import { useListResources } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { FileText, Download } from "lucide-react";
import { format } from "date-fns";

export default function Resources() {
  const { data: resources, isLoading } = useListResources();

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-white">Knowledge Center</h1>
        <p className="text-muted-foreground mt-2">Download research, market reports, and best practices.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources?.map((res) => (
          <div key={res.id} className="glass-panel p-6 rounded-2xl flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{res.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 flex-1">{res.description}</p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
              <div className="text-xs text-muted-foreground">
                {res.fileType.toUpperCase()} • {res.fileSize}
              </div>
              <button className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-white transition-colors">
                <Download className="w-4 h-4" /> {res.downloads}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
