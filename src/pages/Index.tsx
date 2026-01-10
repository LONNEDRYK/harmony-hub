import { useNavigate } from 'react-router-dom';
import { Play, ChevronRight } from 'lucide-react';
import AlbumCarousel from '@/components/AlbumCarousel';
import TrackCard from '@/components/TrackCard';
import { useMusic } from '@/contexts/MusicContext';
import logo from '@/assets/logo.png';

const Index = () => {
  const navigate = useNavigate();
  const { tracks, currentTrack, isPlaying, togglePlay, playTrack } = useMusic();

  const favorites = tracks.filter((t) => t.isFavorite);
  const recentTracks = tracks.slice(0, 6);

  return (
    <div className="min-h-screen pb-36 bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-5 pt-safe">
        <div 
          className="w-11 h-11 rounded-full overflow-hidden cursor-pointer ring-2 ring-primary/30"
          onClick={() => navigate('/profile')}
        >
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <img 
          src={logo} 
          alt="MusicFlow" 
          className="h-9 w-auto"
        />
        <div className="w-11" />
      </header>

      {/* Hero Section */}
      <section className="px-5 py-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          <div className="relative">
            <h1 className="text-2xl font-bold mb-2">Bonjour 👋</h1>
            <p className="text-muted-foreground mb-5">
              {tracks.length > 0 
                ? `${tracks.length} morceaux dans votre collection`
                : 'Commencez par importer de la musique'
              }
            </p>
            <button
              onClick={() => {
                if (tracks.length > 0) {
                  if (currentTrack) {
                    togglePlay();
                  } else {
                    playTrack(tracks[0]);
                  }
                } else {
                  navigate('/library');
                }
              }}
              className="flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold shadow-lg shadow-primary/30"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              {tracks.length > 0 
                ? (isPlaying && currentTrack ? 'En lecture' : 'Lecture aléatoire')
                : 'Importer'
              }
            </button>
          </div>
        </div>
      </section>

      {/* Album Carousel */}
      {tracks.length > 0 && <AlbumCarousel />}

      {/* Quick Play Section */}
      {tracks.length > 0 && (
        <section className="px-5 py-4">
          <div className="grid grid-cols-2 gap-3">
            {tracks.slice(0, 4).map((track) => (
              <button
                key={track.id}
                onClick={() => playTrack(track)}
                className="flex items-center gap-3 bg-card/60 rounded-xl p-3 text-left transition-colors hover:bg-card"
              >
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{track.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <section className="py-5">
          <div className="flex items-center justify-between px-5 mb-4">
            <h2 className="text-xl font-bold">Favoris</h2>
            <button
              onClick={() => navigate('/library?tab=favorites')}
              className="text-sm text-muted-foreground flex items-center gap-1"
            >
              Voir tout <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto px-5 no-scrollbar">
            {favorites.slice(0, 5).map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Section */}
      {recentTracks.length > 0 && (
        <section className="py-5">
          <div className="flex items-center justify-between px-5 mb-4">
            <h2 className="text-xl font-bold">Récemment ajoutés</h2>
            <button
              onClick={() => navigate('/library')}
              className="text-sm text-muted-foreground flex items-center gap-1"
            >
              Voir tout <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto px-5 no-scrollbar">
            {recentTracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {tracks.length === 0 && (
        <section className="px-5 py-8 text-center">
          <div className="bg-card/40 rounded-3xl p-8">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-5">
              <Play className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Votre bibliothèque est vide</h3>
            <p className="text-muted-foreground mb-5">
              Importez vos morceaux préférés pour commencer
            </p>
            <button
              onClick={() => navigate('/library')}
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold"
            >
              Importer de la musique
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
