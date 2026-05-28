"use server"

import { prisma } from "@/lib/prisma"
import { cacheTag, cacheLife, updateTag } from "next/cache"
import type { SerializedUser } from "@/types"

function serializeUser(u: any): SerializedUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    avatar: u.avatar,
    role: u.role,
    createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : u.createdAt,
    updatedAt: u.updatedAt instanceof Date ? u.updatedAt.toISOString() : u.updatedAt,
  }
}

function deriveAvatar(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return "?"
  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export async function getUsers(): Promise<{ success: true; data: SerializedUser[] } | { success: false; error: string }> {
  "use cache"
  cacheTag("users")
  cacheLife("minutes")

  try {
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
    })
    return { success: true, data: users.map(serializeUser) }
  } catch (error) {
    console.error("getUsers error:", error)
    return { success: false, error: "Failed to fetch users" }
  }
}

export async function getUserById(
  id: string
): Promise<{ success: true; data: SerializedUser } | { success: false; error: string }> {
  "use cache"
  cacheTag("users", `user:${id}`)
  cacheLife("minutes")

  try {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return { success: false, error: "User not found" }
    return { success: true, data: serializeUser(user) }
  } catch (error) {
    console.error("getUserById error:", error)
    return { success: false, error: "Failed to fetch user" }
  }
}

export async function createUser(data: {
  name: string
  email: string
  avatar?: string
  role?: string
}): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        avatar: data.avatar?.trim() || deriveAvatar(data.name),
        role: data.role ?? "member",
      },
    })
    updateTag("users")
    updateTag("teams")
    updateTag("subscriptions")
    return { success: true, id: user.id }
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { success: false, error: "A user with this email already exists" }
    }
    console.error("createUser error:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export async function updateUser(
  id: string,
  data: { name?: string; email?: string; avatar?: string; role?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: any = {}
    if (data.name !== undefined) payload.name = data.name.trim()
    if (data.email !== undefined) payload.email = data.email.trim().toLowerCase()
    if (data.avatar !== undefined) payload.avatar = data.avatar.trim()
    if (data.role !== undefined) payload.role = data.role

    await prisma.user.update({ where: { id }, data: payload })
    updateTag("users")
    updateTag("teams")
    return { success: true }
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { success: false, error: "A user with this email already exists" }
    }
    console.error("updateUser error:", error)
    return { success: false, error: "Failed to update user" }
  }
}

export async function deleteUser(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.$transaction(async (tx) => {
      const assignedSubs = await tx.subscriptionUser.findMany({
        where: { userId: id },
        select: { subscriptionId: true },
      })
      const subIds = assignedSubs.map((s) => s.subscriptionId)

      await tx.subscriptionUser.deleteMany({ where: { userId: id } })
      await tx.teamMember.deleteMany({ where: { userId: id } })
      await tx.activity.updateMany({ where: { userId: id }, data: { userId: null } })
      await tx.user.delete({ where: { id } })

      for (const subId of subIds) {
        const remaining = await tx.subscriptionUser.count({ where: { subscriptionId: subId } })
        await tx.subscription.update({ where: { id: subId }, data: { seatsUsed: remaining } })
      }
    })

    updateTag("users")
    updateTag("teams")
    updateTag("subscriptions")
    return { success: true }
  } catch (error) {
    console.error("deleteUser error:", error)
    return { success: false, error: "Failed to delete user" }
  }
}
