import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Music, Grid3X3, List, X, Play, Camera, Image } from 'lucide-react';
import { useMusic, Track } from '@/contexts/MusicContext';
import TrackCard from '@/components/TrackCard';
import TrackOptionsSheet from '@/components/TrackOptionsSheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Library = () => {
  const navigate = useNavigate();
  const { tracks, addTrack, playlists, createPlaylist, playTrack, updateTrackCover } = useMusic();
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

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      {/* Header */}
      <header className="px-5 pt-12 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">Bibliothèque</h1>
            <p className="text-muted-foreground text-xs mt-0.5">
              {tracks.length} titre{tracks.length !== 1 ? 's' : ''} • {favorites.length} favori{favorites.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-background" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-card text-foreground' : 'text-muted-foreground'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-card text-foreground' : 'text-muted-foreground'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'name' | 'artist')}
            className="bg-card border border-border/30 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="recent">Récent</option>
            <option value="name">Titre</option>
            <option value="artist">Artiste</option>
          </select>
        </div>

        <input ref={fileInputRef} type="file" accept="audio/*" multiple onChange={handleFileSelect} className="hidden" />
      </header>

      <Tabs defaultValue="all" className="px-5">
        <TabsList className="w-full bg-card mb-3 p-1 rounded-xl border border-border/30">
          <TabsTrigger value="all" className="flex-1 rounded-lg text-xs data-[state=active]:bg-foreground data-[state=active]:text-background">
            Tout ({tracks.length})
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex-1 rounded-lg text-xs data-[state=active]:bg-foreground data-[state=active]:text-background">
            Favoris ({favorites.length})
          </TabsTrigger>
          <TabsTrigger value="playlists" className="flex-1 rounded-lg text-xs data-[state=active]:bg-foreground data-[state=active]:text-background">
            Playlists
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {sortedTracks.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-3">
                {sortedTracks.map((track) => (
                  <TrackCard key={track.id} track={track} onEditCover={() => handleOpenCamera('track', track.id)} />
                ))}
              </div>
            ) : (
              <div className="space-y-0.5">
                {sortedTracks.map((track) => (
                  <TrackCard key={track.id} track={track} variant="list" onEditCover={() => handleOpenCamera('track', track.id)} />
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
              <div className="space-y-0.5">
                {sortedFavorites.map((track) => (
                  <TrackCard key={track.id} track={track} variant="list" />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <Music className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Aucun favori</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="playlists" className="mt-0">
          {showCreatePlaylist && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreatePlaylist(false)} />
              <div className="relative bg-card rounded-2xl p-5 w-full max-w-sm animate-fade-in border border-border/30">
                <button onClick={() => setShowCreatePlaylist(false)} className="absolute top-4 right-4">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
                <h3 className="text-base font-bold mb-4">Nouvelle playlist</h3>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Nom de la playlist"
                  className="w-full bg-muted rounded-xl px-4 py-3 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring mb-4 text-sm"
                  autoFocus
                />
                <button
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim()}
                  className="w-full py-3 rounded-xl bg-foreground text-background font-semibold text-sm disabled:opacity-50"
                >
                  Créer
                </button>
              </div>
            </div>
          )}

          {playlists.length > 0 ? (
            <div className="space-y-2">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                  className="w-full flex items-center gap-3 bg-card/60 border border-border/30 rounded-xl p-3"
                >
                  <img src={playlist.cover} alt={playlist.name} className="w-13 h-13 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-semibold text-sm truncate">{playlist.name}</p>
                    <p className="text-xs text-muted-foreground">{playlist.trackIds.length} titre{playlist.trackIds.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-foreground/10 flex items-center justify-center">
                    <Play className="w-4 h-4" fill="currentColor" />
                  </div>
                </button>
              ))}
              <button
                onClick={() => setShowCreatePlaylist(true)}
                className="w-full py-3 rounded-xl border border-dashed border-border text-muted-foreground font-medium text-sm flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouvelle playlist
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <Music className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-sm mb-2">Crée ta première playlist</h3>
              <p className="text-muted-foreground text-xs mb-4">Organise tes morceaux</p>
              <button
                onClick={() => setShowCreatePlaylist(true)}
                className="px-5 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm"
              >
                Nouvelle playlist
              </button>
            </div>
          )}
        </TabsContent>
      </Tabs>

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
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageCapture} className="hidden" />
            <input ref={galleryInputRef} type="file" accept="image/*" onChange={handleImageCapture} className="hidden" />
          </div>
        </div>
      )}

      {selectedTrack && (
        <TrackOptionsSheet track={selectedTrack} isOpen={showOptions} onClose={() => { setShowOptions(false); setSelectedTrack(null); }} />
      )}
    </div>
  );
};

const EmptyState = ({ onImport }: { onImport: () => void }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 rounded-full bg-card border border-border/30 flex items-center justify-center mx-auto mb-4">
      <Music className="w-7 h-7 text-muted-foreground" />
    </div>
    <h3 className="text-base font-bold mb-2">Bibliothèque vide</h3>
    <p className="text-muted-foreground text-xs mb-5">Importe tes fichiers audio MP3</p>
    <button onClick={onImport} className="px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm">
      Importer
    </button>
  </div>
);

export default Library;
