import { useNavigate } from 'react-router-dom';
import { Settings, Music, Heart, Clock, Headphones, ChevronRight } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

const Profile = () => {
  const navigate = useNavigate();
  const { tracks } = useMusic();

  const favorites = tracks.filter((t) => t.isFavorite);
  const totalDuration = tracks.reduce((acc, t) => acc + t.duration, 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="min-h-screen pb-36 bg-background">
      {/* Header with gradient */}
      <div className="relative">
        <div 
          className="absolute inset-0 h-64"
          style={{
            background: 'linear-gradient(180deg, hsl(var(--primary) / 0.2) 0%, transparent 100%)',
          }}
        />
        
        <header className="relative p-5 pt-safe flex items-center justify-between">
          <h1 className="text-xl font-bold">Profil</h1>
          <button
            onClick={() => navigate('/settings')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <Settings className="w-5 h-5" />
          </button>
        </header>

        {/* Profile Info */}
        <div className="relative px-5 pt-4 pb-8 text-center">
          <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-primary/30 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold mb-1">Utilisateur</h2>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Headphones className="w-4 h-4" />
            Mélomane passionné
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card/60 rounded-2xl p-4 text-center">
            <Music className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{tracks.length}</p>
            <p className="text-xs text-muted-foreground">Morceaux</p>
          </div>
          <div className="bg-card/60 rounded-2xl p-4 text-center">
            <Heart className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{favorites.length}</p>
            <p className="text-xs text-muted-foreground">Favoris</p>
          </div>
          <div className="bg-card/60 rounded-2xl p-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{hours > 0 ? `${hours}h` : `${minutes}m`}</p>
            <p className="text-xs text-muted-foreground">Durée</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-5">
        <div className="bg-card/40 rounded-2xl overflow-hidden">
          <button
            onClick={() => navigate('/library')}
            className="w-full flex items-center justify-between p-4 transition-colors hover:bg-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium">Ma bibliothèque</p>
                <p className="text-sm text-muted-foreground">{tracks.length} morceaux</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <button
            onClick={() => navigate('/library?tab=favorites')}
            className="w-full flex items-center justify-between p-4 transition-colors hover:bg-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-left">
                <p className="font-medium">Mes favoris</p>
                <p className="text-sm text-muted-foreground">{favorites.length} morceaux</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      {tracks.length > 0 && (
        <div className="px-5 mt-6">
          <h3 className="text-lg font-bold mb-4">Dernières écoutes</h3>
          <div className="space-y-3">
            {tracks.slice(0, 3).map((track) => (
              <div
                key={track.id}
                className="flex items-center gap-3 bg-card/40 rounded-xl p-3"
              >
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{track.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
