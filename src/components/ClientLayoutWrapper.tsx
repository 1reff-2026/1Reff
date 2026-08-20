"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/Sidebar"
import { TopBar } from "@/components/TopBar"

export function ClientLayoutWrapper({ 
  children,
  sidebar,
  topBar
}: { 
  children: React.ReactNode
  sidebar: React.ReactNode
  topBar: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/register"

  if (isAuthPage) {
    return (
      <main className="min-h-screen relative overflow-hidden bg-transparent">
        <div className="blob blob-violet w-[80vw] max-w-[500px] aspect-square top-[-10%] left-[-10%] opacity-50" />
        <div className="blob blob-sky w-[60vw] max-w-[400px] aspect-square top-[20%] right-[-5%] opacity-50" />
        <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
          {children}
        </div>
      </main>
    )
  }

  return (
    <div className="flex min-h-screen">
      {sidebar}
      <div className="flex-1 md:ml-[320px] flex flex-col min-h-screen relative overflow-x-hidden">
        <div className="blob blob-violet w-[80vw] max-w-[500px] aspect-square top-[-10%] left-[-10%]" />
        <div className="blob blob-sky w-[60vw] max-w-[400px] aspect-square top-[20%] right-[-5%]" />
        
        {topBar}
        <main className="flex-1 p-0 md:p-8 relative z-10">
          {children}
        </main>
      </div>
    </div>
  )
}
