import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default async function CompanyProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = {
    name: "InnovateTech",
    industry: "SaaS",
    website: "https://innovatetech.example.com",
    size: "10-50 Employees",
    about: "InnovateTech is a B2B SaaS platform that helps enterprise teams automate their workflow using cutting-edge AI models. We are backed by Y Combinator and top-tier angel investors.",
    team: [
      { id: 1, name: "Sarah Jenkins", role: "Founder & CEO" },
      { id: 4, name: "David Kim", role: "CTO" }
    ],
    opportunities: [
      { type: "Investment", title: "Raising $2M Series A", description: "Looking for a lead investor with deep expertise in enterprise SaaS." },
      { type: "Hiring", title: "VP of Sales", description: "Looking for an experienced sales leader to build out our outbound motion." }
    ]
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 appear pb-20">
      <Link href="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 w-fit">
        ← Back to Directory
      </Link>

      <Card className="glass beam-border overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-sky-ink to-sky-soft" />
        <CardContent className="pt-0 relative px-8 pb-8">
          <div className="flex flex-col md:flex-row gap-6 md:items-end -mt-12">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md border border-input flex items-center justify-center">
              <span className="text-4xl">🏢</span>
            </div>
            <div className="flex-1 space-y-1">
              <h1 className="text-3xl font-display font-bold">{company.name}</h1>
              <p className="text-lg text-muted-foreground">{company.industry} • {company.size}</p>
              <a href={company.website} target="_blank" rel="noreferrer" className="text-sm text-gold-700 hover:underline">
                {company.website.replace("https://", "")}
              </a>
            </div>
            <div className="flex gap-3">
              <Button>Follow</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-display font-bold mb-4">About</h2>
            <p className="text-muted-foreground leading-relaxed">{company.about}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold">Open Opportunities</h2>
            <div className="space-y-4">
              {company.opportunities.map((opp, i) => (
                <Card key={i} className="shadow-sm">
                  <CardContent className="p-5">
                    <span className="inline-block px-2 py-1 bg-emerald-soft/10 text-emerald-ink text-xs font-semibold rounded mb-3">
                      {opp.type}
                    </span>
                    <h3 className="font-semibold text-lg">{opp.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{opp.description}</p>
                    <div className="mt-4">
                      <Button variant="outline" size="sm">Apply / Connect</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar: Team */}
        <div className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Key Team Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.team.map(member => (
                <div key={member.id} className="flex items-center justify-between">
                  <div>
                    <Link href={`/profile/${member.id}`} className="font-medium hover:text-gold-700 hover:underline">
                      {member.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <Link href={`/profile/${member.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 px-2">View</Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
