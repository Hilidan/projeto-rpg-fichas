import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CharacterSheet from "./pages/CharacterSheet";
import QuickRules from "./pages/QuickRules";
import CharacterCreator from "./pages/CharacterCreator";
import MyCharacters from "./pages/MyCharacters";
import CustomCharacterSheet from "./pages/CustomCharacterSheet";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/personagem/:id" component={CharacterSheet} />
      <Route path="/regras" component={QuickRules} />
      <Route path="/criar-personagem" component={CharacterCreator} />
      <Route path="/meus-personagens" component={MyCharacters} />
      <Route path="/ficha-custom/:id" component={CustomCharacterSheet} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
