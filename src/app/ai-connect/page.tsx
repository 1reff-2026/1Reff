"use client";

import React, { useState, useEffect, useRef } from "react";
import { SearchResult } from "@/services/contactSearchService";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content?: string;
  results?: SearchResult[];
  loading?: boolean;
}

export default function AIConnectPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Support URL query param (e.g. from Sidebar search)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get("q");
    if (qParam && messages.length === 0) {
      handleSend(qParam);
    }
  }, []);

  const handleSend = async (queryText: string = input) => {
    const text = queryText.trim();
    if (!text || loading) return;

    const userMsgId = Date.now().toString();
    const assistantMsgId = (Date.now() + 1).toString();

    // 1. Add user message and temporary assistant loading message
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: userMsgId, role: "user", content: text },
      { id: assistantMsgId, role: "assistant", loading: true }
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/contacts/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text })
      });
      const data = await res.json();
      const results: SearchResult[] = data.results || [];

      // 2. Update assistant message with results
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                loading: false,
                content:
                  results.length > 0
                    ? `I found ${results.length} relevant contact${results.length > 1 ? "s" : ""} matching your request:`
                    : "I couldn't find any contacts matching those keywords. Would you like to try searching for a different company (e.g. Google, Microsoft), location (e.g. Bangalore, Hyderabad), or role?",
                results
              }
            : msg
        )
      );
    } catch (err) {
      console.error("Search failed:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                loading: false,
                content: "An error occurred while searching. Please try again."
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen max-w-4xl mx-auto relative bg-transparent">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground select-none pb-12">
            <div className="w-12 h-12 rounded-2xl bg-[#5C45FD]/10 text-[#5C45FD] flex items-center justify-center shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3.5 ${msg.role === "user" ? "justify-end" : "justify-start"} appear`}>
            {/* Assistant Avatar */}
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5C45FD] to-[#806BFF] text-white flex items-center justify-center shrink-0 shadow-sm mt-1 text-sm font-bold">
                ✨
              </div>
            )}

            {/* Message Bubble & Cards Container */}
            <div className={`max-w-[88%] md:max-w-[80%] space-y-3 ${msg.role === "user" ? "order-1" : "order-2"}`}>
              {/* User Bubble */}
              {msg.role === "user" && (
                <div className="bg-[#5C45FD] text-white px-5 py-3.5 rounded-2xl rounded-tr-xs text-sm md:text-base shadow-sm leading-relaxed">
                  {msg.content}
                </div>
              )}

              {/* Assistant Bubble / Loading State */}
              {msg.role === "assistant" && msg.loading && (
                <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-xs shadow-sm flex items-center gap-2 text-sm text-gray-500">
                  <span className="flex gap-1 items-center">
                    <span className="w-2 h-2 rounded-full bg-[#5C45FD] animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 rounded-full bg-[#5C45FD] animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 rounded-full bg-[#5C45FD] animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </span>
                  <span className="ml-1 font-medium">Searching executive database...</span>
                </div>
              )}

              {/* Assistant Text */}
              {msg.role === "assistant" && !msg.loading && msg.content && (
                <div className="text-sm md:text-base text-foreground font-medium px-1 pt-1 leading-relaxed">
                  {msg.content}
                </div>
              )}

              {/* Assistant Result Cards */}
              {msg.role === "assistant" && !msg.loading && msg.results && msg.results.length > 0 && (
                <div className="space-y-3 pt-1">
                  {msg.results.map((contact, index) => (
                    <div
                      key={contact.id}
                      className="group bg-white rounded-2xl border border-gray-200/80 hover:border-[#5C45FD]/50 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden"
                    >
                      {/* Rank Badge */}
                      <div className="absolute top-0 left-0 bg-[#5C45FD] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-br-lg uppercase tracking-wider">
                        #{index + 1}
                      </div>

                      {/* Match Score Badge */}
                      <div className="absolute top-3 right-3 bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1">
                        <span className="text-amber-500">⚡</span>
                        <span>Score: {contact.matchScore}</span>
                        <span className="text-[9px] text-amber-700 font-normal hidden sm:inline">
                          (Co: +{contact.matchDetails.companyScore} | Loc: +{contact.matchDetails.locationScore} | Dept: +{contact.matchDetails.departmentScore} | Role: +{contact.matchDetails.roleScore})
                        </span>
                      </div>

                      <div className="mt-3 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5C45FD] to-[#806BFF] text-white flex items-center justify-center text-base font-extrabold shadow-2xs shrink-0 mt-0.5">
                            {contact.contact_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-bold text-foreground tracking-tight">
                                {contact.contact_name}
                              </h4>
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[11px] font-semibold border border-slate-200">
                                {contact.company}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-[#5C45FD]">
                              {contact.designation}
                            </p>
                            <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground pt-0.5 flex-wrap">
                              <span>Dept: <strong className="text-gray-700">{contact.department}</strong></span>
                              <span>•</span>
                              <span>Role: <strong className="text-gray-700">{contact.role}</strong></span>
                              <span>•</span>
                              <span className="text-gray-600 font-medium flex items-center gap-0.5">
                                <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {contact.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Notes Box */}
                      <div className="mt-3 p-2.5 bg-gray-50/80 rounded-lg border border-gray-100 text-[11px] text-gray-600 leading-relaxed">
                        <span className="font-bold text-gray-700">📝 Notes:</span> {contact.notes}
                      </div>

                      {/* Action Footer */}
                      <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          onClick={() => handleCopy(contact.email, `email-${contact.id}-${msg.id}`)}
                          className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-[#5C45FD]/5 border border-gray-200/60 hover:border-[#5C45FD]/30 transition-all group/btn text-left"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <svg className="w-3.5 h-3.5 text-[#5C45FD] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[11px] font-medium text-gray-700 truncate group-hover/btn:text-[#5C45FD]">
                              {contact.email}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-gray-400 group-hover/btn:text-[#5C45FD] shrink-0 ml-1">
                            {copiedId === `email-${contact.id}-${msg.id}` ? "✓ COPIED" : "COPY"}
                          </span>
                        </button>

                        <button
                          onClick={() => handleCopy(contact.phone, `phone-${contact.id}-${msg.id}`)}
                          className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-[#5C45FD]/5 border border-gray-200/60 hover:border-[#5C45FD]/30 transition-all group/btn text-left"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-[11px] font-medium text-gray-700 truncate group-hover/btn:text-emerald-700">
                              {contact.phone}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-gray-400 group-hover/btn:text-emerald-600 shrink-0 ml-1">
                            {copiedId === `phone-${contact.id}-${msg.id}` ? "✓ COPIED" : "COPY"}
                          </span>
                        </button>

                        <a
                          href={contact.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 rounded-lg bg-[#0077b5]/5 hover:bg-[#0077b5]/10 border border-[#0077b5]/20 text-[#0077b5] transition-all group/btn"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 24 24">
                              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2v-8.37H6.46M7.83 6.88a1.68 1.68 0 0 0-1.68 1.68 1.68 1.68 0 0 0 1.68 1.69 1.68 1.68 0 0 0 1.69-1.69 1.69 1.69 0 0 0-1.69-1.68Z"/>
                            </svg>
                            <span className="text-[11px] font-bold truncate">LinkedIn</span>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 shrink-0 ml-1 opacity-70 group-hover/btn:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Avatar */}
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs mt-1 text-xs font-bold">
                U
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Sticky Input Bar (ChatGPT / Claude Style) */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-md pt-3 pb-6 px-4 border-t border-gray-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="max-w-3xl mx-auto relative flex items-center bg-white border border-gray-200 focus-within:border-[#5C45FD] focus-within:ring-2 focus-within:ring-[#5C45FD]/10 rounded-2xl shadow-lg transition-all overflow-hidden p-1.5 pl-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="w-full bg-transparent py-3 text-sm md:text-base text-foreground placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-[#5C45FD] hover:bg-[#4a36d9] disabled:opacity-30 disabled:bg-gray-300 text-white transition-all flex items-center justify-center shrink-0 shadow-xs ml-2"
            title="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
