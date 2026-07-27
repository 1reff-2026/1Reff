const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mockProfiles = [
  {
    name: "Sarah Jenkins",
    email: "sarah@example.com",
    title: "VP of Sales - TechCorp",
    bio: "15+ years in B2B SaaS sales. Passionate about building high-performing revenue teams and scaling startups from $1M to $10M ARR. Always looking for innovative GTM strategies.",
    role: "USER",
    asks: [{ category: "HIRING", detail: "Looking for a seasoned Enterprise Account Executive in the APAC region." }],
    gives: [{ category: "INTRODUCTION", detail: "Can introduce founders to key decision-makers in Fortune 500 SaaS companies." }],
    status: "PENDING"
  },
  {
    name: "Dr. Prashant Patil",
    email: "prashant@example.com",
    title: "Chief Medical Officer",
    bio: "Cardiologist turned hospital administrator. Focused on leveraging AI in healthcare to improve patient outcomes. Currently leading digital transformation at City Hospital.",
    role: "USER",
    asks: [{ category: "ADVICE", detail: "Seeking advice on implementing scalable telemedicine infrastructure." }],
    gives: [{ category: "MENTORSHIP", detail: "Happy to mentor health-tech startups on clinical validation and compliance." }],
    status: "ACCEPTED"
  },
  {
    name: "Zaheer Samai",
    email: "zaheer@example.com",
    title: "Founder @ StartupInc",
    bio: "Building the future of decentralized supply chains. Previously led logistics at Amazon. YC S22 alumni.",
    role: "USER",
    asks: [{ category: "INVESTMENT", detail: "Raising a $2M Seed round. Looking for strategic angels in the logistics space." }],
    gives: [{ category: "ADVICE", detail: "Can offer advice on YC application strategy and initial product-market fit." }],
    status: "ACCEPTED"
  },
  {
    name: "Sanjay Kadam",
    email: "sanjay@example.com",
    title: "Director of Marketing - GrowthCo",
    bio: "Growth marketer specializing in performance marketing and viral loops. Have managed over $10M in ad spend across Google and Meta.",
    role: "USER",
    asks: [{ category: "SERVICES", detail: "Looking for a top-tier SEO agency to overhaul our content strategy." }],
    gives: [{ category: "MENTORSHIP", detail: "Can review your startup's paid acquisition strategy." }],
    status: "PENDING"
  },
  {
    name: "Anita Sharma",
    email: "anita@example.com",
    title: "Senior Product Manager",
    bio: "Data-driven PM with a background in engineering. I love translating complex user needs into simple, elegant product experiences.",
    role: "USER",
    asks: [{ category: "HIRING", detail: "Looking for a Senior React Native developer for a consumer social app." }],
    gives: [{ category: "SERVICES", detail: "Happy to do a free UI/UX teardown of your MVP." }],
    status: "ACCEPTED"
  },
  {
    name: "David Chen",
    email: "david@example.com",
    title: "Venture Capitalist - Blue Fund",
    bio: "Partner at Blue Fund. We invest in early-stage fintech and climate-tech startups. Former 2x founder.",
    role: "USER",
    asks: [{ category: "INTRODUCTION", detail: "Always looking for introductions to exceptional technical founders in climate-tech." }],
    gives: [{ category: "INVESTMENT", detail: "We write $500k-$1.5M checks for Seed/Pre-seed rounds." }],
    status: "PENDING"
  },
  {
    name: "Marcus Johnson",
    email: "marcus@example.com",
    title: "CEO - InnovateTech",
    bio: "Hardware enthusiast. Currently building smart IoT devices for industrial manufacturing. 20 years in supply chain hardware.",
    role: "USER",
    asks: [{ category: "SERVICES", detail: "Seeking reliable manufacturing partners in Vietnam or Mexico." }],
    gives: [{ category: "INTRODUCTION", detail: "Can connect you with top-tier hardware prototyping labs in Shenzhen." }],
    status: "ACCEPTED"
  },
  {
    name: "Priya Patel",
    email: "priyap@example.com",
    title: "Lead UX Designer",
    bio: "Designing accessible and beautiful interfaces. Previously at Google and Airbnb. I believe design is how it works, not just how it looks.",
    role: "USER",
    asks: [{ category: "HIRING", detail: "Looking for a junior UX researcher to join my team." }],
    gives: [{ category: "MENTORSHIP", detail: "I run weekly portfolio review sessions for junior designers." }],
    status: "ACCEPTED"
  },
  {
    name: "Alex Mercer",
    email: "alex@example.com",
    title: "Head of Growth",
    bio: "Specialist in B2C growth loops, referral programs, and community building. Grew last startup from 10k to 1M users in 18 months.",
    role: "USER",
    asks: [{ category: "ADVICE", detail: "Looking to connect with community managers who have successfully monetized discord servers." }],
    gives: [{ category: "INTRODUCTION", detail: "Can introduce you to some of the best freelance copywriters in the business." }],
    status: "PENDING"
  },
  {
    name: "Elena Rodriguez",
    email: "elena@example.com",
    title: "Principal Data Scientist",
    bio: "PhD in Machine Learning. Building LLM-powered applications for the legal industry. Passionate about ethical AI.",
    role: "USER",
    asks: [{ category: "INTRODUCTION", detail: "Looking to meet legal-tech founders or partners at large law firms." }],
    gives: [{ category: "ADVICE", detail: "Can advise on setting up your data pipeline and fine-tuning open-source LLMs." }],
    status: "ACCEPTED"
  }
];

