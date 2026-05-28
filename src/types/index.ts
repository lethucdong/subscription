// Serializable types for use in Client Components
// Prisma Decimal → number, Date → string

export type SubscriptionStatus = "ACTIVE" | "EXPIRING" | "EXPIRED" | "CANCELLED"
export type BillingCycle = "MONTHLY" | "YEARLY" | "QUARTERLY"

export interface SerializedUser {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface SerializedVendor {
  id: string
  name: string
  logo: string
  website: string | null
  description: string | null
  category: string
  createdAt: string
  updatedAt: string
  // computed
  subscriptionCount?: number
  totalAnnualSpend?: number
  activeProductCount?: number
  teamNames?: string[]
}

export interface SerializedSubscriptionTag {
  id: string
  subscriptionId: string
  tag: string
}

export interface SerializedSubscriptionUser {
  id: string
  subscriptionId: string
  userId: string
  assignedAt: string
  user: SerializedUser
}

export interface SerializedSubscription {
  id: string
  name: string
  vendorId: string
  logo: string
  color: string
  category: string
  status: SubscriptionStatus
  plan: string
  billingCycle: BillingCycle
  amount: number
  currency: string
  nextRenewal: string
  seatsUsed: number
  seatsTotal: number
  description: string | null
  autoRenew: boolean
  createdAt: string
  updatedAt: string
  vendor: SerializedVendor
  assignedUsers: SerializedSubscriptionUser[]
  tags: SerializedSubscriptionTag[]
}

export interface SerializedTeamMember {
  id: string
  teamId: string
  userId: string
  role: string
  joinedAt: string
  user: SerializedUser
}

export interface SerializedTeamSubscription {
  id: string
  teamId: string
  subscriptionId: string
  subscription: SerializedSubscription
}

export interface SerializedTeam {
  id: string
  name: string
  description: string | null
  color: string
  avatar: string
  createdAt: string
  updatedAt: string
  members: SerializedTeamMember[]
  subscriptions: SerializedTeamSubscription[]
}

export interface SerializedActivity {
  id: string
  type: string
  description: string
  subscriptionId: string | null
  userId: string | null
  amount: number | null
  createdAt: string
  subscription?: { id: string; name: string; logo: string } | null
  user?: { id: string; name: string; avatar: string } | null
}

export interface DashboardStats {
  totalMonthlyCost: number
  activeCount: number
  expiringCount: number
  expiredCount: number
  vendorCount: number
  totalSeats: number
  usedSeats: number
  annualizedSpend: number
  monthlySpending: { month: string; amount: number; previousAmount: number }[]
  vendorSpending: { name: string; logo: string; category: string; totalSpending: number }[]
  teamSpending: { name: string; totalSpend: number; subscriptionCount: number }[]
  categorySpend: Record<string, number>
}
