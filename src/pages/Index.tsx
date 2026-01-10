import { useNavigate } from 'react-router-dom';
import { Settings, Play, ChevronRight } from 'lucide-react';
import AlbumCarousel from '@/components/AlbumCarousel';
import TrackCard from '@/components/TrackCard';
import { useMusic } from '@/contexts/MusicContext';

const Index = () => {
  const navigate = useNavigate();
  const { tracks, currentTrack, isPlaying, togglePlay, playTrack } = useMusic();

  const favorites = tracks.filter((t) => t.isFavorite);
  const recentTracks = tracks.slice(0, 6);

  return (
    <div className="min-h-screen pb-36 bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 pt-safe">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
            alt="Profile"
            className="w-full h-full object-cover"
            onClick={() => navigate('/profile')}
          />
        </div>
        <h1 className="text-lg font-bold gradient-text">MusicFlow</h1>
        <button
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full glass-button flex items-center justify-center"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Album Carousel */}
      <AlbumCarousel />

      {/* Your Rhythm Section */}
      <section className="px-4 py-4">
        <div className="glass-card p-4 flex items-center gap-4">
          <button
            onClick={() => {
              if (tracks.length > 0) {
                if (currentTrack) {
                  togglePlay();
                } else {
                  playTrack(tracks[0]);
                }
              }
            }}
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center glow-effect flex-shrink-0"
          >
            <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
          </button>
          <div className="flex-1">
            <p className="font-semibold">Your rhythm</p>
            <p className="text-sm text-muted-foreground">
              {tracks.length > 0 ? `${tracks.length} morceaux` : 'Importez des chansons'}
            </p>
          </div>
        </div>
      </section>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <section className="py-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-lg font-bold">Favoris</h2>
            <button
              onClick={() => navigate('/library?tab=favorites')}
              className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
            >
              Voir tout <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar">
            {favorites.slice(0, 5).map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Section */}
      {recentTracks.length > 0 && (
        <section className="py-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-lg font-bold">Récemment ajoutés</h2>
            <button
              onClick={() => navigate('/library')}
              className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
            >
              Voir tout <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar">
            {recentTracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {tracks.length === 0 && (
        <section className="px-4 py-8 text-center">
          <div className="glass-card p-8">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Votre bibliothèque est vide</h3>
            <p className="text-muted-foreground mb-4">
              Importez vos morceaux préférés pour commencer à écouter
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
