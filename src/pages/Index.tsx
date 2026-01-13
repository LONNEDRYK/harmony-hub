import { useNavigate } from 'react-router-dom';
import { Play, ChevronRight, Sparkles, TrendingUp, Clock, Heart } from 'lucide-react';
import AlbumCarousel from '@/components/AlbumCarousel';
import TrackCard from '@/components/TrackCard';
import { useMusic } from '@/contexts/MusicContext';
import logo from '@/assets/logo.png';

const Index = () => {
  const navigate = useNavigate();
  const { tracks, currentTrack, isPlaying, togglePlay, playTrack } = useMusic();

  const favorites = tracks.filter((t) => t.isFavorite);
  const recentTracks = tracks.slice(0, 6);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}min`;
    return `${mins} min`;
  };

  const totalDuration = tracks.reduce((acc, t) => acc + t.duration, 0);

  return (
    <div className="min-h-screen pb-36 bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-5 pt-safe">
        <div 
          className="relative cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/50 ring-offset-2 ring-offset-background">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
        </div>
        <img 
          src={logo} 
          alt="MusicFlow" 
          className="h-10 w-auto"
        />
        <div className="w-12" />
      </header>

      {/* Hero Section - Premium Look */}
      <section className="px-5 py-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/30 via-primary/10 to-background p-6">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm text-primary font-medium">Bienvenue</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Bonjour 👋</h1>
            <p className="text-muted-foreground mb-6">
              {tracks.length > 0 
                ? `${tracks.length} morceaux • ${formatDuration(totalDuration)}`
                : 'Commencez votre aventure musicale'
              }
            </p>
            
            <div className="flex items-center gap-3">
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
                className="flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3.5 rounded-full font-semibold shadow-xl shadow-primary/40 transition-transform hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5" fill="currentColor" />
                {tracks.length > 0 
                  ? (isPlaying && currentTrack ? 'En lecture' : 'Écouter')
                  : 'Importer'
                }
              </button>
              
              {tracks.length > 0 && (
                <button
                  onClick={() => navigate('/library')}
                  className="px-6 py-3.5 rounded-full bg-white/10 font-medium transition-colors hover:bg-white/20"
                >
                  Bibliothèque
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      {tracks.length > 0 && (
        <section className="px-5 py-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card/60 backdrop-blur rounded-2xl p-4 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-2 text-green-500" />
              <p className="text-xl font-bold">{tracks.length}</p>
              <p className="text-xs text-muted-foreground">Morceaux</p>
            </div>
            <div className="bg-card/60 backdrop-blur rounded-2xl p-4 text-center">
              <Heart className="w-5 h-5 mx-auto mb-2 text-red-500" />
              <p className="text-xl font-bold">{favorites.length}</p>
              <p className="text-xs text-muted-foreground">Favoris</p>
            </div>
            <div className="bg-card/60 backdrop-blur rounded-2xl p-4 text-center">
              <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-xl font-bold">{formatDuration(totalDuration).split(' ')[0]}</p>
              <p className="text-xs text-muted-foreground">Durée</p>
            </div>
          </div>
        </section>
      )}

      {/* Album Carousel */}
      {tracks.length > 0 && <AlbumCarousel />}

      {/* Quick Play Grid */}
      {tracks.length > 0 && (
        <section className="px-5 py-4">
          <h2 className="text-lg font-bold mb-4">Accès rapide</h2>
          <div className="grid grid-cols-2 gap-3">
            {tracks.slice(0, 4).map((track) => (
              <button
                key={track.id}
                onClick={() => playTrack(track)}
                className="flex items-center gap-3 bg-card/80 backdrop-blur rounded-xl p-3 text-left transition-all hover:bg-card hover:scale-[1.02] active:scale-[0.98]"
              >
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-14 h-14 rounded-xl object-cover shadow-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{track.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
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
            <div>
              <h2 className="text-xl font-bold">Vos favoris</h2>
              <p className="text-sm text-muted-foreground">{favorites.length} titres</p>
            </div>
            <button
              onClick={() => navigate('/library?tab=favorites')}
              className="flex items-center gap-1 text-primary font-medium"
            >
              Tout voir <ChevronRight className="w-4 h-4" />
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
            <div>
              <h2 className="text-xl font-bold">Récemment ajoutés</h2>
              <p className="text-sm text-muted-foreground">Vos derniers imports</p>
            </div>
            <button
              onClick={() => navigate('/library')}
              className="flex items-center gap-1 text-primary font-medium"
            >
              Tout voir <ChevronRight className="w-4 h-4" />
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
          <div className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur rounded-3xl p-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mx-auto mb-6">
              <Play className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Votre bibliothèque est vide</h3>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
              Importez vos morceaux préférés depuis votre appareil pour commencer
            </p>
            <button
              onClick={() => navigate('/library')}
              className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold shadow-xl shadow-primary/30 transition-transform hover:scale-105"
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