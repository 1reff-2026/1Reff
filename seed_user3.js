const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const user3Id = 'cmsjd5jn70006erg0cc06n4x5'; // Test User 3
  const user1Id = 'cmsjd5hon0000erg05ndilwzc'; // Test User 1
  const user2Id = 'cmsjd5iod0003erg0qeunueh2'; // Test User 2

  // Create a pending referral to user 3
  await prisma.referral.create({
    data: {
      notes: "I think you should meet Test User 2, they are great at Blockchain architecture!",
      status: "PENDING",
      referrerId: user1Id,
      receiverId: user3Id,
      referredId: user2Id,
    }
  });

  // Create another pending referral to user 3
  await prisma.referral.create({
    data: {
      notes: "Test User 4 is looking for investment opportunities, you should connect.",
      status: "PENDING",
      referrerId: user2Id,
      receiverId: user3Id,
      referredId: 'cmsjd5klm0009erg05tjwlp1t', // Test User 4
    }
  });

  // Create a pending connection request to user 3
  await prisma.connection.create({
    data: {
      userAId: user1Id,
      userBId: user3Id,
      status: "PENDING",
      matchScore: 85,
    }
  });

  console.log("Successfully added examples for Test User 3!");
}

seed().catch(console.error).finally(() => prisma.$disconnect());
