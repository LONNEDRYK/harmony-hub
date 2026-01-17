import { useLocation, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'Discovery', path: '/search', icon: SearchIcon },
    { label: 'Collection', path: '/library', icon: LibraryIcon },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border/30 safe-area-bottom">
      <div className="px-4 pt-3 pb-5 max-w-lg mx-auto">
        <div className="flex items-center justify-between">
          {/* Nav Items */}
          <div className="flex items-center gap-6">
            {items.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-0.5"
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon active={active} />
                  <span className={`text-[10px] font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Add Button */}
          <button
            onClick={() => navigate('/library')}
            className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5 text-primary-foreground" />
          </button>
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
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
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
      <path d="M6 4v16" />
      <path d="M10 4v16" />
      <path d="M14 4v16" />
      <path d="M18 4v16" />
    </svg>
  );
}

export default BottomNav;
