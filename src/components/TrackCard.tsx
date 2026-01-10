import { Play, Pause, MoreVertical } from 'lucide-react';
import { Track, useMusic } from '@/contexts/MusicContext';
import { useState } from 'react';
import TrackOptionsSheet from './TrackOptionsSheet';

interface TrackCardProps {
  track: Track;
  variant?: 'grid' | 'list';
}

const TrackCard = ({ track, variant = 'grid' }: TrackCardProps) => {
  const { playTrack, currentTrack, isPlaying, togglePlay } = useMusic();
  const [showOptions, setShowOptions] = useState(false);

  const isCurrentTrack = currentTrack?.id === track.id;

  const handlePlay = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  if (variant === 'list') {
    return (
      <>
        <div
          className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
            isCurrentTrack ? 'bg-primary/10' : 'hover:bg-white/5'
          }`}
        >
          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={track.cover}
              alt={track.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
            >
              {isCurrentTrack && isPlaying ? (
                <Pause className="w-5 h-5" fill="currentColor" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
              )}
            </button>
          </div>

          <div className="flex-1 min-w-0" onClick={handlePlay}>
            <p className={`font-medium truncate ${isCurrentTrack ? 'text-primary' : ''}`}>
              {track.title}
            </p>
            <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
          </div>

          <button
            onClick={() => setShowOptions(true)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <TrackOptionsSheet
          track={track}
          isOpen={showOptions}
          onClose={() => setShowOptions(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="group flex-shrink-0 w-36">
        <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
          <img
            src={track.cover}
            alt={track.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* More Options Button */}
          <button
            onClick={() => setShowOptions(true)}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Play Button */}
          <button
            onClick={handlePlay}
            className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg"
          >
            {isCurrentTrack && isPlaying ? (
              <Pause className="w-4 h-4 text-primary-foreground" fill="currentColor" />
            ) : (
              <Play className="w-4 h-4 text-primary-foreground ml-0.5" fill="currentColor" />
            )}
          </button>
        </div>
        <p className="font-medium text-sm truncate">{track.title}</p>
        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
      </div>

      <TrackOptionsSheet
        track={track}
        isOpen={showOptions}
        onClose={() => setShowOptions(false)}
      />
    </>
  );
};

export default TrackCard;
