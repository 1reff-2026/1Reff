import { ContactRecord, dummyContacts } from "@/data/dummyContacts";

export interface SearchResult extends ContactRecord {
  matchScore: number;
  matchDetails: {
    companyMatch: boolean;
    companyScore: number;
    locationMatch: boolean;
    locationScore: number;
    departmentMatch: boolean;
    departmentScore: number;
    roleMatch: boolean;
    roleScore: number;
    matchedKeywords: string[];
  };
}

export interface IContactSearchService {
  search(query: string): Promise<SearchResult[]>;
}

export class KeywordContactSearchService implements IContactSearchService {
  private companies: string[];
  private locations: string[];

  private departmentSynonyms: Record<string, string[]> = {
    "HR": ["hr", "human resources", "people ops", "employee relations", "people"],
    "Technical Recruiting": ["technical recruiting", "tech recruiting", "recruiter", "recruiters", "recruiting", "tech hr", "engineering recruiter", "software recruiter", "ai recruiter"],
    "Engineering": ["engineering", "software", "backend", "frontend", "fullstack", "hiring manager", "sde", "developer", "developers", "ai", "ml", "r&d", "tech"],
    "Talent Acquisition": ["talent acquisition", "ta", "talent", "recruiting", "recruiter", "recruiters"],
    "University Recruiting": ["university recruiting", "university", "campus", "intern", "college", "fresher"],
    "Sales": ["sales", "enterprise sales", "gtm", "revenue", "account"],
    "Marketing": ["marketing", "brand", "growth", "comms", "pr"],
    "Investment & VC": ["investor", "investors", "vc", "venture capital", "private equity", "angel", "seed", "funding", "partner", "capital", "investment", "fund", "valuation", "sequoia", "accel", "blume", "kalaari"],
    "Real Estate & Construction": ["real estate", "property", "construction", "realty", "land", "project", "builders", "commercial property", "residential", "infra", "infrastructure", "housing", "estate", "dlf", "godrej", "lodha", "prestige", "oberoi"],
    "Architecture & Interiors": ["architecture", "architect", "architects", "interiors", "interior", "interior designer", "design", "spatial", "urban", "workplace", "studio", "decor", "landscape", "hafeez", "morphogenesis", "livspace", "gensler"],
    "Legal & Compliance": ["legal", "lawyer", "lawyers", "compliance", "attorney", "general counsel", "m&a", "corporate law", "tax", "ca", "chartered accountant", "accountant", "audit", "advisors", "statutory", "litigation", "deloitte", "ey", "pwc", "kpmg", "trilegal"],
    "Healthcare & Pharma": ["pharma", "pharmaceuticals", "healthcare", "hospital", "hospitals", "medical", "doctor", "clinical", "r&d", "biotech", "medicine", "formulations", "trials", "sun pharma", "cipla", "dr reddys", "apollo"],
    "Advertising & PR": ["marketing agency", "agency", "agencies", "advertising", "pr", "brand", "public relations", "digital marketing", "media", "creative", "comms", "communication", "ogilvy", "schbang", "dentsu"],
    "Fintech & Banking": ["fintech", "banking", "bank", "wealth", "investment banking", "risk", "finance", "treasury", "credit", "loans", "financial", "lending", "hdfc", "icici", "razorpay", "zerodha"],
    "Logistics & Supply Chain": ["logistics", "supply chain", "delivery", "transport", "transportation", "fleet", "warehouse", "operations", "fulfillment", "freight", "last mile", "delhivery", "blue dart"]
  };

  private stopWords = new Set([
    "in", "at", "for", "the", "to", "me", "find", "show", "give", "please", 
    "connect", "contacts", "contact", "information", "info", "looking", "need", 
    "roles", "role", "who", "is", "are", "of", "on", "with", "a", "an", "and", 
    "or", "by", "i", "am", "want", "get", "my", "some", "any", "out", "about"
  ]);

  constructor() {
    // Dynamically extract all unique companies and locations from the dummy database
    this.companies = Array.from(new Set(dummyContacts.map(c => c.company.toLowerCase())));
    this.locations = Array.from(new Set(dummyContacts.map(c => c.location.toLowerCase())));
  }

  public async search(query: string): Promise<SearchResult[]> {
    // Simulate API / AI latency
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!query || query.trim().length === 0) {
      return [];
    }

