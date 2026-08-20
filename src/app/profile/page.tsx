import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ProfileAsks, ProfileUploadedContacts } from "@/components/profile/ProfileSections"
import { ProfileBio } from "@/components/profile/ProfileBio"

import { prisma } from "@/lib/prisma"

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { gives: true, asks: true, uploadedContacts: true }
  })

  if (!user) {
    redirect("/login")
  }

  const displayName = user.name?.toUpperCase() || "NINAD PALAV"

  return (
    <div className="w-full max-w-md mx-auto pb-24 appear">
      
      {/* Main Profile Card */}
      <div className="bg-white shadow-sm overflow-hidden min-h-screen">
        
        {/* Banner Section */}
        <div className="relative h-32 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/40 overflow-hidden">
          {/* Abstract background waves (CSS simulated) */}
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-400/5 rounded-full blur-2xl" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-xl" />
          
          <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm text-primary hover:bg-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
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
              <button className="text-primary hover:text-primary/80 transition-colors p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            
            <p className="text-[12px] text-gray-500 mt-1 uppercase tracking-wide">
              {user.title || "NO TITLE"} <span className="mx-1 text-gray-300">|</span> LOCATION
            </p>

            <div className="flex items-center gap-1.5 mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-[13px]"><span className="font-bold text-primary">1847</span> <span className="text-gray-500">Connections</span></p>
            </div>
          </div>
        </div>

        {/* Sections List */}
        <div className="border-t border-gray-100 flex flex-col">
          
          {/* About */}
          <ProfileBio bio={user.bio} title={user.title} />
          <div className="mx-5 border-t border-gray-100" />

          {/* Asks */}
          <ProfileAsks asks={user.asks} />
          <div className="mx-5 border-t border-gray-100" />

          {/* Services */}
          <div className="px-5 py-5 group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-foreground text-[14px] uppercase tracking-wide">SERVICES</h3>
              <button className="text-slate-400 hover:text-primary transition-colors p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-slate-700 text-[12px] font-medium rounded-full">Consulting</span>
              <span className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-slate-700 text-[12px] font-medium rounded-full">Strategy</span>
              <span className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-slate-700 text-[12px] font-medium rounded-full">Management</span>
            </div>
          </div>
          <div className="mx-5 border-t border-gray-100" />

          {/* Additional Ventures */}
          <div className="px-5 py-3.5 flex items-center justify-between group hover:bg-gray-50 transition-colors">
            <h3 className="font-bold text-foreground text-[14px] uppercase tracking-wide">ADDITIONAL VENTURES</h3>
            <button className="text-slate-400 hover:text-primary transition-colors p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          <div className="mx-5 border-t border-gray-100" />

          {/* Past Ventures */}
          <div className="px-5 py-3.5 flex items-center justify-between group hover:bg-gray-50 transition-colors">
            <h3 className="font-bold text-foreground text-[14px] uppercase tracking-wide">PAST VENTURES</h3>
            <button className="text-slate-400 hover:text-primary transition-colors p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          <div className="mx-5 border-t border-gray-100" />

          {/* Past Experiences */}
          <div className="px-5 py-3.5 flex items-center justify-between group hover:bg-gray-50 transition-colors">
            <h3 className="font-bold text-foreground text-[14px] uppercase tracking-wide">PAST EXPERIENCES</h3>
            <button className="text-slate-400 hover:text-primary transition-colors p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          <div className="mx-5 border-t border-gray-100" />

          {/* Uploaded Contacts Dashboard */}
          <ProfileUploadedContacts contacts={user.uploadedContacts || []} />

        </div>
      </div>
    </div>
  )
}
