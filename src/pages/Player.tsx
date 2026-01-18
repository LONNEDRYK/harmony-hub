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
  Sliders
} from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useState, useEffect, useRef } from 'react';
import TrackOptionsSheet from '@/components/TrackOptionsSheet';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getLyricsForTrack = () => {
  return [
    { time: 0, text: "🎵 Intro musicale 🎵" },
    { time: 10, text: "Les premières notes résonnent" },
    { time: 18, text: "La mélodie prend son envol" },
    { time: 26, text: "Chaque son raconte une histoire" },
    { time: 34, text: "La musique nous transporte" },
    { time: 42, text: "Dans un monde de sensations" },
    { time: 50, text: "Les émotions se libèrent" },
    { time: 58, text: "Au rythme de nos cœurs" },
    { time: 66, text: "La musique nous unit" },
    { time: 74, text: "Dans cette harmonie parfaite" },
    { time: 82, text: "🎵 Outro 🎵" },
  ];
};

const Player = () => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  
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

  const lyrics = currentTrack ? getLyricsForTrack() : [];

  useEffect(() => {
    if (!currentTrack || lyrics.length === 0) return;
    
    const index = lyrics.findIndex((lyric, i) => {
      const nextLyric = lyrics[i + 1];
      if (!nextLyric) return currentTime >= lyric.time;
      return currentTime >= lyric.time && currentTime < nextLyric.time;
    });
    
    if (index !== -1) {
      setCurrentLyricIndex(index);
    }
  }, [currentTime, lyrics]);

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
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Blue gradient background with wave effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-500 to-blue-700">
        {/* Wave blur elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-sky-300/40 to-transparent blur-3xl" />
          <div className="absolute top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 -right-20 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 left-10 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-sky-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
          
          {/* Horizontal blur lines like waves */}
          <div className="absolute top-1/4 left-0 right-0 h-px bg-white/10 blur-sm" />
          <div className="absolute top-1/3 left-0 right-0 h-px bg-white/5 blur-md" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 blur-lg" />
        </div>
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col px-6 pt-safe">
        {/* Header */}
        <header className="flex items-center justify-between py-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center"
          >
            <ChevronDown className="w-6 h-6 text-white" />
          </button>
          <div className="text-center flex-1 px-4">
            <p className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-medium">
              Now Playing
            </p>
          </div>
          <button 
            onClick={() => setShowOptions(true)}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center"
          >
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
        </header>

        {/* Album Art */}
        <div className="flex-1 flex items-center justify-center py-4 min-h-0">
          <div className="relative w-full max-w-[280px] aspect-square">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full rounded-3xl object-cover shadow-2xl"
              style={{
                boxShadow: '0 30px 80px -15px rgba(0,0,0,0.5)',
              }}
            />
          </div>
        </div>

        {/* Track Info & Favorite */}
        <div className="flex items-center justify-between py-4">
          <div className="flex-1 min-w-0 pr-4">
            <h1 className="text-2xl font-bold text-white truncate">{currentTrack.title}</h1>
            <p className="text-white/60 text-base truncate">{currentTrack.artist}</p>
          </div>
          <button
            onClick={() => toggleFavorite(currentTrack.id)}
            className="w-10 h-10 flex items-center justify-center"
          >
            <Heart 
              className={`w-6 h-6 ${currentTrack.isFavorite ? 'text-red-400 fill-red-400' : 'text-white/60'}`}
            />
          </button>
        </div>

        {/* Lyrics Preview */}
        {showLyrics && lyrics[currentLyricIndex] && (
          <div className="py-2">
            <p className="text-white/80 text-sm text-center italic">
              {lyrics[currentLyricIndex].text}
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="py-3">
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
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between py-6">
          <button
            onClick={toggleShuffle}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${shuffle ? 'text-white' : 'text-white/40'}`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button 
            onClick={prevTrack} 
            className="w-14 h-14 flex items-center justify-center"
          >
            <SkipBack className="w-8 h-8 text-white" fill="currentColor" />
          </button>

          <button
            onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-9 h-9 text-blue-600" fill="currentColor" />
            ) : (
              <Play className="w-9 h-9 text-blue-600 ml-1" fill="currentColor" />
            )}
          </button>

          <button 
            onClick={nextTrack} 
            className="w-14 h-14 flex items-center justify-center"
          >
            <SkipForward className="w-8 h-8 text-white" fill="currentColor" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`w-10 h-10 rounded-full flex items-center justify-center relative ${repeat !== 'off' ? 'text-white' : 'text-white/40'}`}
          >
            <Repeat className="w-5 h-5" />
            {repeat === 'one' && (
              <span className="absolute text-[8px] font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-0.5">1</span>
            )}
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-center gap-12 py-4 pb-safe">
          <button 
            onClick={() => setShowLyrics(!showLyrics)}
            className={`flex flex-col items-center gap-1 ${showLyrics ? 'text-white' : 'text-white/50'}`}
          >
            <Sliders className="w-5 h-5" />
          </button>
          
          <button className="flex flex-col items-center gap-1 text-white/50">
            <ListMusic className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Full Lyrics Overlay */}
      {showLyrics && (
        <div 
          className="absolute inset-0 bg-blue-900/95 backdrop-blur-xl flex flex-col z-40 animate-fade-in"
          onClick={() => setShowLyrics(false)}
        >
          <div className="flex items-center justify-between p-6 pt-safe">
            <button
              onClick={() => setShowLyrics(false)}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <ChevronDown className="w-6 h-6 text-white" />
            </button>
            <span className="font-semibold text-white">Lyrics</span>
            <div className="w-10" />
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center px-8 pb-32">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-20 h-20 rounded-2xl mb-6 shadow-xl"
            />
            <div className="space-y-4 text-center max-w-xs">
              {lyrics.map((lyric, i) => {
                const isActive = i === currentLyricIndex;
                const isPast = i < currentLyricIndex;
                return (
                  <p 
                    key={lyric.time}
                    className={`transition-all duration-500 ${
                      isActive 
                        ? 'text-white text-2xl font-bold scale-105' 
                        : isPast 
                          ? 'text-white/20 text-lg'
                          : 'text-white/40 text-lg'
                    }`}
                  >
                    {lyric.text}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Mini Player in Lyrics View */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-safe bg-gradient-to-t from-blue-900 to-transparent">
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-14 h-14 rounded-full bg-white flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-blue-600" fill="currentColor" />
                ) : (
                  <Play className="w-6 h-6 text-blue-600 ml-0.5" fill="currentColor" />
                )}
              </button>
              <div className="flex-1">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
