export type SubscriptionStatus = "active" | "expiring" | "expired"
export type BillingCycle = "monthly" | "yearly"

export interface AssignedUser {
  id: string
  name: string
  email: string
  avatar: string
  role: string
}

export interface Subscription {
  id: string
  name: string
  vendor: string
  logo: string
  category: string
  status: SubscriptionStatus
  plan: string
  billingCycle: BillingCycle
  amount: number
  currency: string
  nextRenewal: string
  seats: {
    used: number
    total: number
  }
  assignedUsers: AssignedUser[]
  description: string
  color: string
  tags: string[]
}

export interface Vendor {
  id: string
  name: string
  logo: string
  totalSpending: number
  activeProducts: number
  subscriptions: number
  teams: string[]
  category: string
}

export interface Team {
  id: string
  name: string
  members: number
  subscriptions: string[]
  totalSpend: number
  avatar: string
}

export interface MonthlySpending {
  month: string
  amount: number
  previousAmount: number
}

export interface Activity {
  id: string
  type: "renewal" | "payment" | "seat_added" | "seat_removed" | "plan_change" | "cancelled"
  subscription: string
  description: string
  timestamp: string
  amount?: number
  user?: string
}

export const assignedUsers: AssignedUser[] = [
  { id: "u1", name: "Alex Chen", email: "alex@acme.com", avatar: "AC", role: "Admin" },
  { id: "u2", name: "Sarah Kim", email: "sarah@acme.com", avatar: "SK", role: "Member" },
  { id: "u3", name: "Marcus Johnson", email: "marcus@acme.com", avatar: "MJ", role: "Member" },
  { id: "u4", name: "Priya Patel", email: "priya@acme.com", avatar: "PP", role: "Member" },
  { id: "u5", name: "Tom Rivera", email: "tom@acme.com", avatar: "TR", role: "Member" },
  { id: "u6", name: "Emma Walsh", email: "emma@acme.com", avatar: "EW", role: "Viewer" },
  { id: "u7", name: "David Park", email: "david@acme.com", avatar: "DP", role: "Member" },
  { id: "u8", name: "Lisa Torres", email: "lisa@acme.com", avatar: "LT", role: "Member" },
  { id: "u9", name: "James Miller", email: "james@acme.com", avatar: "JM", role: "Viewer" },
  { id: "u10", name: "Nina Okafor", email: "nina@acme.com", avatar: "NO", role: "Member" },
]

