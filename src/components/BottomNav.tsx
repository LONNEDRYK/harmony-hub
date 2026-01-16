import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { 
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
          <circle cx="12" cy="12" r="2"/>
        </svg>
      ),
      path: '/', 
      label: 'Home' 
    },
    { 
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
      ),
      path: '/search', 
      label: 'Discovery' 
    },
    { 
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round">
          <path d="M4 6h16"/>
          <path d="M4 10h16"/>
          <path d="M4 14h16"/>
          <path d="M4 18h16"/>
        </svg>
      ),
      path: '/library', 
      label: 'Collection' 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom px-4 pb-4">
      <div className="bg-black/60 backdrop-blur-2xl rounded-full border border-white/10 py-3 px-4">
        <div className="flex items-center justify-between">
          {/* Navigation items */}
          <div className="flex items-center gap-8">
            {navItems.map(({ icon, path, label }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="flex flex-col items-center gap-1"
                >
                  <span className={`transition-all ${isActive ? 'text-white' : 'text-white/50'}`}>
                    {icon(isActive)}
                  </span>
                  <span className={`text-[10px] font-medium ${isActive ? 'text-white' : 'text-white/50'}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bouton + à droite */}
          <button
            onClick={() => navigate('/library')}
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M12 5v14"/>
              <path d="M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
