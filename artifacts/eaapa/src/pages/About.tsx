import { motion } from "framer-motion";
import { Link } from "wouter";
import { Globe, Users, Target, Shield, Zap, TrendingUp, Award, MapPin, Mail, Phone, CheckCircle } from "lucide-react";

export default function About() {
  const leadership = [
    { name: "Cosmas Mwangi", title: "Program & Team Lead", role: "Program Architect", bio: "Leading the vision for agricultural transformation across the region." },
    { name: "Tabitha Ng'ang'a", title: "Asst. Program Lead", role: "Team Lead", bio: "Former policy director overseeing ecosystem growth and partnerships." },
    { name: "Jedidah Mugane", title: "Chief Finance Officer", role: "CFO", bio: "Managing capital allocation, investment strategy, and financial compliance." },
  ];

  const clusterLeads = [
    { name: "Peter Kamau", title: "Tech Innovation Lead", bio: "Driving agritech integration across the platform." },
    { name: "Carol Ndegwa", title: "Trade & Export Lead", bio: "Expanding international market access for members." },
    { name: "Leany Kariuki", title: "Capital Lead", bio: "Connecting agripreneurs with funding and investors." },
  ];

  const programCoords = [
    { name: "Helena Githaiga", title: "Accelerator Director" },
    { name: "Winnie Kamau", title: "Mentorship Head" },
    { name: "Christopher Mwangi", title: "Youth Initiatives" },
    { name: "Lucy Mumbi", title: "Incubation Manager" },
  ];

  const partners = ["KENAFF", "Nyandarua County", "AfDB", "KARLO", "Equity Bank", "CGIAR", "KCB Bank", "Strathmore University", "Safaricom"];

  const values = [
    { icon: Shield, label: "Integrity & Transparency" },
    { icon: Zap, label: "Innovation First" },
    { icon: Users, label: "Inclusive Growth" },
    { icon: Globe, label: "Global Standards" },
    { icon: TrendingUp, label: "Sustainable Impact" },
  ];

  return (
    <div className="w-full">
      {/* Hero — deep forest green gradient */}
      <section className="relative min-h-[55vh] flex items-center justify-center py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-emerald-700 to-emerald-900 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(38_74_50_/_0.15),_transparent_60%)] z-0" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 text-white/80 text-xs font-medium mb-6 uppercase tracking-widest"
          >
            <Award className="w-3.5 h-3.5" /> East Africa Agripreneurs Alliance
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight"
          >
            Empowering the Future of <br />
            <span className="text-yellow-300">African Agriculture</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xl text-white/75 max-w-2xl mx-auto"
          >
            EAAPA is the premier intelligence and collaboration ecosystem for agribusinesses, investors, and policymakers across East Africa.
          </motion.p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="vision" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              <Target className="w-3.5 h-3.5" /> Our Foundation
            </div>
            <h2 className="text-4xl font-display font-bold text-foreground">Vision & Mission</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card rounded-3xl p-10 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                To build a resilient, data-driven, and hyper-connected agricultural ecosystem that eradicates poverty and ensures food security across East Africa by 2035.
              </p>
              <h4 className="text-base font-bold text-foreground mb-5">Core Values</h4>
              <ul className="space-y-3.5">
                {values.map((val, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground/75">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <val.icon className="w-4 h-4 text-primary" />
                    </div>
                    {val.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-3xl p-10 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                To connect, empower, and scale agripreneurs across East Africa through market intelligence, strategic capital, and institutional networks — creating a world-class agricultural civilization.
              </p>
              <h4 className="text-base font-bold text-foreground mb-5">Strategic Pillars</h4>
              <ul className="space-y-3.5">
                {["Market Intelligence & Trade Analytics", "Capital Access & Impact Finance", "Ecosystem Building & Network Effects", "Capacity Building & Knowledge Transfer", "Policy Advocacy & Regulatory Alignment"].map((p, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground/75">
                    <CheckCircle className="w-4.5 h-4.5 text-primary flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              <Users className="w-3.5 h-3.5" /> Our Team
            </div>
            <h2 className="text-4xl font-display font-bold text-foreground">Leadership & Governance</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Experienced leaders driving agricultural transformation across East Africa.</p>
          </div>

          {/* Core Leadership */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {leadership.map((person, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-card rounded-2xl p-8 text-center border border-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                  <span className="text-3xl font-display font-bold text-primary">{person.name.charAt(0)}</span>
                </div>
                <h3 className="text-lg font-display font-bold text-foreground">{person.name}</h3>
                <p className="text-sm font-semibold text-primary mt-1">{person.title}</p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{person.bio}</p>
              </motion.div>
            ))}
          </div>

          {/* Cluster Leads */}
          <h3 className="text-xl font-display font-bold text-foreground mb-6 text-center">Cluster Leads</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {clusterLeads.map((person, i) => (
              <div key={i} className="bg-card rounded-xl p-6 border border-border flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-secondary">{person.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{person.name}</div>
                  <div className="text-xs text-primary font-medium">{person.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{person.bio}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Program Coordinators */}
          <h3 className="text-xl font-display font-bold text-foreground mb-6 text-center">Program Coordinators</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {programCoords.map((p, i) => (
              <div key={i} className="bg-card rounded-xl p-5 text-center border border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-sm font-bold text-primary">{p.name.charAt(0)}</span>
                </div>
                <div className="text-sm font-semibold text-foreground">{p.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{p.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              <Shield className="w-3.5 h-3.5" /> Collaborators
            </div>
            <h2 className="text-4xl font-display font-bold text-foreground">Partners & Collaborators</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">World-class institutions and organizations supporting the EAAPA ecosystem.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {partners.map((name, i) => (
              <div key={i} className="px-6 py-3 bg-card border border-border rounded-2xl text-foreground/70 font-semibold text-sm hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer">
                {name}
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
            >
              <Globe className="w-5 h-5" /> Become a Partner
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              <Mail className="w-3.5 h-3.5" /> Get in Touch
            </div>
            <h2 className="text-4xl font-display font-bold text-foreground">Contact Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: "Headquarters", lines: ["Karen Business Park, Karen Road", "Nairobi, Kenya"] },
              { icon: Mail, title: "Email", lines: ["info@eaapa.org", "partnerships@eaapa.org"] },
              { icon: Phone, title: "Phone", lines: ["+254 20 200 0001", "+254 722 000 001"] },
            ].map(({ icon: Icon, title, lines }, i) => (
              <div key={i} className="bg-card rounded-2xl p-8 text-center border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg mb-3">{title}</h3>
                {lines.map((l, j) => <p key={j} className="text-muted-foreground text-sm">{l}</p>)}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
