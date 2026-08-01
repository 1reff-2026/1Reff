import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"

export default async function PendingFollowsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const follows = await prisma.followup.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      target: true
    },
    orderBy: {
      date: 'asc'
    }
  })

  return (
    <div className="w-full max-w-2xl md:max-w-4xl mx-auto appear pb-24">
      
      {/* Container for main card and sidebar */}
      <div className="flex gap-2 sm:gap-4 md:gap-6">
        
        {/* Main Card */}
        <div className="flex-1 bg-white rounded-none md:rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border-transparent md:border-gray-100 overflow-hidden flex flex-col pb-4 min-h-[calc(100vh-56px)] md:min-h-[600px]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 md:p-6 border-b border-gray-50 shrink-0">
            <h1 className="font-bold text-[18px] sm:text-[20px] md:text-[22px] text-slate-900 truncate">Pending Follow Ups</h1>
          </div>

          {/* Content */}
          <div className="flex-1 px-4 sm:px-6 md:px-8 pt-6">
            
            {/* Info Box */}
            <div className="p-4 md:p-5 flex gap-3 items-center bg-[#F2F9F6] rounded-[16px] mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[14px] sm:text-[15px] md:text-[16px] text-slate-700 leading-relaxed pr-2 font-medium">
                You have <span className="text-emerald-600 font-bold">{follows.length}</span> pending follow ups.
              </p>
            </div>

            {/* List Items */}
            <div className="flex flex-col gap-4 md:gap-6">
              
              {follows.map((f: any) => {
                const initials = f.target?.name ? f.target.name.split(' ').map((n: string) => n[0]).join('') : "U";
                
                // Format Date
                const dateObj = new Date(f.date);
                const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
                const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

                return (
                  <div key={f.id} className="relative rounded-[16px] border p-4 sm:p-5 md:p-6 overflow-hidden group hover:shadow-md transition-shadow cursor-pointer bg-[#F2F9F6] border-emerald-100">
                    <div className="absolute left-0 top-3 bottom-3 w-1.5 md:w-2 rounded-r-md bg-emerald-500" />
                    
                    <div className="pl-3 sm:pl-4 md:pl-5">
                      {/* Top Row */}
                      <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full text-slate-800 flex items-center justify-center font-bold text-[15px] md:text-[17px] shrink-0 bg-emerald-200/50">
                            {initials}
                          </div>
                          <div className="min-w-0 truncate">
                            <h3 className="font-bold text-[16px] md:text-[18px] text-slate-900 truncate">{f.target?.name || "Unknown"}</h3>
                          </div>
                        </div>
                        {/* Badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full shrink-0 bg-emerald-100 text-emerald-700 border border-emerald-200/50">
                          <span className="text-[12px] md:text-[13px] font-semibold">{f.status}</span>
                        </div>
                      </div>

                      {/* Middle Row: Meta */}
                      <div className="flex items-center gap-3 text-slate-600 text-[13px] md:text-[14px] mb-4 md:mb-5">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-4.5 md:w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{dayStr}, {timeStr}</span>
                        </div>
                      </div>

                      {/* Bottom Row: Description */}
                      <div>
                        <p className="text-[14px] md:text-[15px] text-slate-700 font-medium mb-1 truncate">Follow up reason</p>
                        <p className="text-[13px] md:text-[14px] text-slate-500 line-clamp-2 md:line-clamp-3 leading-relaxed">
                          {f.notes || "No notes provided."}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {follows.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-200 mx-auto flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No follow ups</h3>
                  <p className="text-slate-500">You don't have any scheduled follow ups yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Bar (Desktop Only) */}
        <div className="hidden md:flex w-20 shrink-0 bg-[#F4F6F9] rounded-[24px] flex-col items-center py-8 gap-8 relative border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          
          {/* Active Tab Background (Simulated) */}
          <div className="absolute top-8 w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100/50 transition-all z-0" />
          
          {/* Tab 1: Followups (Active) */}
          <Link href="/follows" className="w-12 h-12 flex items-center justify-center text-emerald-600 z-10 hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </Link>

          {/* Tab 2: Calendar / Meetings */}
          <Link href="/meetings" className="w-12 h-12 flex items-center justify-center text-[#5C45FD] hover:bg-white hover:rounded-2xl hover:shadow-sm transition-all z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </Link>

          {/* Tab 3: People / Contacts */}
          <Link href="/network" className="w-12 h-12 flex items-center justify-center text-[#5C45FD] hover:bg-white hover:rounded-2xl hover:shadow-sm transition-all z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </Link>

          <div className="w-10 border-t border-gray-300 mt-auto opacity-50 z-10" />

          {/* Tab 4: Activity */}
          <button className="w-12 h-12 flex items-center justify-center text-[#5C45FD] hover:bg-white hover:rounded-2xl hover:shadow-sm transition-all z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  )
}
