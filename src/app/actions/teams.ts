"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { SerializedTeam } from "@/types"
import { Prisma } from "@prisma/client"

function serializeTeam(team: any): SerializedTeam {
  return {
    id: team.id,
    name: team.name,
    description: team.description,
    color: team.color,
    avatar: team.avatar,
    createdAt: team.createdAt instanceof Date ? team.createdAt.toISOString() : team.createdAt,
    updatedAt: team.updatedAt instanceof Date ? team.updatedAt.toISOString() : team.updatedAt,
    members: (team.members ?? []).map((m: any) => ({
      id: m.id,
      teamId: m.teamId,
      userId: m.userId,
      role: m.role,
      joinedAt: m.joinedAt instanceof Date ? m.joinedAt.toISOString() : m.joinedAt,
      user: {
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        avatar: m.user.avatar,
        role: m.user.role,
        createdAt: m.user.createdAt instanceof Date ? m.user.createdAt.toISOString() : m.user.createdAt,
        updatedAt: m.user.updatedAt instanceof Date ? m.user.updatedAt.toISOString() : m.user.updatedAt,
      },
    })),
    subscriptions: (team.subscriptions ?? []).map((ts: any) => ({
      id: ts.id,
      teamId: ts.teamId,
      subscriptionId: ts.subscriptionId,
      subscription: {
        id: ts.subscription.id,
        name: ts.subscription.name,
        vendorId: ts.subscription.vendorId,
        logo: ts.subscription.logo,
        color: ts.subscription.color,
        category: ts.subscription.category,
        status: ts.subscription.status,
        plan: ts.subscription.plan,
        billingCycle: ts.subscription.billingCycle,
        amount: ts.subscription.amount instanceof Prisma.Decimal ? ts.subscription.amount.toNumber() : Number(ts.subscription.amount),
        currency: ts.subscription.currency,
        nextRenewal: ts.subscription.nextRenewal instanceof Date ? ts.subscription.nextRenewal.toISOString() : ts.subscription.nextRenewal,
        seatsUsed: ts.subscription.seatsUsed,
        seatsTotal: ts.subscription.seatsTotal,
        description: ts.subscription.description,
        autoRenew: ts.subscription.autoRenew,
        createdAt: ts.subscription.createdAt instanceof Date ? ts.subscription.createdAt.toISOString() : ts.subscription.createdAt,
        updatedAt: ts.subscription.updatedAt instanceof Date ? ts.subscription.updatedAt.toISOString() : ts.subscription.updatedAt,
        vendor: ts.subscription.vendor
          ? {
              id: ts.subscription.vendor.id,
              name: ts.subscription.vendor.name,
              logo: ts.subscription.vendor.logo,
              website: ts.subscription.vendor.website,
              description: ts.subscription.vendor.description,
              category: ts.subscription.vendor.category,
              createdAt: ts.subscription.vendor.createdAt instanceof Date ? ts.subscription.vendor.createdAt.toISOString() : ts.subscription.vendor.createdAt,
              updatedAt: ts.subscription.vendor.updatedAt instanceof Date ? ts.subscription.vendor.updatedAt.toISOString() : ts.subscription.vendor.updatedAt,
            }
          : { id: "", name: "", logo: "", website: null, description: null, category: "", createdAt: "", updatedAt: "" },
        assignedUsers: [],
        tags: [],
      },
    })),
  }
}

const teamInclude = {
  members: { include: { user: true } },
  subscriptions: {
    include: {
      subscription: { include: { vendor: true } },
    },
  },
}

export async function getTeams(): Promise<{ success: true; data: SerializedTeam[] } | { success: false; error: string }> {
  try {
    const teams = await prisma.team.findMany({
      include: teamInclude,
      orderBy: { name: "asc" },
    })
    return { success: true, data: teams.map(serializeTeam) }
  } catch (error) {
    console.error("getTeams error:", error)
    return { success: false, error: "Failed to fetch teams" }
  }
}

export async function getTeamById(
  id: string
): Promise<{ success: true; data: SerializedTeam } | { success: false; error: string }> {
  try {
    const team = await prisma.team.findUnique({ where: { id }, include: teamInclude })
    if (!team) return { success: false, error: "Team not found" }
    return { success: true, data: serializeTeam(team) }
  } catch (error) {
    console.error("getTeamById error:", error)
    return { success: false, error: "Failed to fetch team" }
  }
}

export async function createTeam(data: {
  name: string
  description?: string
  color?: string
  avatar?: string
}): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const team = await prisma.team.create({ data })
    revalidatePath("/teams")
    return { success: true, id: team.id }
  } catch (error) {
    console.error("createTeam error:", error)
    return { success: false, error: "Failed to create team" }
  }
}

export async function updateTeam(
  id: string,
  data: { name?: string; description?: string; color?: string; avatar?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.team.update({ where: { id }, data })
    revalidatePath("/teams")
    return { success: true }
  } catch (error) {
    console.error("updateTeam error:", error)
    return { success: false, error: "Failed to update team" }
  }
}

export async function deleteTeam(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.team.delete({ where: { id } })
    revalidatePath("/teams")
    return { success: true }
  } catch (error) {
    console.error("deleteTeam error:", error)
    return { success: false, error: "Failed to delete team" }
  }
}

export async function addTeamMember(
  teamId: string,
  userId: string,
  role = "member"
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.teamMember.create({ data: { teamId, userId, role } })
    revalidatePath("/teams")
    return { success: true }
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { success: false, error: "User is already a member of this team" }
    }
    console.error("addTeamMember error:", error)
    return { success: false, error: "Failed to add team member" }
  }
}

export async function removeTeamMember(teamId: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.teamMember.delete({
      where: { teamId_userId: { teamId, userId } },
    })
    revalidatePath("/teams")
    return { success: true }
  } catch (error) {
    console.error("removeTeamMember error:", error)
    return { success: false, error: "Failed to remove team member" }
  }
}
