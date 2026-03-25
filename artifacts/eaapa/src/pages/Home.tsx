import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Globe, Shield, Users, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Hero background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Platform Live: Market Hub Analytics Online
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight"
          >
            The Intelligence Engine for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
              East African Agriculture
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl mx-auto text-xl text-muted-foreground mb-10"
          >
            A multi-layer digital ecosystem organizing, connecting, and scaling agribusiness through predictive data, trade automation, and intelligent capital.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/ecosystem" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:-translate-y-1"
            >
              Join Ecosystem
            </Link>
            <Link 
              href="/market-hub" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all hover:-translate-y-1"
            >
              <Shield className="w-4 h-4 text-secondary" />
              Enter Market Hub
            </Link>
            <Link 
              href="/opportunities" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all hover:-translate-y-1"
            >
              View Opportunities
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-24 bg-card border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Ecosystem Architecture</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The five fundamental pillars driving the EAAPA platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { icon: BarChart3, title: "Market Intelligence", desc: "Live pricing & predictive analytics" },
              { icon: Globe, title: "Trade & Export", desc: "Buyer matching & smart contracts" },
              { icon: Zap, title: "Capital Engine", desc: "Automated funding routing" },
              { icon: Users, title: "Global Network", desc: "Agripreneur & mentor directory" },
              { icon: Shield, title: "Knowledge Trust", desc: "Verified best practices & policies" }
            ].map((pillar, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-2xl glass-panel hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <pillar.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Preview */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold text-white mb-6">Regional Command Centers</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Connected across East Africa. Monitoring supply chains, logistics routes, and real-time yield data to prevent shortages and identify export arbitrage opportunities.
              </p>
              <ul className="space-y-4 mb-8">
                {['Nairobi Primary Node', 'Kigali Logistics Hub', 'Kampala Trade Desk', 'Dar es Salaam Export Point'].map((node, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_rgba(217,119,6,0.8)]" />
                    {node}
                  </li>
                ))}
              </ul>
              <Link href="/ecosystem" className="inline-flex items-center gap-2 text-primary hover:text-primary-foreground transition-colors font-medium">
                Explore Directory <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative h-[400px] lg:h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/10">
              <img 
                src={`${import.meta.env.BASE_URL}images/africa-network.png`} 
                alt="Network Map" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
