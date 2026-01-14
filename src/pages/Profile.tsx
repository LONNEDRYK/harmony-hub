import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { 
  Settings, 
  Music, 
  Heart, 
  Clock, 
  ChevronRight, 
  Camera,
  Disc3,
  ListMusic,
  Download,
  Share2,
  Edit3,
  Crown,
  Bell,
  Sparkles
} from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

const Profile = () => {
  const navigate = useNavigate();
  const { tracks, playTrack, userProfile, updateUserProfile, playlists } = useMusic();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const favorites = tracks.filter((t) => t.isFavorite);
  const totalDuration = tracks.reduce((acc, t) => acc + t.duration, 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateUserProfile({ avatar: url });
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateUserProfile({ banner: url });
    }
  };

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
      subtitle: `${playlists.length} playlists`,
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
    {
      icon: Bell,
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-500',
      label: 'Notifications',
      subtitle: 'Gérer les alertes',
      action: () => navigate('/notifications'),
    },
  ];

  return (
    <div className="min-h-screen pb-36 bg-background overflow-hidden">
      {/* Banner */}
      <div className="relative h-40">
        <img
          src={userProfile.banner}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
        
        <button
          onClick={() => bannerInputRef.current?.click()}
          className="absolute top-safe right-4 mt-2 w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"
        >
          <Camera className="w-4 h-4 text-white" />
        </button>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          onChange={handleBannerChange}
          className="hidden"
        />
        
        <button
          onClick={() => navigate('/settings')}
          className="absolute top-safe left-4 mt-2 w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"
        >
          <Settings className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="relative px-5 -mt-14 pb-4">
        <div className="flex items-end gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-background shadow-xl">
              <img
                src={userProfile.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg"
            >
              <Edit3 className="w-3.5 h-3.5 text-primary-foreground" />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          
          <div className="flex-1 pb-1">
            <h2 className="text-xl font-bold">{userProfile.name}</h2>
            <p className="text-muted-foreground text-sm">Mélomane passionné</p>
          </div>
        </div>
      </div>

      {/* Premium Card */}
      <div className="px-5 mb-5">
        <button
          onClick={() => navigate('/subscription')}
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-primary/20 via-amber-500/20 to-primary/20 border border-primary/20"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center">
              <Crown className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-bold">Passez Premium</h3>
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Audio HD, pas de pub, téléchargements</p>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
        </button>
      </div>

      {/* Stats */}
      <div className="px-5 mb-5">
        <div className="bg-white/5 rounded-2xl p-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                <Disc3 className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-lg font-bold">{tracks.length}</p>
              <p className="text-xs text-muted-foreground">Morceaux</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto mb-2">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-lg font-bold">{favorites.length}</p>
              <p className="text-xs text-muted-foreground">Favoris</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <p className="text-lg font-bold">{hours > 0 ? `${hours}h` : `${minutes}m`}</p>
              <p className="text-xs text-muted-foreground">Durée</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-5 mb-5">
        <div className="bg-white/5 rounded-2xl overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center justify-between p-4 transition-colors hover:bg-white/5 ${
                index !== menuItems.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                  <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent */}
      {tracks.length > 0 && (
        <div className="px-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Dernières écoutes</h3>
            <button 
              onClick={() => navigate('/library')}
              className="text-sm text-primary font-medium"
            >
              Voir tout
            </button>
          </div>
          <div className="space-y-2">
            {tracks.slice(0, 3).map((track, index) => (
              <button
                key={track.id}
                onClick={() => playTrack(track)}
                className="w-full flex items-center gap-3 bg-white/5 rounded-xl p-3 transition-all hover:bg-white/10"
              >
                <span className="text-muted-foreground text-sm w-4">{index + 1}</span>
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-11 h-11 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-medium text-sm truncate">{track.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>
                {track.isFavorite && (
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Share */}
      <div className="px-5 mt-5">
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-muted-foreground font-medium text-sm">
          <Share2 className="w-4 h-4" />
          Partager mon profil
        </button>
      </div>
    </div>
  );
};

export default Profile;
