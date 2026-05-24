"use server"

import { prisma } from "@/lib/prisma"
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

export async function getUsers(): Promise<{ success: true; data: SerializedUser[] } | { success: false; error: string }> {
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
  try {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return { success: false, error: "User not found" }
    return { success: true, data: serializeUser(user) }
  } catch (error) {
    console.error("getUserById error:", error)
    return { success: false, error: "Failed to fetch user" }
  }
}
