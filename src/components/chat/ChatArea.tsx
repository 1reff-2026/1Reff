"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { SearchResult } from "@/services/contactSearchService";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content?: string;
  results?: SearchResult[];
  loading?: boolean;
}

function ContactCard({ contact, index, msgId, handleCopy }: { contact: SearchResult, index: number, msgId: string, handleCopy: (text: string, id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(contact.isUnlocked);

  const handleUnlock = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsUnlocking(true);
      
      const verifyRes = await fetch("/api/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: contact.resultType === 'USER_REFERRAL' ? 150 : 100,
          contactId: contact.id,
          resultType: contact.resultType,
          isDummy: true
        })
      });
      const verifyData = await verifyRes.json();
      
      if (verifyData.success) {
        setIsUnlocked(true);
      } else {
        alert("Failed to unlock contact");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to initiate unlock");
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-200/80 hover:border-[#5C45FD]/50 p-4 shadow-xs hover:shadow-md transition-all relative overflow-hidden cursor-pointer" onClick={() => setExpanded(!expanded)}>
      <div className="absolute top-0 left-0 bg-[#5C45FD] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-br-lg uppercase tracking-wider">
        #{index + 1}
      </div>
      {contact.aiFitScore && (
        <div className="absolute top-0 right-0 bg-white text-[#5C45FD] border-b border-l border-gray-100 text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg tracking-wide flex items-center gap-1 shadow-sm">
          <span className="text-[11px]">🎯</span> Fit Score: {contact.aiFitScore}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5C45FD] to-[#806BFF] text-white flex items-center justify-center text-sm font-extrabold shadow-2xs shrink-0">
            {contact.contact_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-900 tracking-tight">
              {isUnlocked ? contact.contact_name : (() => {
                const parts = contact.contact_name.split(" ").filter(Boolean);
                const salutations = ["mr", "mr.", "ms", "ms.", "mrs", "mrs.", "dr", "dr.", "ca", "ca.", "prof", "prof.", "adv", "adv.", "cpa"];
                let firstReal = parts[0] || "Hidden";
                if (salutations.includes(firstReal.toLowerCase()) && parts.length > 1) {
                  firstReal = parts[1];
                }
                return firstReal.charAt(0).toUpperCase() + firstReal.slice(1).toLowerCase();
              })()}
            </h4>
            <p className="text-xs font-semibold text-gray-500">
              {contact.designation} {isUnlocked && `at ${contact.company}`}
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
          <div className={`mb-3 inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold items-center gap-1 border ${
            contact.resultType === 'ADMIN_DATABASE' ? 'bg-[#5C45FD]/10 text-[#5C45FD] border-[#5C45FD]/20' :
            contact.resultType === 'PLATFORM_USER' ? 'bg-[#5C45FD]/10 text-[#5C45FD] border-[#5C45FD]/20' :
            'bg-[#5C45FD]/10 text-[#5C45FD] border-[#5C45FD]/20'
          }`}>
            {contact.resultType === 'ADMIN_DATABASE' && (
              <>
                <span>👑</span> 1Reff Library
                <span className="mx-1 opacity-50">•</span>
                <span className="flex items-center gap-0.5 opacity-80 px-1 rounded">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  100% Verified
                </span>
              </>
            )}
            {contact.resultType === 'PLATFORM_USER' && <><span>🤝</span> Member Matched</>}
            {contact.resultType === 'USER_REFERRAL' && <><span>👤</span> Referred by Member</>}
          </div>

          <div className="flex items-center gap-2.5 text-[11px] text-gray-500 pt-0.5 flex-wrap mb-3">
            {isUnlocked ? (
              <>
                <span>Dept: <strong className="text-gray-700">{contact.department}</strong></span>
                <span>•</span>
                <span>Role: <strong className="text-gray-700">{contact.role}</strong></span>
                <span>•</span>
                <span className="text-gray-600 font-medium flex items-center gap-0.5">
                  <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {contact.location}
                </span>
              </>
            ) : (
              <div className="w-full">
                <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h5 className="font-bold text-gray-800 text-sm mb-1">Premium Contact Locked</h5>
                  <p className="text-xs text-gray-500 max-w-[200px] mb-4">Unlock this contact to reveal their full name, company, email, and LinkedIn.</p>
                  <button 
                    onClick={handleUnlock}
                    disabled={isUnlocking}
                    className="bg-[#5C45FD] hover:bg-[#4B34EB] text-white font-bold py-2.5 px-6 rounded-lg text-sm shadow-sm transition-colors flex items-center gap-2"
                  >
                    {isUnlocking ? "Processing..." : `Pay ₹${contact.resultType === 'USER_REFERRAL' ? '150' : '100'} to Unlock`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {contact.customReason && (
            <div className="mb-4 bg-gradient-to-br from-[#5C45FD]/5 to-purple-500/5 rounded-xl p-3 border border-[#5C45FD]/20 shadow-sm relative overflow-hidden group/insight">
              <div className="absolute -right-4 -top-4 w-12 h-12 bg-[#5C45FD]/10 rounded-full blur-xl group-hover/insight:bg-[#5C45FD]/20 transition-all"></div>
              <div className="flex gap-2 items-start relative z-10">
                <div className="w-full text-xs text-gray-700 leading-relaxed font-medium">
                  <h5 className="text-[10px] font-bold text-[#5C45FD] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                    AI Match Insight
                  </h5>
                  <div className="[&>p]:mb-2 [&>strong]:text-[#5C45FD] [&>p:last-child]:mb-0">
                    <ReactMarkdown>
                      {contact.customReason
                        .replace(/\*\*Worth verifying:\*\*/g, "\n\n**Worth verifying:**")}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isUnlocked && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
              {contact.email && (
                <button onClick={(e) => { e.stopPropagation(); handleCopy(contact.email, `email-${contact.id}-${msgId}`); }} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-[#5C45FD]/5 border border-gray-200/60 hover:border-[#5C45FD]/30 transition-all text-left">
                  <div className="flex flex-col truncate">
                    <span className="text-[10px] text-gray-500 font-medium">Email</span>
                    <span className="text-xs font-semibold text-gray-700 truncate">{contact.email}</span>
                  </div>
                </button>
              )}
              {contact.phone && (
                <button onClick={(e) => { e.stopPropagation(); handleCopy(contact.phone, `phone-${contact.id}-${msgId}`); }} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-[#5C45FD]/5 border border-gray-200/60 hover:border-[#5C45FD]/30 transition-all text-left">
                  <div className="flex flex-col truncate">
                    <span className="text-[10px] text-gray-500 font-medium">Phone</span>
                    <span className="text-xs font-semibold text-gray-700 truncate">{contact.phone}</span>
                  </div>
                </button>
              )}
              {contact.linkedin && (
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-[#5C45FD]/5 border border-gray-200/60 hover:border-[#5C45FD]/30 transition-all text-left">
                  <div className="flex flex-col truncate">
                    <span className="text-[10px] text-gray-500 font-medium">LinkedIn</span>
                    <span className="text-xs font-semibold text-[#0077b5] truncate">View Profile</span>
                  </div>
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ChatArea({ 
  initialMessages = [], 
  chatId 
}: { 
  initialMessages?: ChatMessage[], 
  chatId?: string 
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(chatId);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Support URL query param (e.g. from Sidebar search on the dashboard)
  useEffect(() => {
    if (!chatId) {
      const params = new URLSearchParams(window.location.search);
      const qParam = params.get("q");
      if (qParam && messages.length === 0) {
        handleSend(qParam);
      }
    }
  }, []);

  const handleSend = async (queryText: string = input) => {
    const text = queryText.trim();
    if (!text || loading) return;

    const userMsgId = Date.now().toString();
    const assistantMsgId = (Date.now() + 1).toString();

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
        body: JSON.stringify({ query: text, sessionId: activeSessionId })
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();
      const results: SearchResult[] = data.results || [];
      
      if (data.sessionId && !activeSessionId) {
        setActiveSessionId(data.sessionId);
        // Replace URL to reflect new session ID without full reload
        router.replace(`/ai-connect/${data.sessionId}`);
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                loading: false,
                content: data.message || (results.length > 0
                    ? `I found ${results.length} relevant contact${results.length > 1 ? "s" : ""} matching your request:`
                    : "I couldn't find any contacts matching those keywords. Would you like to try searching for a different company (e.g. Google, Microsoft), location (e.g. Bangalore, Hyderabad), or role?"),
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
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto bg-transparent pb-4">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 pb-20 appear">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#5C45FD]/20 to-purple-500/10 flex items-center justify-center mb-6 shadow-[0_0_40px_-10px_rgba(92,69,253,0.3)]">
              <span className="text-3xl drop-shadow-sm">✨</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-gray-900 tracking-tight mb-3">
              Ask 1Reff AI
            </h2>
            <p className="text-sm md:text-base text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
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
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5C45FD] to-[#806BFF] text-white flex items-center justify-center shrink-0 shadow-sm mt-1 text-sm font-bold">
                ✨
              </div>
            )}

            <div className={`max-w-[88%] md:max-w-[80%] space-y-3 ${msg.role === "user" ? "order-1" : "order-2"}`}>
              {msg.role === "user" && (
                <div className="bg-[#5C45FD] text-white px-5 py-3.5 rounded-2xl rounded-tr-xs text-sm md:text-base shadow-sm leading-relaxed inline-block">
                  {msg.content}
                </div>
              )}

              {msg.role === "assistant" && msg.loading && (
                <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-xs shadow-sm flex items-center gap-2 text-sm text-gray-500 inline-block">
                  <span className="flex gap-1 items-center">
                    <span className="w-2 h-2 rounded-full bg-[#5C45FD] animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 rounded-full bg-[#5C45FD] animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 rounded-full bg-[#5C45FD] animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </span>
                </div>
              )}

              {msg.role === "assistant" && !msg.loading && msg.content && (
                <div className="text-sm md:text-base text-gray-800 font-medium px-1 pt-1 leading-relaxed [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>strong]:font-bold">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}

              {msg.role === "assistant" && !msg.loading && msg.results && msg.results.length > 0 && (
                <div className="space-y-3 pt-1">
                  {msg.results.map((contact, index) => (
                    <ContactCard key={contact.id} contact={contact} index={index} msgId={msg.id} handleCopy={handleCopy} />
                  ))}
                </div>
              )}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 shadow-sm mt-1 text-xs font-bold uppercase">
                Me
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="px-4">
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
            className="w-full bg-transparent py-3 text-sm md:text-base text-gray-900 placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-[#5C45FD] hover:bg-[#4a36d9] disabled:opacity-30 disabled:bg-gray-300 text-white transition-all flex items-center justify-center shrink-0 shadow-xs ml-2"
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
