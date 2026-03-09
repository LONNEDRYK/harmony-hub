import { useNavigate, useParams } from 'react-router-dom';
import { useState, useRef } from 'react';
import { ChevronLeft, Play, Heart, Trash2, Camera, Music, Image, UserPlus, ExternalLink, Plus } from 'lucide-react';
import { useMusic, Track } from '@/contexts/MusicContext';
import TrackOptionsSheet from '@/components/TrackOptionsSheet';

const PlaylistDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { playlists, tracks, playTrack, currentTrack, removeFromPlaylist, deletePlaylist, updatePlaylistCover } = useMusic();

  const [showOptions, setShowOptions] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const playlist = playlists.find(p => p.id === id);

  if (!playlist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Playlist introuvable</p>
          <button onClick={() => navigate('/library')} className="mt-4 px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm">
            Retour
          </button>
        </div>
      </div>
    );
  }

  const playlistTracks = playlist.trackIds.map(trackId => tracks.find(t => t.id === trackId)).filter(Boolean) as Track[];

  const handlePlayAll = () => {
    if (playlistTracks.length > 0) playTrack(playlistTracks[0]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && id) {
      const url = URL.createObjectURL(file);
      updatePlaylistCover(id, url);
    }
    setShowCameraModal(false);
  };

  const handleDeletePlaylist = () => {
    if (confirm('Supprimer cette playlist ?')) {
      deletePlaylist(playlist.id);
      navigate('/library');
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden pb-36">
      {/* Banner */}
      <div className="relative">
        <div className="h-64">
          <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
        </div>

        <button onClick={() => navigate(-1)} className="absolute top-12 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <button onClick={() => setShowCameraModal(true)} className="absolute top-12 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <Camera className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Name */}
      <div className="-mt-10 relative z-10 text-center px-5">
        <h1 className="text-2xl font-bold">{playlist.name}</h1>
        <p className="text-muted-foreground text-xs mt-1">
          {playlistTracks.length} titre{playlistTracks.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-2.5 mt-4 px-5">
        <button
          onClick={handlePlayAll}
          disabled={playlistTracks.length === 0}
          className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm flex items-center gap-2 disabled:opacity-50"
        >
          <Play className="w-4 h-4" fill="currentColor" />
          Écouter
        </button>
        <button className="w-10 h-10 rounded-full bg-card border border-border/40 flex items-center justify-center">
          <UserPlus className="w-4 h-4" />
        </button>
        <button className="w-10 h-10 rounded-full bg-card border border-border/40 flex items-center justify-center">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Content Grid */}
      <div className="px-1 mt-5">
        {playlistTracks.length > 0 ? (
          <div className="grid grid-cols-3 gap-0.5">
            {playlistTracks.map((track) => (
              <button
                key={track.id}
                onClick={() => playTrack(track)}
                className="relative aspect-square overflow-hidden"
              >
                <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                {track.isFavorite && (
                  <div className="absolute top-1.5 right-1.5">
                    <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                  </div>
                )}
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1">
                  <Play className="w-3 h-3 text-white" fill="white" />
                  <span className="text-white text-[10px] font-medium drop-shadow-lg">
                    {Math.floor(track.duration / 60)}:{String(Math.floor(track.duration % 60)).padStart(2, '0')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-5">
            <Music className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-bold mb-2">Playlist vide</h3>
            <p className="text-muted-foreground text-xs mb-4">Ajoutez des titres depuis la bibliothèque</p>
            <button onClick={() => navigate('/library')} className="px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm">
              Parcourir
            </button>
          </div>
        )}
      </div>

      {/* Delete */}
      <div className="px-5 mt-8">
        <button onClick={handleDeletePlaylist} className="w-full py-3 rounded-xl bg-destructive/10 text-destructive font-medium text-sm flex items-center justify-center gap-2">
          <Trash2 className="w-4 h-4" />
          Supprimer la playlist
        </button>
      </div>

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCameraModal(false)} />
          <div className="relative bg-card rounded-t-3xl p-6 w-full max-w-lg animate-slide-up">
            <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-6" />
            <h3 className="text-base font-bold mb-6 text-center">Changer la couverture</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center gap-3 p-6 bg-muted/50 rounded-2xl">
                <Camera className="w-7 h-7 text-muted-foreground" />
                <span className="font-medium text-sm">Caméra</span>
              </button>
              <button onClick={() => galleryInputRef.current?.click()} className="flex flex-col items-center gap-3 p-6 bg-muted/50 rounded-2xl">
                <Image className="w-7 h-7 text-muted-foreground" />
                <span className="font-medium text-sm">Galerie</span>
              </button>
            </div>
            <button onClick={() => setShowCameraModal(false)} className="w-full py-4 rounded-xl bg-muted/50 text-muted-foreground font-medium">
              Annuler
            </button>
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageSelect} className="hidden" />
            <input ref={galleryInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          </div>
        </div>
      )}

      {selectedTrack && (
        <TrackOptionsSheet track={selectedTrack} isOpen={showOptions} onClose={() => { setShowOptions(false); setSelectedTrack(null); }} />
      )}
    </div>
  );
};

export default PlaylistDetail;
