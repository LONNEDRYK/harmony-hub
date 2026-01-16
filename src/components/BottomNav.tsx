import { Home, Search, Plus, LayoutGrid } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, path: '/', label: 'Accueil' },
    { icon: Search, path: '/search', label: 'Découvrir' },
    { icon: LayoutGrid, path: '/library', label: 'Collection' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      <div className="mx-4 mb-4">
        <div className="bg-card/90 backdrop-blur-xl rounded-full border border-white/10 py-3 px-6">
          <div className="flex justify-around items-center">
            {navItems.map(({ icon: Icon, path, label }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="flex flex-col items-center gap-1 px-4"
                >
                  <Icon
                    className={`w-6 h-6 transition-all ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                    strokeWidth={isActive ? 2 : 1.5}
                    fill={isActive ? 'currentColor' : 'none'}
                  />
                  <span className={`text-[10px] ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {label}
                  </span>
                </button>
              );
            })}

            {/* Bouton central (+) */}
            <button
              onClick={() => navigate('/library')}
              className="w-12 h-12 -mt-8 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-background"
            >
              <Plus className="w-6 h-6 text-black" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
