import { Heart, ListPlus, Share2, Trash2, Radio, X } from 'lucide-react';
import { Track, useMusic } from '@/contexts/MusicContext';

interface TrackOptionsSheetProps {
  track: Track;
  isOpen: boolean;
  onClose: () => void;
}

const TrackOptionsSheet = ({ track, isOpen, onClose }: TrackOptionsSheetProps) => {
  const { toggleFavorite, removeTrack, playTrack } = useMusic();

  if (!isOpen) return null;

  const options = [
    {
      icon: Heart,
      label: track.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris',
      action: () => {
        toggleFavorite(track.id);
        onClose();
      },
      filled: track.isFavorite,
    },
    {
      icon: ListPlus,
      label: 'Ajouter à une playlist',
      action: () => {
        onClose();
      },
    },
    {
      icon: Radio,
      label: 'Lancer la radio',
      action: () => {
        playTrack(track);
        onClose();
      },
    },
    {
      icon: Share2,
      label: 'Partager',
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: track.title,
            text: `Écoute ${track.title} par ${track.artist}`,
          });
        }
        onClose();
      },
    },
    {
      icon: Trash2,
      label: 'Supprimer',
      action: () => {
        removeTrack(track.id);
        onClose();
      },
      destructive: true,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="max-w-lg mx-auto">
          <div className="bg-card/95 backdrop-blur-xl rounded-t-3xl shadow-2xl shadow-black/50 overflow-hidden">
            {/* Track Info Header */}
            <div className="p-5 bg-muted/30">
              <div className="flex items-center gap-4">
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{track.title}</h3>
                  <p className="text-muted-foreground text-sm truncate">{track.artist}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="py-2">
              {options.map(({ icon: Icon, label, action, filled, destructive }) => (
                <button
                  key={label}
                  onClick={action}
                  className={`w-full flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/5 active:bg-white/10 ${
                    destructive ? 'text-destructive' : ''
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${filled ? 'fill-primary text-primary' : ''}`}
                  />
                  <span className="text-[15px]">{label}</span>
                </button>
              ))}
            </div>

            {/* Safe area spacer */}
            <div className="h-8" />
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackOptionsSheet;
