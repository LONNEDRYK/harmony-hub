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
  const { toggleFavorite, removeTrack, playlists, addToPlaylist } = useMusic();
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
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
        setShowPlaylistPicker(true);
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
        className="rounded-t-3xl bg-zinc-900/98 backdrop-blur-xl border-0 p-0 max-h-[85vh] mx-4 mb-4 rounded-b-3xl"
        style={{ 
          marginLeft: '16px', 
          marginRight: '16px', 
          marginBottom: '16px',
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
              {/* Playlist Picker */}
              <div className="px-5 pb-4">
                <h3 className="text-xl font-bold text-white">Ajouter à une playlist</h3>
              </div>
              <div className="px-4 pb-6">
                {playlists.length > 0 ? (
                  <div className="space-y-2">
                    {playlists.map((playlist) => (
                      <button
                        key={playlist.id}
                        onClick={() => {
                          addToPlaylist(playlist.id, track.id);
                          onClose();
                        }}
                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
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
              <div className="px-4 pb-6">
                {options.map(({ icon: Icon, label, action, filled, destructive }, index) => (
                  <button
                    key={label}
                    onClick={action}
                    className={`w-full flex items-center justify-between px-4 py-4 transition-colors hover:bg-white/5 active:bg-white/10 rounded-xl ${
                      index !== options.length - 1 ? 'border-b border-zinc-800/30' : ''
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
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TrackOptionsSheet;