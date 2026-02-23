import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MusicProvider } from "@/contexts/MusicContext";
import BottomNav from "@/components/BottomNav";
import MiniPlayer from "@/components/MiniPlayer";
import WelcomeScreen from "@/components/WelcomeScreen";
import Index from "./pages/Index";
import Player from "./pages/Player";
import Library from "./pages/Library";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import PlaylistDetail from "./pages/PlaylistDetail";
import NotFound from "./pages/NotFound";
import Record from "./pages/Record";
import { useState } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const [welcomeComplete, setWelcomeComplete] = useState(() => {
    return localStorage.getItem('musicflow_welcome_seen') === 'true';
  });
  const hideNav = ['/player', '/record'].includes(location.pathname);

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen relative overflow-x-hidden">
      {!welcomeComplete && (
        <WelcomeScreen onComplete={() => setWelcomeComplete(true)} />
      )}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/player" element={<Player />} />
        <Route path="/library" element={<Library />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/playlist/:id" element={<PlaylistDetail />} />
        <Route path="/record" element={<Record />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideNav && welcomeComplete && (
        <>
          <MiniPlayer />
          <BottomNav />
        </>
      )}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MusicProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </MusicProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
