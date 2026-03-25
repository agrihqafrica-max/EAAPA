import { useState } from "react";
import { useListEvents, useRegisterEvent } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { Calendar as CalendarIcon, MapPin, Users, LayoutList, CalendarDays, ExternalLink, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { clsx } from "clsx";

export default function Events() {
  const [view, setView] = useState<"list"|"calendar">("list");
  const [typeFilter, setTypeFilter] = useState("All");
  
  const { data: events, isLoading } = useListEvents();
  const { mutate: register } = useRegisterEvent();
  const { toast } = useToast();

  if (isLoading) return <LoadingScreen />;

  const filteredEvents = events?.filter(e => typeFilter === "All" || e.type.toLowerCase() === typeFilter.toLowerCase()) || [];

  // Simple calendar math
  const today = new Date();
  const daysInMonth = eachDayOfInterval({ start: startOfMonth(today), end: endOfMonth(today) });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Ecosystem Events</h1>
          <p className="text-xl text-muted-foreground">Conferences, capacity building, and networking across the region.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-card border border-white/10 p-1.5 rounded-2xl">
          <button onClick={()=>setView("list")} className={clsx("flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all", view==="list" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white")}>
            <LayoutList className="w-4 h-4"/> List
          </button>
          <button onClick={()=>setView("calendar")} className={clsx("flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all", view==="calendar" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white")}>
            <CalendarDays className="w-4 h-4"/> Calendar
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
        {["All", "Conference", "Exhibition", "Workshop", "Webinar", "Training"].map(t => (
          <button 
            key={t} onClick={()=>setTypeFilter(t)}
            className={clsx("px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all", typeFilter===t ? "bg-primary text-white" : "bg-card border border-white/10 text-muted-foreground hover:bg-white/10")}
          >
            {t}
          </button>
        ))}
      </div>

      {view === "list" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredEvents.map((evt) => (
            <div key={evt.id} className={clsx(
              "glass-panel rounded-[2rem] overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1",
              evt.isFeatured ? "border-secondary/50 shadow-[0_0_30px_rgba(217,119,6,0.1)]" : "border-white/10"
            )}>
              <div className={clsx("h-3 w-full", evt.isFeatured ? "bg-gradient-to-r from-secondary to-yellow-300" : "bg-white/10")} />
              <div className="p-8 flex flex-col h-full relative">
                {evt.isFeatured && <div className="absolute top-6 right-6 text-secondary flex items-center gap-1 font-bold text-xs"><Sparkles className="w-3.5 h-3.5"/> Featured</div>}
                
                <span className="px-3 py-1 rounded bg-white/5 text-[10px] font-bold uppercase tracking-wider text-white/60 mb-4 inline-table self-start">
                  {evt.type}
                </span>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors leading-tight">{evt.title}</h3>
                <p className="text-sm text-muted-foreground mb-8 flex-1">{evt.description}</p>
                
                <div className="space-y-4 mb-8 bg-background/50 p-5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3 text-sm text-white font-medium">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><CalendarIcon className="w-4 h-4"/></div>
                    {format(new Date(evt.startDate), 'MMM d')} - {format(new Date(evt.endDate), 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white font-medium">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><MapPin className="w-4 h-4"/></div>
                    {evt.location}, {evt.country}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white font-medium">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Users className="w-4 h-4"/></div>
                    {evt.attendees} / {evt.maxAttendees} Attending
                    <div className="ml-auto w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{width: `${(evt.attendees/evt.maxAttendees)*100}%`}}/>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => register({ id: evt.id }, { onSuccess: () => toast({ title: "Registered for Event" }) })}
                  disabled={evt.isRegistered || evt.attendees >= evt.maxAttendees}
                  className={clsx(
                    "w-full py-4 rounded-xl font-bold transition-all mt-auto",
                    evt.isRegistered ? "bg-white/10 text-white border border-white/20" :
                    evt.attendees >= evt.maxAttendees ? "bg-background text-muted-foreground cursor-not-allowed" :
                    "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                  )}
                >
                  {evt.isRegistered ? "Ticket Confirmed ✓" : evt.attendees >= evt.maxAttendees ? "Fully Booked" : "Reserve Seat"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-8 border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">{format(today, 'MMMM yyyy')}</h2>
          <div className="grid grid-cols-7 gap-4">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="text-center text-xs font-bold text-muted-foreground uppercase pb-2">{d}</div>)}
            {daysInMonth.map((day, i) => {
              const dayEvents = filteredEvents.filter(e => isSameDay(new Date(e.startDate), day) || (day >= new Date(e.startDate) && day <= new Date(e.endDate)));
              return (
                <div key={i} className={clsx(
                  "min-h-32 p-3 rounded-2xl border transition-all",
                  isToday(day) ? "bg-primary/10 border-primary" : "bg-background/50 border-white/5 hover:border-white/20",
                  !isSameMonth(day, today) && "opacity-50"
                )}>
                  <div className={clsx("text-sm font-bold mb-2", isToday(day) ? "text-primary" : "text-white/70")}>{format(day, 'd')}</div>
                  <div className="space-y-1.5">
                    {dayEvents.map(e => (
                      <div key={e.id} className="text-[10px] p-1.5 rounded bg-card border border-white/10 text-white font-medium truncate" title={e.title}>
                        {e.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
