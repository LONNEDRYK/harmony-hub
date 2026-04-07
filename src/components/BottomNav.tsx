import { useLocation, useNavigate } from 'react-router-dom';
import { useMusic } from '@/contexts/MusicContext';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile } = useMusic();

  const items = [
    { label: 'Accueil', path: '/', icon: 'home' },
    { label: 'Recherche', path: '/search', icon: 'search' },
    { label: '', path: '/record', icon: 'plus', isCenter: true },
    { label: 'Bibliothèque', path: '/library', icon: 'library' },
    { label: 'Profil', path: '/profile', icon: 'profile', avatar: userProfile.avatar },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border/10 safe-area-bottom">
      <div className="px-4 pt-2 pb-5 max-w-lg mx-auto">
        <div className="flex items-center justify-around">
          {items.map((item) => {
            const active = location.pathname === item.path;

            if (item.isCenter) {
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex items-center justify-center"
                >
                  <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center" style={{ backgroundColor: '#111111' }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <line x1="10" y1="3" x2="10" y2="17" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="3" y1="10" x2="17" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </button>
              );
            }

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1"
              >
                {item.avatar ? (
                  <div className={`w-7 h-7 rounded-full overflow-hidden ring-[1.5px] ${active ? 'ring-foreground' : 'ring-transparent'}`}>
                    <img src={item.avatar} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <NavIcon name={item.icon} active={active} />
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

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const color = active ? 'white' : '#666666';

  switch (name) {
    case 'home':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M4.5 10.2L12 3.5L19.5 10.2V19.5C19.5 20.05 19.05 20.5 18.5 20.5H5.5C4.95 20.5 4.5 20.05 4.5 19.5V10.2Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <rect
            x="9.5"
            y="14.5"
            width="5"
            height="6"
            rx="1"
            stroke={color}
            strokeWidth="1.5"
          />
        </svg>
      );
    case 'search':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth="2" />
          <line
            x1="15.5"
            y1="15.5"
            x2="21"
            y2="21"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'library':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          {/* Tab derrière */}
          <path
            d="M6.5 4.5H17.5C18.05 4.5 18.5 4.95 18.5 5.5V6.5H5.5V5.5C5.5 4.95 5.95 4.5 6.5 4.5Z"
            stroke={color}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          {/* Carte principale */}
          <rect
            x="4"
            y="7.5"
            width="16"
            height="13"
            rx="2"
            stroke={color}
            strokeWidth="1.5"
          />
          {/* Lignes de texte */}
          <line x1="7.5" y1="12.5" x2="16.5" y2="12.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="7.5" y1="16" x2="13.5" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default BottomNav;
