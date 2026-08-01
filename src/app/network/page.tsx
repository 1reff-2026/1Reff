import { auth } from "@/auth"
import { NetworkClient } from "./NetworkClient"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"

export default async function NetworkPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  // Pending requests where current user is userB (receiving the request)
  const pendingConnections = await prisma.connection.findMany({
    where: {
      userBId: session.user.id,
      status: "PENDING"
    },
    include: {
      userA: true // The person who sent the request
    }
  })

  // Accepted connections
  const acceptedConnections = await prisma.connection.findMany({
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

  // Format data for the client
  const currentUserId = session.user.id;

  const requests = pendingConnections.map(c => ({
    id: c.id,
    userId: c.userAId,
    name: c.userA.name || "Unknown",
    title: c.userA.title || "User",
    badge: "Connection Request"
  }))

  const connections = acceptedConnections.map(c => {
    const otherUser = c.userAId === currentUserId ? c.userB : c.userA;
    return {
      id: c.id,
      userId: otherUser.id,
      name: otherUser.name || "Unknown",
      title: otherUser.title || "User"
    }
  })

  return <NetworkClient initialRequests={requests} initialConnections={connections} />
}
