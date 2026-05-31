import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Globe, Shield, Users, Zap, TrendingUp, CheckCircle, Star, Sprout } from "lucide-react";
import { Link } from "wouter";

const STATS = [
  { value: "6,200+", label: "Verified Members", icon: Users },
  { value: "8", label: "East African Countries", icon: Globe },
  { value: "$2.1B+", label: "Trade Facilitated", icon: TrendingUp },
  { value: "140+", label: "Commodity Markets", icon: BarChart3 },
];

const PILLARS = [
  { icon: BarChart3, title: "Market Intelligence", desc: "Live pricing, demand forecasts & predictive analytics across 140+ commodities", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { icon: Globe, title: "Trade & Export", desc: "Buyer matching, smart contracts & export facilitation to 40+ global markets", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { icon: Zap, title: "Capital Engine", desc: "Automated funding routing to grants, impact investors, and agri-credit facilities", color: "bg-amber-50 border-amber-200 text-amber-700" },
  { icon: Users, title: "Global Network", desc: "Verified agripreneur, investor, mentor, and buyer directory", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { icon: Shield, title: "Knowledge Trust", desc: "Verified best practices, compliance guides, and policy frameworks", color: "bg-rose-50 border-rose-200 text-rose-700" },
];

const FEATURES = [
  { title: "AI Market Layer", desc: "Predictive commodity analytics, arbitrage detection, and price trend forecasting powered by real-time data." },
  { title: "Ecosystem Directory", desc: "Verified profiles for agripreneurs, companies, partners, investors, mentors and satellite centers." },
  { title: "Documents & Records", desc: "Manage licences, contracts, certificates, agreements and compliance records in one place." },
  { title: "Impact Dashboard", desc: "Track real economic outcomes: revenue, jobs, exports, sustainability metrics across your portfolio." },
];

const TESTIMONIALS = [
  { name: "Amara Nkosi", role: "Avocado Export Farmer, Kenya", quote: "EAAPA's Market Hub showed me the exact price premium I could command by getting GlobalGAP certified. That data changed everything — I grew from 5 to 200 acres.", avatar: "A", metric: "$480K revenue" },
  { name: "Jean-Pierre Nziza", role: "Specialty Coffee, Rwanda", quote: "Through EAAPA's buyer network, I connected directly with Starbucks Reserve. No more middlemen. My price went from $950/kg to $4,500/ton.", avatar: "J", metric: "55% growth" },
  { name: "Asha Daud", role: "Vanilla Cultivator, Kenya", quote: "The AI Layer flagged vanilla as the highest-opportunity spice in our region. I started with 3 acres. Now I supply McCormick and IFF directly.", avatar: "A", metric: "$195K/year" },
];

export default function Home() {
  return (
    <div className="w-full">
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden pt-16 pb-24">
        {/* Background image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-emerald-900/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-8 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Platform Live — Market Hub Analytics Online
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight"
          >
            The Intelligence Engine for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-yellow-300">
              East African Agriculture
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl mx-auto text-xl text-white/75 mb-10"
          >
            A multi-layer digital ecosystem organizing, connecting, and scaling agribusiness through predictive data, trade automation, and intelligent capital.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/ecosystem"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 hover:-translate-y-1"
            >
              <Sprout className="w-5 h-5" /> Join Ecosystem
            </Link>
            <Link
              href="/market-hub"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all hover:-translate-y-1 backdrop-blur-sm"
            >
              <Shield className="w-4 h-4 text-yellow-300" /> Enter Market Hub
            </Link>
            <Link
              href="/opportunities"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-transparent border border-white/20 text-white/80 font-semibold flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white transition-all hover:-translate-y-1"
            >
              View Opportunities <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────── */}
      <section className="bg-primary py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-display font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/65 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pillars ───────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              Platform Architecture
            </div>
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">The Five Pillars of EAAPA</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The foundational modules driving every interaction on the platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 border border-border hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${pillar.color}`}>
                  <pillar.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-display font-bold text-foreground mb-2">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section className="py-24 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                Key Capabilities
              </div>
              <h2 className="text-4xl font-display font-bold text-foreground mb-6">
                Built for Enterprise-Grade Agricultural Operations
              </h2>
              <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
                From individual farmers to cooperatives, investors, exporters and governments — EAAPA serves every stakeholder in the agricultural value chain.
              </p>
              <div className="space-y-6">
                {FEATURES.map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-1">{f.title}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Market Alerts", value: "Real-time", bg: "from-emerald-500 to-emerald-700" },
                { label: "Certified Members", value: "6,200+", bg: "from-blue-500 to-blue-700" },
                { label: "Trade Volume", value: "$2.1B", bg: "from-amber-500 to-amber-700" },
                { label: "Active Projects", value: "340+", bg: "from-purple-500 to-purple-700" },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  className={`rounded-2xl p-7 bg-gradient-to-br ${card.bg} text-white shadow-lg`}
                >
                  <div className="text-3xl font-display font-bold mb-1">{card.value}</div>
                  <div className="text-white/70 text-sm">{card.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              <Star className="w-3.5 h-3.5" /> Success Stories
            </div>
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">Agripreneurs Transforming East Africa</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Real outcomes from real members across the ecosystem.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-card border border-border rounded-2xl p-7 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-1 mb-5">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4" fill="#16a34a" stroke="#16a34a" />)}
                </div>
                <blockquote className="text-foreground/75 text-sm leading-relaxed mb-6 italic">"{t.quote}"</blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                  <span className="ml-auto px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">{t.metric}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/impact" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
              View All Success Stories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-primary via-emerald-700 to-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,215,0,0.1),_transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Ready to Join Africa's Premier Agricultural Ecosystem?
          </h2>
          <p className="text-white/75 text-xl mb-10">
            Connect with 6,200+ verified agripreneurs, investors, buyers, and mentors building the future of East African agriculture.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/ecosystem"
              className="px-8 py-4 rounded-2xl bg-white text-primary font-bold hover:bg-white/90 shadow-xl transition-all hover:-translate-y-1"
            >
              <Sprout className="w-5 h-5 inline mr-2" />Join Ecosystem Free
            </Link>
            <Link
              href="/market-hub"
              className="px-8 py-4 rounded-2xl bg-white/10 border border-white/25 text-white font-bold hover:bg-white/20 transition-all hover:-translate-y-1"
            >
              <Shield className="w-4 h-4 inline mr-2 text-yellow-300" />Access Market Hub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
