import { useNavigate } from 'react-router-dom';
import { Play, ChevronRight, Bell, Sparkles } from 'lucide-react';
import AlbumCarousel from '@/components/AlbumCarousel';
import TrackCard from '@/components/TrackCard';
import { useMusic } from '@/contexts/MusicContext';
import logo from '@/assets/logo.png';

const Index = () => {
  const navigate = useNavigate();
  const { tracks, currentTrack, isPlaying, togglePlay, playTrack, userProfile } = useMusic();

  const favorites = tracks.filter((t) => t.isFavorite);
  const recentTracks = tracks.slice(0, 6);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div className="min-h-screen pb-36 bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-5 pt-safe">
        <div 
          className="relative cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-primary/40">
            <img
              src={userProfile.avatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <img 
          src={logo} 
          alt="MusicFlow" 
          className="h-8 w-auto"
        />
        
        <button className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      {/* Greeting Section */}
      <section className="px-5 py-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-medium">MusicFlow</span>
        </div>
        <h1 className="text-3xl font-bold">{getGreeting()} 👋</h1>
        <p className="text-muted-foreground mt-1">
          {tracks.length > 0 
            ? `Prêt pour ${tracks.length} morceaux ?`
            : 'Commencez votre aventure musicale'
          }
        </p>
      </section>

      {/* Quick Actions */}
      <section className="px-5 py-4">
        <div className="flex gap-3">
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
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-2xl font-semibold shadow-lg shadow-primary/30"
          >
            <Play className="w-5 h-5" fill="currentColor" />
            {tracks.length > 0 
              ? (isPlaying && currentTrack ? 'En lecture' : 'Lecture')
              : 'Importer'
            }
          </button>
          <button
            onClick={() => navigate('/library')}
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 py-4 rounded-2xl font-semibold"
          >
            Bibliothèque
          </button>
        </div>
      </section>

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
                className="flex items-center gap-3 bg-white/5 rounded-xl p-3 text-left transition-all hover:bg-white/10 active:scale-[0.98]"
              >
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{track.title}</p>
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
            <h2 className="text-lg font-bold">Vos favoris</h2>
            <button
              onClick={() => navigate('/library?tab=favorites')}
              className="flex items-center gap-1 text-primary text-sm font-medium"
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
            <h2 className="text-lg font-bold">Récemment ajoutés</h2>
            <button
              onClick={() => navigate('/library')}
              className="flex items-center gap-1 text-primary text-sm font-medium"
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
          <div className="bg-white/5 rounded-3xl p-10">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-5">
              <Play className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Bibliothèque vide</h3>
            <p className="text-muted-foreground mb-6">
              Importez vos morceaux préférés pour commencer
            </p>
            <button
              onClick={() => navigate('/library')}
              className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold"
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