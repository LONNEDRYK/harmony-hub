import { Heart, ListPlus, Share2, Trash2, Radio, Download, UserPlus, Ban, Flag } from 'lucide-react';
import { Track, useMusic } from '@/contexts/MusicContext';
import { useState, useRef, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';
import { toast } from 'sonner';

interface TrackOptionsSheetProps {
  track: Track;
  isOpen: boolean;
  onClose: () => void;
}

const SONG_REACTIONS = [
  { emoji: '❤️', label: 'Amour' },
  { emoji: '🔥', label: 'Feu' },
  { emoji: '😍', label: 'Adoré' },
  { emoji: '🎵', label: 'Vibe' },
  { emoji: '💯', label: 'Parfait' },
  { emoji: '🙌', label: 'Bravo' },
  { emoji: '😢', label: 'Triste' },
  { emoji: '🤩', label: 'Wow' },
  { emoji: '💀', label: 'Tuerie' },
  { emoji: '👑', label: 'Royal' },
  { emoji: '✨', label: 'Magic' },
  { emoji: '🎧', label: 'Écoute' },
];

const TrackOptionsSheet = ({ track, isOpen, onClose }: TrackOptionsSheetProps) => {
  const { toggleFavorite, removeTrack, playlists, addToPlaylist } = useMusic();
  const [selectedReactions, setSelectedReactions] = useState<string[]>([]);
  const [showPlaylistPicker, setShowPlaylistPicker] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  useEffect(() => {
    if (!isOpen) {
      setDragY(0);
      setIsDragging(false);
      setShowPlaylistPicker(false);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 100) {
      onClose();
    }
    setDragY(0);
  };

  const handleReaction = (emoji: string) => {
    setSelectedReactions(prev => {
      if (prev.includes(emoji)) {
        return prev.filter(e => e !== emoji);
      }
      return [...prev, emoji];
    });
    toast.success(`Réaction ${emoji} ajoutée !`);
  };

  const options = [
    {
      icon: Heart,
      label: track.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris',
      action: () => {
        toggleFavorite(track.id);
        toast.success(track.isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
        onClose();
      },
      filled: track.isFavorite,
      iconColor: track.isFavorite ? 'text-red-500' : 'text-white',
    },
    {
      icon: ListPlus,
      label: 'Ajouter à une playlist',
      action: () => setShowPlaylistPicker(true),
      iconColor: 'text-green-500',
    },
    {
      icon: Radio,
      label: 'Lancer une radio',
      action: () => {
        toast.success('Radio lancée !');
        onClose();
      },
      iconColor: 'text-purple-500',
    },
    {
      icon: Download,
      label: 'Télécharger',
      action: () => {
        toast.success('Téléchargement commencé');
        onClose();
      },
      iconColor: 'text-blue-500',
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
        } else {
          toast.success('Lien copié !');
        }
        onClose();
      },
      iconColor: 'text-cyan-500',
    },
    {
      icon: UserPlus,
      label: 'Suivre l\'artiste',
      action: () => {
        toast.success(`Vous suivez ${track.artist}`);
        onClose();
      },
      iconColor: 'text-pink-500',
    },
    {
      icon: Flag,
      label: 'Signaler',
      action: () => {
        toast.success('Signalement envoyé');
        onClose();
      },
      iconColor: 'text-orange-500',
    },
    {
      icon: Trash2,
      label: 'Supprimer de la bibliothèque',
      action: () => {
        removeTrack(track.id);
        toast.success('Morceau supprimé');
        onClose();
      },
      destructive: true,
      iconColor: 'text-red-500',
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="rounded-t-3xl bg-zinc-900/98 backdrop-blur-xl border-0 p-0 max-h-[85vh]"
        style={{ 
          margin: '0 16px 16px 16px',
          width: 'calc(100% - 32px)',
          borderRadius: '24px',
        }}
      >
        <div 
          ref={sheetRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ transform: `translateY(${dragY}px)` }}
          className="transition-transform duration-100"
        >
          {/* Drag Handle */}
          <div className="flex justify-center py-3">
            <div className="w-10 h-1 bg-zinc-600 rounded-full" />
          </div>

          {showPlaylistPicker ? (
            <>
              <div className="px-5 pb-4">
                <h3 className="text-lg font-bold text-white">Ajouter à une playlist</h3>
              </div>
              <div className="px-4 pb-6 max-h-[50vh] overflow-y-auto">
                {playlists.length > 0 ? (
                  <div className="space-y-2">
                    {playlists.map((playlist) => (
                      <button
                        key={playlist.id}
                        onClick={() => {
                          addToPlaylist(playlist.id, track.id);
                          toast.success(`Ajouté à ${playlist.name}`);
                          onClose();
                        }}
                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5"
                      >
                        <img
                          src={playlist.cover}
                          alt={playlist.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="text-left">
                          <p className="font-medium text-white">{playlist.name}</p>
                          <p className="text-sm text-zinc-400">{playlist.trackIds.length} morceaux</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-zinc-400">Aucune playlist</p>
                    <p className="text-sm text-zinc-500 mt-1">Créez une playlist dans la bibliothèque</p>
                  </div>
                )}
                <button
                  onClick={() => setShowPlaylistPicker(false)}
                  className="w-full mt-4 py-3 rounded-xl bg-white/10 text-white font-medium"
                >
                  Retour
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Track Header */}
              <div className="px-5 pb-4 flex items-center gap-4">
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white truncate">{track.title}</h3>
                  <p className="text-zinc-400 text-sm truncate">{track.artist}</p>
                </div>
              </div>

              {/* Reactions */}
              <div className="px-5 pb-4">
                <p className="text-white text-sm font-medium mb-3">Réactions</p>
                <div className="flex flex-wrap gap-2">
                  {SONG_REACTIONS.map(({ emoji, label }) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className={`text-2xl p-2 rounded-xl transition-all ${
                        selectedReactions.includes(emoji) 
                          ? 'bg-primary/20 scale-110' 
                          : 'hover:bg-white/10'
                      }`}
                      title={label}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="px-4 pb-6 max-h-[40vh] overflow-y-auto">
                {options.map(({ icon: Icon, label, action, filled, destructive, iconColor }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="w-full flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-white/5 active:bg-white/10 rounded-xl"
                  >
                    <Icon
                      className={`w-5 h-5 ${iconColor} ${filled ? 'fill-current' : ''}`}
                    />
                    <span className={`text-sm font-medium ${destructive ? 'text-red-500' : 'text-white'}`}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TrackOptionsSheet;
