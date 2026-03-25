import { useState } from "react";
import { useListOpportunities, useSubmitOpportunity } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { DollarSign, Clock, Tag, Plus, Briefcase, TrendingUp, Handshake } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { clsx } from "clsx";
import { formatDistanceToNow } from "date-fns";

const TABS = [
  { id: "investment", label: "Investment", icon: DollarSign },
  { id: "funding", label: "Funding", icon: Briefcase },
  { id: "value_chain", label: "Value Chain", icon: Handshake },
  { id: "submit", label: "Submit Idea", icon: Plus }
];

export default function Opportunities() {
  const [activeTab, setActiveTab] = useState("investment");
  const [fundingFilter, setFundingFilter] = useState("All");
  
  const { data: opportunities, isLoading } = useListOpportunities();
  const { mutate: submit, isPending } = useSubmitOpportunity();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "investment",
    sector: "",
    expectedRoi: "",
    fundingAmount: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({
      data: {
        title: form.title,
        description: form.description,
        type: form.type,
        sector: form.sector,
        roi: form.expectedRoi || undefined,
        fundingAmount: Number(form.fundingAmount) || undefined
      }
    }, {
      onSuccess: () => {
        setOpen(false);
        setForm({ title: "", description: "", type: "investment", sector: "", expectedRoi: "", fundingAmount: "" });
        toast({ title: "Opportunity Submitted", description: "It is under internal review by the executive committee." });
        setActiveTab("investment");
      }
    });
  };

  if (isLoading) return <LoadingScreen />;

  const filteredOpps = opportunities?.filter(o => {
    if (activeTab === "funding") {
      if (o.type !== "grant" && o.type !== "accelerator" && o.type !== "incubator" && o.type !== "funding") return false;
      if (fundingFilter !== "All" && o.type !== fundingFilter.toLowerCase()) return false;
      return true;
    }
    return o.type === activeTab;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-display font-bold text-white mb-4">Capital & Opportunities</h1>
        <p className="text-xl text-muted-foreground">Discover high-yield agribusiness projects, grants, and value chain gaps requiring immediate attention.</p>
      </div>

      <div className="flex justify-center border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-semibold whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"
            }`}
          >
            <tab.icon className="w-5 h-5" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "submit" ? (
        <div className="max-w-2xl mx-auto glass-panel p-8 md:p-12 rounded-3xl border-primary/20 shadow-2xl shadow-primary/5">
          <h2 className="text-2xl font-bold text-white mb-6">Pitch Your Agribusiness Idea</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-bold text-muted-foreground uppercase mb-2 block">Opportunity Title</label>
              <input required className="w-full bg-background border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Solar-powered Cold Storage in Nakuru" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold text-muted-foreground uppercase mb-2 block">Sector</label>
                <input required className="w-full bg-background border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary outline-none" value={form.sector} onChange={e => setForm({...form, sector: e.target.value})} placeholder="e.g. Logistics" />
              </div>
              <div>
                <label className="text-sm font-bold text-muted-foreground uppercase mb-2 block">Type</label>
                <select className="w-full bg-background border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary outline-none" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="investment">Investment Sought</option>
                  <option value="value_chain">Value Chain Partner</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-muted-foreground uppercase mb-2 block">Description</label>
              <textarea required rows={4} className="w-full bg-background border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary outline-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Detail the problem, solution, and market size..." />
            </div>
            {form.type === 'investment' && (
              <div className="grid grid-cols-2 gap-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Funding Needed (USD)</label>
                  <input type="number" required className="w-full bg-background border border-white/10 rounded-lg py-2.5 px-3 text-white focus:border-primary outline-none font-mono" value={form.fundingAmount} onChange={e => setForm({...form, fundingAmount: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Expected ROI</label>
                  <input className="w-full bg-background border border-white/10 rounded-lg py-2.5 px-3 text-white focus:border-primary outline-none" value={form.expectedRoi} onChange={e => setForm({...form, expectedRoi: e.target.value})} placeholder="e.g. 18% over 3 years" />
                </div>
              </div>
            )}
            <button disabled={isPending} type="submit" className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              {isPending ? "Submitting to Ledger..." : "Submit to EAAPA Network"}
            </button>
          </form>
        </div>
      ) : (
        <>
          {activeTab === "funding" && (
            <div className="flex gap-2 mb-8 justify-center">
              {["All", "Grant", "Accelerator", "Incubator"].map(f => (
                <button 
                  key={f} onClick={() => setFundingFilter(f)} 
                  className={clsx("px-4 py-2 rounded-full text-sm font-bold transition-all", fundingFilter === f ? "bg-white text-background" : "bg-white/5 text-white/70 hover:bg-white/10")}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpps.length === 0 ? (
              <div className="col-span-full py-20 text-center text-muted-foreground">No active opportunities found for this category.</div>
            ) : filteredOpps.map((opp) => (
              <div key={opp.id} className="glass-panel p-8 rounded-3xl flex flex-col h-full hover:border-primary/50 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                  <span className={clsx("px-3 py-1 rounded-full text-xs font-bold uppercase", 
                    opp.type === 'investment' ? "bg-primary/10 text-primary border border-primary/20" :
                    opp.type === 'grant' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                    "bg-secondary/10 text-secondary border border-secondary/20"
                  )}>
                    {opp.type.replace('_', ' ')}
                  </span>
                  {opp.status === 'open' ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-white/90"><span className="w-2 h-2 rounded-full bg-primary animate-pulse"/> Accepting</span>
                  ) : (
                    <span className="text-xs font-bold text-destructive flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> Closing Soon</span>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors leading-tight">{opp.title}</h3>
                <p className="text-sm text-muted-foreground flex-1 mb-8 line-clamp-3">{opp.description}</p>
                
                <div className="space-y-4 mb-8 bg-background/50 rounded-2xl p-5 border border-white/5 mt-auto">
                  {opp.fundingAmount && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-bold uppercase">Funding Value</span>
                      <span className="font-mono font-bold text-lg text-white">${opp.fundingAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {opp.roi && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-bold uppercase">Proj. ROI</span>
                      <span className="font-bold text-primary text-lg">{opp.roi}</span>
                    </div>
                  )}
                  {opp.deadline && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-bold uppercase">Deadline</span>
                      <span className="text-sm font-medium text-white">{new Date(opp.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <button className="w-full py-3.5 rounded-xl border-2 border-white/10 text-white font-bold hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-2">
                  {opp.type === 'investment' ? 'Request Data Room' : opp.type === 'value_chain' ? 'Contact Partner' : 'Apply Now'} <Plus className="w-4 h-4"/>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
