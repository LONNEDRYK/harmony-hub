import { useLocation, useNavigate } from 'react-router-dom';
import { useMusic } from '@/contexts/MusicContext';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile } = useMusic();

  const items: Array<{label: string; path: string; icon: (({active}: {active?: boolean}) => JSX.Element) | null; avatar?: string}> = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'Discovery', path: '/search', icon: SearchIcon },
    { label: 'Collection', path: '/library', icon: LibraryIcon },
    { label: 'Profile', path: '/profile', icon: null, avatar: userProfile.avatar },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/30 safe-area-bottom">
      <div className="px-6 pt-3 pb-5 max-w-lg mx-auto">
        <div className="flex items-center justify-center gap-10">
          {items.map((item) => {
            const active = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1"
                aria-current={active ? 'page' : undefined}
              >
                {item.avatar ? (
                  <div className={`w-6 h-6 rounded-full overflow-hidden ring-2 ${active ? 'ring-foreground' : 'ring-transparent'}`}>
                    <img src={item.avatar} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <item.icon active={active} />
                )}
                <span className={`text-[10px] font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${active ? 'text-foreground' : 'text-muted-foreground'}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      {/* WiFi-like concentric arcs */}
      <path d="M12 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="currentColor" />
      <path d="M8.5 15.5a5 5 0 017 0" strokeLinecap="round" />
      <path d="M5.5 12a9 9 0 0113 0" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon({ active }: { active?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${active ? 'text-foreground' : 'text-muted-foreground'}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function LibraryIcon({ active }: { active?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${active ? 'text-foreground' : 'text-muted-foreground'}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path d="M4 6h16" />
      <path d="M4 10h16" />
      <path d="M4 14h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

export default BottomNav;
