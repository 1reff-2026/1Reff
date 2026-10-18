import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default async function PublicProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Mock data based on the ID
  const profile = {
    name: "Sarah Jenkins",
    role: "Founder & CEO",
    company: "InnovateTech",
    bio: "Building the future of B2B SaaS. Previously PM at Stripe. Passionate about empowering businesses through automation and data-driven insights. Currently raising our Series A.",
    gives: [
      { category: "B2B_SERVICES", detail: "We offer early access to our enterprise software suite." },
      { category: "MENTORSHIP", detail: "Happy to advise early-stage founders on product-market fit." }
    ],
    asks: [
      { category: "INVESTMENT", detail: "Looking for $2M Series A lead investor with SaaS expertise." },
      { category: "HIRING", detail: "Seeking a seasoned VP of Sales with B2B enterprise experience." }
    ]
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 appear pb-20">
      
      {/* Back to Explore */}
      <Link href="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 w-fit">
        ← Back to Directory
      </Link>

      {/* Header Profile Card */}
      <Card className="glass beam-border overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-gold-300 to-primary/80" />
        <CardContent className="pt-0 relative px-8 pb-8">
          <div className="flex flex-col md:flex-row gap-6 md:items-end -mt-12">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md border border-input">
              <div className="w-full h-full rounded-xl bg-gradient-to-tr from-marigold-300 to-marigold-500 flex items-center justify-center text-3xl font-bold text-white">
                SJ
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <h1 className="text-3xl font-display font-bold">{profile.name}</h1>
              <p className="text-lg text-muted-foreground">{profile.role} at <Link href="/company/1" className="text-gold-700 hover:underline">{profile.company}</Link></p>
            </div>
            <div className="flex gap-3">
              <Button>Message</Button>
              <Button variant="outline">Connect</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-display font-bold mb-4">About</h2>
            <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold">What I'm Looking For (Asks)</h2>
            <div className="space-y-3">
              {profile.asks.map((ask, i) => (
                <div key={i} className="p-4 rounded-lg border border-input bg-white shadow-sm">
                  <span className="inline-block px-2 py-1 bg-gold-50 text-gold-700 text-xs font-semibold rounded mb-2">
                    {ask.category.replace(/_/g, ' ')}
                  </span>
                  <p className="text-sm">{ask.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold">What I Offer (Gives)</h2>
            <div className="space-y-3">
              {profile.gives.map((give, i) => (
                <div key={i} className="p-4 rounded-lg border border-input bg-white shadow-sm">
                  <span className="inline-block px-2 py-1 bg-sky-soft/20 text-sky-ink text-xs font-semibold rounded mb-2">
                    {give.category.replace(/_/g, ' ')}
                  </span>
                  <p className="text-sm">{give.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar / AI Insights Placeholder */}
        <div className="space-y-6">
          <Card className="glass relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="text-6xl">✨</span>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-lg">AI Insights</span>
                <span className="text-xs bg-gold-50 text-gold-700 px-2 py-0.5 rounded-full font-semibold border border-gold-100">PRO</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="bg-emerald-soft/10 text-emerald-ink text-xs font-semibold px-2 py-1 rounded w-fit">
                94% Match for you
              </div>
              <p className="text-sm text-muted-foreground">
                Sarah is currently raising a Series A round, which perfectly aligns with your investment mandate. She also needs a VP of Sales; you have 3 strong candidates in your immediate network.
              </p>
              <div className="pt-2">
                <Button variant="outline" className="w-full text-xs">View Full Analysis</Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
