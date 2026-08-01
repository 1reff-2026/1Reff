"use server"

import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/prisma"

export async function createMeeting(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Not authenticated" }

  const date = formData.get("date") as string
  const time = formData.get("time") as string
  const notes = formData.get("notes") as string
  const guestId = formData.get("guestId") as string

  if (!date || !time || !guestId) {
    return { error: "Missing required fields" }
  }

  // Combine date and time
  const dateTimeString = `${date}T${time}:00.000Z`
  const meetingDate = new Date(dateTimeString)

  try {
    await prisma.meeting.create({
      data: {
        date: meetingDate,
        notes,
        hostId: session.user.id,
        guestId,
        status: "SCHEDULED"
      }
    })

    revalidatePath("/meetings")
    revalidatePath("/network")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to schedule meeting" }
  }
}

export async function createFollowup(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Not authenticated" }

  const date = formData.get("date") as string
  const time = formData.get("time") as string
  const notes = formData.get("notes") as string
  const targetId = formData.get("targetId") as string

  if (!date || !time || !targetId || !notes) {
    return { error: "Missing required fields" }
  }

  const dateTimeString = `${date}T${time}:00.000Z`
  const followupDate = new Date(dateTimeString)

  try {
    await prisma.followup.create({
      data: {
        date: followupDate,
        notes,
        userId: session.user.id,
        targetId,
        status: "PENDING"
      }
    })

    revalidatePath("/follows")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to create followup" }
  }
}

export async function createReferral(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Not authenticated" }

  const notes = formData.get("notes") as string
  const receiverId = formData.get("receiverId") as string
  const referredId = formData.get("referredId") as string

  if (!notes || !receiverId || !referredId) {
    return { error: "Missing required fields" }
  }

  try {
    await prisma.referral.create({
      data: {
        notes,
        referrerId: session.user.id,
        receiverId,
        referredId,
        status: "PENDING"
      }
    })

    revalidatePath("/referrals-passed")
    revalidatePath("/referrals-received")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to create referral" }
  }
}
