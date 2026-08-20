"use server"

import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function uploadReferralContact(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  const userId = session.user.id;
  
  const contact_name = formData.get("contact_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const company = formData.get("company") as string;
  const designation = formData.get("designation") as string;
  const department = formData.get("department") as string;
  const role = formData.get("role") as string;
  const location = formData.get("location") as string;
  const linkedin = formData.get("linkedin") as string;
  const notes = formData.get("notes") as string;

  if (!contact_name || !company || !designation || !notes) {
    return { error: "Name, Company, Title, and Bio/Notes are required." }
  }

  let embeddingStr: string | null = null;

  // Generate OpenAI Embedding
  if (openai) {
    try {
      const textToEmbed = `${contact_name} ${company} ${designation} ${department} ${role} ${location} ${notes}`;
      const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: textToEmbed.trim(),
      });
      const embedding = response.data[0].embedding;
      embeddingStr = `[${embedding.join(",")}]`;
    } catch (e) {
      console.error("Failed to generate embedding", e);
      return { error: "Failed to process AI embedding for this contact." }
    }
  } else {
    return { error: "OpenAI API key is missing on the server." }
  }

  try {
    // We must use raw query to insert the vector
    await prisma.$executeRawUnsafe(
      `INSERT INTO "Contact" (id, contact_name, email, phone, company, designation, department, role, location, linkedin, notes, "uploadedById", embedding) 
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::vector)`,
      contact_name,
      email || '',
      phone || '',
      company,
      designation,
      department || '',
      role || '',
      location || '',
      linkedin || '',
      notes,
      userId,
      embeddingStr
    );
    
    revalidatePath("/profile")
    revalidatePath("/ai-connect")
    
    return { success: true }
  } catch (error) {
    console.error("Error saving contact:", error);
    return { error: "Failed to save contact to database." }
  }
}
