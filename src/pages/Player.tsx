import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Heart,
  MoreVertical,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Shuffle,
  Repeat,
  ListMusic,
  Volume2,
  Star,
} from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useState, useEffect } from 'react';
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
  const remaining = currentTrack.duration - currentTime;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(percent * currentTrack.duration);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setVolume(Math.max(0, Math.min(1, percent)));
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Album art as full background */}
      <div className="absolute inset-0">
        <img
          src={currentTrack.cover}
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-4 pt-safe">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-black/30 backdrop-blur flex items-center justify-center"
          >
            <ChevronDown className="w-6 h-6 text-white" />
          </button>
          <div className="w-10" />
        </header>

        {/* Spacer to push content down */}
        <div className="flex-1" />

        {/* Track info overlay on album art */}
        <div className="px-5 pb-2">
          <div className="flex items-end justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h1 className="text-2xl font-bold text-white truncate">{currentTrack.title}</h1>
              <p className="text-white/70 text-base truncate">{currentTrack.artist}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => toggleFavorite(currentTrack.id)}>
                <Star
                  className={`w-6 h-6 ${currentTrack.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-white/60'}`}
                />
              </button>
              <button onClick={() => setShowOptions(true)}>
                <MoreVertical className="w-6 h-6 text-white/60" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-5 py-3">
          <div
            className="h-1 bg-white/20 rounded-full cursor-pointer overflow-hidden"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-white rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/50 mt-2 font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>-{formatTime(remaining)}</span>
          </div>
        </div>

        {/* Main Controls - large */}
        <div className="flex items-center justify-center gap-12 py-4 px-5">
          <button
            onClick={prevTrack}
            className="w-14 h-14 flex items-center justify-center"
          >
            <SkipBack className="w-10 h-10 text-white" fill="currentColor" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="w-14 h-14 text-white" fill="currentColor" />
            ) : (
              <Play className="w-14 h-14 text-white ml-1" fill="currentColor" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="w-14 h-14 flex items-center justify-center"
          >
            <SkipForward className="w-10 h-10 text-white" fill="currentColor" />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="px-5 pb-4 flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-white/40 flex-shrink-0" />
          <div
            className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer overflow-hidden"
            onClick={handleVolumeClick}
          >
            <div
              className="h-full bg-white/60 rounded-full"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-center gap-16 pb-6 pb-safe">
          <button
            onClick={toggleShuffle}
            className={`${shuffle ? 'text-white' : 'text-white/40'}`}
          >
            <Shuffle className="w-5 h-5" />
          </button>
          <button
            onClick={toggleRepeat}
            className={`relative ${repeat !== 'off' ? 'text-white' : 'text-white/40'}`}
          >
            <Repeat className="w-5 h-5" />
            {repeat === 'one' && (
              <span className="absolute text-[8px] font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-0.5">1</span>
            )}
          </button>
          <button className="text-white/40">
            <ListMusic className="w-5 h-5" />
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
