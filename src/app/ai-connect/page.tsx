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

function ContactCard({ contact, index, msgId, handleCopy }: { contact: SearchResult, index: number, msgId: string, handleCopy: (text: string, id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group bg-white rounded-2xl border border-gray-200/80 hover:border-[#5C45FD]/50 p-4 shadow-xs hover:shadow-md transition-all relative overflow-hidden cursor-pointer" onClick={() => setExpanded(!expanded)}>
      {/* Rank Badge */}
      <div className="absolute top-0 left-0 bg-[#5C45FD] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-br-lg uppercase tracking-wider">
        #{index + 1}
      </div>



      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5C45FD] to-[#806BFF] text-white flex items-center justify-center text-sm font-extrabold shadow-2xs shrink-0">
            {contact.contact_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <h4 className="text-base font-bold text-foreground tracking-tight">
              {contact.contact_name}
            </h4>
            <p className="text-xs font-semibold text-gray-500">
              {contact.designation} at {contact.company}
            </p>
          </div>
        </div>
        <div className="text-gray-400">
          {expanded ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
          {/* Source Badge */}
          <div className={`mb-3 inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold items-center gap-1 border ${
            !contact.uploadedById 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            {!contact.uploadedById ? (
              <><span>📚</span> 1Reff Library</>
            ) : (
              <><span>👤</span> Uploaded by {contact.uploader_name || 'User'}</>
            )}
          </div>

          <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground pt-0.5 flex-wrap mb-3">
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



          {/* Action Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); handleCopy(contact.email, `email-${contact.id}-${msgId}`); }}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-[#5C45FD]/5 border border-gray-200/60 hover:border-[#5C45FD]/30 transition-all group/btn text-left"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-6 h-6 rounded-md bg-white border border-gray-200 shadow-sm flex items-center justify-center shrink-0 group-hover/btn:border-[#5C45FD]/40 transition-colors">
                  <svg className="w-3 h-3 text-gray-500 group-hover/btn:text-[#5C45FD] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-[10px] text-gray-500 font-medium">Email</span>
                  <span className="text-xs font-semibold text-gray-700 truncate">{contact.email}</span>
                </div>
              </div>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleCopy(contact.phone, `phone-${contact.id}-${msgId}`); }}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-[#5C45FD]/5 border border-gray-200/60 hover:border-[#5C45FD]/30 transition-all group/btn text-left"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-6 h-6 rounded-md bg-white border border-gray-200 shadow-sm flex items-center justify-center shrink-0 group-hover/btn:border-[#5C45FD]/40 transition-colors">
                  <svg className="w-3 h-3 text-gray-500 group-hover/btn:text-[#5C45FD] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-[10px] text-gray-500 font-medium">Phone</span>
                  <span className="text-xs font-semibold text-gray-700 truncate">{contact.phone}</span>
                </div>
              </div>
            </button>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-[#5C45FD]/5 border border-gray-200/60 hover:border-[#5C45FD]/30 transition-all group/btn text-left"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-6 h-6 rounded-md bg-[#0077b5]/10 border border-[#0077b5]/20 shadow-sm flex items-center justify-center shrink-0 group-hover/btn:bg-[#0077b5] transition-colors">
                  <svg className="w-3 h-3 text-[#0077b5] group-hover/btn:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-[10px] text-gray-500 font-medium">LinkedIn</span>
                  <span className="text-xs font-semibold text-[#0077b5] truncate">View Profile</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
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

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

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
          <div className="h-full flex flex-col items-center justify-center text-center px-4 pb-20 appear">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#5C45FD]/20 to-purple-500/10 flex items-center justify-center mb-6 shadow-[0_0_40px_-10px_rgba(92,69,253,0.3)]">
              <span className="text-3xl drop-shadow-sm">✨</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-foreground tracking-tight mb-3">
              Ask 1Reff AI
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-sm mx-auto mb-8 leading-relaxed">
              Find exactly who you need. Describe the role, company, or expertise.
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
              {["Looking for a CTO in Bangalore", "Finance experts", "Sales directors"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  className="px-4 py-2 rounded-full bg-gray-50/80 border border-gray-200/60 text-xs text-gray-600 hover:bg-[#5C45FD]/5 hover:border-[#5C45FD]/30 hover:text-[#5C45FD] transition-all font-medium shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
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
                    <ContactCard key={contact.id} contact={contact} index={index} msgId={msg.id} handleCopy={handleCopy} />
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
