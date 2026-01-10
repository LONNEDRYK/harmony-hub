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
} from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useState } from 'react';
import TrackOptionsSheet from '@/components/TrackOptionsSheet';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const Player = () => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const {
    currentTrack,
    isPlaying,
    currentTime,
    shuffle,
    repeat,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
  } = useMusic();

  if (!currentTrack) {
    navigate('/');
    return null;
  }

  const progress = currentTrack.duration > 0 ? (currentTime / currentTrack.duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(percent * currentTrack.duration);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(180deg, hsl(var(--primary) / 0.3) 0%, transparent 50%)`,
        }}
      />

      {/* Content */}
      <div className="relative flex-1 flex flex-col p-6 pt-safe">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              En écoute
            </p>
          </div>
          <button 
            onClick={() => setShowOptions(true)}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </header>

        {/* Album Art */}
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="relative">
            <div 
              className="absolute inset-0 rounded-3xl blur-3xl opacity-50"
              style={{
                background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.3))`,
                transform: 'scale(0.9) translateY(20px)',
              }}
            />
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="relative w-72 h-72 md:w-80 md:h-80 rounded-3xl object-cover shadow-2xl"
            />
          </div>
        </div>

        {/* Track Info */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold truncate mb-1">{currentTrack.title}</h1>
            <p className="text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
          <button
            onClick={() => toggleFavorite(currentTrack.id)}
            className="p-3 rounded-full transition-transform active:scale-90"
          >
            <Heart
              className={`w-7 h-7 transition-colors ${
                currentTrack.isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'
              }`}
            />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div 
            className="h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-primary rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-3">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={toggleShuffle}
            className={`p-3 rounded-full transition-all active:scale-90 ${
              shuffle ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Shuffle className="w-6 h-6" />
          </button>

          <button
            onClick={prevTrack}
            className="p-3 rounded-full transition-transform active:scale-90"
          >
            <SkipBack className="w-8 h-8" fill="currentColor" />
          </button>

          <button
            onClick={togglePlay}
            className="w-18 h-18 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/20 transition-transform active:scale-95"
            style={{ width: '72px', height: '72px' }}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-black" fill="currentColor" />
            ) : (
              <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-3 rounded-full transition-transform active:scale-90"
          >
            <SkipForward className="w-8 h-8" fill="currentColor" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-3 rounded-full transition-all active:scale-90 ${
              repeat !== 'off' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {repeat === 'one' ? <Repeat1 className="w-6 h-6" /> : <Repeat className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Options Sheet */}
      <TrackOptionsSheet
        track={currentTrack}
        isOpen={showOptions}
        onClose={() => setShowOptions(false)}
      />
    </div>
  );
};

export default Player;