async function main() {
  const users = await prisma.user.findMany({
    where: {
      email: { in: ['admin@1reff.ai', 'admin@cirq.ai', 'admin@connex.ai'] }
    }
  });
  
  let myUser = users[0];
  if (!myUser) {
    const allUsers = await prisma.user.findMany();
    if (allUsers.length === 0) {
      console.log("No users found to seed profiles for!");
      return;
    }
    myUser = allUsers[0];
  }
  console.log("Seeding network for:", myUser.name, myUser.email);

  // Clear existing mock data if they have our dummy emails
  await prisma.user.deleteMany({
    where: { email: { in: mockProfiles.map(p => p.email) } }
  });

  // Clear all existing meetings, followups, asks, gives, and referrals for myUser
  await prisma.meeting.deleteMany({ where: { OR: [{ hostId: myUser.id }, { guestId: myUser.id }] } });
  await prisma.followup.deleteMany({ where: { userId: myUser.id } });
  await prisma.referral.deleteMany({ where: { OR: [{ referrerId: myUser.id }, { receiverId: myUser.id }] } });
  await prisma.ask.deleteMany({ where: { userId: myUser.id } });
  await prisma.give.deleteMany({ where: { userId: myUser.id } });

  const acceptedFriends = [];
  const pendingFriends = [];

  for (const profile of mockProfiles) {
    const { asks, gives, status, ...userData } = profile;
    
    const newUser = await prisma.user.create({
      data: {
        ...userData,
        asks: { create: asks },
        gives: { create: gives }
      }
    });

    if (status === "PENDING") {
      pendingFriends.push(newUser);
      await prisma.connection.create({
        data: { userAId: newUser.id, userBId: myUser.id, status: "PENDING" }
      });
    } else if (status === "ACCEPTED") {
      acceptedFriends.push(newUser);
      await prisma.connection.create({
        data: { userAId: myUser.id, userBId: newUser.id, status: "ACCEPTED" }
      });
    }
  }

  // --- Seed Asks and Gives for Admin ---
  await prisma.ask.createMany({
    data: [
      { category: "INVESTMENT", detail: "Looking to raise $1M Seed round for my new B2B AI startup.", userId: myUser.id },
      { category: "HIRING", detail: "Need a talented Full Stack Engineer proficient in Next.js and Prisma.", userId: myUser.id }
    ]
  });

  await prisma.give.createMany({
    data: [
      { category: "MENTORSHIP", detail: "Can review business plans and pitch decks for early stage SaaS startups.", userId: myUser.id },
      { category: "INTRODUCTION", detail: "I know several angel investors in the enterprise software space.", userId: myUser.id }
    ]
  });

  // --- Seed Meetings ---
  if (acceptedFriends.length >= 3) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 5);

    await prisma.meeting.create({
      data: {
        date: tomorrow,
        status: "SCHEDULED",
        notes: "Discuss the potential partnership and product roadmap.",
        hostId: myUser.id,
        guestId: acceptedFriends[0].id
      }
    });

    await prisma.meeting.create({
      data: {
        date: nextWeek,
        status: "SCHEDULED",
        notes: "Coffee catchup to talk about AI trends in healthcare.",
        hostId: myUser.id,
        guestId: acceptedFriends[1].id
      }
    });

    await prisma.meeting.create({
      data: {
        date: new Date(),
        status: "SCHEDULED",
        notes: "Review the Q3 marketing strategy and budget.",
        hostId: acceptedFriends[2].id, // Hosted by friend
        guestId: myUser.id
      }
    });
  }

  // --- Seed Follow-ups ---
  if (acceptedFriends.length >= 2) {
    const followDate = new Date();
    followDate.setDate(followDate.getDate() + 2);

    await prisma.followup.create({
      data: {
        date: followDate,
        notes: "Check if they reviewed the investment pitch deck.",
        status: "PENDING",
        userId: myUser.id,
        targetId: acceptedFriends[3].id
      }
    });

    await prisma.followup.create({
      data: {
        date: followDate,
        notes: "Ask about their recent product launch metrics.",
        status: "PENDING",
        userId: myUser.id,
        targetId: acceptedFriends[4].id
      }
    });
  }

  // --- Seed Referrals ---
  if (acceptedFriends.length >= 3) {
    // Referrals Passed (Admin referred someone TO a friend)
    await prisma.referral.create({
      data: {
        status: "PENDING",
        notes: "I think you guys should connect. Priya is an amazing designer.",
        referrerId: myUser.id,
        receiverId: acceptedFriends[0].id,
        referredId: acceptedFriends[4].id // Referring Priya to friend 0
      }
    });

    await prisma.referral.create({
      data: {
        status: "COMPLETED",
        notes: "Marcus needs some manufacturing help, you should chat with him.",
        referrerId: myUser.id,
        receiverId: acceptedFriends[1].id,
        referredId: acceptedFriends[3].id // Referring Marcus to friend 1
      }
    });

    // Referrals Received (Friend referred someone TO Admin)
    await prisma.referral.create({
      data: {
        status: "PENDING",
        notes: "Admin, you should talk to Zaheer about logistics.",
        referrerId: acceptedFriends[2].id,
        receiverId: myUser.id,
        referredId: acceptedFriends[1].id
      }
    });
  }

  console.log(`Successfully seeded 10 rich profiles with connections, meetings, follow-ups, and referrals for ${myUser.email}!`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
