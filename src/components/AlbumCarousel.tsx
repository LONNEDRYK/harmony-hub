import { useState, useEffect } from 'react';
import { useMusic, Track } from '@/contexts/MusicContext';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

const AlbumCarousel = () => {
  const { tracks, playTrack, currentTrack, isPlaying } = useMusic();
  const [activeIndex, setActiveIndex] = useState(0);

  const displayTracks = tracks.length > 0 ? tracks : placeholderTracks;

  useEffect(() => {
    if (displayTracks.length > 0) {
      setActiveIndex(Math.min(activeIndex, displayTracks.length - 1));
    }
  }, [displayTracks.length]);

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % displayTracks.length);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + displayTracks.length) % displayTracks.length);
  };

  const handlePlay = () => {
    if (tracks.length > 0) {
      playTrack(tracks[activeIndex]);
    }
  };

  const getTransform = (index: number) => {
    const diff = index - activeIndex;
    const absPos = Math.abs(diff);

    if (absPos > 1) return { display: 'none' };

    const translateX = diff * 70;
    const scale = absPos === 0 ? 1 : 0.75;
    const zIndex = absPos === 0 ? 10 : 5;
    const opacity = absPos === 0 ? 1 : 0.5;

    return {
      transform: `translateX(${translateX}%) scale(${scale})`,
      zIndex,
      opacity,
    };
  };

  const activeTrack = displayTracks[activeIndex];

  return (
    <div className="relative py-8">
      <div className="relative h-64 flex items-center justify-center">
        {displayTracks.map((track, index) => {
          const style = getTransform(index);
          if (style.display === 'none') return null;

          return (
            <div
              key={track.id}
              className="absolute w-48 h-48 transition-all duration-500 ease-out cursor-pointer"
              style={{
                transform: style.transform,
                zIndex: style.zIndex,
                opacity: style.opacity,
              }}
              onClick={() => setActiveIndex(index)}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden album-shadow">
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
                {index === activeIndex && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay();
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center glow-effect">
                      <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
                    </div>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-4">
        <h2 className="text-xl font-bold truncate px-8">{activeTrack?.title}</h2>
        <p className="text-muted-foreground">{activeTrack?.artist}</p>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={goPrev}
          className="w-10 h-10 rounded-full glass-button flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goNext}
          className="w-10 h-10 rounded-full glass-button flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const placeholderTracks: Track[] = [
  {
    id: 'p1',
    title: 'Sometimes...',
    artist: 'Tyler, The Creator',
    album: 'Flower Boy',
    duration: 180,
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    url: '',
    isFavorite: false,
  },
  {
    id: 'p2',
    title: 'Straight Outta Compton',
    artist: 'N.W.A',
    album: 'Straight Outta Compton',
    duration: 240,
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
    url: '',
    isFavorite: false,
  },
  {
    id: 'p3',
    title: 'Whole Lotta Red',
    artist: 'Playboi Carti',
    album: 'Whole Lotta Red',
    duration: 200,
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    url: '',
    isFavorite: false,
  },
];

export default AlbumCarousel;
