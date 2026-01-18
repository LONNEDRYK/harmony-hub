import { useNavigate, useParams } from 'react-router-dom';
import { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  Play, 
  Pause,
  MoreVertical, 
  Shuffle,
  Heart,
  Trash2,
  Camera,
  Music,
  GripVertical,
  Image
} from 'lucide-react';
import { useMusic, Track } from '@/contexts/MusicContext';
import TrackOptionsSheet from '@/components/TrackOptionsSheet';

const PlaylistDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { 
    playlists, 
    tracks, 
    playTrack, 
    isPlaying, 
    currentTrack, 
    togglePlay,
    removeFromPlaylist,
    deletePlaylist,
    updatePlaylistCover
  } = useMusic();
  
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
          <p className="text-muted-foreground">Playlist not found</p>
          <button 
            onClick={() => navigate('/library')}
            className="mt-4 px-6 py-3 rounded-full bg-primary text-primary-foreground"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const playlistTracks = playlist.trackIds
    .map(trackId => tracks.find(t => t.id === trackId))
    .filter(Boolean) as Track[];

  const totalDuration = playlistTracks.reduce((acc, t) => acc + t.duration, 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  const handlePlayAll = () => {
    if (playlistTracks.length > 0) {
      playTrack(playlistTracks[0]);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && id) {
      const url = URL.createObjectURL(file);
      updatePlaylistCover(id, url);
    }
    setShowCameraModal(false);
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && id) {
      const url = URL.createObjectURL(file);
      updatePlaylistCover(id, url);
    }
    setShowCameraModal(false);
  };

  const handleDeletePlaylist = () => {
    if (confirm('Delete this playlist?')) {
      deletePlaylist(playlist.id);
      navigate('/library');
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden pb-36">
      {/* Header with Cover */}
      <div className="relative">
        <div className="h-72 relative">
          <img
            src={playlist.cover}
            alt={playlist.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-safe left-5 mt-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          {/* Edit Cover */}
          <button
            onClick={() => setShowCameraModal(true)}
            className="absolute top-safe right-5 mt-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"
          >
            <Camera className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Playlist Info */}
        <div className="px-5 -mt-20 relative z-10">
          <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
          <p className="text-muted-foreground">
            {playlistTracks.length} tracks • {hours > 0 ? `${hours}h ` : ''}{minutes} min
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-6 flex items-center gap-4">
        <button
          onClick={handlePlayAll}
          disabled={playlistTracks.length === 0}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold disabled:opacity-50"
        >
          <Play className="w-5 h-5" fill="currentColor" />
          Play
        </button>
        <button className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
          <Shuffle className="w-5 h-5" />
        </button>
        <button 
          onClick={handleDeletePlaylist}
          className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center"
        >
          <Trash2 className="w-5 h-5 text-red-500" />
        </button>
      </div>

      {/* Tracks List */}
      <div className="px-5">
        {playlistTracks.length > 0 ? (
          <div className="space-y-2">
            {playlistTracks.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-6 flex items-center justify-center">
                  <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                </div>
                <button
                  onClick={() => playTrack(track)}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <p className={`font-medium truncate ${
                      currentTrack?.id === track.id ? 'text-primary' : ''
                    }`}>
                      {track.title}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  {track.isFavorite && (
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  )}
                  <button
                    onClick={() => {
                      setSelectedTrack(track);
                      setShowOptions(true);
                    }}
                    className="p-2 rounded-full hover:bg-white/10"
                  >
                    <MoreVertical className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Empty playlist</h3>
            <p className="text-muted-foreground mb-4">
              Add tracks from your library
            </p>
            <button
              onClick={() => navigate('/library')}
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold"
            >
              Browse library
            </button>
          </div>
        )}
      </div>

      {/* Camera/Gallery Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCameraModal(false)} />
          <div className="relative bg-zinc-900 rounded-t-3xl p-6 w-full max-w-lg animate-slide-up">
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />
            <h3 className="text-lg font-bold mb-6 text-center">Change cover</h3>
            
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

      {/* Track Options Sheet */}
      {selectedTrack && (
        <TrackOptionsSheet
          track={selectedTrack}
          isOpen={showOptions}
          onClose={() => {
            setShowOptions(false);
            setSelectedTrack(null);
          }}
        />
      )}
    </div>
  );
};

export default PlaylistDetail;
