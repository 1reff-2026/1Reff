import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { FollowupClient } from "./FollowupClient"

import { prisma } from "@/lib/prisma"

export default async function AddFollowupPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  // Fetch accepted connections
  const connections = await prisma.connection.findMany({
    where: {
      OR: [
        { userAId: session.user.id },
        { userBId: session.user.id }
      ],
      status: "ACCEPTED"
    },
    include: {
      userA: true,
      userB: true
    }
  })

  const networkOptions = connections.map(c => {
    const otherUser = c.userAId === session!.user!.id ? c.userB : c.userA;
    return {
      id: otherUser.id,
      name: otherUser.name || "Unknown",
      title: otherUser.title || "User"
    }
  })

  return <FollowupClient connections={networkOptions} />
}
