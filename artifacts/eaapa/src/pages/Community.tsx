import { useState } from "react";
import { useListForumThreads, useCreateForumThread, useListMentors } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { MessageSquare, Eye, Clock, Plus, Star, Users, MapPin, Award, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { clsx } from "clsx";

const FORUM_CATEGORIES = ["ALL", "Funding", "Marketing", "Dairy", "Technology", "Agronomy", "Market", "Youth"];

export default function Community() {
  const [activeTab, setActiveTab] = useState<"forum"|"mentors"|"challenges">("forum");
  
  const { data: threads, isLoading: l1 } = useListForumThreads();
  const { data: mentors, isLoading: l2 } = useListMentors();
  const { mutate: createThread, isPending } = useCreateForumThread();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Funding", content: "", tags: "" });
  const [forumFilter, setForumFilter] = useState("ALL");

  if (l1 || l2) return <LoadingScreen />;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createThread({
      data: {
        title: form.title,
        category: form.category,
        content: form.content,
        tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean)
      }
    }, {
      onSuccess: () => {
        setOpen(false);
        toast({ title: "Thread created successfully" });
        setForm({ title: "", category: "Funding", content: "", tags: "" });
      }
    });
  };

  const filteredThreads = threads?.filter(t => forumFilter === "ALL" || t.category === forumFilter) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-display font-bold text-white mb-4">Agripreneur Community</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Engage with peers, find expert mentors, and participate in ecosystem challenges.</p>
      </div>

      <div className="flex justify-center border-b border-white/10 mb-10 overflow-x-auto no-scrollbar">
        {[
          { id: "forum", label: "Discussions Forum" },
          { id: "mentors", label: "Mentor Network" },
          { id: "challenges", label: "Active Challenges" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-4 font-bold whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "forum" && (
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-full pb-2">
              {FORUM_CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setForumFilter(cat)}
                  className={clsx("px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all", forumFilter === cat ? "bg-white text-background" : "bg-white/5 text-muted-foreground hover:bg-white/10")}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="flex-shrink-0 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
                  <Plus className="w-4 h-4"/> New Topic
                </button>
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 text-white sm:max-w-lg rounded-3xl p-8">
                <DialogHeader><DialogTitle className="text-2xl font-display">Start a Discussion</DialogTitle></DialogHeader>
                <form onSubmit={handleCreate} className="space-y-5 mt-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Topic Title</label>
                    <input required className="w-full bg-background border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Category</label>
                    <select className="w-full bg-background border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
                      {FORUM_CATEGORIES.filter(c=>c!=='ALL').map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Content</label>
                    <textarea required rows={5} className="w-full bg-background border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary" value={form.content} onChange={e=>setForm({...form, content:e.target.value})} />
                  </div>
                  <button disabled={isPending} className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    {isPending ? "Posting..." : "Post Topic"}
                  </button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="glass-panel rounded-3xl overflow-hidden divide-y divide-white/5 border-white/10">
            {filteredThreads.length === 0 ? <div className="p-8 text-center text-muted-foreground">No discussions in this category yet.</div> : null}
            {filteredThreads.map((thread) => (
              <div key={thread.id} className="p-6 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row gap-4 justify-between items-start md:items-center group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80">{thread.category}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {formatDistanceToNow(new Date(thread.createdAt))} ago</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary cursor-pointer transition-colors leading-tight">{thread.title}</h3>
                  <p className="text-sm text-muted-foreground">Posted by <span className="text-white/80 font-medium">{thread.author}</span></p>
                </div>
                
                <div className="flex items-center gap-6 bg-background/50 px-5 py-3 rounded-2xl border border-white/5">
                  <div className="flex flex-col items-center">
                    <span className="font-mono font-bold text-white">{thread.replies}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Replies</span>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="flex flex-col items-center">
                    <span className="font-mono font-bold text-white">{thread.views}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "mentors" && (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Executive Mentor Network</h2>
            <select className="bg-card border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-primary outline-none">
              <option>All Sectors</option>
              <option>Agri-Finance</option>
              <option>Export Logistics</option>
              <option>Agronomy</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentors?.map(mentor => (
              <div key={mentor.id} className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group">
                <div className="absolute top-4 right-4">
                  {mentor.isAvailable ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-primary"><span className="w-2 h-2 rounded-full bg-primary animate-pulse"/> Available</span>
                  ) : (
                    <span className="text-xs font-bold text-muted-foreground">At Capacity</span>
                  )}
                </div>
                
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-card to-background border-2 border-white/10 flex items-center justify-center mb-5 shadow-xl group-hover:border-primary/50 transition-colors">
                  <span className="text-3xl font-display font-bold text-white">{mentor.name.charAt(0)}</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">{mentor.name}</h3>
                <p className="text-primary text-sm font-medium mb-4">{mentor.sector}</p>
                <div className="flex items-center gap-1.5 text-secondary mb-6">
                  {[...Array(5)].map((_,i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(mentor.rating/2) ? 'fill-secondary' : 'opacity-30'}`}/>)}
                  <span className="text-xs font-bold ml-1 text-white/80">{mentor.rating/2}/5.0</span>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {mentor.expertise.map((exp,i) => <span key={i} className="px-3 py-1 rounded-full bg-white/5 text-xs text-white/70">{exp}</span>)}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {mentor.country}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4"/> {mentor.menteeCount} Mentees</span>
                </div>

                <button disabled={!mentor.isAvailable} className="w-full py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 border-2 border-white/10 hover:border-primary hover:bg-primary/10 text-white mt-auto">
                  Request Mentorship
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "challenges" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Active Competitions</h2>
            {[
              { title: "Precision Farming Innovation Challenge", prize: "$50,000", dl: "Ends in 12 days", org: "World Bank" },
              { title: "Youth Agripreneur Pitch 2024", prize: "$25,000", dl: "Ends in 28 days", org: "Mastercard Foundation" },
              { title: "Women in Agribusiness Award", prize: "$100,000", dl: "Ends in 45 days", org: "USAID" }
            ].map((c,i) => (
              <div key={i} className="glass-panel p-8 rounded-3xl border-l-4 border-l-primary flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-primary/10 transition-all">
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Powered by {c.org}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{c.title}</h3>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded bg-secondary/10 text-secondary text-sm font-bold flex items-center gap-1"><Award className="w-4 h-4"/> {c.prize}</span>
                    <span className="text-sm text-destructive font-medium flex items-center gap-1.5"><Clock className="w-4 h-4"/> {c.dl}</span>
                  </div>
                </div>
                <button className="px-6 py-3 rounded-xl bg-white text-background font-bold hover:bg-white/90 transition-all whitespace-nowrap">
                  Apply Now
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="glass-panel p-10 rounded-[2.5rem] border-white/10 bg-gradient-to-br from-card to-background h-full">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Group Initiatives</h2>
              <p className="text-muted-foreground mb-10">Join forces with other agripreneurs to tackle large-scale ecosystem problems and unlock massive funding pools.</p>
              
              <div className="space-y-4">
                {[
                  "Cross-border Cold Chain Alliance",
                  "Organic Certification Cooperative",
                  "Solar Irrigation Syndicate"
                ].map((init, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                    <span className="font-bold text-white">{init}</span>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
