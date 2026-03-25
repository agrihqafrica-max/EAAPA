import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
      </div>
      <p className="text-muted-foreground font-medium animate-pulse">Initializing Data Core...</p>
    </div>
  );
}
