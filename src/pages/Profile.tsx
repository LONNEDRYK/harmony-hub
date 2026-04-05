import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Settings, Camera, Image, Play, Pause, Heart, ChevronDown, Pencil, Film } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useVideo } from '@/contexts/VideoContext';

type TabKey = 'songs' | 'videos' | 'popular';

const Profile = () => {
  const navigate = useNavigate();
  const { tracks, playlists, userProfile, updateUserProfile, playTrack, currentTrack, isPlaying, togglePlay, saveImageToLocal } = useMusic();
  const { videos } = useVideo();
  const [activeTab, setActiveTab] = useState<TabKey>('songs');
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [editTarget, setEditTarget] = useState<'avatar' | 'banner'>('avatar');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [showProfileSwitch, setShowProfileSwitch] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const key = editTarget === 'avatar' ? 'profile_avatar' : 'profile_banner';
      const url = await saveImageToLocal(key, file);
      updateUserProfile(editTarget === 'avatar' ? { avatar: url } : { banner: url });
    }
    setShowCameraModal(false);
  };

  const openEdit = (target: 'avatar' | 'banner') => {
    setEditTarget(target);
    setShowCameraModal(true);
  };

  const saveName = () => {
    if (nameInput.trim()) {
      updateUserProfile({ name: nameInput.trim() });
    }
    setEditingName(false);
  };

  const favorites = tracks.filter(t => t.isFavorite);

  const handleTrackPlay = (track: typeof tracks[0]) => {
    if (currentTrack?.id === track.id) togglePlay();
    else playTrack(track);
  };

  const displayTracks = activeTab === 'songs' ? tracks : activeTab === 'popular' ? [...tracks].sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)) : [];

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'songs', label: 'Tout les sons enregistré' },
    { key: 'videos', label: 'Les vidéos enregistré' },
    { key: 'popular', label: 'Les plus écoutés' },
  ];

  return (
    <div className="min-h-screen pb-32 bg-background">
      {/* Header */}
      <div className="px-4 pt-10 pb-3">
        <button
          onClick={() => setShowProfileSwitch(!showProfileSwitch)}
          className="flex items-center gap-1.5 text-sm font-semibold"
        >
          Changer de profil (Local) <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Profile Info Row */}
      <div className="px-4 flex items-center gap-3 mb-3">
        <button onClick={() => openEdit('avatar')} className="shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-border/30">
            <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </button>
        <div className="flex-1 min-w-0">
          {editingName ? (
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => e.key === 'Enter' && saveName()}
              autoFocus
              className="bg-transparent text-base font-bold outline-none border-b border-foreground w-full"
            />
          ) : (
            <button onClick={() => { setNameInput(userProfile.name); setEditingName(true); }}>
              <h1 className="text-base font-bold">{userProfile.name}</h1>
            </button>
          )}
          <p className="text-[11px] text-muted-foreground mt-0.5">Stockage utilisé :</p>
          <p className="text-[10px] text-muted-foreground">
            Enregi...({tracks.length}) Playli...({playlists.length})
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 px-4 mb-3">
        <button
          onClick={() => navigate('/library')}
          className="px-4 py-2 rounded-full bg-foreground text-background font-semibold text-xs"
        >
          Voir les sons
        </button>
        <button
          onClick={() => { setNameInput(userProfile.name); setEditingName(true); }}
          className="px-4 py-2 rounded-full bg-card border border-border/30 font-semibold text-xs"
        >
          Éditer le profil
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="w-8 h-8 rounded-full bg-card border border-border/30 flex items-center justify-center"
        >
          <Settings className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 px-4 mb-3 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap border ${
              activeTab === tab.key
                ? 'bg-card border-border/50 text-foreground'
                : 'border-border/20 text-muted-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button className="w-7 h-7 rounded-full bg-card border border-border/30 flex items-center justify-center shrink-0">
          <Pencil className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>

      {/* Content Grid */}
      {activeTab === 'videos' ? (
        videos.length > 0 ? (
          <div className="px-1">
            <div className="grid grid-cols-3 gap-0.5">
              {videos.map(video => (
                <button
                  key={video.id}
                  onClick={() => navigate(`/video-player?id=${video.id}`)}
                  className="relative aspect-square overflow-hidden bg-card"
                >
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1 right-1">
                    <p className="text-white text-[9px] font-medium truncate drop-shadow-lg">{video.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-xs">Aucune vidéo</p>
          </div>
        )
      ) : displayTracks.length > 0 ? (
        <div className="px-1">
          <div className="grid grid-cols-3 gap-0.5">
            {displayTracks.map(track => {
              const isActive = currentTrack?.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => handleTrackPlay(track)}
                  className="relative aspect-square overflow-hidden bg-card"
                >
                  <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-1 left-1 right-1">
                    <p className="text-white text-[9px] font-medium truncate drop-shadow-lg">{track.title}</p>
                  </div>
                  {isActive && (
                    <div className="absolute top-1 left-1">
                      {isPlaying ? (
                        <Pause className="w-2.5 h-2.5 text-white" fill="white" />
                      ) : (
                        <Play className="w-2.5 h-2.5 text-white" fill="white" />
                      )}
                    </div>
                  )}
                  {track.isFavorite && (
                    <div className="absolute top-1 right-1">
                      <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-xs">Aucun son pour le moment</p>
          <button
            onClick={() => navigate('/library')}
            className="mt-3 px-5 py-2 rounded-full bg-foreground text-background font-semibold text-xs"
          >
            Importer
          </button>
        </div>
      )}

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCameraModal(false)} />
          <div className="relative bg-card rounded-t-2xl p-5 w-full max-w-lg animate-slide-up">
            <div className="w-8 h-1 bg-muted rounded-full mx-auto mb-4" />
            <h3 className="text-xs font-bold mb-4 text-center">
              {editTarget === 'avatar' ? 'Changer la photo' : 'Changer la bannière'}
            </h3>
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <button onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center gap-1.5 p-4 bg-muted/50 rounded-xl">
                <Camera className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-[10px]">Caméra</span>
              </button>
              <button onClick={() => galleryInputRef.current?.click()} className="flex flex-col items-center gap-1.5 p-4 bg-muted/50 rounded-xl">
                <Image className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-[10px]">Galerie</span>
              </button>
            </div>
            <button onClick={() => setShowCameraModal(false)} className="w-full py-3 rounded-xl bg-muted/50 text-muted-foreground font-medium text-xs">
              Annuler
            </button>
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageSelect} className="hidden" />
            <input ref={galleryInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          </div>
        </div>
      )}

      {/* Profile Switch Dropdown */}
      {showProfileSwitch && (
        <div className="fixed inset-0 z-50" onClick={() => setShowProfileSwitch(false)}>
          <div className="absolute top-20 left-4 bg-card rounded-xl border border-border/20 shadow-xl p-3 w-56">
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/30">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src={userProfile.avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-semibold">{userProfile.name}</p>
                <p className="text-[9px] text-muted-foreground">Profil local actif</p>
              </div>
            </div>
            <p className="text-[9px] text-muted-foreground mt-2 px-2">
              Un seul profil local disponible
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
