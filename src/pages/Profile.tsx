import { useNavigate } from 'react-router-dom';
import { Settings, Music, Heart, Clock, ChevronRight } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

const Profile = () => {
  const navigate = useNavigate();
  const { tracks } = useMusic();

  const favorites = tracks.filter((t) => t.isFavorite);
  const totalDuration = tracks.reduce((acc, t) => acc + t.duration, 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  const stats = [
    { icon: Music, label: 'Morceaux', value: tracks.length },
    { icon: Heart, label: 'Favoris', value: favorites.length },
    { icon: Clock, label: 'Durée', value: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m` },
  ];

  return (
    <div className="min-h-screen pb-36 bg-background">
      <header className="p-4 pt-safe flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profil</h1>
        <button
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full glass-button flex items-center justify-center"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      <div className="px-4">
        {/* Profile Card */}
        <div className="glass-card p-6 text-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-primary/30">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-bold mb-1">Utilisateur</h2>
          <p className="text-muted-foreground">Mélomane passionné</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass-card p-4 text-center">
              <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="glass-card overflow-hidden">
          <button
            onClick={() => navigate('/library')}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Music className="w-5 h-5 text-primary" />
              <span>Ma bibliothèque</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="h-px bg-border mx-4" />
          <button
            onClick={() => navigate('/library?tab=favorites')}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-primary" />
              <span>Mes favoris</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
