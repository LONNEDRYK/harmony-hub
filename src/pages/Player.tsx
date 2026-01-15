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
  Share2,
  ListMusic,
  Mic2,
  Camera,
  Volume2
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
  const coverInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('New cover:', file);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black relative overflow-hidden">
      {/* Album Art Background Blur */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url(${currentTrack.cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(80px) saturate(1.5)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black" />

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
            <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-medium">
              En lecture
            </p>
            <p className="text-xs text-white/80 font-medium mt-0.5 truncate">
              {currentTrack.album || 'Ma Bibliothèque'}
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
          <div className="relative w-full max-w-[300px] aspect-square">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full rounded-[32px] object-cover shadow-2xl"
              style={{
                boxShadow: '0 30px 60px -15px rgba(0,0,0,0.8)',
              }}
            />
            <button
              onClick={() => coverInputRef.current?.click()}
              className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 flex items-center justify-center active:scale-90 transition-transform"
            >
              <Camera className="w-5 h-5 text-white/80" />
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Track Info & Favorite */}
        <div className="flex items-center justify-between py-4">
          <div className="flex-1 min-w-0 pr-4">
            <h1 className="text-2xl font-bold text-white truncate">{currentTrack.title}</h1>
            <p className="text-white/50 text-base truncate">{currentTrack.artist}</p>
          </div>
          <button
            onClick={() => toggleFavorite(currentTrack.id)}
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-transform"
          >
            <Heart 
              className={`w-6 h-6 ${currentTrack.isFavorite ? 'text-red-500 fill-red-500' : 'text-white/60'}`}
            />
          </button>
        </div>

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
          <div className="flex justify-between text-xs text-white/40 mt-2 font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between py-4">
          <button
            onClick={toggleShuffle}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${shuffle ? 'bg-primary/20 text-primary' : 'text-white/40'}`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button 
            onClick={prevTrack} 
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-transform"
          >
            <SkipBack className="w-6 h-6 text-white" fill="currentColor" />
          </button>

          <button
            onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-black" fill="currentColor" />
            ) : (
              <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
            )}
          </button>

          <button 
            onClick={nextTrack} 
            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-transform"
          >
            <SkipForward className="w-6 h-6 text-white" fill="currentColor" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`w-12 h-12 rounded-full flex items-center justify-center relative ${repeat !== 'off' ? 'bg-primary/20 text-primary' : 'text-white/40'}`}
          >
            <Repeat className="w-5 h-5" />
            {repeat === 'one' && (
              <span className="absolute text-[8px] font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-0.5">1</span>
            )}
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-center gap-8 py-4 pb-safe">
          <button 
            onClick={() => setShowLyrics(!showLyrics)}
            className={`flex flex-col items-center gap-1.5 ${showLyrics ? 'text-primary' : 'text-white/40'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${showLyrics ? 'bg-primary/20' : 'bg-white/10'}`}>
              <Mic2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">Paroles</span>
          </button>
          
          <button className="flex flex-col items-center gap-1.5 text-white/40">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">Volume</span>
          </button>
          
          <button className="flex flex-col items-center gap-1.5 text-white/40">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">Partager</span>
          </button>
          
          <button className="flex flex-col items-center gap-1.5 text-white/40">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <ListMusic className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">File</span>
          </button>
        </div>
      </div>

      {/* Lyrics Overlay */}
      {showLyrics && (
        <div 
          className="absolute inset-0 bg-black/95 backdrop-blur-xl flex flex-col z-40 animate-fade-in"
          onClick={() => setShowLyrics(false)}
        >
          <div className="flex items-center justify-between p-6 pt-safe">
            <button
              onClick={() => setShowLyrics(false)}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <ChevronDown className="w-6 h-6 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <Mic2 className="w-5 h-5 text-primary" />
              <span className="font-semibold">Paroles</span>
            </div>
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

          {/* Mini Player */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-safe bg-gradient-to-t from-black to-transparent">
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-14 h-14 rounded-full bg-white flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-black" fill="currentColor" />
                ) : (
                  <Play className="w-6 h-6 text-black ml-0.5" fill="currentColor" />
                )}
              </button>
              <div className="flex-1">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
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
