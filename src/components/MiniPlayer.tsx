import { Play, Pause } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useNavigate } from 'react-router-dom';

const MiniPlayer = () => {
  const { currentTrack, isPlaying, togglePlay } = useMusic();
  const navigate = useNavigate();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-24 left-0 right-0 z-40 px-4">
      <div
        className="bg-card/95 backdrop-blur-xl rounded-2xl border border-white/10 p-3 flex items-center gap-3 cursor-pointer shadow-lg"
        onClick={() => navigate('/player')}
      >
        {/* Album art */}
        <img
          src={currentTrack.cover}
          alt={currentTrack.title}
          className="w-12 h-12 rounded-xl object-cover"
        />
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{currentTrack.title}</p>
          <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
        </div>

        {/* Play/Pause button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-black" fill="currentColor" />
          ) : (
            <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MiniPlayer;
