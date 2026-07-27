const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with test accounts...')

  // Clear existing
  await prisma.meeting.deleteMany()
  await prisma.followup.deleteMany()
  await prisma.referral.deleteMany()
  await prisma.connection.deleteMany()
  await prisma.ask.deleteMany()
  await prisma.give.deleteMany()
  await prisma.user.deleteMany()
  await prisma.company.deleteMany()

  // Password for all test accounts
  const password = await bcrypt.hash('password123', 10)

  // 1. Admin / Platform Manager
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@1reff.ai',
      password,
      role: 'ADMIN',
      title: 'Platform Administrator',
      bio: 'Managing the 1Reff ecosystem.',
    }
  })

  // 2. Startup Founder (Looking for investment)
  await prisma.user.create({
    data: {
      name: 'User 1',
      email: 'user1@1reff.ai',
      password,
      role: 'USER',
      title: 'Founder & CEO at InnovateTech',
      bio: 'Building the future of B2B SaaS. Currently raising our Series A.',
      gives: {
        create: [
          { category: 'B2B_SERVICES', detail: 'We offer early access to our enterprise software suite.' }
        ]
      },
      asks: {
        create: [
          { category: 'INVESTMENT', detail: 'Looking for $2M Series A lead investor with SaaS expertise.' },
          { category: 'HIRING', detail: 'Seeking a seasoned VP of Sales.' }
        ]
      }
    }
  })

  // 3. Investor (Looking to invest)
  await prisma.user.create({
    data: {
      name: 'User 2',
      email: 'user2@1reff.ai',
      password,
      role: 'USER',
      title: 'Partner at Horizon Ventures',
      bio: 'Early-stage investor focusing on B2B SaaS, AI, and developer tools.',
      gives: {
        create: [
          { category: 'INVESTMENT', detail: 'Lead checks of $1M - $3M in Seed and Series A rounds.' },
          { category: 'MENTORSHIP', detail: 'Go-to-market strategy for enterprise software.' },
          { category: 'ADVISORY', detail: 'Board member for high-growth tech startups.' }
        ]
      },
      asks: {
        create: [
          { category: 'INVESTMENT', detail: 'Looking for promising AI and B2B SaaS startups.' }
        ]
      }
    }
  })

  // 4. Service Provider / Distributor
  await prisma.user.create({
    data: {
      name: 'User 3',
      email: 'user3@1reff.ai',
      password,
      role: 'USER',
      title: 'VP of Partnerships at Global Distributors',
      bio: 'Connecting innovative hardware products with enterprise buyers across Europe and LATAM.',
      gives: {
        create: [
          { category: 'DISTRIBUTORS', detail: 'We have a network of 500+ enterprise retailers globally.' }
        ]
      },
      asks: {
        create: [
          { category: 'B2B_SERVICES', detail: 'Looking for innovative consumer electronics to distribute.' }
        ]
      }
    }
  })

  console.log('Seed completed successfully!')
  console.log('\n--- Test Accounts Created ---')
  console.log('1. Admin:')
  console.log('   Email: admin@1reff.ai')
  console.log('   Pass:  password123')
  console.log('\n2. User 1 (Startup Founder):')
  console.log('   Email: user1@1reff.ai')
  console.log('   Pass:  password123')
  console.log('\n3. User 2 (Investor):')
  console.log('   Email: user2@1reff.ai')
  console.log('   Pass:  password123')
  console.log('\n4. User 3 (Distributor):')
  console.log('   Email: user3@1reff.ai')
  console.log('   Pass:  password123')
  console.log('-----------------------------\n')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
