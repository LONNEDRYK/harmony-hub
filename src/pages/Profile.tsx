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
  Bell,
  User,
  Headphones,
  BarChart3
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

  const quickActions = [
    {
      icon: Heart,
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-500',
      label: 'Favoris',
      value: favorites.length,
      action: () => navigate('/library?tab=favorites'),
    },
    {
      icon: ListMusic,
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-500',
      label: 'Playlists',
      value: playlists.length,
      action: () => navigate('/library?tab=playlists'),
    },
    {
      icon: Download,
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-500',
      label: 'Downloads',
      value: 0,
      action: () => {},
    },
  ];

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
      icon: Headphones,
      iconBg: 'bg-cyan-500/20',
      iconColor: 'text-cyan-500',
      label: 'Historique d\'écoute',
      subtitle: 'Vos dernières écoutes',
      action: () => navigate('/library'),
    },
    {
      icon: BarChart3,
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-500',
      label: 'Statistiques',
      subtitle: `${hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`} d'écoute`,
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
    {
      icon: Settings,
      iconBg: 'bg-slate-500/20',
      iconColor: 'text-slate-400',
      label: 'Paramètres',
      subtitle: 'Préférences & compte',
      action: () => navigate('/settings'),
    },
  ];

  return (
    <div className="min-h-screen pb-36 bg-background overflow-hidden">
      {/* Banner */}
      <div className="relative h-36 md:h-48">
        <img
          src={userProfile.banner}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-background" />
        
        <button
          onClick={() => bannerInputRef.current?.click()}
          className="absolute top-safe right-4 mt-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"
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
          className="absolute top-safe left-4 mt-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"
        >
          <Settings className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="relative px-5 -mt-12 pb-4">
        <div className="flex items-end gap-4">
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden ring-4 ring-background shadow-xl">
              <img
                src={userProfile.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-lg"
            >
              <Edit3 className="w-3 h-3 text-primary-foreground" />
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
            <h2 className="text-lg md:text-xl font-bold">{userProfile.name}</h2>
            <p className="text-muted-foreground text-xs md:text-sm">Mélomane passionné</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-4">
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="bg-white/5 rounded-xl p-3 text-center hover:bg-white/10 transition-colors"
            >
              <div className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center mx-auto mb-1.5`}>
                <item.icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>
              <p className="text-sm font-bold">{item.value}</p>
              <p className="text-[10px] text-muted-foreground">{item.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Card */}
      <div className="px-5 mb-4">
        <div className="bg-gradient-to-r from-primary/10 to-amber-500/10 rounded-2xl p-4 border border-primary/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-amber-500/20 flex items-center justify-center">
              <Disc3 className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Temps d'écoute total</h3>
              <p className="text-2xl font-bold">
                {hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-5 mb-4">
        <div className="bg-white/5 rounded-2xl overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center justify-between p-3.5 transition-colors hover:bg-white/5 ${
                index !== menuItems.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                  <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Tracks */}
      {tracks.length > 0 && (
        <div className="px-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">Dernières écoutes</h3>
            <button 
              onClick={() => navigate('/library')}
              className="text-xs text-primary font-medium"
            >
              Voir tout
            </button>
          </div>
          <div className="space-y-2">
            {tracks.slice(0, 3).map((track, index) => (
              <button
                key={track.id}
                onClick={() => playTrack(track)}
                className="w-full flex items-center gap-3 bg-white/5 rounded-xl p-2.5 transition-all hover:bg-white/10"
              >
                <span className="text-muted-foreground text-xs w-4">{index + 1}</span>
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-medium text-sm truncate">{track.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{track.artist}</p>
                </div>
                {track.isFavorite && (
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Share Button */}
      <div className="px-5">
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-muted-foreground font-medium text-sm hover:bg-white/10 transition-colors">
          <Share2 className="w-4 h-4" />
          Partager mon profil
        </button>
      </div>
    </div>
  );
};

export default Profile;
