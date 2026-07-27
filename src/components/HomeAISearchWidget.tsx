"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";


export function HomeAISearchWidget() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (searchQuery: string = query) => {
    const q = searchQuery.trim();
    if (!q || q === "...") {
      router.push("/ai-connect");
      return;
    }
    router.push(`/ai-connect?q=${encodeURIComponent(q)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="w-full bg-gradient-to-br from-purple-50/70 via-white to-purple-50/40 border border-purple-100 rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_-4px_rgba(92,69,253,0.08)] text-left relative overflow-hidden my-4 transition-all hover:shadow-[0_12px_35px_-4px_rgba(92,69,253,0.12)]">
      {/* Top Section: Icon + Title & Input */}
      <div className="flex items-start gap-3.5 sm:gap-4">
        {/* Sparkle Icon Circle */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#5C45FD] text-white flex items-center justify-center shrink-0 shadow-md mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>

        {/* Title & Input Box */}
        <div className="flex-1 min-w-0 space-y-2">
          <h3 className="text-sm sm:text-base font-bold text-gray-800 tracking-tight">
            Ask 1Reff AI...
          </h3>
          <form
            onSubmit={handleSubmit}
            className="relative flex items-center bg-white border border-gray-200/80 focus-within:border-[#5C45FD] focus-within:ring-2 focus-within:ring-[#5C45FD]/10 rounded-2xl shadow-xs transition-all overflow-hidden p-1 pl-3.5"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="E.g. Tech HR at Google Bangalore"
              className="w-full bg-transparent py-2 text-xs sm:text-sm text-foreground placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#5C45FD] hover:bg-[#4a36d9] text-white flex items-center justify-center shrink-0 shadow-xs transition-transform hover:scale-105 ml-1"
              title="Search Contacts"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-4 sm:w-4 transform -rotate-45 translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
