import { Card, CardContent } from "@/components/ui/Card"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { TypewriterText } from "@/components/TypewriterText"
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
      uploadedContacts: true
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
        <div className="space-y-8">
          <div className="block px-2">
            <div className="w-full">
              <h3 className="text-[16px] sm:text-[17px] font-display font-bold leading-tight text-slate-900">
                <Link href="/ai-connect" className="hover:underline">
                  <span className="text-[#5C45FD] font-extrabold">My Asks</span> <span className="opacity-80 font-medium text-slate-500">– Want to connect to...</span>
                </Link>
              </h3>
              
              {/* Functional search field */}
              <form action="/ai-connect" className="mt-3 flex items-center bg-white/60 backdrop-blur-sm border border-purple-100/80 rounded-none px-3.5 shadow-[0_2px_8px_-2px_rgba(92,69,253,0.05)] text-[13px] text-slate-700 w-full hover:bg-white focus-within:bg-white focus-within:border-[#5C45FD]/50 focus-within:ring-2 focus-within:ring-[#5C45FD]/10 transition-all duration-300 overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2.5 text-purple-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  name="q"
                  className="w-full bg-transparent py-2.5 focus:outline-none placeholder:text-slate-400"
                />
              </form>
            </div>
          </div>

          <Link href="/upload-referral" className="block px-2 pt-2 pb-1 hover:opacity-80 transition-opacity">
            <div className="w-full">
              <h3 className="text-[16px] sm:text-[17px] font-display font-bold leading-tight text-slate-900">
                <span className="text-emerald-500 font-extrabold">My Gives</span> <span className="opacity-80 font-medium text-slate-500">– I can connect you to...</span>
              </h3>
            </div>
          </Link>
        </div>

        {/* Banner */}
        <div className="pt-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#5C45FD] to-purple-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-slate-500 text-[12px] sm:text-[13px] font-medium tracking-tight leading-snug">
                You get paid for every give referred
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

