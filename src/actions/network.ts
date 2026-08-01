"use server"

import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function approveConnection(connectionId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Ensure this connection belongs to the user and is pending
  const conn = await prisma.connection.findUnique({ where: { id: connectionId } })
  if (!conn || conn.userBId !== session.user.id || conn.status !== "PENDING") {
    throw new Error("Invalid request")
  }

  await prisma.connection.update({
    where: { id: connectionId },
    data: { status: "ACCEPTED" }
  })
  
  revalidatePath("/network")
}

export async function rejectConnection(connectionId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const conn = await prisma.connection.findUnique({ where: { id: connectionId } })
  if (!conn || conn.userBId !== session.user.id || conn.status !== "PENDING") {
    throw new Error("Invalid request")
  }

  await prisma.connection.update({
    where: { id: connectionId },
    data: { status: "REJECTED" }
  })
  
  revalidatePath("/network")
}
