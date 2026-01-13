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
  Timer,
  Share2,
  ListMusic,
  Disc3,
} from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useState, useEffect } from 'react';
import TrackOptionsSheet from '@/components/TrackOptionsSheet';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Simulated lyrics with timestamps
const getLyricsForTrack = (track: { title: string; artist: string }) => {
  return [
    { time: 0, text: "♪ Instrumental ♪" },
    { time: 15, text: "Première ligne des paroles" },
    { time: 25, text: "Deuxième ligne qui suit" },
    { time: 35, text: "Le rythme continue" },
    { time: 45, text: "La mélodie s'élève" },
    { time: 55, text: "Les mots s'envolent" },
    { time: 65, text: "La musique nous emporte" },
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
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    toggleShuffle,
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

  // Extract dominant color simulation
  const gradientColors = [
    'from-purple-600/90 via-pink-500/70 to-yellow-400/80',
    'from-blue-600/90 via-cyan-500/70 to-green-400/80',
    'from-orange-600/90 via-red-500/70 to-pink-400/80',
  ];
  const gradientIndex = currentTrack.id.charCodeAt(0) % gradientColors.length;

  return (
    <div className="min-h-screen flex flex-col bg-black relative overflow-hidden">
      {/* Dynamic Background Gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b ${gradientColors[gradientIndex]} opacity-60`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

      {/* Content */}
      <div className="relative flex-1 flex flex-col p-5 pt-safe">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center"
          >
            <ChevronDown className="w-7 h-7 text-white" />
          </button>
          <div className="text-center flex-1">
            <p className="text-xs text-white/70 uppercase tracking-widest font-medium">
              Lecture à partir de playlist
            </p>
            <p className="text-sm text-white font-semibold mt-0.5">
              {currentTrack.album || 'Ma Bibliothèque'}
            </p>
          </div>
          <button 
            onClick={() => setShowOptions(true)}
            className="w-10 h-10 flex items-center justify-center"
          >
            <MoreVertical className="w-6 h-6 text-white" />
          </button>
        </header>

        {/* Album Art - Large */}
        <div className="flex-1 flex items-center justify-center py-4">
          <div className="relative w-full max-w-sm aspect-square">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full rounded-2xl object-cover shadow-2xl"
            />
            {isPlaying && (
              <div className="absolute inset-0 rounded-2xl bg-black/10 flex items-center justify-center">
                <Disc3 className="w-12 h-12 text-white/30 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            )}
          </div>
        </div>

        {/* Track Info with Favorite */}
        <div className="flex items-center justify-between mb-4 mt-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white truncate">{currentTrack.title}</h1>
              <p className="text-white/60 truncate">{currentTrack.artist}</p>
            </div>
          </div>
          <button
            onClick={() => toggleFavorite(currentTrack.id)}
            className="p-2 transition-transform active:scale-90"
          >
            {currentTrack.isFavorite ? (
              <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
            ) : (
              <Heart className="w-7 h-7 text-white/60" />
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div 
            className="h-1 bg-white/20 rounded-full cursor-pointer overflow-hidden"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-white rounded-full transition-all duration-100 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-white/50 mt-2 font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Artist Credits */}
        <div className="flex items-center gap-4 mb-6 overflow-x-auto no-scrollbar">
          {currentTrack.artist.split(',').map((artist, i) => (
            <span 
              key={i} 
              className="text-sm font-bold text-white/40 uppercase tracking-wider whitespace-nowrap"
            >
              {artist.trim()}
            </span>
          ))}
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={toggleShuffle}
            className={`p-3 transition-all active:scale-90 ${
              shuffle ? 'text-green-500' : 'text-white/60'
            }`}
          >
            <Shuffle className="w-6 h-6" />
          </button>

          <button
            onClick={prevTrack}
            className="p-2 transition-transform active:scale-90"
          >
            <SkipBack className="w-9 h-9 text-white" fill="currentColor" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl transition-transform active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 text-black" fill="currentColor" />
            ) : (
              <Play className="w-7 h-7 text-black ml-1" fill="currentColor" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-2 transition-transform active:scale-90"
          >
            <SkipForward className="w-9 h-9 text-white" fill="currentColor" />
          </button>

          <button className="p-3 text-white/60 transition-all active:scale-90">
            <Timer className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between py-2">
          <button 
            onClick={() => setShowLyrics(!showLyrics)}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <Disc3 className="w-6 h-6" />
          </button>
          <button className="p-2 text-white/60 hover:text-white transition-colors">
            <Share2 className="w-6 h-6" />
          </button>
          <button className="p-2 text-white/60 hover:text-white transition-colors">
            <ListMusic className="w-6 h-6" />
          </button>
        </div>

        {/* Lyrics Preview Card */}
        {showLyrics && (
          <div 
            className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-5 animate-fade-in cursor-pointer"
            onClick={() => setShowLyrics(false)}
          >
            <h3 className="text-lg font-bold text-white mb-3">Aperçu des paroles</h3>
            <div className="space-y-2">
              {lyrics.slice(Math.max(0, currentLyricIndex - 1), currentLyricIndex + 3).map((lyric, i) => (
                <p 
                  key={lyric.time}
                  className={`text-base transition-all ${
                    lyrics[currentLyricIndex] === lyric 
                      ? 'text-white font-bold text-lg' 
                      : 'text-white/60'
                  }`}
                >
                  {lyric.text}
                </p>
              ))}
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