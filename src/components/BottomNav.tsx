import { useLocation, useNavigate } from 'react-router-dom';
import { useMusic } from '@/contexts/MusicContext';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile } = useMusic();

  const leftItems = [
    { label: 'Accueil', path: '/', icon: HomeIcon },
    { label: 'Recherche', path: '/search', icon: SearchIcon },
  ];

  const rightItems = [
    { label: 'Bibliothèque', path: '/library', icon: LibraryIcon },
    { label: 'Profil', path: '/profile', icon: null as any, avatar: userProfile.avatar },
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
          <div className={`w-7 h-7 rounded-full overflow-hidden ring-[1.5px] ${active ? 'ring-foreground' : 'ring-transparent'}`}>
            <img src={item.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
        ) : (
          item.icon && <item.icon active={active} />
        )}
        <span className={`text-[10px] font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border/10 safe-area-bottom">
      <div className="px-4 pt-2 pb-5 max-w-lg mx-auto">
        <div className="flex items-center justify-center" style={{ gap: '69px' }}>
          {leftItems.map(item => renderItem({ ...item, avatar: undefined }))}

          {/* Center create button */}
          <button
            onClick={() => navigate('/record')}
            className="flex flex-col items-center gap-1 min-w-[48px]"
          >
            <div className="w-[42px] h-[42px] bg-foreground/90 rounded-full flex items-center justify-center -mt-1">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <line x1="9" y1="2" x2="9" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-background" />
                <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-background" />
              </svg>
            </div>
          </button>

          {rightItems.map(item => renderItem(item))}
        </div>
      </div>
    </nav>
  );
};

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className={active ? 'text-foreground' : 'text-muted-foreground'}>
      {/* House outline with door */}
      <path d="M4 10.5L12 4L20 10.5V19C20 19.55 19.55 20 19 20H5C4.45 20 4 19.55 4 19V10.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      {/* Door */}
      <rect x="9.5" y="14" width="5" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

function SearchIcon({ active }: { active?: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className={active ? 'text-foreground' : 'text-muted-foreground'}>
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LibraryIcon({ active }: { active?: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className={active ? 'text-foreground' : 'text-muted-foreground'}>
      {/* Back card */}
      <rect x="5" y="3" width="14" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
      {/* Main card */}
      <rect x="3.5" y="7" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
      {/* Lines inside */}
      <line x1="7.5" y1="12" x2="16.5" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="7.5" y1="16" x2="14" y2="16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default BottomNav;
