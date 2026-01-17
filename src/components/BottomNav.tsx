import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'Discovery', path: '/search', icon: SearchIcon },
    { label: 'Collection', path: '/library', icon: LibraryIcon },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-t border-border/40 safe-area-bottom">
      <div className="px-6 pt-4 pb-6">
        <div className="mx-auto grid max-w-xs grid-cols-3 items-end">
          {items.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1"
                aria-current={active ? 'page' : undefined}
              >
                <Icon className={active ? 'text-foreground' : 'text-muted-foreground'} />
                <span className={active ? 'text-[11px] text-foreground' : 'text-[11px] text-muted-foreground'}>
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

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={"h-7 w-7 " + (className ?? '')}
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

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={"h-7 w-7 " + (className ?? '')}
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

function LibraryIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={"h-7 w-7 " + (className ?? '')}
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
