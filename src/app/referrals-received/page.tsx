import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"

export default async function ReferralsReceivedPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const referrals = await prisma.referral.findMany({
    where: {
      receiverId: session.user.id
    },
    include: {
      referrer: true,
      referred: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="w-full max-w-2xl md:max-w-4xl mx-auto appear pb-24">
      
      <div className="flex gap-2 sm:gap-4 md:gap-6">
        
        <div className="flex-1 bg-white rounded-none md:rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border-transparent md:border-gray-100 overflow-hidden flex flex-col pb-4 min-h-[calc(100vh-56px)] md:min-h-[600px]">
          
          <div className="p-4 sm:p-5 md:p-6 border-b border-gray-50 shrink-0">
            <h1 className="font-bold text-[18px] sm:text-[20px] md:text-[22px] text-slate-900 truncate">Referrals Received</h1>
          </div>

          <div className="flex-1 px-4 sm:px-6 md:px-8 pt-6">
            
            <div className="p-4 md:p-5 flex gap-3 items-center bg-[#F9F5FF] rounded-[16px] mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[14px] sm:text-[15px] md:text-[16px] text-slate-700 leading-relaxed pr-2 font-medium">
                You have received <span className="text-purple-600 font-bold">{referrals.length}</span> referrals.
              </p>
            </div>

            <div className="flex flex-col gap-4 md:gap-6">
              
              {referrals.map((r: any) => {
                const initials = r.referred?.name ? r.referred.name.split(' ').map((n: string) => n[0]).join('') : "U";
                
                // Format Date
                const dateObj = new Date(r.createdAt);
                const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

                return (
                  <div key={r.id} className="relative rounded-[16px] border p-4 sm:p-5 md:p-6 overflow-hidden group hover:shadow-md transition-shadow cursor-pointer bg-[#F9F5FF] border-purple-100">
                    <div className="absolute left-0 top-3 bottom-3 w-1.5 md:w-2 rounded-r-md bg-purple-600" />
                    
                    <div className="pl-3 sm:pl-4 md:pl-5">
                      <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full text-slate-800 flex items-center justify-center font-bold text-[15px] md:text-[17px] shrink-0 bg-purple-200/50">
                            {initials}
                          </div>
                          <div className="min-w-0 truncate">
                            <h3 className="font-bold text-[16px] md:text-[18px] text-slate-900 truncate">{r.referred?.name || "Unknown"}</h3>
                            <p className="text-[12px] md:text-[13px] text-slate-500">Referred by {r.referrer?.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full shrink-0 bg-purple-100 text-purple-700 border border-purple-200/50">
                          <span className="text-[12px] md:text-[13px] font-semibold">{r.status}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-slate-600 text-[13px] md:text-[14px] mb-4 md:mb-5">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-4.5 md:w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{dayStr}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-[14px] md:text-[15px] text-slate-700 font-medium mb-1 truncate">Referral Notes</p>
                        <p className="text-[13px] md:text-[14px] text-slate-500 line-clamp-2 md:line-clamp-3 leading-relaxed">
                          {r.notes || "No notes provided."}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {referrals.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-200 mx-auto flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No Referrals Received</h3>
                  <p className="text-slate-500">You haven't received any referrals yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
