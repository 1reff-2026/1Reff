"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { uploadReferralContact } from "@/app/actions/contacts"
import Link from "next/link"

export default function UploadReferralPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const res = await uploadReferralContact(formData)
      if (res.error) {
        setError(res.error)
      } else {
        router.push("/profile")
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="font-display font-bold text-lg text-slate-800">Add Referral Contact</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#5C45FD] to-purple-500"></div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Refer a Contact to 1Reff</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Upload a valuable contact from your network. This contact will be intelligently matched with other users on the platform using our AI Smart Search.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Full Name *</label>
                <input required name="contact_name" placeholder="John Doe" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#5C45FD]/20 focus:border-[#5C45FD] outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Company *</label>
                <input required name="company" placeholder="Acme Corp" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#5C45FD]/20 focus:border-[#5C45FD] outline-none transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Job Title *</label>
                <input required name="designation" placeholder="E.g. Engineering Manager" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#5C45FD]/20 focus:border-[#5C45FD] outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Department</label>
                <input name="department" placeholder="E.g. Engineering" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#5C45FD]/20 focus:border-[#5C45FD] outline-none transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Role Focus</label>
                <input name="role" placeholder="E.g. Software Development" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#5C45FD]/20 focus:border-[#5C45FD] outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Location</label>
                <input name="location" placeholder="E.g. San Francisco, CA" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#5C45FD]/20 focus:border-[#5C45FD] outline-none transition-all" />
              </div>
            </div>

            <hr className="border-gray-100 my-4" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Email Address</label>
                <input type="email" name="email" placeholder="john@example.com" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#5C45FD]/20 focus:border-[#5C45FD] outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">Phone Number</label>
                <input type="tel" name="phone" placeholder="+1 (555) 000-0000" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#5C45FD]/20 focus:border-[#5C45FD] outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700">LinkedIn URL</label>
                <input type="url" name="linkedin" placeholder="https://linkedin.com/in/..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#5C45FD]/20 focus:border-[#5C45FD] outline-none transition-all" />
              </div>
            </div>

            <hr className="border-gray-100 my-4" />

            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-700 flex items-center justify-between">
                <span>Bio / Notes for AI Smart Match *</span>
                <span className="text-[10px] font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Crucial for matching</span>
              </label>
              <textarea 
                required 
                name="notes" 
                rows={4}
                placeholder="Explain what this person does, what they specialize in, and who they would be a good connection for. The AI will read this to match them with other users." 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#5C45FD]/20 focus:border-[#5C45FD] outline-none transition-all resize-y" 
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-[#5C45FD] hover:bg-[#4B34EB] text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md shadow-[#5C45FD]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating AI Embeddings & Saving...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Upload Referral Contact</span>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  )
}
