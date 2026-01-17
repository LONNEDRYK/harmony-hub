import { useLocation, useNavigate } from 'react-router-dom';
import { useMusic } from '@/contexts/MusicContext';
import { Pause, Play } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentTrack, isPlaying, togglePlay } = useMusic();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm safe-area-bottom">
      <div className="px-4 pt-3 pb-6">
        {/* Mini Player - Pill shape with gradient border effect */}
        {currentTrack && (
          <button 
            onClick={() => navigate('/player')}
            className="w-full mb-5 flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-4 py-3"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="flex-shrink-0"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" fill="white" />
              ) : (
                <Play className="w-5 h-5 text-white" fill="white" />
              )}
            </button>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-white text-sm font-medium truncate">{currentTrack.title}</p>
              <p className="text-white/60 text-xs truncate">{currentTrack.artist}</p>
            </div>
          </button>
        )}

        {/* Navigation Icons - Disposition en diagonale comme l'image */}
        <div className="flex items-end justify-between px-2">
          {/* Home - en haut à gauche */}
          <button
            onClick={() => navigate('/')}
            className="flex flex-col items-center gap-1 -mb-2"
          >
            <svg viewBox="0 0 24 24" className={`w-7 h-7 ${location.pathname === '/' ? 'text-white' : 'text-white/50'}`} fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="9"/>
              <circle cx="12" cy="12" r="5"/>
              <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
            </svg>
            <span className={`text-[10px] ${location.pathname === '/' ? 'text-white' : 'text-white/50'}`}>Home</span>
          </button>

          {/* Discovery - au centre un peu plus bas */}
          <button
            onClick={() => navigate('/search')}
            className="flex flex-col items-center gap-1 mb-0"
          >
            <svg viewBox="0 0 24 24" className={`w-7 h-7 ${location.pathname === '/search' ? 'text-white' : 'text-white/50'}`} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <span className={`text-[10px] ${location.pathname === '/search' ? 'text-white' : 'text-white/50'}`}>Discovery</span>
          </button>

          {/* Collection - plus bas à droite */}
          <button
            onClick={() => navigate('/library')}
            className="flex flex-col items-center gap-1 mb-2"
          >
            <svg viewBox="0 0 24 24" className={`w-7 h-7 ${location.pathname === '/library' ? 'text-white' : 'text-white/50'}`} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M6 4v16"/>
              <path d="M10 4v16"/>
              <path d="M14 4v16"/>
              <path d="M18 4v16"/>
            </svg>
            <span className={`text-[10px] ${location.pathname === '/library' ? 'text-white' : 'text-white/50'}`}>Collection</span>
          </button>

          {/* Bouton + tout à droite */}
          <button
            onClick={() => navigate('/library')}
            className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center mb-2"
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
