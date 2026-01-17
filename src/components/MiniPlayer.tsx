import { Pause, Play, Heart } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useNavigate } from 'react-router-dom';

const MiniPlayer = () => {
  const { currentTrack, isPlaying, togglePlay, toggleFavorite } = useMusic();
  const navigate = useNavigate();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-[72px] left-0 right-0 z-40 px-3 max-w-4xl mx-auto">
      <div
        className="w-full rounded-2xl border border-border/40 bg-card/80 backdrop-blur-md px-3 py-2 shadow-lg flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/player')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') navigate('/player');
        }}
      >
        {/* Album Art */}
        <img
          src={currentTrack.cover}
          alt={currentTrack.title}
          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate text-foreground">{currentTrack.title}</p>
          <p className="text-[11px] truncate text-muted-foreground">{currentTrack.artist}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(currentTrack.id);
            }}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"
            aria-label="Favorite"
          >
            <Heart 
              className={`w-4 h-4 ${currentTrack.isFavorite ? 'text-red-500 fill-red-500' : 'text-foreground'}`} 
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" fill="currentColor" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
