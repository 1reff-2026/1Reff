import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

import { prisma } from "@/lib/prisma"

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const { id } = await params
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: { gives: true, asks: true }
  })

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <h1 className="text-2xl font-bold mb-2">User not found</h1>
        <Link href="/network" className="text-primary hover:underline">Return to Network</Link>
      </div>
    )
  }

  // Check connection status
  const connection = await prisma.connection.findFirst({
    where: {
      OR: [
        { userAId: session.user.id, userBId: user.id },
        { userAId: user.id, userBId: session.user.id }
      ]
    }
  })

  const displayName = user.name?.toUpperCase() || "UNKNOWN USER"
  const isConnected = connection?.status === "ACCEPTED"

  return (
    <div className="w-full max-w-md mx-auto pb-24 appear">
      
      {/* Main Profile Card */}
      <div className="bg-white shadow-sm overflow-hidden min-h-screen">
        
        {/* Banner Section */}
        <div className="relative h-32 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/40 overflow-hidden">
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-400/5 rounded-full blur-2xl" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-xl" />
        </div>

        {/* Profile Info Section */}
        <div className="px-5 pb-5 relative">
          
          {/* Avatar over banner */}
          <div className="absolute -top-12 left-5">
            <div className="w-24 h-24 rounded-full bg-[#A3ADC2] border-4 border-white flex flex-col items-center justify-center text-white shadow-sm overflow-hidden relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-[10px] font-medium">Photo</span>
            </div>
          </div>

          <div className="pt-14">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold font-display text-foreground tracking-tight">{displayName}</h1>
            </div>
            
            <p className="text-[12px] text-gray-500 mt-1 uppercase tracking-wide">
              {user.title || "NO TITLE"} <span className="mx-1 text-gray-300">|</span> LOCATION
            </p>

            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-[13px]"><span className="font-bold text-primary">500+</span> <span className="text-gray-500">Connections</span></p>
              </div>

              {!isConnected && (
                <button className="w-full bg-[#5C45FD] text-white py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-[#5C45FD]/90 transition-colors">
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sections List */}
        <div className="border-t border-gray-100 flex flex-col">
          
          {/* About */}
          <div className="px-5 py-5 group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-foreground text-[16px]">About</h3>
            </div>
            <p className="text-[14px] text-slate-700 leading-relaxed whitespace-pre-wrap">
              {user.bio || <span className="text-gray-400 italic">No bio provided.</span>}
            </p>
          </div>
          <div className="mx-5 border-t border-gray-100" />

          {/* Asks & Gives */}
          <div className="px-5 py-5 group">
            <h3 className="font-bold text-foreground text-[14px] uppercase tracking-wide mb-3">Asks</h3>
            {user.asks.length === 0 ? (
              <p className="text-[13px] text-gray-400 italic">No asks right now.</p>
            ) : (
              <div className="space-y-3">
                {user.asks.map(ask => (
                  <div key={ask.id} className="p-3 bg-white border border-gray-100 rounded-xl relative group/item">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md uppercase tracking-wider">{ask.category}</span>
                    <p className="text-[13.5px] text-slate-700 mt-2 leading-relaxed">{ask.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mx-5 border-t border-gray-100" />

          <div className="px-5 py-5 group">
            <h3 className="font-bold text-emerald-600 text-[14px] uppercase tracking-wide mb-3">Gives</h3>
            {user.gives.length === 0 ? (
              <p className="text-[13px] text-gray-400 italic">No gives right now.</p>
            ) : (
              <div className="space-y-3">
                {user.gives.map(give => (
                  <div key={give.id} className="p-3 bg-white border border-emerald-100 rounded-xl relative group/item">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider">{give.category}</span>
                    <p className="text-[13.5px] text-slate-700 mt-2 leading-relaxed">{give.detail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mx-5 border-t border-gray-100" />

          {/* Services */}
          <div className="px-5 py-5 group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-foreground text-[14px] uppercase tracking-wide">SERVICES</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-slate-700 text-[12px] font-medium rounded-full">Consulting</span>
              <span className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-slate-700 text-[12px] font-medium rounded-full">Strategy</span>
            </div>
          </div>
          <div className="mx-5 border-t border-gray-100" />

        </div>
      </div>
    </div>
  )
}