    const cleanQuery = query.toLowerCase().replace(/[^\w\s-]/g, " ");
    const tokens = cleanQuery.split(/\s+/).filter(t => 
      (t.length > 1 || t === "ca" || t === "vc" || t === "pr" || t === "hr" || t === "ey" || t === "ip") && 
      !this.stopWords.has(t)
    );

    const results: SearchResult[] = dummyContacts.map(record => {
      let companyScore = 0;
      let locationScore = 0;
      let departmentScore = 0;
      let roleScore = 0;
      const matchedKeywords: string[] = [];

      const recordCompany = record.company.toLowerCase();
      const recordLocation = record.location.toLowerCase();
      const recordDept = record.department.toLowerCase();
      const recordRole = record.role.toLowerCase();
      const recordDesg = record.designation.toLowerCase();
      const recordNotes = record.notes.toLowerCase();

      // 1. Company Match (+5)
      const isCompanyMatch = this.companies.some(comp => {
        if (cleanQuery.includes(comp)) return recordCompany === comp;
        const compWords = comp.split(" ").filter(w => w.length > 2);
        return compWords.some(w => tokens.includes(w) && recordCompany.includes(w));
      });
      if (isCompanyMatch) {
        companyScore = 5;
        matchedKeywords.push(`Company: ${record.company}`);
      }

      // 2. Location Match (+3)
      const isLocationMatch = this.locations.some(loc => {
        const isQueryLoc = cleanQuery.includes(loc);
        if (!isQueryLoc) return false;
        if (loc === "bengaluru" && recordLocation === "bangalore") return true;
        if (loc === "gurugram" && recordLocation === "gurgaon") return true;
        return recordLocation === loc;
      });
      if (isLocationMatch) {
        locationScore = 3;
        matchedKeywords.push(`Location: ${record.location}`);
      }

      // 3. Department Match (+3)
      let isDeptMatch = false;
      const syns = this.departmentSynonyms[record.department] || [recordDept];
      for (const syn of syns) {
        if (cleanQuery.includes(syn)) {
          isDeptMatch = true;
          break;
        }
      }
      if (isDeptMatch) {
        departmentScore = 3;
        matchedKeywords.push(`Dept: ${record.department}`);
      }

      // 4. Role Match (+2 per matching meaningful concept, minimum +2 if matched)
      let roleMatchCount = 0;
      for (const token of tokens) {
        // Avoid double counting company or location in role match
        if (this.companies.includes(token) || this.locations.includes(token)) continue;
        if (
          recordRole.includes(token) || 
          recordDesg.includes(token) || 
          recordNotes.includes(token) ||
          recordDept.includes(token) ||
          (token === "ca" && (recordRole.includes("chartered accountant") || recordDesg.includes("chartered accountant") || recordRole.includes("ca") || recordDept.includes("legal"))) ||
          (token === "vc" && (recordRole.includes("venture partner") || recordRole.includes("investor") || recordDept.includes("investment"))) ||
          (token === "investor" && (recordRole.includes("investor") || recordRole.includes("venture") || recordRole.includes("partner") || recordDept.includes("investment")))
        ) {
          roleMatchCount++;
          if (!matchedKeywords.some(k => k.toLowerCase().includes(token))) {
            matchedKeywords.push(`Keyword: "${token}"`);
          }
        }
      }

      if (roleMatchCount > 0) {
        // Base +2 for role match, plus +2 for each additional specific role keyword matched
        roleScore = 2 * roleMatchCount;
      }

      const totalScore = companyScore + locationScore + departmentScore + roleScore;

      return {
        ...record,
        matchScore: totalScore,
        matchDetails: {
          companyMatch: companyScore > 0,
          companyScore,
          locationMatch: locationScore > 0,
          locationScore,
          departmentMatch: departmentScore > 0,
          departmentScore,
          roleMatch: roleScore > 0,
          roleScore,
          matchedKeywords
        }
      };
    });

    // Filter to positive scores and rank descending by totalScore
    const positiveResults = results.filter(r => r.matchScore > 0);
    positiveResults.sort((a, b) => b.matchScore - a.matchScore);

    // Return Top 5 most relevant contacts
    return positiveResults.slice(0, 5);
  }
}

// Export singleton instance so it can be swapped for LLMContactSearchService seamlessly in Phase 2
export const contactSearchService: IContactSearchService = new KeywordContactSearchService();
