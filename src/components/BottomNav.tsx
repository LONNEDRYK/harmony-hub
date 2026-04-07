import { useLocation, useNavigate } from 'react-router-dom';
import { useMusic } from '@/contexts/MusicContext';
import navHome from '@/assets/nav-home.webp';
import navSearch from '@/assets/nav-search.webp';
import navLibrary from '@/assets/nav-library.webp';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile } = useMusic();

  const items = [
    { label: 'Accueil', path: '/', icon: navHome },
    { label: 'Recherche', path: '/search', icon: navSearch },
    { label: '', path: '/record', icon: null, isCenter: true },
    { label: 'Bibliothèque', path: '/library', icon: navLibrary },
    { label: 'Profil', path: '/profile', icon: null, avatar: userProfile.avatar },
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
                  <div className="w-[46px] h-[46px] bg-[#2a2a2a] rounded-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <line x1="10" y1="3" x2="10" y2="17" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                      <line x1="3" y1="10" x2="17" y2="10" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
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
                ) : item.icon ? (
                  <img
                    src={item.icon}
                    alt={item.label}
                    className={`w-7 h-7 object-contain ${active ? 'opacity-100' : 'opacity-50'}`}
                  />
                ) : null}
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

export default BottomNav;
