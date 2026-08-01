import { Card, CardContent } from "@/components/ui/Card"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { TypewriterText } from "@/components/TypewriterText"
import { HomeAISearchWidget } from "@/components/HomeAISearchWidget"

import { prisma } from "@/lib/prisma"

export default async function Dashboard() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id! },
    include: {
      asks: true,
      gives: true
    }
  })

  const firstName = user?.name?.split(' ')[0]?.toUpperCase() || 'USER'

  return (
    <div className="max-w-xl mx-auto px-4 md:px-0 flex flex-col min-h-[calc(100vh-100px)] appear">
      
      {/* Top Section: Centered */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 pb-8">
        <div className="text-center space-y-3 w-full">
          <h1 className="text-[17px] font-medium text-foreground/80">
            Welcome, <span className="text-primary font-bold">{firstName}</span>
          </h1>
          <h2 className="text-[26px] leading-[1.15] md:text-3xl font-display font-extrabold text-foreground tracking-tight max-w-[280px] mx-auto min-h-[60px]">
            <TypewriterText phrases={[
              "Who do you want to connect with today?",
              "Looking for your next big opportunity?",
              "Who can help you grow your business?",
              "Ready to expand your network?"
            ]} />
          </h2>
        </div>
        
      </div>

      {/* Bottom Section */}
      <div className="mt-auto space-y-6">
        {/* Action Cards */}
        <div className="space-y-4">
          <Link href="/profile" className="block">
            <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-white to-purple-50/40 border border-purple-100 shadow-[0_4px_20px_-4px_rgba(92,69,253,0.08)] hover:shadow-[0_8px_30px_-4px_rgba(92,69,253,0.15)] hover:-translate-y-1 transition-all duration-300 p-4 sm:p-5 group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-[#5C45FD]/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex-1 pr-2">
                  <h3 className="text-[16px] sm:text-[17px] font-display font-semibold leading-tight text-slate-900">
                    <span className="text-[#5C45FD] font-bold">My Asks</span> <span className="opacity-80 font-medium text-slate-500">– Want to connect to...</span>
                  </h3>
                  <p className="text-[12.5px] sm:text-[13px] text-slate-500 mt-1.5 leading-relaxed">
                    You have <span className="font-bold text-[#5C45FD]">{user?.asks?.length || 0}</span> active asks. Click here to manage them.
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white shadow-sm text-[#5C45FD] flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-[#5C45FD] group-hover:text-white transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/profile" className="block">
            <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-white to-emerald-50/40 border border-emerald-100 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.08)] hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.15)] hover:-translate-y-1 transition-all duration-300 p-4 sm:p-5 group">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              
              <div className="flex items-center justify-between gap-3 relative z-10">
                <div className="flex-1 pr-2">
                  <h3 className="text-[16px] sm:text-[17px] font-display font-semibold leading-tight text-slate-900">
                    <span className="text-emerald-500 font-bold">My Gives</span> <span className="opacity-80 font-medium text-slate-500">– I can connect you to...</span>
                  </h3>
                  <p className="text-[12.5px] sm:text-[13px] text-slate-500 mt-1.5 leading-relaxed">
                    You have <span className="font-bold text-emerald-500">{user?.gives?.length || 0}</span> active gives. Click here to manage them.
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white shadow-sm text-emerald-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* 3rd: AI Contact Search Widget */}
          <HomeAISearchWidget />
        </div>

        {/* Banner */}
        <div className="pt-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#5C45FD]/5 via-white to-emerald-500/5 border border-white/60 p-3 sm:p-4 shadow-[0_2px_15px_rgba(0,0,0,0.03)] flex items-center gap-3">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-xl" />
            
            <div className="relative z-10 w-8 h-8 rounded-full bg-gradient-to-br from-[#5C45FD] to-purple-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="relative z-10">
              <p className="text-slate-800 text-[12px] sm:text-[13px] font-semibold tracking-tight leading-snug">
                We Encourage <span className="text-[#5C45FD] font-bold">1 Give</span> on every <span className="text-emerald-500 font-bold">2 Asks</span>
              </p>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 mt-0.5 font-medium">Small actions. Stronger connections.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

