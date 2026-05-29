import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Programs from "@/pages/Programs";
import Ecosystem from "@/pages/Ecosystem";
import MarketHub from "@/pages/MarketHub";
import DataRoom from "@/pages/DataRoom";
import AILayer from "@/pages/AILayer";
import Opportunities from "@/pages/Opportunities";
import Network from "@/pages/Network";
import Community from "@/pages/Community";
import Resources from "@/pages/Resources";
import Events from "@/pages/Events";
import Impact from "@/pages/Impact";
import BuyerNetwork from "@/pages/BuyerNetwork";
import Documents from "@/pages/Documents";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/programs" component={Programs} />
        <Route path="/ecosystem" component={Ecosystem} />
        <Route path="/market-hub" component={MarketHub} />
        <Route path="/market-hub/:id/ai" component={AILayer} />
        <Route path="/market-hub/:id" component={DataRoom} />
        <Route path="/opportunities" component={Opportunities} />
        <Route path="/network" component={Network} />
        <Route path="/community" component={Community} />
        <Route path="/resources" component={Resources} />
        <Route path="/events" component={Events} />
        <Route path="/impact" component={Impact} />
        <Route path="/buyer-network" component={BuyerNetwork} />
        <Route path="/documents" component={Documents} />
        <Route path="/documents/:category" component={Documents} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <AuthModal />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
