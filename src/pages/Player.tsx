import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
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
  MessageCircle,
  Radio,
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
      {/* Album art as full background with BLUR */}
      <div className="absolute inset-0">
        <img
          src={currentTrack.cover}
          alt=""
          className="w-full h-full object-cover scale-110 blur-md"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Album art centered (non-blurred) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={currentTrack.cover}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dark gradient from bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

      {/* Content */}
      <div className="relative flex-1 flex flex-col">
        {/* Header - small notch bar */}
        <header className="flex items-center justify-center px-5 py-3 pt-safe">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur flex items-center justify-center"
          >
            <ChevronDown className="w-5 h-5 text-white" />
          </button>
          <div className="w-10 h-1 rounded-full bg-white/30" />
        </header>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Track info */}
        <div className="px-5 pb-1">
          <div className="flex items-end justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h1 className="text-xl font-bold text-white truncate">{currentTrack.title}</h1>
              <p className="text-white/60 text-sm truncate">{currentTrack.artist}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <button onClick={() => toggleFavorite(currentTrack.id)}>
                <Star
                  className={`w-5 h-5 ${currentTrack.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-white/50'}`}
                />
              </button>
              <button onClick={() => setShowOptions(true)}>
                <MoreVertical className="w-5 h-5 text-white/50" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-5 py-2.5">
          <div
            className="h-[3px] bg-white/20 rounded-full cursor-pointer overflow-hidden"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-white rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/40 mt-1.5 font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>-{formatTime(remaining)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-10 py-3 px-5">
          <button onClick={prevTrack} className="w-12 h-12 flex items-center justify-center">
            <SkipBack className="w-8 h-8 text-white" fill="currentColor" />
          </button>
          <button onClick={togglePlay} className="w-14 h-14 flex items-center justify-center">
            {isPlaying ? (
              <Pause className="w-12 h-12 text-white" fill="currentColor" />
            ) : (
              <Play className="w-12 h-12 text-white ml-1" fill="currentColor" />
            )}
          </button>
          <button onClick={nextTrack} className="w-12 h-12 flex items-center justify-center">
            <SkipForward className="w-8 h-8 text-white" fill="currentColor" />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="px-5 pb-3 flex items-center gap-2.5">
          <Volume2 className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
          <div
            className="flex-1 h-[3px] bg-white/15 rounded-full cursor-pointer overflow-hidden"
            onClick={handleVolumeClick}
          >
            <div
              className="h-full bg-white/50 rounded-full"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>

        {/* Bottom icons row - chat, broadcast/radio, shuffle/repeat, queue */}
        <div className="flex items-center justify-center gap-12 pb-5 pb-safe">
          <button className="text-white/40">
            <MessageCircle className="w-4.5 h-4.5" />
          </button>
          <button className="text-white/40">
            <Radio className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={toggleShuffle}
            className={`${shuffle ? 'text-white' : 'text-white/40'}`}
          >
            <Shuffle className="w-4.5 h-4.5" />
          </button>
          <button className="text-white/40">
            <ListMusic className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <TrackOptionsSheet
        track={currentTrack}
        isOpen={showOptions}
        onClose={() => setShowOptions(false)}
      />
    </div>
  );
};

export default Player;
