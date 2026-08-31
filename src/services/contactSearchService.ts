import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export type ResultType = "ADMIN_DATABASE" | "PLATFORM_USER" | "USER_REFERRAL";

export interface SearchResult {
  id: string;
  contact_name: string;
  email: string;
  phone: string;
  company: string;
  designation: string;
  department: string;
  role: string;
  location: string;
  linkedin: string;
  notes: string;
  uploadedById: string | null;
  uploader_name: string | null;
  matchScore: number;
  customReason?: string;
  resultType: ResultType; // Added Result Type
  isUnlocked?: boolean; // Whether the user has paid to unlock this contact
  aiFitScore?: number; // Added from LLM evaluation
}

export interface IContactSearchService {
  search(query: string, userId?: string): Promise<SearchResult[]>;
}

export class SemanticContactSearchService implements IContactSearchService {
  public async search(query: string, userId?: string): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }
    
    if (!openai) {
      console.warn("OpenAI API key missing. Semantic search disabled.");
      return [];
    }

    try {
      // 1. Fetch User Profile if userId is provided
      let userProfile = null;
      if (userId) {
        userProfile = await prisma.user.findUnique({
          where: { id: userId },
          select: { name: true, bio: true, company: { select: { name: true } }, title: true, role: true }
        });
      }

      // 2. Get embedding for the user's query
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query.trim(),
      });
      
      const embedding = response.data[0].embedding;
      const embeddingStr = `[${embedding.join(",")}]`;

      // 3. Perform Broad Hybrid Search on Contacts to get top 15 candidates
      const dbResults = await prisma.$queryRawUnsafe<any[]>(
        `
        SELECT 
          c.id, c.contact_name, c.email, c.phone, c.company, c.designation, c.department, c.role, c.location, c.linkedin, c.notes, c."uploadedById",
          u.name as uploader_name,
          (1 - (c.embedding <=> $1::vector)) as vector_score,
          ts_rank_cd(
            to_tsvector('english', coalesce(c.contact_name, '') || ' ' || coalesce(c.company, '') || ' ' || coalesce(c.role, '') || ' ' || coalesce(c.designation, '') || ' ' || coalesce(c.location, '')),
            websearch_to_tsquery('english', $2)
          ) as text_score,
          (
            (1 - (c.embedding <=> $1::vector)) * 0.6 + 
            (ts_rank_cd(
              to_tsvector('english', coalesce(c.contact_name, '') || ' ' || coalesce(c.company, '') || ' ' || coalesce(c.role, '') || ' ' || coalesce(c.designation, '') || ' ' || coalesce(c.location, '')),
              websearch_to_tsquery('english', $2)
            ) * 2.0)
          ) as hybrid_score
        FROM "Contact" c
        LEFT JOIN "User" u ON c."uploadedById" = u.id
        ORDER BY hybrid_score DESC
        LIMIT 100;
        `,
        embeddingStr,
        query.trim()
      );

      // 4. Perform Full-Text Search on Actual Platform Users
      const likeQuery = `%${query.trim()}%`;
      const userResults = await prisma.$queryRawUnsafe<any[]>(
        `
        SELECT 
          u.id, u.name as contact_name, u.email, u.phone, c.name as company, u.title as designation, 
          '' as department, u.role, '' as location, '' as linkedin, u.bio as notes
        FROM "User" u
        LEFT JOIN "Company" c ON u."companyId" = c.id
        WHERE u.id != coalesce($1, 'no-user') AND (
          to_tsvector('english', coalesce(u.name, '') || ' ' || coalesce(u.bio, '') || ' ' || coalesce(u.title, '') || ' ' || coalesce(c.name, '')) @@ websearch_to_tsquery('english', $2)
          OR u.bio ILIKE $3
          OR u.title ILIKE $3
          OR c.name ILIKE $3
        )
        LIMIT 10;
        `,
        userId || null,
        query.trim(),
        likeQuery
      );

      // Fetch unlocked contacts for the current user
      const unlockedRecords = userId ? await prisma.unlockedContact.findMany({
        where: { userId: userId },
        select: { contactId: true, platformUserId: true }
      }) : [];
      
      const unlockedContactIds = new Set(unlockedRecords.map(r => r.contactId).filter(Boolean));
      const unlockedPlatformUserIds = new Set(unlockedRecords.map(r => r.platformUserId).filter(Boolean));

      let initialResults: SearchResult[] = [
        // Map Contact results
        ...dbResults
          .map(r => ({
            id: r.id,
            contact_name: r.contact_name,
            email: r.email,
            phone: r.phone,
            company: r.company,
            designation: r.designation,
            department: r.department,
            role: r.role,
            location: r.location,
            linkedin: r.linkedin,
            notes: r.notes,
            uploadedById: r.uploadedById,
            uploader_name: r.uploader_name,
            matchScore: Math.round(r.hybrid_score * 100),
            resultType: r.uploadedById ? "USER_REFERRAL" as ResultType : "ADMIN_DATABASE" as ResultType,
            isUnlocked: unlockedContactIds.has(r.id)
          })),
        // Map User results
        ...userResults
          .map(r => ({
            id: r.id,
            contact_name: r.contact_name || "Unknown User",
            email: r.email || "",
            phone: r.phone || "",
            company: r.company || "",
            designation: r.designation || "",
            department: r.department,
            role: r.role,
            location: r.location,
            linkedin: r.linkedin,
            notes: r.notes || "",
            uploadedById: null,
            uploader_name: null,
            matchScore: 90, // Arbitrary high score for direct user match
            resultType: "PLATFORM_USER" as ResultType,
            isUnlocked: unlockedPlatformUserIds.has(r.id)
          }))
      ];
      // Pass up to 100 top matches to the powerful GPT-4o model for deep semantic filtering
      initialResults = initialResults.slice(0, 100);

      // 5. "Thinking Search" LLM Re-ranking Phase
      if (userProfile && (userProfile.bio || userProfile.company?.name || userProfile.role) && initialResults.length > 0) {
        try {
          const systemPrompt = `You are an elite AI networking matchmaker. 
Your goal is to evaluate the provided list of candidates against the user's query and profile.
RULES for matching:
1. LOCATION MUST BE STRICT: If the user's query specifies a LOCATION (e.g. 'Delhi', 'Mumbai', 'Gujarat'), you MUST completely REJECT candidates who are located in a completely different geographical region. However, if they search for a State (e.g. Gujarat), you MUST INCLUDE cities within that state (e.g. Ahmedabad, Surat).
2. ROLES MUST BE FLEXIBLE WITHIN THE SAME DOMAIN: 
   If the user searches for a specific role (e.g. 'Marketing Head' or 'Law Associate'), you MUST INCLUDE other people in the same department (e.g. 'Marketing Manager', 'Managing Partner', 'Legal Advisor').
   Do not reject someone because of a seniority mismatch (e.g. Associate vs Partner) or slight title mismatch, as long as they are in the requested field/department.

3. STRICT DOMAIN FILTER: 
   You MUST REJECT candidates who are in completely different professions. For example, if the user searches for a 'Tech employee', DO NOT return a 'Legal Advisor' even if they happen to work at a Tech company. The profession must align.
4. PRIVACY LOCK - CRITICAL RULE:
   You MUST NEVER mention the candidate's actual name, company name, or exact specific identifying details in your reasoning.
   Use generic terms instead: "This candidate", "Their firm", "This professional", "Their clinic".
   Example BAD: "Mr. Kushal Kothari is a Managing Partner at LEAGLEZ in Ahmedabad."
   Example GOOD: "This candidate is a Managing Partner at a legal firm in Ahmedabad."

5. Select ONLY the highly accurate candidates based on these rules. You MUST select a MAXIMUM of 5 top candidates. It is completely expected to return 0 candidates if no one matches the criteria.

For EACH selected candidate, provide a highly precise and exact analysis in exactly this format (use exactly these 2 sections, separated by double newlines, keeping the text very concise):
**Why suggested:** [1 sentence specific reason using privacy-safe language]

**Worth verifying:** [1 sentence on what to verify or look out for]

Also, generate a fitScore (a number between 1 and 10 with up to one decimal place, e.g. 8.5) for how well they match.

Output JSON format EXACTLY like this: { "selected": [{ "id": "candidate_id_here", "customReason": "your formatted text here", "fitScore": 8.5 }] }`;

          const userContext = `
Searching User Profile:
Name: ${userProfile.name}
Company: ${userProfile.company?.name || "N/A"}
Title: ${userProfile.title || "N/A"}
Role: ${userProfile.role || "N/A"}
Bio: ${userProfile.bio || "N/A"}

Search Query: "${query}"

Candidates:
${JSON.stringify(initialResults.map(r => ({
  id: r.id,
  name: "Premium Contact",
  company: "Premium Company",
  designation: r.designation,
  department: r.department,
  role: r.role,
  location: r.location,
  resultType: r.resultType,
  bio_or_notes: r.notes
})), null, 2)}`;

          const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userContext }
            ],
            temperature: 0.3,
          });

          const llmContent = completion.choices[0].message.content;
          if (llmContent) {
            const parsed = JSON.parse(llmContent);
            const selectedItems: { id: string, customReason: string, fitScore?: number }[] = parsed.selected || [];
            
            const finalResults: SearchResult[] = [];
            for (const selection of selectedItems) {
              const contact = initialResults.find(r => r.id === selection.id);
              if (contact) {
                finalResults.push({
                  ...contact,
                  customReason: selection.customReason,
                  aiFitScore: selection.fitScore
                });
              }
            }

            finalResults.sort((a, b) => {
              const scoreA = typeof a.aiFitScore === 'number' ? a.aiFitScore : 0;
              const scoreB = typeof b.aiFitScore === 'number' ? b.aiFitScore : 0;
              return scoreB - scoreA;
            });
            
            // Return exactly what the LLM selected (capped at max 5 results)
            return finalResults.slice(0, 5);
          }
        } catch (llmError) {
          console.error("Error during LLM Thinking Search re-ranking:", llmError);
        }
      }

      // Fallback: only if LLM completely crashed or userProfile is missing
      return initialResults.slice(0, 5);

    } catch (error) {
      console.error("Semantic search error:", error);
      return [];
    }
  }
}

export const contactSearchService = new SemanticContactSearchService();
