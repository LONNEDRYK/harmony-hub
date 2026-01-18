import { Pause, Play, Plus } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useNavigate } from 'react-router-dom';

const MiniPlayer = () => {
  const { currentTrack, isPlaying, togglePlay, playlists } = useMusic();
  const navigate = useNavigate();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-[72px] left-0 right-0 z-40 px-4 max-w-4xl mx-auto">
      <div
        className="w-full rounded-full bg-card/70 backdrop-blur-xl px-3 py-2 shadow-2xl flex items-center gap-3 cursor-pointer border border-border/20"
        onClick={() => navigate('/player')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') navigate('/player');
        }}
      >
        {/* Play/Pause Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="w-8 h-8 flex items-center justify-center flex-shrink-0"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <div className="flex items-center gap-0.5">
              <div className="w-1 h-4 bg-foreground rounded-full" />
              <div className="w-1 h-4 bg-foreground rounded-full" />
            </div>
          ) : (
            <Play className="w-5 h-5 text-foreground" fill="currentColor" />
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate text-foreground">{currentTrack.title}</p>
          <p className="text-[11px] truncate text-muted-foreground">{currentTrack.artist}</p>
        </div>

        {/* Add to playlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Open add to playlist action
          }}
          className="w-8 h-8 rounded-full border border-border/50 flex items-center justify-center flex-shrink-0"
          aria-label="Add to playlist"
        >
          <Plus className="w-4 h-4 text-foreground" />
        </button>
      </div>
    </div>
  );
};

export default MiniPlayer;