export const subscriptions: Subscription[] = [
  {
    id: "sub-1",
    name: "ChatGPT Team",
    vendor: "OpenAI",
    logo: "🤖",
    category: "AI & ML",
    status: "active",
    plan: "Team",
    billingCycle: "monthly",
    amount: 200,
    currency: "USD",
    nextRenewal: "2026-06-15",
    seats: { used: 8, total: 10 },
    assignedUsers: assignedUsers.slice(0, 8),
    description: "AI-powered chat and productivity tool for the entire team. Access to GPT-4o and advanced reasoning models.",
    color: "#10b981",
    tags: ["AI", "Productivity", "Essential"],
  },
  {
    id: "sub-2",
    name: "Figma Team",
    vendor: "Figma",
    logo: "🎨",
    category: "Design",
    status: "expiring",
    plan: "Professional",
    billingCycle: "monthly",
    amount: 75,
    currency: "USD",
    nextRenewal: "2026-05-30",
    seats: { used: 5, total: 5 },
    assignedUsers: assignedUsers.slice(0, 5),
    description: "Collaborative design tool for UI/UX, prototyping, and design system management.",
    color: "#f59e0b",
    tags: ["Design", "Collaboration", "Critical"],
  },
  {
    id: "sub-3",
    name: "Adobe Creative Cloud",
    vendor: "Adobe",
    logo: "🅰️",
    category: "Design",
    status: "active",
    plan: "Business",
    billingCycle: "monthly",
    amount: 600,
    currency: "USD",
    nextRenewal: "2026-07-01",
    seats: { used: 14, total: 20 },
    assignedUsers: assignedUsers.slice(0, 7),
    description: "Full suite of creative tools including Photoshop, Illustrator, Premiere Pro, and more.",
    color: "#ef4444",
    tags: ["Design", "Video", "Marketing"],
  },
  {
    id: "sub-4",
    name: "Notion Team",
    vendor: "Notion",
    logo: "📝",
    category: "Productivity",
    status: "active",
    plan: "Business",
    billingCycle: "monthly",
    amount: 16,
    currency: "USD",
    nextRenewal: "2026-06-20",
    seats: { used: 12, total: 15 },
    assignedUsers: assignedUsers.slice(0, 5),
    description: "All-in-one workspace for notes, docs, wikis, and project management.",
    color: "#6366f1",
    tags: ["Productivity", "Documentation", "Essential"],
  },
  {
    id: "sub-5",
    name: "Slack Pro",
    vendor: "Slack",
    logo: "💬",
    category: "Communication",
    status: "active",
    plan: "Pro",
    billingCycle: "monthly",
    amount: 87.5,
    currency: "USD",
    nextRenewal: "2026-06-10",
    seats: { used: 35, total: 50 },
    assignedUsers: assignedUsers,
    description: "Team messaging and collaboration platform with integrations and unlimited message history.",
    color: "#8b5cf6",
    tags: ["Communication", "Essential", "Integration"],
  },
  {
    id: "sub-6",
    name: "GitHub Enterprise",
    vendor: "GitHub",
    logo: "🐙",
    category: "Development",
    status: "expiring",
    plan: "Enterprise",
    billingCycle: "monthly",
    amount: 420,
    currency: "USD",
    nextRenewal: "2026-06-01",
    seats: { used: 28, total: 30 },
    assignedUsers: assignedUsers.slice(0, 9),
    description: "Enterprise-grade code hosting, CI/CD, security scanning, and team collaboration.",
    color: "#f59e0b",
    tags: ["Development", "DevOps", "Critical"],
  },
  {
    id: "sub-7",
    name: "Linear",
    vendor: "Linear",
    logo: "📐",
    category: "Project Management",
    status: "active",
    plan: "Business",
    billingCycle: "monthly",
    amount: 80,
    currency: "USD",
    nextRenewal: "2026-07-15",
    seats: { used: 20, total: 25 },
    assignedUsers: assignedUsers.slice(0, 8),
    description: "Streamlined issue tracking and project management for software teams.",
    color: "#6366f1",
    tags: ["Project Management", "Engineering", "Essential"],
  },
  {
    id: "sub-8",
    name: "Vercel Pro",
    vendor: "Vercel",
    logo: "▲",
    category: "Infrastructure",
    status: "expired",
    plan: "Pro",
    billingCycle: "monthly",
    amount: 40,
    currency: "USD",
    nextRenewal: "2026-05-10",
    seats: { used: 5, total: 5 },
    assignedUsers: assignedUsers.slice(0, 5),
    description: "Cloud platform for deploying Next.js and frontend applications with edge network.",
    color: "#ef4444",
    tags: ["Infrastructure", "Deployment", "Engineering"],
  },
]

export const vendors: Vendor[] = [
  {
    id: "v1",
    name: "OpenAI",
    logo: "🤖",
    totalSpending: 2400,
    activeProducts: 1,
    subscriptions: 1,
    teams: ["Engineering", "Product", "Marketing"],
    category: "AI & ML",
  },
  {
    id: "v2",
    name: "Figma",
    logo: "🎨",
    totalSpending: 900,
    activeProducts: 1,
    subscriptions: 1,
    teams: ["Design", "Product"],
    category: "Design",
  },
  {
    id: "v3",
    name: "Adobe",
    logo: "🅰️",
    totalSpending: 7200,
    activeProducts: 1,
    subscriptions: 1,
    teams: ["Design", "Marketing", "Video"],
    category: "Design",
  },
  {
    id: "v4",
    name: "Notion",
    logo: "📝",
    totalSpending: 192,
    activeProducts: 1,
    subscriptions: 1,
    teams: ["All Teams"],
    category: "Productivity",
  },
  {
    id: "v5",
    name: "Slack",
    logo: "💬",
    totalSpending: 1050,
    activeProducts: 1,
    subscriptions: 1,
    teams: ["All Teams"],
    category: "Communication",
  },
  {
    id: "v6",
    name: "GitHub",
    logo: "🐙",
    totalSpending: 5040,
    activeProducts: 1,
    subscriptions: 1,
    teams: ["Engineering", "DevOps"],
    category: "Development",
  },
  {
    id: "v7",
    name: "Linear",
    logo: "📐",
    totalSpending: 960,
    activeProducts: 1,
    subscriptions: 1,
    teams: ["Engineering", "Product"],
    category: "Project Management",
  },
  {
    id: "v8",
    name: "Vercel",
    logo: "▲",
    totalSpending: 480,
    activeProducts: 1,
    subscriptions: 1,
    teams: ["Engineering"],
    category: "Infrastructure",
  },
]

