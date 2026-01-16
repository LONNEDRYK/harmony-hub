import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { 
      icon: (active: boolean) => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
          <circle cx="12" cy="12" r="9"/>
          <circle cx="12" cy="12" r="5"/>
          <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
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
          <path d="M3 6h18"/>
          <path d="M3 10h18"/>
          <path d="M3 14h18"/>
          <path d="M3 18h18"/>
        </svg>
      ),
      path: '/library', 
      label: 'Collection' 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-sm border-t border-white/5 safe-area-bottom">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Navigation items à gauche */}
        <div className="flex items-center gap-10">
          {navItems.map(({ icon, path, label }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="flex flex-col items-center gap-1"
              >
                <span className={`transition-all ${isActive ? 'text-white' : 'text-white/40'}`}>
                  {icon(isActive)}
                </span>
                <span className={`text-[10px] ${isActive ? 'text-white font-medium' : 'text-white/40'}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bouton + à droite */}
        <button
          onClick={() => navigate('/library')}
          className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M12 5v14"/>
            <path d="M5 12h14"/>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
