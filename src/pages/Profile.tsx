import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { ChevronLeft, Settings, Camera, Image, Plus, ExternalLink, Heart, Play } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

const Profile = () => {
  const navigate = useNavigate();
  const { tracks, playlists, userProfile, updateUserProfile } = useMusic();
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [editTarget, setEditTarget] = useState<'avatar' | 'banner'>('avatar');
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (editTarget === 'avatar') {
        updateUserProfile({ avatar: url });
      } else {
        updateUserProfile({ banner: url });
      }
    }
    setShowCameraModal(false);
  };

  const openEdit = (target: 'avatar' | 'banner') => {
    setEditTarget(target);
    setShowCameraModal(true);
  };

  const favorites = tracks.filter(t => t.isFavorite);

  return (
    <div className="min-h-screen pb-36 bg-background">
      {/* Banner */}
      <div className="relative">
        <button onClick={() => openEdit('banner')} className="w-full">
          <div className="h-52 w-full overflow-hidden">
            <img
              src={userProfile.banner}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </div>
        </button>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Avatar overlapping banner */}
      <div className="relative -mt-16 flex flex-col items-center">
        <button onClick={() => openEdit('avatar')} className="relative">
          <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-background">
            <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </button>

        {/* Name */}
        <h1 className="text-2xl font-bold mt-3">{userProfile.name}</h1>
        <p className="text-muted-foreground text-sm mt-0.5">@{userProfile.name.toLowerCase().replace(/\s/g, '')}</p>

        {/* Bio */}
        <p className="text-muted-foreground text-sm text-center mt-2 px-10 leading-relaxed">
          {tracks.length} son{tracks.length !== 1 ? 's' : ''} • {playlists.length} playlist{playlists.length !== 1 ? 's' : ''} • {favorites.length} favori{favorites.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center justify-center gap-2.5 mt-5 px-5">
        <button
          onClick={() => navigate('/library')}
          className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm"
        >
          Voir les sons
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full bg-card border border-border/40 flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full bg-card border border-border/40 flex items-center justify-center"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Friends & Community section */}
      <div className="flex items-center justify-center gap-10 mt-6 px-5">
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex -space-x-2">
            {tracks.slice(0, 3).map((t, i) => (
              <div key={i} className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-background">
                <img src={t.cover} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            {tracks.length > 3 && (
              <div className="w-10 h-10 rounded-full bg-card border border-border/40 flex items-center justify-center ring-2 ring-background">
                <span className="text-xs font-bold">+{tracks.length - 3}</span>
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground">sons</span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div className="flex -space-x-2">
            {playlists.slice(0, 3).map((p, i) => (
              <div key={i} className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-background">
                <img src={p.cover} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">playlists</span>
        </div>
      </div>

      {/* Content Grid */}
      {tracks.length > 0 && (
        <div className="px-3 mt-6">
          <div className="grid grid-cols-3 gap-0.5">
            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => {
                  navigate('/player');
                }}
                className="relative aspect-square overflow-hidden"
              >
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1">
                  <Play className="w-3 h-3 text-white" fill="white" />
                  <span className="text-white text-[10px] font-medium drop-shadow-lg">
                    {Math.floor(track.duration / 60)}:{String(Math.floor(track.duration % 60)).padStart(2, '0')}
                  </span>
                </div>
                {track.isFavorite && (
                  <div className="absolute top-1.5 right-1.5">
                    <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {tracks.length === 0 && (
        <div className="text-center py-16 px-5">
          <p className="text-muted-foreground text-sm mb-4">Aucun son pour le moment</p>
          <button
            onClick={() => navigate('/library')}
            className="px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm"
          >
            Importer de la musique
          </button>
        </div>
      )}

      {/* Camera/Gallery Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCameraModal(false)} />
          <div className="relative bg-card rounded-t-3xl p-6 w-full max-w-lg animate-slide-up">
            <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-6" />
            <h3 className="text-lg font-bold mb-6 text-center">
              {editTarget === 'avatar' ? 'Changer la photo' : 'Changer la bannière'}
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center gap-3 p-6 bg-muted/50 rounded-2xl"
              >
                <Camera className="w-7 h-7 text-muted-foreground" />
                <span className="font-medium text-sm">Caméra</span>
              </button>
              <button
                onClick={() => galleryInputRef.current?.click()}
                className="flex flex-col items-center gap-3 p-6 bg-muted/50 rounded-2xl"
              >
                <Image className="w-7 h-7 text-muted-foreground" />
                <span className="font-medium text-sm">Galerie</span>
              </button>
            </div>
            <button
              onClick={() => setShowCameraModal(false)}
              className="w-full py-4 rounded-xl bg-muted/50 text-muted-foreground font-medium"
            >
              Annuler
            </button>
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageSelect} className="hidden" />
            <input ref={galleryInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