export const teams: Team[] = [
  {
    id: "t1",
    name: "Engineering",
    members: 12,
    subscriptions: ["sub-1", "sub-6", "sub-7", "sub-8"],
    totalSpend: 740,
    avatar: "EN",
  },
  {
    id: "t2",
    name: "Design",
    members: 5,
    subscriptions: ["sub-2", "sub-3"],
    totalSpend: 675,
    avatar: "DS",
  },
  {
    id: "t3",
    name: "Product",
    members: 8,
    subscriptions: ["sub-1", "sub-4", "sub-7"],
    totalSpend: 296,
    avatar: "PM",
  },
  {
    id: "t4",
    name: "Marketing",
    members: 6,
    subscriptions: ["sub-1", "sub-3", "sub-5"],
    totalSpend: 887.5,
    avatar: "MK",
  },
  {
    id: "t5",
    name: "Operations",
    members: 4,
    subscriptions: ["sub-4", "sub-5"],
    totalSpend: 103.5,
    avatar: "OP",
  },
]

export const monthlySpending: MonthlySpending[] = [
  { month: "Jun '25", amount: 1250, previousAmount: 1100 },
  { month: "Jul '25", amount: 1380, previousAmount: 1250 },
  { month: "Aug '25", amount: 1290, previousAmount: 1380 },
  { month: "Sep '25", amount: 1520, previousAmount: 1290 },
  { month: "Oct '25", amount: 1680, previousAmount: 1520 },
  { month: "Nov '25", amount: 1420, previousAmount: 1680 },
  { month: "Dec '25", amount: 1850, previousAmount: 1420 },
  { month: "Jan '26", amount: 1750, previousAmount: 1850 },
  { month: "Feb '26", amount: 1620, previousAmount: 1750 },
  { month: "Mar '26", amount: 1890, previousAmount: 1620 },
  { month: "Apr '26", amount: 1518, previousAmount: 1890 },
  { month: "May '26", amount: 1518.5, previousAmount: 1518 },
]

export const activities: Activity[] = [
  {
    id: "a1",
    type: "renewal",
    subscription: "ChatGPT Team",
    description: "Subscription automatically renewed",
    timestamp: "2026-05-15T10:30:00Z",
    amount: 200,
  },
  {
    id: "a2",
    type: "seat_added",
    subscription: "Slack Pro",
    description: "5 new seats added to Slack Pro",
    timestamp: "2026-05-14T14:22:00Z",
    user: "Alex Chen",
  },
  {
    id: "a3",
    type: "payment",
    subscription: "Adobe Creative Cloud",
    description: "Payment processed successfully",
    timestamp: "2026-05-12T09:00:00Z",
    amount: 600,
  },
  {
    id: "a4",
    type: "plan_change",
    subscription: "Notion Team",
    description: "Upgraded from Plus to Business plan",
    timestamp: "2026-05-10T16:45:00Z",
    amount: 16,
    user: "Sarah Kim",
  },
  {
    id: "a5",
    type: "cancelled",
    subscription: "Vercel Pro",
    description: "Subscription expired — renewal failed",
    timestamp: "2026-05-10T08:00:00Z",
    amount: 40,
  },
  {
    id: "a6",
    type: "seat_removed",
    subscription: "GitHub Enterprise",
    description: "2 seats removed after offboarding",
    timestamp: "2026-05-08T11:15:00Z",
    user: "Marcus Johnson",
  },
  {
    id: "a7",
    type: "renewal",
    subscription: "Linear",
    description: "Subscription automatically renewed",
    timestamp: "2026-05-07T10:00:00Z",
    amount: 80,
  },
  {
    id: "a8",
    type: "payment",
    subscription: "Slack Pro",
    description: "Payment processed successfully",
    timestamp: "2026-05-05T09:30:00Z",
    amount: 87.5,
  },
]

// Computed stats
export const dashboardStats = {
  totalMonthlySpend: subscriptions
    .filter(s => s.status !== "expired")
    .reduce((sum, s) => sum + s.amount, 0),
  activeSubscriptions: subscriptions.filter(s => s.status === "active").length,
  expiringSubscriptions: subscriptions.filter(s => s.status === "expiring").length,
  expiredSubscriptions: subscriptions.filter(s => s.status === "expired").length,
  totalSeats: subscriptions.reduce((sum, s) => sum + s.seats.total, 0),
  usedSeats: subscriptions.reduce((sum, s) => sum + s.seats.used, 0),
  totalVendors: vendors.length,
  annualizedSpend: subscriptions
    .filter(s => s.status !== "expired")
    .reduce((sum, s) => sum + s.amount * 12, 0),
}
