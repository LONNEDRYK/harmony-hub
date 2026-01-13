import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Music, 
  Heart, 
  Clock, 
  ChevronRight, 
  Crown,
  Disc3,
  ListMusic,
  Download,
  Share2,
  Star,
  TrendingUp
} from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

const Profile = () => {
  const navigate = useNavigate();
  const { tracks, playTrack } = useMusic();

  const favorites = tracks.filter((t) => t.isFavorite);
  const totalDuration = tracks.reduce((acc, t) => acc + t.duration, 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  const menuItems = [
    {
      icon: Music,
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-500',
      label: 'Ma bibliothèque',
      subtitle: `${tracks.length} morceaux`,
      action: () => navigate('/library'),
    },
    {
      icon: Heart,
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-500',
      label: 'Mes favoris',
      subtitle: `${favorites.length} morceaux`,
      action: () => navigate('/library?tab=favorites'),
    },
    {
      icon: ListMusic,
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-500',
      label: 'Mes playlists',
      subtitle: '0 playlists',
      action: () => navigate('/library?tab=playlists'),
    },
    {
      icon: Download,
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-500',
      label: 'Téléchargements',
      subtitle: 'Musique hors ligne',
      action: () => {},
    },
  ];

  return (
    <div className="min-h-screen pb-36 bg-background">
      {/* Header with gradient */}
      <div className="relative">
        <div 
          className="absolute inset-0 h-80"
          style={{
            background: 'linear-gradient(180deg, hsl(var(--primary) / 0.25) 0%, transparent 100%)',
          }}
        />
        
        <header className="relative p-5 pt-safe flex items-center justify-between">
          <h1 className="text-xl font-bold">Profil</h1>
          <button
            onClick={() => navigate('/settings')}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center"
          >
            <Settings className="w-5 h-5" />
          </button>
        </header>

        {/* Profile Info */}
        <div className="relative px-5 pt-4 pb-8">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/30 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <Crown className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">Utilisateur</h2>
              <p className="text-muted-foreground flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Mélomane passionné
              </p>
              <button className="mt-3 px-4 py-2 rounded-full bg-white/10 text-sm font-medium">
                Modifier le profil
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-5 mb-6 -mt-2">
        <div className="bg-card/80 backdrop-blur rounded-2xl p-5">
          <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Statistiques
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                <Disc3 className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{tracks.length}</p>
              <p className="text-xs text-muted-foreground">Morceaux</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-2">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold">{favorites.length}</p>
              <p className="text-xs text-muted-foreground">Favoris</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold">{hours > 0 ? `${hours}h` : `${minutes}m`}</p>
              <p className="text-xs text-muted-foreground">Durée totale</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-5 mb-6">
        <div className="bg-card/60 backdrop-blur rounded-2xl overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center justify-between p-4 transition-colors hover:bg-white/5 ${
                index !== menuItems.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                  <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <div className="text-left">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {tracks.length > 0 && (
        <div className="px-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Dernières écoutes</h3>
            <button 
              onClick={() => navigate('/library')}
              className="text-sm text-primary font-medium"
            >
              Tout voir
            </button>
          </div>
          <div className="space-y-3">
            {tracks.slice(0, 4).map((track, index) => (
              <button
                key={track.id}
                onClick={() => playTrack(track)}
                className="w-full flex items-center gap-4 bg-card/40 backdrop-blur rounded-xl p-3 transition-all hover:bg-card/60"
              >
                <span className="text-muted-foreground text-sm w-5">{index + 1}</span>
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-12 h-12 rounded-lg object-cover shadow-md"
                />
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-medium truncate">{track.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                </div>
                {track.isFavorite && (
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Share Profile */}
      <div className="px-5 mt-6">
        <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 text-muted-foreground font-medium transition-colors hover:bg-white/10">
          <Share2 className="w-5 h-5" />
          Partager mon profil
        </button>
      </div>
    </div>
  );
};

export default Profile;