import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";

import Home from "@/pages/Home";
import Ecosystem from "@/pages/Ecosystem";
import MarketHub from "@/pages/MarketHub";
import DataRoom from "@/pages/DataRoom";
import Opportunities from "@/pages/Opportunities";
import Projects from "@/pages/Projects";
import Community from "@/pages/Community";
import Resources from "@/pages/Resources";
import Events from "@/pages/Events";
import Impact from "@/pages/Impact";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/ecosystem" component={Ecosystem} />
        <Route path="/market-hub" component={MarketHub} />
        <Route path="/market-hub/:id" component={DataRoom} />
        <Route path="/opportunities" component={Opportunities} />
        <Route path="/projects" component={Projects} />
        <Route path="/community" component={Community} />
        <Route path="/resources" component={Resources} />
        <Route path="/events" component={Events} />
        <Route path="/impact" component={Impact} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
