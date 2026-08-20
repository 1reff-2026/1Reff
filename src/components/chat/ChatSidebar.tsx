"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
}

export function ChatSidebar() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // Mobile drawer state
  const params = useParams();
  const router = useRouter();

  const activeId = params.id as string | undefined;

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/chat/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.chats || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [activeId]);

  return (
    <>
      {/* Mobile Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden absolute top-4 left-4 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-gray-200 text-gray-700 text-[11px] font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#5C45FD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          History
        </button>
      )}

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 z-40" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar Panel */}
      <div className={`
        absolute md:relative z-40 h-full w-[260px] bg-white border-r border-gray-100 flex flex-col transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-4 border-b border-gray-100">
          <Link
            href="/ai-connect"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 w-full p-2.5 rounded-xl bg-[#5C45FD]/10 text-[#5C45FD] font-semibold hover:bg-[#5C45FD]/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Search
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 pt-2">
            Recent Searches
          </div>
          {loading ? (
            <div className="text-sm text-gray-400 px-2">Loading...</div>
          ) : sessions.length === 0 ? (
            <div className="text-sm text-gray-400 px-2">No history yet</div>
          ) : (
            sessions.map((session) => (
              <Link
                key={session.id}
                href={`/ai-connect/${session.id}`}
                onClick={() => setIsOpen(false)}
                className={`
                  group flex items-center justify-between w-full p-2.5 rounded-lg text-sm transition-colors
                  ${activeId === session.id ? "bg-gray-100 font-medium text-gray-900" : "text-gray-600 hover:bg-gray-50"}
                `}
              >
                <div className="flex items-center gap-2 truncate">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span className="truncate">{session.title}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
