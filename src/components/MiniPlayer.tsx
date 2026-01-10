import { Play, Pause, SkipForward, Heart } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useNavigate } from 'react-router-dom';

const MiniPlayer = () => {
  const { currentTrack, isPlaying, togglePlay, nextTrack, toggleFavorite } = useMusic();
  const navigate = useNavigate();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 px-2">
      <div
        className="glass-card p-3 mx-auto max-w-lg flex items-center gap-3 cursor-pointer animate-slide-up"
        onClick={() => navigate('/player')}
      >
        <img
          src={currentTrack.cover}
          alt={currentTrack.title}
          className="w-12 h-12 rounded-lg object-cover"
        />
        
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{currentTrack.title}</p>
          <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(currentTrack.id);
          }}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${currentTrack.isFavorite ? 'fill-primary text-primary' : ''}`}
          />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-primary-foreground" fill="currentColor" />
          ) : (
            <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            nextTrack();
          }}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MiniPlayer;
