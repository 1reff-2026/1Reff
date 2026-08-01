"use server"

import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function updateProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  const userId = session.user.id
  const title = formData.get("title") as string
  const bio = formData.get("bio") as string

  // We expect gives and asks as JSON strings to handle the dynamic list
  const givesStr = formData.get("gives") as string
  const asksStr = formData.get("asks") as string

  let gives = []
  let asks = []

  try {
    gives = givesStr ? JSON.parse(givesStr) : []
    asks = asksStr ? JSON.parse(asksStr) : []
  } catch (e) {
    return { error: "Invalid data format" }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { title, bio }
  })

  // Delete old gives and asks, and create new ones
  await prisma.give.deleteMany({ where: { userId } })
  if (gives.length > 0) {
    await prisma.give.createMany({
      data: gives.map((g: any) => ({ category: g.category, detail: g.detail, userId }))
    })
  }

  await prisma.ask.deleteMany({ where: { userId } })
  if (asks.length > 0) {
    await prisma.ask.createMany({
      data: asks.map((a: any) => ({ category: a.category, detail: a.detail, userId }))
    })
  }

  revalidatePath("/profile")
  return { success: true }
}
