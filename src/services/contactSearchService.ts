import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

// Only instantiate OpenAI if we have a key, so build doesn't fail if missing
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

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
}

export interface IContactSearchService {
  search(query: string): Promise<SearchResult[]>;
}

export class SemanticContactSearchService implements IContactSearchService {
  public async search(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }
    
    if (!openai) {
      console.warn("OpenAI API key missing. Semantic search disabled.");
      return [];
    }

    try {
      // 1. Get embedding for the user's query
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query.trim(),
      });
      
      const embedding = response.data[0].embedding;
      const embeddingStr = `[${embedding.join(",")}]`;

      // 2. Perform Hybrid Search (Vector Similarity + Full Text Keyword Search)
      // Using <=> for cosine distance (Vector) and ts_rank_cd for keyword matching.
      const results = await prisma.$queryRawUnsafe<any[]>(
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
            ) * 2.0) -- Boost text score as it naturally ranges lower than vector similarity
          ) as hybrid_score
        FROM "Contact" c
        LEFT JOIN "User" u ON c."uploadedById" = u.id
        ORDER BY hybrid_score DESC
        LIMIT 5;
        `,
        embeddingStr,
        query.trim()
      );

      // 3. Map results
      return results
        .filter(r => r.vector_score > 0.48) // Strict semantic threshold: Requires at least 48% semantic relevance. This stops "Pune" returning random CFOs in Mumbai.
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
          matchScore: Math.round(r.hybrid_score * 100), // Adjusted to hybrid score
          matchDetails: {
            companyScore: Math.round(r.text_score * 50),
            locationScore: Math.round(r.vector_score * 20),
            departmentScore: 15,
            roleScore: 15,
          },
        }));

    } catch (error) {
      console.error("Semantic search error:", error);
      return [];
    }
  }
}

export const contactSearchService = new SemanticContactSearchService();
