import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Music, Grid3X3, List, X, Play, Camera, Image, ChevronLeft } from 'lucide-react';
import { useMusic, Track } from '@/contexts/MusicContext';
import TrackCard from '@/components/TrackCard';
import TrackOptionsSheet from '@/components/TrackOptionsSheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Library = () => {
  const navigate = useNavigate();
  const { tracks, addTrack, playlists, createPlaylist, deletePlaylist, playTrack, updateTrackCover } = useMusic();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'artist'>('recent');
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<'track' | 'playlist' | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const favorites = tracks.filter((t) => t.isFavorite);

  const sortedTracks = [...tracks].sort((a, b) => {
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    if (sortBy === 'artist') return a.artist.localeCompare(b.artist);
    return 0;
  });

  const sortedFavorites = [...favorites].sort((a, b) => {
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    if (sortBy === 'artist') return a.artist.localeCompare(b.artist);
    return 0;
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (file.type.startsWith('audio/')) {
        await addTrack(file);
      }
    }

    e.target.value = '';
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowCreatePlaylist(false);
    }
  };

  const handleOpenCamera = (target: 'track' | 'playlist', id: string) => {
    setCameraTarget(target);
    setTargetId(id);
    setShowCameraModal(true);
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && targetId && cameraTarget === 'track') {
      const url = URL.createObjectURL(file);
      updateTrackCover?.(targetId, url);
    }
    setShowCameraModal(false);
    setCameraTarget(null);
    setTargetId(null);
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && targetId && cameraTarget === 'track') {
      const url = URL.createObjectURL(file);
      updateTrackCover?.(targetId, url);
    }
    setShowCameraModal(false);
    setCameraTarget(null);
    setTargetId(null);
  };

  return (
    <div className="min-h-screen pb-36 bg-background overflow-hidden">
      <header className="p-5 pt-safe">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold">Library</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {tracks.length} tracks • {favorites.length} favorites
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
          >
            <Plus className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white/10 text-white' : 'text-muted-foreground'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-muted-foreground'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'name' | 'artist')}
            className="bg-white/5 border-0 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="recent">Recent</option>
            <option value="name">Title</option>
            <option value="artist">Artist</option>
          </select>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </header>

      <Tabs defaultValue="all" className="px-5">
        <TabsList className="w-full bg-white/5 mb-4 p-1 rounded-xl">
          <TabsTrigger 
            value="all" 
            className="flex-1 rounded-lg text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All ({tracks.length})
          </TabsTrigger>
          <TabsTrigger 
            value="favorites" 
            className="flex-1 rounded-lg text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Favorites ({favorites.length})
          </TabsTrigger>
          <TabsTrigger 
            value="playlists" 
            className="flex-1 rounded-lg text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Playlists
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {sortedTracks.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-3">
                {sortedTracks.map((track) => (
                  <TrackCard 
                    key={track.id} 
                    track={track} 
                    onEditCover={() => handleOpenCamera('track', track.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {sortedTracks.map((track) => (
                  <TrackCard 
                    key={track.id} 
                    track={track} 
                    variant="list"
                    onEditCover={() => handleOpenCamera('track', track.id)}
                  />
                ))}
              </div>
            )
          ) : (
            <EmptyState onImport={() => fileInputRef.current?.click()} />
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-0">
          {sortedFavorites.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-3">
                {sortedFavorites.map((track) => (
                  <TrackCard key={track.id} track={track} />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {sortedFavorites.map((track) => (
                  <TrackCard key={track.id} track={track} variant="list" />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Music className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">No favorites yet</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="playlists" className="mt-0">
          {/* Create Playlist Modal */}
          {showCreatePlaylist && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreatePlaylist(false)} />
              <div className="relative bg-zinc-900 rounded-2xl p-5 w-full max-w-sm animate-fade-in">
                <button
                  onClick={() => setShowCreatePlaylist(false)}
                  className="absolute top-4 right-4"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
                <h3 className="text-lg font-bold mb-4">New playlist</h3>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Playlist name"
                  className="w-full bg-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                  autoFocus
                />
                <button
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim()}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          )}

          {/* Playlists List */}
          {playlists.length > 0 ? (
            <div className="space-y-2">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                  className="w-full flex items-center gap-3 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors"
                >
                  <img
                    src={playlist.cover}
                    alt={playlist.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-semibold text-sm truncate">{playlist.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {playlist.trackIds.length} tracks
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (playlist.trackIds.length > 0) {
                        const firstTrack = tracks.find(t => t.id === playlist.trackIds[0]);
                        if (firstTrack) playTrack(firstTrack);
                      }
                    }}
                    className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"
                  >
                    <Play className="w-4 h-4 text-primary" fill="currentColor" />
                  </button>
                </button>
              ))}
              <button
                onClick={() => setShowCreatePlaylist(true)}
                className="w-full py-3 rounded-xl border-2 border-dashed border-white/20 text-muted-foreground font-medium text-sm flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="w-4 h-4" />
                New playlist
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Music className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2 text-sm">Create your first playlist</h3>
              <p className="text-muted-foreground text-xs mb-4">
                Organize your tracks
              </p>
              <button 
                onClick={() => setShowCreatePlaylist(true)}
                className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm"
              >
                New playlist
              </button>
            </div>
          )}
        </TabsContent>
      </Tabs>

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

const EmptyState = ({ onImport }: { onImport: () => void }) => (
  <div className="text-center py-12">
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
      <Music className="w-8 h-8 text-primary" />
    </div>
    <h3 className="text-lg font-bold mb-2">Library empty</h3>
    <p className="text-muted-foreground text-sm mb-5 max-w-xs mx-auto">
      Import your MP3 audio files
    </p>
    <button
      onClick={onImport}
      className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/30"
    >
      Import music
    </button>
  </div>
);

export default Library;
