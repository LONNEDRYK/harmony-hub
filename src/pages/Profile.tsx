import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Settings, Camera, Image } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

const Profile = () => {
  const navigate = useNavigate();
  const { tracks, userProfile, updateUserProfile } = useMusic();
  const [showCameraModal, setShowCameraModal] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateUserProfile({ avatar: url });
    }
    setShowCameraModal(false);
  };

  return (
    <div className="min-h-screen pb-36 bg-background">
      {/* Header - Changer de compte */}
      <div className="pt-safe" />
      <div className="px-5 pt-4 pb-6 text-center">
        <p className="text-muted-foreground text-base">Changer de compte ▿</p>
      </div>

      {/* Profile Card - Large avatar + info */}
      <div className="px-5 pb-8">
        <div className="flex items-start gap-5">
          {/* Large Avatar */}
          <button
            onClick={() => setShowCameraModal(true)}
            className="relative shrink-0"
          >
            <div className="w-36 h-36 rounded-full overflow-hidden ring-2 ring-white/10">
              <img
                src={userProfile.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </button>

          {/* Info - right side */}
          <div className="flex-1 min-w-0 pt-4">
            <h2 className="text-2xl font-bold truncate leading-tight">{userProfile.name}</h2>
            <p className="text-muted-foreground text-base mt-2">
              Stockage utilisé :
            </p>
            <p className="text-muted-foreground text-base">
              {tracks.length} son{tracks.length !== 1 ? 's' : ''} enregistré{tracks.length !== 1 ? 's' : ''}...
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons - matching reference sizes */}
      <div className="px-5 flex items-center gap-2.5">
        <button
          onClick={() => navigate('/library')}
          className="px-5 py-3 rounded-full bg-white text-black font-semibold text-sm whitespace-nowrap"
        >
          Voir les sons
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="px-5 py-3 rounded-full bg-white/10 font-semibold text-sm whitespace-nowrap"
        >
          Éditer le profil
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Camera/Gallery Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCameraModal(false)} />
          <div className="relative bg-zinc-900 rounded-t-3xl p-6 w-full max-w-lg animate-slide-up">
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />
            <h3 className="text-lg font-bold mb-6 text-center">Changer la photo</h3>
            
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
                <span className="font-medium">Galerie</span>
              </button>
            </div>

            <button
              onClick={() => setShowCameraModal(false)}
              className="w-full py-4 rounded-xl bg-white/5 text-muted-foreground font-medium"
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
