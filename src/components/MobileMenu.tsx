"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { signOut } from "next-auth/react"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isAddNewOpen, setIsAddNewOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-foreground hover:bg-black/5 rounded-full transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex justify-start">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="relative w-full max-w-[340px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left-full duration-300">

            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center group">
                <img src="/logo.png" alt="1Reff Logo" className="h-12 w-auto object-contain group-hover:scale-105 transition-transform" />
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-50 text-gray-500 rounded-full hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto pb-8">

              {/* Main Navigation Links */}
              <nav className="p-3">
                <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-4 px-4 py-3.5 mb-1 rounded-xl bg-[#F8F7FF] text-[#5C45FD] transition-colors">
                  <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-bold tracking-wide">MY PROFILE</span>
                </Link>

                <div className="px-4">
                  <Link href="/follows" onClick={() => setIsOpen(false)} className="flex items-center gap-4 py-4 border-b border-gray-100 group">
                    <div className="w-9 h-9 rounded-full bg-[#5C45FD]/5 text-[#5C45FD] flex items-center justify-center group-hover:bg-[#5C45FD]/10 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <span className="text-[13px] font-semibold text-foreground tracking-wide group-hover:text-[#5C45FD] transition-colors">PENDING FOLLOW UPS</span>
                  </Link>

                  <Link href="/meetings" onClick={() => setIsOpen(false)} className="flex items-center gap-4 py-4 border-b border-gray-100 group">
                    <div className="w-9 h-9 rounded-full bg-[#5C45FD]/5 text-[#5C45FD] flex items-center justify-center group-hover:bg-[#5C45FD]/10 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-[13px] font-semibold text-foreground tracking-wide group-hover:text-[#5C45FD] transition-colors">PENDING MEETINGS</span>
                  </Link>

                  <Link href="/referrals-received" onClick={() => setIsOpen(false)} className="flex items-center gap-4 py-4 border-b border-gray-100 group">
                    <div className="w-9 h-9 rounded-full bg-[#5C45FD]/5 text-[#5C45FD] flex items-center justify-center group-hover:bg-[#5C45FD]/10 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-[13px] font-semibold text-foreground tracking-wide group-hover:text-[#5C45FD] transition-colors">REFERRALS PURCHASED</span>
                  </Link>

                  <Link href="/referrals-passed" onClick={() => setIsOpen(false)} className="flex items-center gap-4 py-4 border-b border-gray-100 group">
                    <div className="w-9 h-9 rounded-full bg-[#5C45FD]/5 text-[#5C45FD] flex items-center justify-center group-hover:bg-[#5C45FD]/10 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    <span className="text-[13px] font-semibold text-foreground tracking-wide group-hover:text-[#5C45FD] transition-colors">REFERRALS PASSED</span>
                  </Link>

                  <Link href="/network" onClick={() => setIsOpen(false)} className="flex items-center gap-4 py-4 border-b border-gray-100 group">
                    <div className="w-9 h-9 rounded-full bg-[#5C45FD]/5 text-[#5C45FD] flex items-center justify-center group-hover:bg-[#5C45FD]/10 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </div>
                    <span className="text-[13px] font-semibold text-foreground tracking-wide group-hover:text-[#5C45FD] transition-colors">MY NETWORK</span>
                  </Link>

                  <Link href="/ai-connect" onClick={() => setIsOpen(false)} className="flex items-center gap-4 py-4 group">
                    <div className="w-9 h-9 rounded-full bg-[#5C45FD]/5 text-[#5C45FD] flex items-center justify-center group-hover:bg-[#5C45FD]/10 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-[13px] font-semibold text-foreground tracking-wide group-hover:text-[#5C45FD] transition-colors">AI SEARCH</span>
                  </Link>
                </div>



                <div className="mt-auto px-4 pb-4 pt-6">
                  <button 
                    onClick={() => {
                      setIsOpen(false)
                      signOut({ callbackUrl: '/login' })
                    }}
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
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
