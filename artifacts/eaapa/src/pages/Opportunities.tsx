import { useState } from "react";
import { useListOpportunities, useSubmitOpportunity } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { DollarSign, Clock, Tag, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function Opportunities() {
  const { data: opportunities, isLoading } = useListOpportunities();
  const { mutate: submit, isPending } = useSubmitOpportunity();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "investment",
    sector: "",
    fundingAmount: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({
      data: {
        ...form,
        fundingAmount: Number(form.fundingAmount) || undefined
      }
    }, {
      onSuccess: () => {
        setOpen(false);
        toast({ title: "Opportunity Submitted", description: "It is under internal review." });
      }
    });
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Investment Opportunities</h1>
          <p className="text-muted-foreground mt-2">Discover high-yield agribusiness projects requiring capital.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="px-6 py-3 rounded-xl bg-primary text-white font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              <Plus className="w-5 h-5" /> Submit Idea
            </button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">Submit New Idea</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Title</label>
                <input required className="w-full bg-background border border-white/10 rounded-lg p-3 text-white" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Sector</label>
                <input required className="w-full bg-background border border-white/10 rounded-lg p-3 text-white" value={form.sector} onChange={e => setForm({...form, sector: e.target.value})} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Description</label>
                <textarea required rows={3} className="w-full bg-background border border-white/10 rounded-lg p-3 text-white" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Funding Needed (USD)</label>
                <input type="number" className="w-full bg-background border border-white/10 rounded-lg p-3 text-white" value={form.fundingAmount} onChange={e => setForm({...form, fundingAmount: e.target.value})} />
              </div>
              <button disabled={isPending} type="submit" className="w-full py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-all mt-4">
                {isPending ? "Submitting..." : "Submit to Workflow"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities?.map((opp) => (
          <div key={opp.id} className="glass-panel p-6 rounded-2xl flex flex-col h-full hover:border-primary/50 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase">
                {opp.type.replace('_', ' ')}
              </span>
              {opp.status === 'open' ? (
                <span className="flex items-center gap-1 text-xs font-medium text-primary"><span className="w-2 h-2 rounded-full bg-primary animate-pulse"/> Active</span>
              ) : (
                <span className="text-xs text-muted-foreground capitalize">{opp.status.replace('_', ' ')}</span>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{opp.title}</h3>
            <p className="text-sm text-muted-foreground flex-1 mb-6 line-clamp-3">{opp.description}</p>
            
            <div className="space-y-3 mb-6 bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2"><DollarSign className="w-4 h-4"/> Funding</span>
                <span className="font-mono font-bold text-white">{opp.fundingAmount ? `$${opp.fundingAmount.toLocaleString()}` : 'TBD'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2"><TrendingUp className="w-4 h-4"/> Proj. ROI</span>
                <span className="font-bold text-primary">{opp.roi || 'Variable'}</span>
              </div>
            </div>

            <button className="w-full py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/10 transition-all">
              View Data Room
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
