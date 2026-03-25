import { motion } from "framer-motion";
import { Link } from "wouter";
import { Globe, Users, Target, Shield, Zap, TrendingUp, Award, MapPin, Mail, Phone } from "lucide-react";

export default function About() {
  const leadership = [
    { name: "Dr. Akinwumi Adesina", title: "President & Chair", role: "president", bio: "Leading the vision for agricultural transformation across the region." },
    { name: "Sarah Njoroge", title: "Vice President", role: "vp", bio: "Former policy director overseeing ecosystem growth." },
    { name: "David Ochieng", title: "CFO", role: "cfo", bio: "Managing capital allocation and investment strategy." },
  ];

  const clusterLeads = [
    { name: "Jane Kamau", title: "Tech Innovation Lead", bio: "Driving agritech integration." },
    { name: "Paul Bekele", title: "Trade & Export Lead", bio: "Expanding international markets." },
    { name: "Amina Yusuf", title: "Capital Lead", bio: "Connecting agripreneurs with funding." }
  ];

  const programCoords = [
    { name: "Michael Omondi", title: "Accelerator Director" },
    { name: "Grace Wanjiku", title: "Mentorship Head" },
    { name: "Peter Kagwe", title: "Youth Initiatives" },
    { name: "Alice Mumbi", title: "Incubation Manager" }
  ];

  const partners = ["USAID", "World Bank", "AfDB", "IFAD", "FAO", "CGIAR", "KCB Bank", "Safaricom"];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background z-0" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6"
          >
            Empowering the Future of <br/><span className="text-primary">African Agriculture</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground mb-8"
          >
            EAAPA is the premier intelligence and collaboration ecosystem for agribusinesses, investors, and policymakers in East Africa.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <button className="px-8 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
              Join EAAPA Today
            </button>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="vision" className="py-24 bg-card border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="glass-panel p-10 rounded-3xl">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">Our Vision</h2>
              <p className="text-lg text-muted-foreground mb-8">
                To build a resilient, data-driven, and hyper-connected agricultural ecosystem that eradicates poverty and ensures food security across East Africa by 2035.
              </p>
              <h3 className="text-xl font-bold text-white mb-4">Core Values</h3>
              <ul className="space-y-4">
                {[
                  { icon: Shield, text: "Integrity & Transparency" },
                  { icon: Zap, text: "Innovation First" },
                  { icon: Users, text: "Inclusive Growth" },
                  { icon: Globe, text: "Global Standards" },
                  { icon: TrendingUp, text: "Sustainable Impact" }
                ].map((val, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <val.icon className="w-5 h-5 text-primary" /> {val.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-panel p-10 rounded-3xl border-secondary/20">
              <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-secondary" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-8">
                To equip agripreneurs with elite intelligence, seamless capital access, and unparalleled market routes to scale their agribusinesses exponentially.
              </p>
              <h3 className="text-xl font-bold text-white mb-4">Guiding Principles</h3>
              <ul className="space-y-4">
                {[
                  "Data Over Guesswork",
                  "Farmer-Centric Policies",
                  "Cross-Border Collaboration",
                  "Market-Driven Production",
                  "Youth & Women Empowerment"
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <div className="w-2 h-2 rounded-full bg-secondary" /> {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-bold text-white mb-4">Leadership & Governance</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-16">Guided by industry veterans and visionary leaders.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {leadership.map((leader, i) => (
              <div key={i} className={`glass-panel p-8 rounded-3xl ${leader.role === 'president' ? 'border-secondary/50 shadow-[0_0_30px_rgba(217,119,6,0.1)]' : ''}`}>
                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold mb-4 ${leader.role === 'president' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
                  {leader.name.charAt(0)}
                </div>
                {leader.role === 'president' && <Award className="w-6 h-6 text-secondary mx-auto mb-2" />}
                <h3 className="text-xl font-bold text-white">{leader.name}</h3>
                <p className="text-sm font-medium text-muted-foreground mb-4">{leader.title}</p>
                <p className="text-sm text-white/70">{leader.bio}</p>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold text-white mb-8">Cluster Leads</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {clusterLeads.map((leader, i) => (
              <div key={i} className="bg-card border border-white/10 p-6 rounded-2xl">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center text-xl font-bold text-white mb-4">
                  {leader.name.charAt(0)}
                </div>
                <h4 className="font-bold text-white">{leader.name}</h4>
                <p className="text-xs text-primary mb-2">{leader.title}</p>
                <p className="text-xs text-muted-foreground">{leader.bio}</p>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold text-white mb-8">Program Coordinators</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {programCoords.map((coord, i) => (
              <div key={i} className="bg-background border border-white/5 p-4 rounded-xl text-center">
                <h4 className="font-bold text-white text-sm">{coord.name}</h4>
                <p className="text-xs text-muted-foreground">{coord.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategy */}
      <section id="strategy" className="py-24 bg-card border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Strategic Roadmap (2024-2030)</h2>
            <p className="text-muted-foreground">Our 3 pillar strategy for regional transformation.</p>
          </div>
          
          <div className="space-y-12">
            {[
              { year: "Phase 1: Digital Foundation", title: "Data & Intelligence Infrastructure", desc: "Deploying Market Hub across 5 countries to gather live yield and pricing data." },
              { year: "Phase 2: Capital Engine", title: "Automated Investment Routing", desc: "Connecting 10,000+ agripreneurs to $500M in smart capital." },
              { year: "Phase 3: Global Trade", title: "Export Corridor Optimization", desc: "Establishing seamless logistics and smart contracts for international trade." }
            ].map((phase, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/3 pt-2">
                  <span className="px-4 py-2 rounded-lg bg-primary/20 text-primary font-bold text-sm block md:inline-block w-full text-center md:w-auto">{phase.year}</span>
                </div>
                <div className="w-full md:w-2/3 glass-panel p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                  <h3 className="text-2xl font-bold text-white mb-2">{phase.title}</h3>
                  <p className="text-muted-foreground">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-bold text-white mb-4">Partners & Collaborators</h2>
          <p className="text-muted-foreground mb-12">Backed by global institutions and regional leaders.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {partners.map((partner, i) => (
              <div key={i} className="h-24 glass-panel rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors">
                <span className="font-display font-bold text-xl text-white/50 uppercase tracking-widest">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-card border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-display font-bold text-white mb-12 text-center">Regional Offices</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { city: "Nairobi", title: "EAAPA Headquarters", addr: "Karen Business Park, Karen", phone: "+254 20 123 4567", email: "nairobi@eaapa.org" },
              { city: "Nakuru", title: "Rift Valley Hub", addr: "Westside Mall, Nakuru", phone: "+254 51 234 5678", email: "nakuru@eaapa.org" },
              { city: "Mombasa", title: "Coastal Trade Desk", addr: "Nyali Centre, Mombasa", phone: "+254 41 345 6789", email: "mombasa@eaapa.org" }
            ].map((office, i) => (
              <div key={i} className="glass-panel rounded-3xl overflow-hidden flex flex-col">
                <div className="h-48 w-full bg-background relative">
                  <iframe 
                    src={`https://maps.google.com/maps?q=${office.city}&output=embed`}
                    className="w-full h-full border-0 opacity-70 filter grayscale contrast-125"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{office.title}</h3>
                  <p className="text-sm text-primary mb-6">{office.city}, Kenya</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5" /> <span>{office.addr}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" /> <span>{office.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" /> <span>{office.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
