"use client"

import { useState, useTransition } from "react"
import { createAsk, deleteAsk, createGive, deleteGive } from "@/actions/profile"

interface ProfileItem {
  id: string;
  category: string;
  detail: string;
}

export function ProfileAsks({ asks }: { asks: ProfileItem[] }) {
  const [isEditing, setIsEditing] = useState(false)
  const [category, setCategory] = useState("INTRODUCTION")
  const [detail, setDetail] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleAddAsk = async () => {
    if (!detail) return
    startTransition(async () => {
      await createAsk(category, detail)
      setDetail("")
      setIsEditing(false)
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteAsk(id)
    })
  }

  return (
    <div className="px-5 py-5 group">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-foreground text-[14px] uppercase tracking-wide">My Asks</h3>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="text-slate-400 hover:text-primary transition-colors p-1"
        >
          {isEditing ? (
            <span className="text-xs font-bold text-red-500">CANCEL</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
      </div>

      {isEditing && (
        <div className="mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mb-2 p-2 rounded-lg border border-gray-200 text-sm"
          >
            <option value="INTRODUCTION">Introduction</option>
            <option value="ADVICE">Advice / Mentorship</option>
            <option value="HIRING">Hiring</option>
            <option value="INVESTMENT">Investment</option>
            <option value="SERVICES">Services / Vendors</option>
          </select>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="What exactly are you looking for?"
            className="w-full p-2 rounded-lg border border-gray-200 text-sm min-h-[80px]"
          />
          <button 
            onClick={handleAddAsk}
            disabled={isPending || !detail}
            className="mt-2 w-full bg-primary text-white font-bold py-2 rounded-lg text-sm disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Add Ask"}
          </button>
        </div>
      )}

      {asks.length === 0 && !isEditing ? (
        <p className="text-[13px] text-gray-400 italic">No asks added yet. Click + to add what you are looking for.</p>
      ) : (
        <div className="space-y-3">
          {asks.map(ask => (
            <div key={ask.id} className="p-3 bg-white border border-gray-100 rounded-xl relative group/item">
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md uppercase tracking-wider">{ask.category}</span>
              <p className="text-[13.5px] text-slate-700 mt-2 leading-relaxed">{ask.detail}</p>
              
              <button 
                onClick={() => handleDelete(ask.id)}
                className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProfileGives({ gives }: { gives: ProfileItem[] }) {
  const [isEditing, setIsEditing] = useState(false)
  const [category, setCategory] = useState("MENTORSHIP")
  const [detail, setDetail] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleAddGive = async () => {
    if (!detail) return
    startTransition(async () => {
      await createGive(category, detail)
      setDetail("")
      setIsEditing(false)
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteGive(id)
    })
  }

  return (
    <div className="px-5 py-5 group">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-emerald-600 text-[14px] uppercase tracking-wide">My Gives</h3>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="text-slate-400 hover:text-emerald-500 transition-colors p-1"
        >
          {isEditing ? (
            <span className="text-xs font-bold text-red-500">CANCEL</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
      </div>

      {isEditing && (
        <div className="mb-4 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mb-2 p-2 rounded-lg border border-emerald-200 text-sm focus:ring-emerald-500"
          >
            <option value="MENTORSHIP">Mentorship</option>
            <option value="INTRODUCTION">Introductions</option>
            <option value="SERVICES">Pro-bono Services</option>
            <option value="INVESTMENT">Investment</option>
          </select>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="How can you help others?"
            className="w-full p-2 rounded-lg border border-emerald-200 text-sm min-h-[80px] focus:ring-emerald-500 focus:border-transparent"
          />
          <button 
            onClick={handleAddGive}
            disabled={isPending || !detail}
            className="mt-2 w-full bg-emerald-500 text-white font-bold py-2 rounded-lg text-sm disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Add Give"}
          </button>
        </div>
      )}

      {gives.length === 0 && !isEditing ? (
        <p className="text-[13px] text-gray-400 italic">No gives added yet. Click + to add what you can offer.</p>
      ) : (
        <div className="space-y-3">
          {gives.map(give => (
            <div key={give.id} className="p-3 bg-white border border-emerald-100 rounded-xl relative group/item">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider">{give.category}</span>
              <p className="text-[13.5px] text-slate-700 mt-2 leading-relaxed">{give.detail}</p>
              
              <button 
                onClick={() => handleDelete(give.id)}
                className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProfileUploadedContacts({ contacts }: { contacts: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="px-5 py-5 group">
      <div 
        className="flex items-center justify-between mb-1 cursor-pointer group-hover:opacity-80 transition-opacity"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-foreground text-[14px] uppercase tracking-wide">My Uploaded Contacts</h3>
          <span className="text-[10px] font-bold bg-[#5C45FD] text-white px-2 py-0.5 rounded-full shadow-sm">{contacts.length}</span>
        </div>
        <button className="text-slate-400 hover:text-[#5C45FD] transition-colors p-1 flex items-center justify-center bg-gray-50 rounded-full w-6 h-6 border border-gray-100 group-hover:border-gray-200 group-hover:bg-gray-100">
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          {contacts.length > 0 ? (
            <div className="space-y-3 mt-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="p-3 bg-gray-50 border border-gray-200/80 hover:border-[#5C45FD]/40 transition-colors rounded-xl flex items-start justify-between gap-3 shadow-xs relative overflow-hidden group/card cursor-pointer">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#5C45FD] to-[#806BFF] opacity-0 group-hover/card:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5C45FD] to-purple-500 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm shadow-[#5C45FD]/20">
                      {contact.contact_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-gray-800 truncate">{contact.contact_name}</p>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">{contact.designation} <span className="text-gray-300 mx-1">•</span> <span className="font-medium text-gray-600">{contact.company}</span></p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0 pt-1">
                    <span className="text-[10px] text-gray-500 font-semibold bg-white border border-gray-200 px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs">
                      <svg className="w-2.5 h-2.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {contact.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 rounded-full bg-gray-200/50 flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </div>
              <p className="text-xs text-gray-500 font-medium">No contacts uploaded yet.</p>
              <p className="text-[10px] text-gray-400 mt-1">Contribute to the 1Reff library to see them here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
