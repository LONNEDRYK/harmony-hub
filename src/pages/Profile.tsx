import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { 
  Settings, 
  Music, 
  Heart, 
  ChevronRight, 
  Camera,
  ListMusic,
  Download,
  Share2,
  Edit3,
  ChevronLeft,
  Image
} from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

const Profile = () => {
  const navigate = useNavigate();
  const { tracks, playTrack, userProfile, updateUserProfile, playlists } = useMusic();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<'avatar' | 'banner' | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const favorites = tracks.filter((t) => t.isFavorite);

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (cameraTarget === 'avatar') {
        updateUserProfile({ avatar: url });
      } else if (cameraTarget === 'banner') {
        updateUserProfile({ banner: url });
      }
    }
    setShowCameraModal(false);
    setCameraTarget(null);
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (cameraTarget === 'avatar') {
        updateUserProfile({ avatar: url });
      } else if (cameraTarget === 'banner') {
        updateUserProfile({ banner: url });
      }
    }
    setShowCameraModal(false);
    setCameraTarget(null);
  };

  const openCameraModal = (target: 'avatar' | 'banner') => {
    setCameraTarget(target);
    setShowCameraModal(true);
  };

  const quickActions = [
    {
      icon: Heart,
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-500',
      label: 'Favorites',
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
      value: tracks.length,
      action: () => navigate('/library'),
    },
  ];

  const menuItems = [
    {
      icon: Music,
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-500',
      label: 'My library',
      subtitle: `${tracks.length} tracks`,
      action: () => navigate('/library'),
    },
    {
      icon: Settings,
      iconBg: 'bg-slate-500/20',
      iconColor: 'text-slate-400',
      label: 'Settings',
      subtitle: 'Preferences & account',
      action: () => navigate('/settings'),
    },
  ];

  return (
    <div className="min-h-screen pb-36 bg-background overflow-hidden">
      {/* Banner */}
      <div className="relative h-52">
        <img
          src={userProfile.banner}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
        
        <button
          onClick={() => openCameraModal('banner')}
          className="absolute top-safe right-4 mt-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"
        >
          <Camera className="w-4 h-4 text-white" />
        </button>
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-safe left-4 mt-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="relative px-5 -mt-16 pb-6">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-background shadow-2xl">
              <img
                src={userProfile.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => openCameraModal('avatar')}
              className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-lg"
            >
              <Camera className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
          
          <h2 className="text-2xl font-bold mb-1">{userProfile.name}</h2>
          <p className="text-muted-foreground text-sm mb-4">Music lover</p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/settings')}
              className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm"
            >
              Edit profile
            </button>
            <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="bg-white/5 rounded-2xl p-4 text-center hover:bg-white/10 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center mx-auto mb-2`}>
                <item.icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
              <p className="text-lg font-bold">{item.value}</p>
              <p className="text-[11px] text-muted-foreground">{item.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="px-5 mb-6">
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
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Tracks */}
      {tracks.length > 0 && (
        <div className="px-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Recent listens</h3>
            <button 
              onClick={() => navigate('/library')}
              className="text-xs text-primary font-medium"
            >
              See all
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {tracks.slice(0, 6).map((track) => (
              <button
                key={track.id}
                onClick={() => playTrack(track)}
                className="group"
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-2 relative">
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                  {track.isFavorite && (
                    <div className="absolute top-2 right-2">
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium truncate">{track.title}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Camera/Gallery Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCameraModal(false)} />
          <div className="relative bg-zinc-900 rounded-t-3xl p-6 w-full max-w-lg animate-slide-up">
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />
            <h3 className="text-lg font-bold mb-6 text-center">
              {cameraTarget === 'avatar' ? 'Change profile photo' : 'Change banner'}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Camera className="w-7 h-7 text-blue-500" />
                </div>
                <span className="font-medium">Camera</span>
              </button>
              
              <button
                onClick={() => galleryInputRef.current?.click()}
                className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Image className="w-7 h-7 text-purple-500" />
                </div>
                <span className="font-medium">Gallery</span>
              </button>
            </div>

            <button
              onClick={() => setShowCameraModal(false)}
              className="w-full py-4 rounded-xl bg-white/5 text-muted-foreground font-medium"
            >
              Cancel
            </button>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              className="hidden"
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              onChange={handleGallerySelect}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
