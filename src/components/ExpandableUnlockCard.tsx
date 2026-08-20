"use client";

import React, { useState } from "react";

export function ExpandableUnlockCard({ data, mode }: { data: any, mode: 'received' | 'passed' }) {
  const [expanded, setExpanded] = useState(false);
  const initials = data.contactName ? data.contactName.split(' ').map((n: string) => n[0]).join('').slice(0,2) : "C";
  const dateObj = new Date(data.createdAt);
  const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div 
      onClick={() => setExpanded(!expanded)}
      className="relative rounded-[16px] border p-4 sm:p-5 md:p-6 overflow-hidden group hover:shadow-md transition-shadow cursor-pointer bg-[#F9F5FF] border-purple-100"
    >
      <div className="absolute left-0 top-3 bottom-3 w-1.5 md:w-2 rounded-r-md bg-purple-600" />
      
      <div className="pl-3 sm:pl-4 md:pl-5">
        <div className="flex justify-between items-start mb-3 md:mb-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full text-white flex items-center justify-center font-bold text-[15px] md:text-[17px] shrink-0 bg-gradient-to-br from-[#5C45FD] to-[#806BFF] shadow-sm">
              {initials}
            </div>
            <div className="min-w-0 truncate">
              <h3 className="font-bold text-[16px] md:text-[18px] text-slate-900 truncate">{data.contactName || "Unknown Contact"}</h3>
              <p className="text-[12px] md:text-[13px] text-slate-500">{data.designation} {data.company ? `at ${data.company}` : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full shrink-0 bg-purple-100 text-purple-700 border border-purple-200/50">
            <span className="text-[12px] md:text-[13px] font-semibold">{mode === 'received' ? 'Referrals Purchased' : 'Unlocked'}</span>
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

        {mode === 'received' ? (
          <div>
            <p className="text-[14px] md:text-[15px] text-slate-700 font-medium mb-1 truncate">Payment Details</p>
            <p className="text-[13px] md:text-[14px] text-slate-500 line-clamp-2 md:line-clamp-3 leading-relaxed">
              You paid ₹{data.amount} to unlock this {data.type?.toLowerCase() || 'contact'}.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-[14px] md:text-[15px] text-slate-700 font-medium mb-1 truncate">Unlocked By</p>
            <p className="text-[13px] md:text-[14px] text-slate-500 leading-relaxed flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                {data.user?.name ? data.user.name.charAt(0) : "?"}
              </span>
              <strong className="text-slate-700">{data.user?.name || "Unknown User"}</strong>
              <span className="opacity-70">paid ₹{data.amount}</span>
            </p>
          </div>
        )}

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200/60 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {data.email && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleCopy(data.email); }}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white hover:bg-[#5C45FD]/5 border border-gray-200/60 hover:border-[#5C45FD]/30 transition-all group/btn text-left shadow-sm"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover/btn:border-[#5C45FD]/40 group-hover/btn:bg-white transition-colors">
                      <svg className="w-4 h-4 text-gray-500 group-hover/btn:text-[#5C45FD] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-[10px] text-gray-500 font-medium">Email</span>
                      <span className="text-sm font-semibold text-gray-800 truncate">{data.email}</span>
                    </div>
                  </div>
                </button>
              )}
              {data.phone && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleCopy(data.phone); }}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white hover:bg-[#5C45FD]/5 border border-gray-200/60 hover:border-[#5C45FD]/30 transition-all group/btn text-left shadow-sm"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover/btn:border-[#5C45FD]/40 group-hover/btn:bg-white transition-colors">
                      <svg className="w-4 h-4 text-gray-500 group-hover/btn:text-[#5C45FD] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-[10px] text-gray-500 font-medium">Phone</span>
                      <span className="text-sm font-semibold text-gray-800 truncate">{data.phone}</span>
                    </div>
                  </div>
                </button>
              )}
              {data.linkedin && (
                <a
                  href={data.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white hover:bg-[#0077b5]/5 border border-gray-200/60 hover:border-[#0077b5]/30 transition-all group/btn text-left shadow-sm sm:col-span-2"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-md bg-[#0077b5]/10 border border-[#0077b5]/20 flex items-center justify-center shrink-0 group-hover/btn:bg-[#0077b5] transition-colors">
                      <svg className="w-4 h-4 text-[#0077b5] group-hover/btn:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-[10px] text-gray-500 font-medium">LinkedIn</span>
                      <span className="text-sm font-semibold text-[#0077b5] truncate">View Profile</span>
                    </div>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
