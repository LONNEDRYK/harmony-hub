import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Heart,
  MoreHorizontal,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  ListMusic,
} from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Slider } from '@/components/ui/slider';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const Player = () => {
  const navigate = useNavigate();
  const {
    currentTrack,
    isPlaying,
    currentTime,
    volume,
    shuffle,
    repeat,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
  } = useMusic();

  if (!currentTrack) {
    navigate('/');
    return null;
  }

  const progress = currentTrack.duration > 0 ? (currentTime / currentTrack.duration) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background p-4 pt-safe animate-slide-up">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full glass-button flex items-center justify-center"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            En cours de lecture
          </p>
          <p className="text-sm font-medium">{currentTrack.album}</p>
        </div>
        <button className="w-10 h-10 rounded-full glass-button flex items-center justify-center">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </header>

      {/* Album Art */}
      <div className="flex-1 flex items-center justify-center py-4">
        <div className="relative w-72 h-72 md:w-80 md:h-80">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full rounded-3xl object-cover album-shadow"
          />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      </div>

      {/* Track Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold truncate">{currentTrack.title}</h1>
          <p className="text-muted-foreground truncate">{currentTrack.artist}</p>
        </div>
        <button
          onClick={() => toggleFavorite(currentTrack.id)}
          className="p-3 rounded-full hover:bg-white/10 transition-colors"
        >
          <Heart
            className={`w-6 h-6 ${
              currentTrack.isFavorite ? 'fill-primary text-primary' : ''
            }`}
          />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <Slider
          value={[progress]}
          max={100}
          step={0.1}
          onValueChange={([val]) => {
            const newTime = (val / 100) * currentTrack.duration;
            seek(newTime);
          }}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={toggleShuffle}
          className={`p-3 rounded-full transition-colors ${
            shuffle ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Shuffle className="w-5 h-5" />
        </button>

        <button
          onClick={prevTrack}
          className="p-3 rounded-full hover:bg-white/10 transition-colors"
        >
          <SkipBack className="w-7 h-7" fill="currentColor" />
        </button>

        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-primary flex items-center justify-center glow-effect"
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 text-primary-foreground" fill="currentColor" />
          ) : (
            <Play className="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" />
          )}
        </button>

        <button
          onClick={nextTrack}
          className="p-3 rounded-full hover:bg-white/10 transition-colors"
        >
          <SkipForward className="w-7 h-7" fill="currentColor" />
        </button>

        <button
          onClick={toggleRepeat}
          className={`p-3 rounded-full transition-colors ${
            repeat !== 'off' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {repeat === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
        </button>
      </div>

      {/* Volume & Queue */}
      <div className="flex items-center gap-4 mb-4">
        <Volume2 className="w-5 h-5 text-muted-foreground" />
        <Slider
          value={[volume * 100]}
          max={100}
          step={1}
          onValueChange={([val]) => setVolume(val / 100)}
          className="flex-1"
        />
        <button
          onClick={() => navigate('/library')}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ListMusic className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default Player;
