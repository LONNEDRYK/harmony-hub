import { Pause, Play, Plus } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useNavigate } from 'react-router-dom';

const MiniPlayer = () => {
  const { currentTrack, isPlaying, togglePlay } = useMusic();
  const navigate = useNavigate();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-[52px] left-0 right-0 z-40 px-3 max-w-lg mx-auto">
      <div
        className="w-full rounded-full bg-card/80 backdrop-blur-xl px-2.5 py-1.5 shadow-xl flex items-center gap-2.5 cursor-pointer border border-border/10"
        onClick={() => navigate('/player')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/player'); }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          className="w-7 h-7 flex items-center justify-center flex-shrink-0"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <div className="flex items-center gap-[2px]">
              <div className="w-[3px] h-3.5 bg-foreground rounded-full" />
              <div className="w-[3px] h-3.5 bg-foreground rounded-full" />
            </div>
          ) : (
            <Play className="w-4 h-4 text-foreground" fill="currentColor" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-medium truncate text-foreground">{currentTrack.title}</p>
          <p className="text-[10px] truncate text-muted-foreground">{currentTrack.artist}</p>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); }}
          className="w-7 h-7 rounded-full border border-border/30 flex items-center justify-center flex-shrink-0"
          aria-label="Add to playlist"
        >
          <Plus className="w-3 h-3 text-foreground" />
        </button>
      </div>
    </div>
  );
};

export default MiniPlayer;
