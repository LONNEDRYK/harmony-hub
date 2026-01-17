import { Pause, Play, Plus } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useNavigate } from 'react-router-dom';

const MiniPlayer = () => {
  const { currentTrack, isPlaying, togglePlay } = useMusic();
  const navigate = useNavigate();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-[88px] left-0 right-0 z-40 px-4">
      <div
        className="w-full rounded-full border border-border/50 bg-card/60 backdrop-blur-sm px-3 py-2.5 shadow-lg flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/player')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') navigate('/player');
        }}
      >
        {/* Play/Pause */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" fill="currentColor" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate text-foreground/95">{currentTrack.title}</p>
          <p className="text-xs truncate text-muted-foreground">{currentTrack.artist}</p>
        </div>

        {/* + action (comme sur l'image) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/library');
          }}
          className="w-10 h-10 rounded-full border border-border/60 bg-background/10 flex items-center justify-center flex-shrink-0"
          aria-label="Ajouter"
        >
          <Plus className="w-5 h-5 text-foreground/80" />
        </button>
      </div>
    </div>
  );
};

export default MiniPlayer;
