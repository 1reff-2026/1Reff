"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

export function Sidebar() {
  const [isAddNewOpen, setIsAddNewOpen] = useState(false)
  const [searchVal, setSearchVal] = useState("")
  const router = useRouter()

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchVal.trim()) {
      router.push(`/ai-connect?q=${encodeURIComponent(searchVal.trim())}`)
    }
  }

  return (
    <aside className="w-[320px] border-r border-gray-100 bg-white hidden md:flex flex-col h-screen fixed left-0 top-0 z-40 overflow-y-auto shadow-[2px_0_15px_rgba(0,0,0,0.02)]">
      
      {/* Header */}
      <div className="flex items-center p-5 border-b border-gray-100 shrink-0">
        <Link href="/" className="flex items-center group py-1">
          <img src="/logo.png" alt="1Reff Logo" className="h-14 w-auto object-contain group-hover:scale-105 transition-transform" />
        </Link>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 pb-8 flex flex-col">
        
        {/* Top Widgets (Search & Bell) */}
        <div className="p-5 bg-[#FAFAFA] border-b border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={handleSearchSubmit}
                className="block w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:ring-2 focus:ring-[#5C45FD] focus:border-transparent transition-all shadow-sm placeholder-gray-400"
                placeholder="Search contacts & hit Enter..."
              />
            </div>
            <Link href="/notifications" className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </Link>
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="p-3 flex-1 flex flex-col">
          <Link href="/profile" className="flex items-center gap-4 px-4 py-3.5 mb-1 rounded-xl bg-[#F8F7FF] text-[#5C45FD] transition-colors">
            <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-[13px] font-bold tracking-wide">MY PROFILE</span>
          </Link>

          <div className="px-4">
            <Link href="/follows" className="flex items-center gap-4 py-4 border-b border-gray-100 group">
              <div className="w-9 h-9 rounded-full bg-[#5C45FD]/5 text-[#5C45FD] flex items-center justify-center group-hover:bg-[#5C45FD]/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-foreground tracking-wide group-hover:text-[#5C45FD] transition-colors">PENDING FOLLOW UPS</span>
            </Link>

            <Link href="/meetings" className="flex items-center gap-4 py-4 border-b border-gray-100 group">
              <div className="w-9 h-9 rounded-full bg-[#5C45FD]/5 text-[#5C45FD] flex items-center justify-center group-hover:bg-[#5C45FD]/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-foreground tracking-wide group-hover:text-[#5C45FD] transition-colors">PENDING MEETINGS</span>
            </Link>

            <Link href="/referrals-received" className="flex items-center gap-4 py-4 border-b border-gray-100 group">
              <div className="w-9 h-9 rounded-full bg-[#5C45FD]/5 text-[#5C45FD] flex items-center justify-center group-hover:bg-[#5C45FD]/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-foreground tracking-wide group-hover:text-[#5C45FD] transition-colors">REFERRALS PURCHASED</span>
            </Link>

            <Link href="/referrals-passed" className="flex items-center gap-4 py-4 border-b border-gray-100 group">
              <div className="w-9 h-9 rounded-full bg-[#5C45FD]/5 text-[#5C45FD] flex items-center justify-center group-hover:bg-[#5C45FD]/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-foreground tracking-wide group-hover:text-[#5C45FD] transition-colors">REFERRALS PASSED</span>
            </Link>

            <Link href="/network" className="flex items-center gap-4 py-4 border-b border-gray-100 group">
              <div className="w-9 h-9 rounded-full bg-[#5C45FD]/5 text-[#5C45FD] flex items-center justify-center group-hover:bg-[#5C45FD]/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-foreground tracking-wide group-hover:text-[#5C45FD] transition-colors">MY NETWORK</span>
            </Link>

            <Link href="/ai-connect" className="flex items-center gap-4 py-4 group">
              <div className="w-9 h-9 rounded-full bg-[#5C45FD]/5 text-[#5C45FD] flex items-center justify-center group-hover:bg-[#5C45FD]/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-foreground tracking-wide group-hover:text-[#5C45FD] transition-colors">AI SEARCH</span>
            </Link>
          </div>


          
          <div className="mt-auto px-4 pb-4">
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-bold text-[13px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              LOGOUT
            </button>
          </div>

        </nav>
      </div>
    </aside>
  )
}
