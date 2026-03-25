import { useListEvents, useRegisterEvent } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { Calendar, MapPin, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Events() {
  const { data: events, isLoading } = useListEvents();
  const { mutate: register } = useRegisterEvent();
  const { toast } = useToast();

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-display font-bold text-white mb-8">Ecosystem Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((evt) => (
          <div key={evt.id} className="bg-card border border-white/10 rounded-2xl overflow-hidden group">
            <div className="h-3 bg-gradient-to-r from-primary to-secondary" />
            <div className="p-6">
              <span className="px-2.5 py-1 rounded-md bg-white/5 text-xs font-medium text-white/70 uppercase mb-4 inline-block">
                {evt.type}
              </span>
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{evt.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-3">{evt.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <Calendar className="w-4 h-4 text-primary" /> {format(new Date(evt.startDate), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <MapPin className="w-4 h-4 text-primary" /> {evt.location}, {evt.country}
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <Users className="w-4 h-4 text-primary" /> {evt.attendees} / {evt.maxAttendees} Attending
                </div>
              </div>

              <button 
                onClick={() => register({ id: evt.id }, { onSuccess: () => toast({ title: "Registered for Event" }) })}
                disabled={evt.isRegistered || evt.attendees >= evt.maxAttendees}
                className="w-full py-2.5 rounded-xl border border-white/10 font-semibold text-white hover:bg-white/10 disabled:opacity-50 transition-all"
              >
                {evt.isRegistered ? "Registered" : evt.attendees >= evt.maxAttendees ? "Full" : "Register Now"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
