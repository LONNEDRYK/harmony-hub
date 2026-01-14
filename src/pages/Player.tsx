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
  Camera
} from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useState, useEffect, useRef } from 'react';
import TrackOptionsSheet from '@/components/TrackOptionsSheet';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Real lyrics database simulation
const getLyricsForTrack = (track: { title: string; artist: string }) => {
  const lyricsDatabase: Record<string, { time: number; text: string }[]> = {
    default: [
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
    ],
  };
  
  return lyricsDatabase.default;
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

  const lyrics = currentTrack ? getLyricsForTrack(currentTrack) : [];

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
      // In a real app, you'd update the track cover
      console.log('New cover:', file);
    }
  };

  const gradientColors = [
    'from-violet-600/80 via-purple-500/60 to-fuchsia-400/70',
    'from-blue-600/80 via-cyan-500/60 to-teal-400/70',
    'from-orange-600/80 via-red-500/60 to-pink-400/70',
    'from-emerald-600/80 via-green-500/60 to-lime-400/70',
  ];
  const gradientIndex = currentTrack.id.charCodeAt(0) % gradientColors.length;

  return (
    <div className="h-screen flex flex-col bg-black relative overflow-hidden">
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${gradientColors[gradientIndex]} opacity-50`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative flex-1 flex flex-col p-5 pt-safe">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center"
          >
            <ChevronDown className="w-7 h-7 text-white" />
          </button>
          <div className="text-center flex-1">
            <p className="text-[10px] text-white/60 uppercase tracking-widest font-medium">
              En lecture
            </p>
            <p className="text-xs text-white font-medium mt-0.5 truncate max-w-[200px] mx-auto">
              {currentTrack.album || 'Ma Bibliothèque'}
            </p>
          </div>
          <button 
            onClick={() => setShowOptions(true)}
            className="w-10 h-10 flex items-center justify-center"
          >
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
        </header>

        {/* Album Art */}
        <div className="flex-1 flex items-center justify-center py-2">
          <div className="relative w-full max-w-[280px] aspect-square">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full rounded-3xl object-cover shadow-2xl"
            />
            {/* Change cover button */}
            <button
              onClick={() => coverInputRef.current?.click()}
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center"
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

        {/* Track Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 min-w-0 pr-4">
            <h1 className="text-xl font-bold text-white truncate">{currentTrack.title}</h1>
            <p className="text-white/60 text-sm truncate">{currentTrack.artist}</p>
          </div>
          <button
            onClick={() => toggleFavorite(currentTrack.id)}
            className="p-2 transition-transform active:scale-90"
          >
            <Heart 
              className={`w-6 h-6 ${currentTrack.isFavorite ? 'text-red-500 fill-red-500' : 'text-white/60'}`}
            />
          </button>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <div 
            className="h-1.5 bg-white/20 rounded-full cursor-pointer overflow-hidden"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-white rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg -mr-2" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-white/50 mt-2 font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={toggleShuffle}
            className={`p-3 ${shuffle ? 'text-primary' : 'text-white/50'}`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button onClick={prevTrack} className="p-2">
            <SkipBack className="w-8 h-8 text-white" fill="currentColor" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 text-black" fill="currentColor" />
            ) : (
              <Play className="w-7 h-7 text-black ml-1" fill="currentColor" />
            )}
          </button>

          <button onClick={nextTrack} className="p-2">
            <SkipForward className="w-8 h-8 text-white" fill="currentColor" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-3 ${repeat !== 'off' ? 'text-primary' : 'text-white/50'}`}
          >
            <Repeat className="w-5 h-5" />
            {repeat === 'one' && (
              <span className="absolute text-[8px] font-bold">1</span>
            )}
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-around py-2">
          <button 
            onClick={() => setShowLyrics(!showLyrics)}
            className={`flex flex-col items-center gap-1 ${showLyrics ? 'text-primary' : 'text-white/50'}`}
          >
            <Mic2 className="w-5 h-5" />
            <span className="text-[10px]">Paroles</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-white/50">
            <Share2 className="w-5 h-5" />
            <span className="text-[10px]">Partager</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-white/50">
            <ListMusic className="w-5 h-5" />
            <span className="text-[10px]">File</span>
          </button>
        </div>

        {/* Lyrics Card */}
        {showLyrics && (
          <div 
            className="mt-3 bg-white/10 backdrop-blur-lg rounded-2xl p-4 animate-fade-in max-h-40 overflow-hidden"
            onClick={() => setShowLyrics(false)}
          >
            <div className="flex items-center gap-2 mb-3">
              <Mic2 className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary">Paroles</span>
            </div>
            <div className="space-y-2">
              {lyrics.slice(Math.max(0, currentLyricIndex - 1), currentLyricIndex + 4).map((lyric, i) => {
                const isActive = lyrics[currentLyricIndex] === lyric;
                return (
                  <p 
                    key={lyric.time}
                    className={`text-sm transition-all duration-300 ${
                      isActive 
                        ? 'text-white font-bold text-base' 
                        : 'text-white/40'
                    }`}
                  >
                    {lyric.text}
                  </p>
                );
              })}
            </div>
          </div>
        )}
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
