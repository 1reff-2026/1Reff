const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.findFirst();
    console.log("DB connection successful!", user ? `Found user ${user.id}` : "No users found");
  } catch (error) {
    console.error("DB connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
