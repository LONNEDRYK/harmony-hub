import { Home, Search, Bookmark, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { icon: Home, path: '/' },
  { icon: Search, path: '/search' },
  { icon: Bookmark, path: '/library' },
  { icon: User, path: '/profile' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl safe-area-bottom">
      <div className="flex justify-around items-center h-14 px-8 max-w-lg mx-auto">
        {navItems.map(({ icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex items-center justify-center p-3 transition-all duration-200"
            >
              <Icon
                className={`w-6 h-6 transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-white/40'
                }`}
                strokeWidth={isActive ? 2 : 1.5}
                fill={isActive ? 'white' : 'none'}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
