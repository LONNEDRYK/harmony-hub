import { useLocation, useNavigate } from 'react-router-dom';
import { useMusic } from '@/contexts/MusicContext';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile } = useMusic();

  const leftItems = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'Discovery', path: '/search', icon: SearchIcon },
  ];

  const rightItems = [
    { label: 'Collection', path: '/library', icon: LibraryIcon },
    { label: 'Profile', path: '/profile', icon: null as any, avatar: userProfile.avatar },
  ];

  const renderItem = (item: { label: string; path: string; icon: any; avatar?: string }) => {
    const active = location.pathname === item.path;
    return (
      <button
        key={item.path}
        onClick={() => navigate(item.path)}
        className="flex flex-col items-center gap-1 min-w-[48px]"
      >
        {item.avatar ? (
          <div className={`w-6 h-6 rounded-full overflow-hidden ring-[1.5px] ${active ? 'ring-foreground' : 'ring-transparent'}`}>
            <img src={item.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
        ) : (
          item.icon && <item.icon active={active} />
        )}
        <span className={`text-[11px] font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-t border-border/15 safe-area-bottom">
      <div className="px-5 pt-2.5 pb-5 max-w-lg mx-auto">
        <div className="flex items-center justify-center gap-6">
          {leftItems.map(item => renderItem({ ...item, avatar: undefined }))}

          {/* Center pill */}
          <button
            onClick={() => navigate('/record')}
            className="bg-foreground rounded-full px-6 py-2 flex items-center justify-center shadow-lg shadow-white/5"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <line x1="10" y1="3" x2="10" y2="17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-background" />
              <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-background" />
            </svg>
          </button>

          {rightItems.map(item => renderItem(item))}
        </div>
      </div>
    </nav>
  );
};

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={active ? 'text-foreground' : 'text-muted-foreground'}>
      <path d="M12 3.5 C8 3.5 5.5 6.5 5.5 10 C5.5 13.5 8 16.5 12 20 C16 16.5 18.5 13.5 18.5 10 C18.5 6.5 16 3.5 12 3.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9.2 9.5 C10.8 8.5 13.6 9.6 13.8 11.4 C14 13.2 11.8 14.6 10.4 13.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={active ? 'text-foreground' : 'text-muted-foreground'}>
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6" />
      <line x1="15.5" y1="15.5" x2="20" y2="20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function LibraryIcon({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={active ? 'text-foreground' : 'text-muted-foreground'}>
      <line x1="7" y1="5" x2="7" y2="19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="11" y1="5" x2="11" y2="19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="15" y1="5" x2="15" y2="19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="17.5" y1="5" x2="20" y2="19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default BottomNav;
