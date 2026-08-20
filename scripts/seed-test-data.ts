import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.trim(),
  });
  return response.data[0].embedding;
}

async function main() {
  console.log("Seeding test data for Blockchain query...");

  // 1. Create a dummy uploader user
  const uploader = await prisma.user.create({
    data: {
      name: "Test Uploader",
      email: "uploader@test.com",
      role: "USER"
    }
  });

  // 2. Create a platform user (Target for the search)
  const platformUser = await prisma.user.create({
    data: {
      name: "Eve Platform",
      email: "eve@platform.com",
      title: "Blockchain Innovator",
      bio: "I build decentralized applications and specialize in Web3 and Crypto.",
      role: "USER"
    }
  });

  // 3. Create Admin Contacts (no uploadedById)
  const adminContact1Text = "Alice Admin Blockchain Architect";
  const adminContact1Embedding = await getEmbedding(adminContact1Text);
  await prisma.$executeRawUnsafe(
    `INSERT INTO "Contact" (id, contact_name, email, phone, company, designation, department, role, location, linkedin, notes, "uploadedById", embedding) 
     VALUES (gen_random_uuid()::text, 'Alice Admin', 'alice@admin.com', '123', 'CryptoCorp', 'Blockchain Architect', 'Tech', 'Architect', 'Remote', 'link', 'Admin database contact', null, $1::vector)`,
    `[${adminContact1Embedding.join(",")}]`
  );

  const adminContact2Text = "Bob Admin Crypto Analyst";
  const adminContact2Embedding = await getEmbedding(adminContact2Text);
  await prisma.$executeRawUnsafe(
    `INSERT INTO "Contact" (id, contact_name, email, phone, company, designation, department, role, location, linkedin, notes, "uploadedById", embedding) 
     VALUES (gen_random_uuid()::text, 'Bob Admin', 'bob@admin.com', '124', 'CryptoCorp', 'Crypto Analyst', 'Finance', 'Analyst', 'Remote', 'link', 'Admin database contact', null, $1::vector)`,
    `[${adminContact2Embedding.join(",")}]`
  );

  // 4. Create User Referral Contacts (uploaded by the dummy uploader)
  const refContact1Text = "Charlie Referral Web3 Developer";
  const refContact1Embedding = await getEmbedding(refContact1Text);
  await prisma.$executeRawUnsafe(
    `INSERT INTO "Contact" (id, contact_name, email, phone, company, designation, department, role, location, linkedin, notes, "uploadedById", embedding) 
     VALUES (gen_random_uuid()::text, 'Charlie Referral', 'charlie@ref.com', '125', 'Web3Inc', 'Web3 Developer', 'Engineering', 'Developer', 'Remote', 'link', 'User uploaded contact', '${uploader.id}', $1::vector)`,
    `[${refContact1Embedding.join(",")}]`
  );

  const refContact2Text = "Dave Referral Smart Contract Engineer";
  const refContact2Embedding = await getEmbedding(refContact2Text);
  await prisma.$executeRawUnsafe(
    `INSERT INTO "Contact" (id, contact_name, email, phone, company, designation, department, role, location, linkedin, notes, "uploadedById", embedding) 
     VALUES (gen_random_uuid()::text, 'Dave Referral', 'dave@ref.com', '126', 'Web3Inc', 'Smart Contract Engineer', 'Engineering', 'Engineer', 'Remote', 'link', 'User uploaded contact', '${uploader.id}', $1::vector)`,
    `[${refContact2Embedding.join(",")}]`
  );

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
