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
