import * as React from 'react'
import { auth } from "@/auth"
import { MobileMenu } from "./MobileMenu"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export async function TopBar() {
  const session = await auth()
  let hasNotifications = false;
  
  if (session?.user?.id) {
    const myId = session.user.id;
    
    // Check connections
    const pendingConnections = await prisma.connection.count({
      where: { userBId: myId, status: "PENDING" }
    });
    
    // Check referrals
    const pendingReferrals = await prisma.referral.count({
      where: { receiverId: myId, status: "PENDING" }
    });
    
    // Check followups
    const pendingFollowups = await prisma.followup.count({
      where: { userId: myId, status: "PENDING" }
    });
    
    // Check unlocked contacts
    const myUploadedContacts = await prisma.contact.findMany({
      where: { uploadedById: myId },
      select: { id: true }
    });
    const myUploadedContactIds = myUploadedContacts.map(c => c.id);
    const unlockedCount = await prisma.unlockedContact.count({
      where: { contactId: { in: myUploadedContactIds } }
    });
    
    if (pendingConnections > 0 || pendingReferrals > 0 || pendingFollowups > 0 || unlockedCount > 0) {
      hasNotifications = true;
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-hairline shadow-sm md:hidden">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left: Mobile Menu & Desktop Search */}
        <div className="flex items-center flex-1">
          <MobileMenu />
          <div className="hidden md:block relative w-64 ml-4">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 bg-gray-50 border border-input rounded-full text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all shadow-sm placeholder-muted-foreground"
                placeholder="Search..."
              />
          </div>
        </div>

        {/* Center: Logo */}
        <Link href="/" className="flex items-center group">
          <img src="/logo.png" alt="1Reff Logo" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
        </Link>

        {/* Right Actions */}
        <div className="flex items-center justify-end flex-1">
          <Link href="/notifications" className="relative p-2 text-foreground hover:bg-black/5 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {hasNotifications && (
              <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-destructive ring-2 ring-white" />
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
