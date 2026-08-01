"use client"

import { useState } from "react"
import { updateProfile } from "@/app/actions/profile"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

const CATEGORIES = ["INVESTMENT", "MENTORSHIP", "B2B_SERVICES", "HIRING", "DISTRIBUTORS", "ADVISORY"]

interface TagItem {
  category: string;
  detail: string;
}

interface TagListProps {
  items: TagItem[];
  setItems: (items: TagItem[]) => void;
  title: string;
}

const TagList = ({ items, setItems, title }: TagListProps) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-lg">{title}</h3>
    {items.map((item: TagItem, i: number) => (
      <div key={i} className="flex gap-2">
        <select 
          className="border border-input rounded-md px-3 py-2 text-sm bg-background w-40"
          value={item.category}
          onChange={(e) => {
            const newItems = [...items]
            newItems[i].category = e.target.value
            setItems(newItems)
          }}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
        </select>
        <input 
          type="text" 
          className="flex-1 border border-input rounded-md px-3 py-2 text-sm"
          placeholder="Add details..."
          value={item.detail}
          onChange={(e) => {
            const newItems = [...items]
            newItems[i].detail = e.target.value
            setItems(newItems)
          }}
        />
        <Button type="button" variant="ghost" onClick={() => setItems(items.filter((_, index) => index !== i))}>
          X
        </Button>
      </div>
    ))}
    <Button type="button" variant="outline" size="sm" onClick={() => setItems([...items, { category: CATEGORIES[0], detail: "" }])}>
      + Add {title}
    </Button>
  </div>
)

interface UserProfile {
  title?: string;
  bio?: string;
  gives?: TagItem[];
  asks?: TagItem[];
}

export function ProfileForm({ user }: { user: UserProfile }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [gives, setGives] = useState(user.gives || [])
  const [asks, setAsks] = useState(user.asks || [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    formData.append("gives", JSON.stringify(gives))
    formData.append("asks", JSON.stringify(asks))

    const res = await updateProfile(formData)
    
    setLoading(false)
    if (res?.success) setSuccess(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="glass">
        <CardHeader>
          <CardTitle>Basic Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title / Headline</label>
            <input 
              name="title" 
              defaultValue={user.title || ""} 
              className="w-full border border-input rounded-md px-3 py-2 text-sm"
              placeholder="e.g. Founder & CEO at TechCorp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea 
              name="bio" 
              defaultValue={user.bio || ""} 
              className="w-full border border-input rounded-md px-3 py-2 text-sm h-24"
              placeholder="Tell us about yourself..."
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Gives & Asks</CardTitle>
          <p className="text-sm text-muted-foreground">What can you offer the network? What are you looking for?</p>
        </CardHeader>
        <CardContent className="space-y-8">
          <TagList items={gives} setItems={setGives} title="Gives" />
          <TagList items={asks} setItems={setAsks} title="Asks" />
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button type="submit" className="w-48" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </Button>
        {success && <span className="text-emerald-soft font-medium text-sm">Profile updated!</span>}
      </div>
    </form>
  )
}
