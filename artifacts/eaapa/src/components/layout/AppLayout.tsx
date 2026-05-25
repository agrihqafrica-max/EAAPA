import { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { Ticker } from "./Ticker";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-x-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Ticker />
      <TopNav />
      <main className="flex-1 w-full relative z-10">
        {children}
      </main>
    </div>
  );
}
