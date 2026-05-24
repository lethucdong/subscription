// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv/config")
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient, SubscriptionStatus, BillingCycle } = require("@prisma/client")
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaPg } = require("@prisma/adapter-pg")

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in .env")
}
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  // --- Vendors ---
  const vendors = await Promise.all([
    prisma.vendor.upsert({
      where: { id: "vendor-openai" },
      update: {},
      create: {
        id: "vendor-openai",
        name: "OpenAI",
        logo: "🤖",
        website: "https://openai.com",
        description: "AI research and deployment company",
        category: "AI & ML",
      },
    }),
    prisma.vendor.upsert({
      where: { id: "vendor-adobe" },
      update: {},
      create: {
        id: "vendor-adobe",
        name: "Adobe",
        logo: "🅰️",
        website: "https://adobe.com",
        description: "Creative software and digital media",
        category: "Design",
      },
    }),
    prisma.vendor.upsert({
      where: { id: "vendor-figma" },
      update: {},
      create: {
        id: "vendor-figma",
        name: "Figma",
        logo: "🎨",
        website: "https://figma.com",
        description: "Collaborative design tool",
        category: "Design",
      },
    }),
    prisma.vendor.upsert({
      where: { id: "vendor-notion" },
      update: {},
      create: {
        id: "vendor-notion",
        name: "Notion",
        logo: "📝",
        website: "https://notion.so",
        description: "All-in-one workspace",
        category: "Productivity",
      },
    }),
    prisma.vendor.upsert({
      where: { id: "vendor-slack" },
      update: {},
      create: {
        id: "vendor-slack",
        name: "Slack",
        logo: "💬",
        website: "https://slack.com",
        description: "Team messaging platform",
        category: "Communication",
      },
    }),
    prisma.vendor.upsert({
      where: { id: "vendor-github" },
      update: {},
      create: {
        id: "vendor-github",
        name: "GitHub",
        logo: "🐙",
        website: "https://github.com",
        description: "Code hosting and collaboration",
        category: "Development",
      },
    }),
    prisma.vendor.upsert({
      where: { id: "vendor-linear" },
      update: {},
      create: {
        id: "vendor-linear",
        name: "Linear",
        logo: "📐",
        website: "https://linear.app",
        description: "Issue tracking for software teams",
        category: "Project Management",
      },
    }),
    prisma.vendor.upsert({
      where: { id: "vendor-vercel" },
      update: {},
      create: {
        id: "vendor-vercel",
        name: "Vercel",
        logo: "▲",
        website: "https://vercel.com",
        description: "Frontend cloud platform",
        category: "Infrastructure",
      },
    }),
  ])

  console.log(`Seeded ${vendors.length} vendors`)

  // --- Users ---
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "alex@acme.com" },
      update: {},
      create: {
        id: "user-alex",
        name: "Alex Chen",
        email: "alex@acme.com",
        avatar: "AC",
        role: "Admin",
      },
    }),
    prisma.user.upsert({
      where: { email: "sarah@acme.com" },
      update: {},
      create: {
        id: "user-sarah",
        name: "Sarah Kim",
        email: "sarah@acme.com",
        avatar: "SK",
        role: "Member",
      },
    }),
    prisma.user.upsert({
      where: { email: "marcus@acme.com" },
      update: {},
      create: {
        id: "user-marcus",
        name: "Marcus Johnson",
        email: "marcus@acme.com",
        avatar: "MJ",
        role: "Member",
      },
    }),
    prisma.user.upsert({
      where: { email: "priya@acme.com" },
      update: {},
      create: {
        id: "user-priya",
        name: "Priya Patel",
        email: "priya@acme.com",
        avatar: "PP",
        role: "Member",
      },
    }),
    prisma.user.upsert({
      where: { email: "tom@acme.com" },
      update: {},
      create: {
        id: "user-tom",
        name: "Tom Rivera",
        email: "tom@acme.com",
        avatar: "TR",
        role: "Member",
      },
    }),
    prisma.user.upsert({
      where: { email: "emma@acme.com" },
      update: {},
      create: {
        id: "user-emma",
        name: "Emma Walsh",
        email: "emma@acme.com",
        avatar: "EW",
        role: "Viewer",
      },
    }),
    prisma.user.upsert({
      where: { email: "david@acme.com" },
      update: {},
      create: {
        id: "user-david",
        name: "David Park",
        email: "david@acme.com",
        avatar: "DP",
        role: "Member",
      },
    }),
    prisma.user.upsert({
      where: { email: "lisa@acme.com" },
      update: {},
      create: {
        id: "user-lisa",
        name: "Lisa Torres",
        email: "lisa@acme.com",
        avatar: "LT",
        role: "Member",
      },
    }),
    prisma.user.upsert({
      where: { email: "james@acme.com" },
      update: {},
      create: {
        id: "user-james",
        name: "James Miller",
        email: "james@acme.com",
        avatar: "JM",
        role: "Viewer",
      },
    }),
    prisma.user.upsert({
      where: { email: "nina@acme.com" },
      update: {},
      create: {
        id: "user-nina",
        name: "Nina Okafor",
        email: "nina@acme.com",
        avatar: "NO",
        role: "Member",
      },
    }),
  ])

  console.log(`Seeded ${users.length} users`)

  // --- Subscriptions ---

  // Delete existing tags for idempotency
  await prisma.subscriptionTag.deleteMany({
    where: { subscriptionId: { in: ["sub-1", "sub-2", "sub-3", "sub-4", "sub-5", "sub-6", "sub-7", "sub-8"] } },
  })

  const subscriptions = await Promise.all([
    prisma.subscription.upsert({
      where: { id: "sub-1" },
      update: {},
      create: {
        id: "sub-1",
        name: "ChatGPT Team",
        vendorId: "vendor-openai",
        logo: "🤖",
        color: "#10b981",
        category: "AI & ML",
        status: SubscriptionStatus.ACTIVE,
        plan: "Team",
        billingCycle: BillingCycle.MONTHLY,
        amount: 200,
        currency: "USD",
        nextRenewal: new Date("2026-06-15"),
        seatsUsed: 8,
        seatsTotal: 10,
        description: "AI-powered chat and productivity tool for the entire team. Access to GPT-4o and advanced reasoning models.",
        autoRenew: true,
        tags: { create: [{ tag: "AI" }, { tag: "Productivity" }, { tag: "Essential" }] },
      },
    }),
    prisma.subscription.upsert({
      where: { id: "sub-2" },
      update: {},
      create: {
        id: "sub-2",
        name: "Figma Team",
        vendorId: "vendor-figma",
        logo: "🎨",
        color: "#f59e0b",
        category: "Design",
        status: SubscriptionStatus.EXPIRING,
        plan: "Professional",
        billingCycle: BillingCycle.MONTHLY,
        amount: 75,
        currency: "USD",
        nextRenewal: new Date("2026-05-30"),
        seatsUsed: 5,
        seatsTotal: 5,
        description: "Collaborative design tool for UI/UX, prototyping, and design system management.",
        autoRenew: true,
        tags: { create: [{ tag: "Design" }, { tag: "Collaboration" }, { tag: "Critical" }] },
      },
    }),
    prisma.subscription.upsert({
      where: { id: "sub-3" },
      update: {},
      create: {
        id: "sub-3",
        name: "Adobe Creative Cloud",
        vendorId: "vendor-adobe",
        logo: "🅰️",
        color: "#ef4444",
        category: "Design",
        status: SubscriptionStatus.ACTIVE,
        plan: "Business",
        billingCycle: BillingCycle.MONTHLY,
        amount: 600,
        currency: "USD",
        nextRenewal: new Date("2026-07-01"),
        seatsUsed: 14,
        seatsTotal: 20,
        description: "Full suite of creative tools including Photoshop, Illustrator, Premiere Pro, and more.",
        autoRenew: true,
        tags: { create: [{ tag: "Design" }, { tag: "Video" }, { tag: "Marketing" }] },
      },
    }),
    prisma.subscription.upsert({
      where: { id: "sub-4" },
      update: {},
      create: {
        id: "sub-4",
        name: "Notion Team",
        vendorId: "vendor-notion",
        logo: "📝",
        color: "#6366f1",
        category: "Productivity",
        status: SubscriptionStatus.ACTIVE,
        plan: "Business",
        billingCycle: BillingCycle.MONTHLY,
        amount: 16,
        currency: "USD",
        nextRenewal: new Date("2026-06-20"),
        seatsUsed: 12,
        seatsTotal: 15,
        description: "All-in-one workspace for notes, docs, wikis, and project management.",
        autoRenew: true,
        tags: { create: [{ tag: "Productivity" }, { tag: "Documentation" }, { tag: "Essential" }] },
      },
    }),
    prisma.subscription.upsert({
      where: { id: "sub-5" },
      update: {},
      create: {
        id: "sub-5",
        name: "Slack Pro",
        vendorId: "vendor-slack",
        logo: "💬",
        color: "#8b5cf6",
        category: "Communication",
        status: SubscriptionStatus.ACTIVE,
        plan: "Pro",
        billingCycle: BillingCycle.MONTHLY,
        amount: 87.5,
        currency: "USD",
        nextRenewal: new Date("2026-06-10"),
        seatsUsed: 35,
        seatsTotal: 50,
        description: "Team messaging and collaboration platform with integrations and unlimited message history.",
        autoRenew: true,
        tags: { create: [{ tag: "Communication" }, { tag: "Essential" }, { tag: "Integration" }] },
      },
    }),
    prisma.subscription.upsert({
      where: { id: "sub-6" },
      update: {},
      create: {
        id: "sub-6",
        name: "GitHub Enterprise",
        vendorId: "vendor-github",
        logo: "🐙",
        color: "#f59e0b",
        category: "Development",
        status: SubscriptionStatus.EXPIRING,
        plan: "Enterprise",
        billingCycle: BillingCycle.MONTHLY,
        amount: 420,
        currency: "USD",
        nextRenewal: new Date("2026-06-01"),
        seatsUsed: 28,
        seatsTotal: 30,
        description: "Enterprise-grade code hosting, CI/CD, security scanning, and team collaboration.",
        autoRenew: true,
        tags: { create: [{ tag: "Development" }, { tag: "DevOps" }, { tag: "Critical" }] },
      },
    }),
    prisma.subscription.upsert({
      where: { id: "sub-7" },
      update: {},
      create: {
        id: "sub-7",
        name: "Linear",
        vendorId: "vendor-linear",
        logo: "📐",
        color: "#6366f1",
        category: "Project Management",
        status: SubscriptionStatus.ACTIVE,
        plan: "Business",
        billingCycle: BillingCycle.MONTHLY,
        amount: 80,
        currency: "USD",
        nextRenewal: new Date("2026-07-15"),
        seatsUsed: 20,
        seatsTotal: 25,
        description: "Streamlined issue tracking and project management for software teams.",
        autoRenew: true,
        tags: { create: [{ tag: "Project Management" }, { tag: "Engineering" }, { tag: "Essential" }] },
      },
    }),
    prisma.subscription.upsert({
      where: { id: "sub-8" },
      update: {},
      create: {
        id: "sub-8",
        name: "Vercel Pro",
        vendorId: "vendor-vercel",
        logo: "▲",
        color: "#ef4444",
        category: "Infrastructure",
        status: SubscriptionStatus.EXPIRED,
        plan: "Pro",
        billingCycle: BillingCycle.MONTHLY,
        amount: 40,
        currency: "USD",
        nextRenewal: new Date("2026-05-10"),
        seatsUsed: 5,
        seatsTotal: 5,
        description: "Cloud platform for deploying Next.js and frontend applications with edge network.",
        autoRenew: false,
        tags: { create: [{ tag: "Infrastructure" }, { tag: "Deployment" }, { tag: "Engineering" }] },
      },
    }),
  ])

  console.log(`Seeded ${subscriptions.length} subscriptions`)

  // --- Assign users to subscriptions ---
  const userSubscriptionAssignments = [
    // sub-1: users 0-7
    ...["user-alex", "user-sarah", "user-marcus", "user-priya", "user-tom", "user-emma", "user-david", "user-lisa"].map(
      (userId) => ({ subscriptionId: "sub-1", userId })
    ),
    // sub-2: users 0-4
    ...["user-alex", "user-sarah", "user-marcus", "user-priya", "user-tom"].map(
      (userId) => ({ subscriptionId: "sub-2", userId })
    ),
    // sub-3: users 0-6
    ...["user-alex", "user-sarah", "user-marcus", "user-priya", "user-tom", "user-emma", "user-david"].map(
      (userId) => ({ subscriptionId: "sub-3", userId })
    ),
    // sub-4: users 0-4
    ...["user-alex", "user-sarah", "user-marcus", "user-priya", "user-tom"].map(
      (userId) => ({ subscriptionId: "sub-4", userId })
    ),
    // sub-5: all users
    ...["user-alex", "user-sarah", "user-marcus", "user-priya", "user-tom", "user-emma", "user-david", "user-lisa", "user-james", "user-nina"].map(
      (userId) => ({ subscriptionId: "sub-5", userId })
    ),
    // sub-6: users 0-8
    ...["user-alex", "user-sarah", "user-marcus", "user-priya", "user-tom", "user-emma", "user-david", "user-lisa", "user-james"].map(
      (userId) => ({ subscriptionId: "sub-6", userId })
    ),
    // sub-7: users 0-7
    ...["user-alex", "user-sarah", "user-marcus", "user-priya", "user-tom", "user-emma", "user-david", "user-lisa"].map(
      (userId) => ({ subscriptionId: "sub-7", userId })
    ),
    // sub-8: users 0-4
    ...["user-alex", "user-sarah", "user-marcus", "user-priya", "user-tom"].map(
      (userId) => ({ subscriptionId: "sub-8", userId })
    ),
  ]

  for (const assignment of userSubscriptionAssignments) {
    await prisma.subscriptionUser.upsert({
      where: {
        subscriptionId_userId: {
          subscriptionId: assignment.subscriptionId,
          userId: assignment.userId,
        },
      },
      update: {},
      create: assignment,
    })
  }

  console.log(`Seeded ${userSubscriptionAssignments.length} user-subscription assignments`)

  // --- Teams ---
  const teams = await Promise.all([
    prisma.team.upsert({
      where: { id: "team-eng" },
      update: {},
      create: {
        id: "team-eng",
        name: "Engineering",
        description: "Software engineering team",
        color: "#6366f1",
        avatar: "EN",
      },
    }),
    prisma.team.upsert({
      where: { id: "team-design" },
      update: {},
      create: {
        id: "team-design",
        name: "Design",
        description: "UX and visual design team",
        color: "#ec4899",
        avatar: "DS",
      },
    }),
    prisma.team.upsert({
      where: { id: "team-product" },
      update: {},
      create: {
        id: "team-product",
        name: "Product",
        description: "Product management team",
        color: "#3b82f6",
        avatar: "PM",
      },
    }),
    prisma.team.upsert({
      where: { id: "team-marketing" },
      update: {},
      create: {
        id: "team-marketing",
        name: "Marketing",
        description: "Marketing and growth team",
        color: "#f59e0b",
        avatar: "MK",
      },
    }),
    prisma.team.upsert({
      where: { id: "team-ops" },
      update: {},
      create: {
        id: "team-ops",
        name: "Operations",
        description: "Operations and infrastructure team",
        color: "#10b981",
        avatar: "OP",
      },
    }),
  ])

  console.log(`Seeded ${teams.length} teams`)

  // --- Team members ---
  const teamMemberData = [
    // Engineering: Alex, Marcus, David, James, Nina + more
    { teamId: "team-eng", userId: "user-alex", role: "admin" },
    { teamId: "team-eng", userId: "user-marcus", role: "member" },
    { teamId: "team-eng", userId: "user-david", role: "member" },
    { teamId: "team-eng", userId: "user-james", role: "member" },
    { teamId: "team-eng", userId: "user-nina", role: "member" },
    // Design: Sarah, Emma, Lisa
    { teamId: "team-design", userId: "user-sarah", role: "admin" },
    { teamId: "team-design", userId: "user-emma", role: "member" },
    { teamId: "team-design", userId: "user-lisa", role: "member" },
    // Product: Alex, Priya, Tom, Sarah
    { teamId: "team-product", userId: "user-alex", role: "member" },
    { teamId: "team-product", userId: "user-priya", role: "admin" },
    { teamId: "team-product", userId: "user-tom", role: "member" },
    { teamId: "team-product", userId: "user-sarah", role: "member" },
    // Marketing: Lisa, Nina, Tom, Emma
    { teamId: "team-marketing", userId: "user-lisa", role: "admin" },
    { teamId: "team-marketing", userId: "user-nina", role: "member" },
    { teamId: "team-marketing", userId: "user-tom", role: "member" },
    { teamId: "team-marketing", userId: "user-emma", role: "member" },
    // Operations: James, Marcus
    { teamId: "team-ops", userId: "user-james", role: "admin" },
    { teamId: "team-ops", userId: "user-marcus", role: "member" },
    { teamId: "team-ops", userId: "user-priya", role: "member" },
    { teamId: "team-ops", userId: "user-david", role: "member" },
  ]

  for (const tm of teamMemberData) {
    await prisma.teamMember.upsert({
      where: { teamId_userId: { teamId: tm.teamId, userId: tm.userId } },
      update: {},
      create: tm,
    })
  }

  console.log(`Seeded ${teamMemberData.length} team members`)

  // --- Team subscriptions ---
  const teamSubData = [
    // Engineering: ChatGPT, GitHub, Linear, Vercel
    { teamId: "team-eng", subscriptionId: "sub-1" },
    { teamId: "team-eng", subscriptionId: "sub-6" },
    { teamId: "team-eng", subscriptionId: "sub-7" },
    { teamId: "team-eng", subscriptionId: "sub-8" },
    // Design: Figma, Adobe CC
    { teamId: "team-design", subscriptionId: "sub-2" },
    { teamId: "team-design", subscriptionId: "sub-3" },
    // Product: ChatGPT, Notion, Linear
    { teamId: "team-product", subscriptionId: "sub-1" },
    { teamId: "team-product", subscriptionId: "sub-4" },
    { teamId: "team-product", subscriptionId: "sub-7" },
    // Marketing: ChatGPT, Adobe, Slack
    { teamId: "team-marketing", subscriptionId: "sub-1" },
    { teamId: "team-marketing", subscriptionId: "sub-3" },
    { teamId: "team-marketing", subscriptionId: "sub-5" },
    // Operations: Notion, Slack
    { teamId: "team-ops", subscriptionId: "sub-4" },
    { teamId: "team-ops", subscriptionId: "sub-5" },
  ]

  for (const ts of teamSubData) {
    await prisma.teamSubscription.upsert({
      where: { teamId_subscriptionId: { teamId: ts.teamId, subscriptionId: ts.subscriptionId } },
      update: {},
      create: ts,
    })
  }

  console.log(`Seeded ${teamSubData.length} team subscriptions`)

  // --- Activities ---
  const activitiesToSeed = [
    {
      id: "act-1",
      type: "renewal",
      description: "Subscription automatically renewed",
      subscriptionId: "sub-1",
      userId: null,
      amount: 200,
      createdAt: new Date("2026-05-15T10:30:00Z"),
    },
    {
      id: "act-2",
      type: "seat_added",
      description: "5 new seats added to Slack Pro",
      subscriptionId: "sub-5",
      userId: "user-alex",
      amount: null,
      createdAt: new Date("2026-05-14T14:22:00Z"),
    },
    {
      id: "act-3",
      type: "payment",
      description: "Payment processed successfully",
      subscriptionId: "sub-3",
      userId: null,
      amount: 600,
      createdAt: new Date("2026-05-12T09:00:00Z"),
    },
    {
      id: "act-4",
      type: "plan_change",
      description: "Upgraded from Plus to Business plan",
      subscriptionId: "sub-4",
      userId: "user-sarah",
      amount: 16,
      createdAt: new Date("2026-05-10T16:45:00Z"),
    },
    {
      id: "act-5",
      type: "cancelled",
      description: "Subscription expired — renewal failed",
      subscriptionId: "sub-8",
      userId: null,
      amount: 40,
      createdAt: new Date("2026-05-10T08:00:00Z"),
    },
    {
      id: "act-6",
      type: "seat_removed",
      description: "2 seats removed after offboarding",
      subscriptionId: "sub-6",
      userId: "user-marcus",
      amount: null,
      createdAt: new Date("2026-05-08T11:15:00Z"),
    },
    {
      id: "act-7",
      type: "renewal",
      description: "Subscription automatically renewed",
      subscriptionId: "sub-7",
      userId: null,
      amount: 80,
      createdAt: new Date("2026-05-07T10:00:00Z"),
    },
    {
      id: "act-8",
      type: "payment",
      description: "Payment processed successfully",
      subscriptionId: "sub-5",
      userId: null,
      amount: 87.5,
      createdAt: new Date("2026-05-05T09:30:00Z"),
    },
    {
      id: "act-9",
      type: "renewal",
      description: "Subscription automatically renewed",
      subscriptionId: "sub-3",
      userId: null,
      amount: 600,
      createdAt: new Date("2026-04-12T09:00:00Z"),
    },
    {
      id: "act-10",
      type: "seat_added",
      description: "3 new seats added to ChatGPT Team",
      subscriptionId: "sub-1",
      userId: "user-priya",
      amount: null,
      createdAt: new Date("2026-04-20T13:00:00Z"),
    },
    {
      id: "act-11",
      type: "payment",
      description: "Payment processed successfully",
      subscriptionId: "sub-6",
      userId: null,
      amount: 420,
      createdAt: new Date("2026-05-01T08:00:00Z"),
    },
    {
      id: "act-12",
      type: "renewal",
      description: "Subscription automatically renewed",
      subscriptionId: "sub-2",
      userId: null,
      amount: 75,
      createdAt: new Date("2026-04-30T10:00:00Z"),
    },
    {
      id: "act-13",
      type: "plan_change",
      description: "Downgraded from Enterprise to Team plan",
      subscriptionId: "sub-5",
      userId: "user-alex",
      amount: 87.5,
      createdAt: new Date("2026-04-15T14:00:00Z"),
    },
    {
      id: "act-14",
      type: "seat_added",
      description: "10 seats added to GitHub Enterprise",
      subscriptionId: "sub-6",
      userId: "user-david",
      amount: null,
      createdAt: new Date("2026-03-20T09:00:00Z"),
    },
    {
      id: "act-15",
      type: "renewal",
      description: "Subscription automatically renewed",
      subscriptionId: "sub-4",
      userId: null,
      amount: 16,
      createdAt: new Date("2026-04-20T10:00:00Z"),
    },
  ]

  for (const activity of activitiesToSeed) {
    await prisma.activity.upsert({
      where: { id: activity.id },
      update: {},
      create: {
        id: activity.id,
        type: activity.type,
        description: activity.description,
        subscriptionId: activity.subscriptionId,
        userId: activity.userId,
        amount: activity.amount,
        createdAt: activity.createdAt,
      },
    })
  }

  console.log(`Seeded ${activitiesToSeed.length} activities`)
  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
