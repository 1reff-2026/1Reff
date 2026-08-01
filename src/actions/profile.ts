"use server"

import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function createAsk(category: string, detail: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.ask.create({
    data: { category, detail, userId: session.user.id }
  })
  revalidatePath("/profile")
  revalidatePath("/")
}

export async function updateAsk(id: string, category: string, detail: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const ask = await prisma.ask.findUnique({ where: { id } })
  if (ask?.userId !== session.user.id) throw new Error("Unauthorized")

  await prisma.ask.update({
    where: { id },
    data: { category, detail }
  })
  revalidatePath("/profile")
  revalidatePath("/")
}

export async function deleteAsk(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const ask = await prisma.ask.findUnique({ where: { id } })
  if (ask?.userId !== session.user.id) throw new Error("Unauthorized")

  await prisma.ask.delete({ where: { id } })
  revalidatePath("/profile")
  revalidatePath("/")
}

export async function createGive(category: string, detail: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.give.create({
    data: { category, detail, userId: session.user.id }
  })
  revalidatePath("/profile")
  revalidatePath("/")
}

export async function updateGive(id: string, category: string, detail: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const give = await prisma.give.findUnique({ where: { id } })
  if (give?.userId !== session.user.id) throw new Error("Unauthorized")

  await prisma.give.update({
    where: { id },
    data: { category, detail }
  })
  revalidatePath("/profile")
  revalidatePath("/")
}

export async function deleteGive(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const give = await prisma.give.findUnique({ where: { id } })
  if (give?.userId !== session.user.id) throw new Error("Unauthorized")

  await prisma.give.delete({ where: { id } })
  revalidatePath("/profile")
  revalidatePath("/")
}

export async function updateProfileInfo(title: string, bio: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.user.update({
    where: { id: session.user.id },
    data: { title, bio }
  })
  revalidatePath("/profile")
}
