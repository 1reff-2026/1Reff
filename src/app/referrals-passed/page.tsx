import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { ExpandableUnlockCard } from "@/components/ExpandableUnlockCard"

export default async function ReferralsPassedPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const myUploadedContacts = await prisma.contact.findMany({
    where: { uploadedById: session.user.id },
    select: { id: true, contact_name: true, designation: true, company: true, email: true, phone: true, linkedin: true }
  })
  
  const contactIds = myUploadedContacts.map(c => c.id)

  const unlockedRecords = await prisma.unlockedContact.findMany({
    where: { contactId: { in: contactIds } },
    include: {
      user: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Map the contact details back into the unlock records
  const mappedUnlocks = unlockedRecords.map(record => {
    const c = myUploadedContacts.find(c => c.id === record.contactId)
    return { 
      ...record, 
      contactName: c?.contact_name, 
      designation: c?.designation, 
      company: c?.company, 
      email: c?.email, 
      phone: c?.phone, 
      linkedin: c?.linkedin 
    }
  })

  return (
    <div className="w-full max-w-2xl md:max-w-4xl mx-auto appear pb-24">
      
      <div className="flex gap-2 sm:gap-4 md:gap-6">
        
        <div className="flex-1 bg-white rounded-none md:rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border-transparent md:border-gray-100 overflow-hidden flex flex-col pb-4 min-h-[calc(100vh-56px)] md:min-h-[600px]">
          
          <div className="p-4 sm:p-5 md:p-6 border-b border-gray-50 shrink-0">
            <h1 className="font-bold text-[18px] sm:text-[20px] md:text-[22px] text-slate-900 truncate">Referrals Passed</h1>
          </div>

          <div className="flex-1 px-4 sm:px-6 md:px-8 pt-6">
            
            <div className="p-4 md:p-5 flex gap-3 items-center bg-[#F9F5FF] rounded-[16px] mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <p className="text-[14px] sm:text-[15px] md:text-[16px] text-slate-700 leading-relaxed pr-2 font-medium">
                Your contacts have been unlocked <span className="text-purple-600 font-bold">{mappedUnlocks.length}</span> times.
              </p>
            </div>

            <div className="flex flex-col gap-4 md:gap-6">
              
              {mappedUnlocks.map((u: any) => (
                <ExpandableUnlockCard key={u.id} data={u} mode="passed" />
              ))}
              
              {mappedUnlocks.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-200 mx-auto flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No Unlocked Contacts</h3>
                  <p className="text-slate-500">None of your uploaded contacts have been unlocked yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
