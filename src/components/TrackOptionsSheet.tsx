import { Heart, ListPlus, Share2, Trash2 } from 'lucide-react';
import { Track, useMusic } from '@/contexts/MusicContext';
import { useState, useRef, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';

interface TrackOptionsSheetProps {
  track: Track;
  isOpen: boolean;
  onClose: () => void;
}

const SONG_REACTIONS = ['🖤', '⭐', '🎵', '🎧', '🎤', '🎸', '🎸'];

const TrackOptionsSheet = ({ track, isOpen, onClose }: TrackOptionsSheetProps) => {
  const { toggleFavorite, removeTrack } = useMusic();
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  useEffect(() => {
    if (!isOpen) {
      setDragY(0);
      setIsDragging(false);
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

  const options = [
    {
      icon: Heart,
      label: 'Favoris',
      action: () => {
        toggleFavorite(track.id);
        onClose();
      },
      filled: track.isFavorite,
    },
    {
      icon: ListPlus,
      label: 'Ajouter à la playlist',
      action: () => {
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
      label: 'Supprimer de la bibliothèque',
      action: () => {
        removeTrack(track.id);
        onClose();
      },
      destructive: true,
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="rounded-t-3xl bg-zinc-900/95 backdrop-blur-xl border-0 p-0 max-h-[85vh]"
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

          {/* Track Info Header */}
          <div className="px-5 pb-4">
            <h3 className="text-xl font-bold text-white">{track.title}</h3>
            <p className="text-zinc-400 text-base">{track.artist}</p>
          </div>

          {/* Song Reactions */}
          <div className="px-5 pb-5">
            <p className="text-white text-base font-medium mb-3">Réactions de Chanson</p>
            <div className="flex items-center gap-3">
              {SONG_REACTIONS.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedReaction(emoji === selectedReaction ? null : emoji)}
                  className={`text-2xl transition-transform active:scale-90 ${
                    selectedReaction === emoji ? 'scale-110' : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
              <button className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 text-lg">
                +
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="px-2">
            {options.map(({ icon: Icon, label, action, filled, destructive }, index) => (
              <button
                key={label}
                onClick={action}
                className={`w-full flex items-center justify-between px-4 py-4 transition-colors hover:bg-white/5 active:bg-white/10 ${
                  index !== options.length - 1 ? 'border-b border-zinc-800/50' : ''
                }`}
              >
                <span className={`text-[16px] font-normal ${destructive ? 'text-zinc-400' : 'text-white'}`}>
                  {label}
                </span>
                <Icon
                  className={`w-5 h-5 ${
                    filled ? 'fill-white text-white' : destructive ? 'text-zinc-500' : 'text-zinc-400'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Safe area spacer */}
          <div className="h-10" />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TrackOptionsSheet;