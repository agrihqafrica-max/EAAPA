import { useListForumThreads } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { MessageSquare, Eye, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Community() {
  const { data: threads, isLoading } = useListForumThreads();

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Agripreneur Forum</h1>
          <p className="text-muted-foreground mt-2">Discuss funding, marketing, and agricultural technology.</p>
        </div>
        <button className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          New Topic
        </button>
      </div>

      <div className="bg-card border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
        {threads?.map((thread) => (
          <div key={thread.id} className="p-6 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex-1">
              <span className="text-xs font-medium text-secondary mb-2 block">{thread.category}</span>
              <h3 className="text-lg font-semibold text-white mb-1 hover:text-primary cursor-pointer transition-colors">{thread.title}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                By {thread.author} • <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(thread.createdAt))} ago
              </p>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>{thread.replies} Replies</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{thread.views} Views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
