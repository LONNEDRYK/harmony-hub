import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { ChevronLeft, Settings, Camera, Image, ExternalLink, Heart, Play, Pause } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

const Profile = () => {
  const navigate = useNavigate();
  const { tracks, playlists, userProfile, updateUserProfile, playTrack, currentTrack, isPlaying, togglePlay } = useMusic();
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [editTarget, setEditTarget] = useState<'avatar' | 'banner'>('avatar');
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateUserProfile(editTarget === 'avatar' ? { avatar: url } : { banner: url });
    }
    setShowCameraModal(false);
  };

  const openEdit = (target: 'avatar' | 'banner') => {
    setEditTarget(target);
    setShowCameraModal(true);
  };

  const favorites = tracks.filter(t => t.isFavorite);

  const handleTrackPlay = (track: typeof tracks[0]) => {
    if (currentTrack?.id === track.id) togglePlay();
    else playTrack(track);
  };

  return (
    <div className="min-h-screen pb-36 bg-background">
      {/* Banner */}
      <div className="relative">
        <button onClick={() => openEdit('banner')} className="w-full">
          <div className="h-48 w-full overflow-hidden">
            <img src={userProfile.banner} alt="Banner" className="w-full h-full object-cover" />
          </div>
        </button>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <button
          onClick={() => navigate('/settings')}
          className="absolute top-12 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
        >
          <Settings className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Avatar */}
      <div className="relative -mt-14 flex flex-col items-center">
        <button onClick={() => openEdit('avatar')} className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-background">
            <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </button>

        <h1 className="text-xl font-bold mt-3">{userProfile.name}</h1>
        <p className="text-muted-foreground text-xs mt-0.5">@{userProfile.name.toLowerCase().replace(/\s/g, '')}</p>

        <p className="text-muted-foreground text-xs text-center mt-2 px-10">
          {tracks.length} son{tracks.length !== 1 ? 's' : ''} • {playlists.length} playlist{playlists.length !== 1 ? 's' : ''} • {favorites.length} favori{favorites.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-2.5 mt-4 px-5">
        <button
          onClick={() => navigate('/library')}
          className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm"
        >
          Voir les sons
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="w-9 h-9 rounded-full bg-card border border-border/30 flex items-center justify-center"
        >
          <Settings className="w-4 h-4 text-muted-foreground" />
        </button>
        <button className="w-9 h-9 rounded-full bg-card border border-border/30 flex items-center justify-center">
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-8 mt-5 px-5">
        <div className="flex flex-col items-center">
          <div className="flex -space-x-2">
            {tracks.slice(0, 3).map((t, i) => (
              <div key={i} className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-background">
                <img src={t.cover} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            {tracks.length > 3 && (
              <div className="w-9 h-9 rounded-full bg-card border border-border/30 flex items-center justify-center ring-2 ring-background">
                <span className="text-[10px] font-bold">+{tracks.length - 3}</span>
              </div>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground mt-1.5">sons</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex -space-x-2">
            {playlists.slice(0, 3).map((p, i) => (
              <div key={i} className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-background">
                <img src={p.cover} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground mt-1.5">playlists</span>
        </div>
      </div>

      {/* Content Grid */}
      {tracks.length > 0 && (
        <div className="px-1 mt-5">
          <div className="grid grid-cols-3 gap-0.5">
            {tracks.map((track) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => handleTrackPlay(track)}
                  className="relative aspect-square overflow-hidden"
                >
                  <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1">
                    {isActive && isPlaying ? (
                      <Pause className="w-3 h-3 text-white" fill="white" />
                    ) : (
                      <Play className="w-3 h-3 text-white" fill="white" />
                    )}
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
              );
            })}
          </div>
        </div>
      )}

      {tracks.length === 0 && (
        <div className="text-center py-16 px-5">
          <p className="text-muted-foreground text-xs mb-4">Aucun son pour le moment</p>
          <button
            onClick={() => navigate('/library')}
            className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm"
          >
            Importer
          </button>
        </div>
      )}

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCameraModal(false)} />
          <div className="relative bg-card rounded-t-3xl p-6 w-full max-w-lg animate-slide-up">
            <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-6" />
            <h3 className="text-sm font-bold mb-5 text-center">
              {editTarget === 'avatar' ? 'Changer la photo' : 'Changer la bannière'}
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center gap-2 p-5 bg-muted/50 rounded-2xl">
                <Camera className="w-6 h-6 text-muted-foreground" />
                <span className="font-medium text-xs">Caméra</span>
              </button>
              <button onClick={() => galleryInputRef.current?.click()} className="flex flex-col items-center gap-2 p-5 bg-muted/50 rounded-2xl">
                <Image className="w-6 h-6 text-muted-foreground" />
                <span className="font-medium text-xs">Galerie</span>
              </button>
            </div>
            <button onClick={() => setShowCameraModal(false)} className="w-full py-3.5 rounded-xl bg-muted/50 text-muted-foreground font-medium text-sm">
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
