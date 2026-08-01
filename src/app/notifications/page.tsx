import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

import { prisma } from "@/lib/prisma"

export default async function NotificationsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const myId = session.user.id

  // 1. Pending Connection Requests
  const pendingConnections = await prisma.connection.findMany({
    where: { userBId: myId, status: "PENDING" },
    include: { userA: true },
    orderBy: { createdAt: 'desc' }
  })

  // 2. Pending Referrals Received
  const pendingReferrals = await prisma.referral.findMany({
    where: { receiverId: myId, status: "PENDING" },
    include: { referrer: true, referred: true },
    orderBy: { createdAt: 'desc' }
  })

  // 3. Pending Follow-ups
  const pendingFollowups = await prisma.followup.findMany({
    where: { userId: myId, status: "PENDING" },
    include: { target: true },
    orderBy: { date: 'asc' }
  })

  // 4. Upcoming Meetings (Scheduled)
  const upcomingMeetings = await prisma.meeting.findMany({
    where: { 
      OR: [{ hostId: myId }, { guestId: myId }],
      status: "SCHEDULED"
    },
    include: { host: true, guest: true },
    orderBy: { date: 'asc' }
  })

  return (
    <div className="w-full max-w-2xl md:max-w-4xl mx-auto appear pb-24">
      <div className="flex items-center gap-3 mb-8 px-4 md:px-0">
        <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-display">Notifications</h1>
      </div>

      <div className="px-4 md:px-0 flex flex-col gap-4">
        
        {/* Connection Requests Section */}
        {pendingConnections.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Connection Requests
            </h2>
            <div className="flex flex-col gap-4">
              {pendingConnections.map((conn: any) => (
                <div key={conn.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-bold">
                      {conn.userA.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{conn.userA.name}</p>
                      <p className="text-sm text-gray-500">{conn.userA.title}</p>
                    </div>
                  </div>
                  <Link href={`/network`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">
                    Review
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Referrals Received Section */}
        {pendingReferrals.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              New Referrals
            </h2>
            <div className="flex flex-col gap-4">
              {pendingReferrals.map((ref: any) => (
                <div key={ref.id} className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold text-gray-900">{ref.referrer.name}</span> referred you to <span className="font-semibold text-gray-900">{ref.referred.name}</span>
                    </p>
                    <p className="text-sm text-gray-500 italic">"{ref.notes}"</p>
                  </div>
                  <Link href={`/referrals-received`} className="px-4 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-sm font-medium rounded-xl transition-colors whitespace-nowrap">
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Meetings Section */}
        {upcomingMeetings.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Upcoming Meetings
            </h2>
            <div className="flex flex-col gap-4">
              {upcomingMeetings.map((meeting: any) => {
                const otherPerson = meeting.hostId === myId ? meeting.guest : meeting.host;
                return (
                  <div key={meeting.id} className="flex items-center justify-between p-4 bg-purple-50/50 rounded-2xl border border-purple-100/50">
                    <div>
                      <p className="font-medium text-gray-900">Meeting with {otherPerson.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(meeting.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                    <Link href={`/meetings`} className="px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 text-sm font-medium rounded-xl transition-colors whitespace-nowrap">
                      Details
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Pending Follow-ups Section */}
        {pendingFollowups.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Pending Follow-ups
            </h2>
            <div className="flex flex-col gap-4">
              {pendingFollowups.map((follow: any) => (
                <div key={follow.id} className="flex items-center justify-between p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                  <div>
                    <p className="font-medium text-gray-900">Follow up with {follow.target.name}</p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(follow.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <Link href={`/follows`} className="px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 text-sm font-medium rounded-xl transition-colors whitespace-nowrap">
                    Action
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {pendingConnections.length === 0 && pendingReferrals.length === 0 && upcomingMeetings.length === 0 && pendingFollowups.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">You're all caught up!</h3>
            <p className="text-gray-500">No new notifications right now.</p>
          </div>
        )}
      </div>
    </div>
  )
}
