import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Music, Grid3X3, List, X, Play, Pause, Camera, Image, Heart, MoreVertical, Search, Film } from 'lucide-react';
import { useMusic, Track } from '@/contexts/MusicContext';
import TrackOptionsSheet from '@/components/TrackOptionsSheet';

const Library = () => {
  const navigate = useNavigate();
  const { tracks, addTrack, playlists, createPlaylist, playTrack, currentTrack, isPlaying, togglePlay, updateTrackCover } = useMusic();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'playlists'>('all');
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [targetTrackId, setTargetTrackId] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const favorites = tracks.filter(t => t.isFavorite);
  const baseTracks = activeTab === 'favorites' ? favorites : tracks;
  const displayTracks = searchQuery
    ? baseTracks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.artist.toLowerCase().includes(searchQuery.toLowerCase()))
    : baseTracks;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      if (file.type.startsWith('audio/')) await addTrack(file);
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

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && targetTrackId) {
      updateTrackCover(targetTrackId, URL.createObjectURL(file));
    }
    setShowCameraModal(false);
    setTargetTrackId(null);
  };

  const handleTrackPlay = (track: Track) => {
    if (currentTrack?.id === track.id) togglePlay();
    else playTrack(track);
  };

  const tabs = [
    { key: 'all' as const, label: 'Tout', count: tracks.length },
    { key: 'favorites' as const, label: 'Favoris', count: favorites.length },
    { key: 'playlists' as const, label: 'Playlists', count: playlists.length },
  ];

  return (
    <div className="min-h-screen pb-36 bg-background">
      {/* Header */}
      <header className="px-5 pt-14 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold leading-tight">Bibliothèque</h1>
            <p className="text-xs text-muted-foreground mt-1">
              {tracks.length} titre{tracks.length !== 1 ? 's' : ''} • {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-background" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="w-full bg-card border border-border/20 rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring/30"
          />
        </div>

        {/* Quick access to videos */}
        <button
          onClick={() => navigate('/videos')}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border/20 mb-2"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Film className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold">Mes Vidéos</p>
            <p className="text-xs text-muted-foreground">Vidéos importées localement</p>
          </div>
        </button>

        <input ref={fileInputRef} type="file" accept="audio/*" multiple onChange={handleFileSelect} className="hidden" />
      </header>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'bg-foreground text-background'
                  : 'bg-card border border-border/20 text-muted-foreground'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5">
        {activeTab !== 'playlists' ? (
          <>
            {displayTracks.length > 0 && (
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{displayTracks.length} résultat{displayTracks.length !== 1 ? 's' : ''}</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${viewMode === 'list' ? 'text-foreground' : 'text-muted-foreground/50'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${viewMode === 'grid' ? 'text-foreground' : 'text-muted-foreground/50'}`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {displayTracks.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-2 gap-3">
                  {displayTracks.map(track => {
                    const isActive = currentTrack?.id === track.id;
                    return (
                      <button key={track.id} onClick={() => handleTrackPlay(track)} className="text-left">
                        <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                          <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          {isActive && isPlaying && (
                            <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center">
                              <Pause className="w-4 h-4 text-background" fill="currentColor" />
                            </div>
                          )}
                          {track.isFavorite && (
                            <div className="absolute top-2 right-2">
                              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-semibold truncate">{track.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-1">
                  {displayTracks.map(track => {
                    const isActive = currentTrack?.id === track.id;
                    return (
                      <div
                        key={track.id}
                        className={`flex items-center gap-3 py-2.5 px-3 rounded-xl transition-colors ${isActive ? 'bg-card' : ''}`}
                      >
                        <button onClick={() => handleTrackPlay(track)} className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                          {isActive && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              {isPlaying ? (
                                <Pause className="w-4 h-4 text-white" fill="currentColor" />
                              ) : (
                                <Play className="w-4 h-4 text-white ml-px" fill="currentColor" />
                              )}
                            </div>
                          )}
                        </button>
                        <button onClick={() => handleTrackPlay(track)} className="flex-1 min-w-0 text-left">
                          <p className={`text-sm font-semibold truncate ${isActive ? 'text-foreground' : ''}`}>{track.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{track.artist} • {Math.floor(track.duration / 60)}:{String(Math.floor(track.duration % 60)).padStart(2, '0')}</p>
                        </button>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {track.isFavorite && <Heart className="w-4 h-4 text-red-500 fill-red-500" />}
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedTrack(track); setShowOptions(true); }}
                            className="p-1.5"
                          >
                            <MoreVertical className="w-5 h-5 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <EmptyState onImport={() => fileInputRef.current?.click()} type={activeTab} />
            )}
          </>
        ) : (
          <div>
            {playlists.length > 0 ? (
              <div className="space-y-2">
                {playlists.map(playlist => (
                  <button
                    key={playlist.id}
                    onClick={() => navigate(`/playlist/${playlist.id}`)}
                    className="w-full flex items-center gap-3 bg-card/50 border border-border/10 rounded-xl p-3"
                  >
                    <img src={playlist.cover} alt={playlist.name} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-semibold text-sm truncate">{playlist.name}</p>
                      <p className="text-xs text-muted-foreground">{playlist.trackIds.length} titre{playlist.trackIds.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                      <Play className="w-4 h-4 ml-px" fill="currentColor" />
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => setShowCreatePlaylist(true)}
                  className="w-full py-3 rounded-xl border border-dashed border-border/30 text-muted-foreground text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle playlist
                </button>
              </div>
            ) : (
              <div className="text-center py-16">
                <Music className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold text-base mb-1">Aucune playlist</h3>
                <p className="text-muted-foreground text-sm mb-5">Crée ta première playlist</p>
                <button
                  onClick={() => setShowCreatePlaylist(true)}
                  className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm"
                >
                  Créer
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Playlist Modal */}
      {showCreatePlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreatePlaylist(false)} />
          <div className="relative bg-card rounded-2xl p-5 w-full max-w-sm border border-border/10 animate-fade-in">
            <button onClick={() => setShowCreatePlaylist(false)} className="absolute top-4 right-4">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
            <h3 className="text-base font-bold mb-4">Nouvelle playlist</h3>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Nom de la playlist"
              className="w-full bg-muted rounded-xl px-4 py-3 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring/30 mb-4 text-sm"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()}
            />
            <button
              onClick={handleCreatePlaylist}
              disabled={!newPlaylistName.trim()}
              className="w-full py-3 rounded-xl bg-foreground text-background font-semibold text-sm disabled:opacity-40"
            >
              Créer
            </button>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCameraModal(false)} />
          <div className="relative bg-card rounded-t-3xl p-6 w-full max-w-lg animate-slide-up">
            <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-6" />
            <h3 className="text-sm font-bold mb-5 text-center">Changer la couverture</h3>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center gap-2.5 p-5 bg-muted/50 rounded-2xl">
                <Camera className="w-7 h-7 text-muted-foreground" />
                <span className="font-medium text-sm">Caméra</span>
              </button>
              <button onClick={() => galleryInputRef.current?.click()} className="flex flex-col items-center gap-2.5 p-5 bg-muted/50 rounded-2xl">
                <Image className="w-7 h-7 text-muted-foreground" />
                <span className="font-medium text-sm">Galerie</span>
              </button>
            </div>
            <button onClick={() => setShowCameraModal(false)} className="w-full py-3.5 rounded-xl bg-muted/50 text-muted-foreground font-medium text-sm">
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

const EmptyState = ({ onImport, type }: { onImport: () => void; type: string }) => (
  <div className="text-center py-16">
    <div className="w-16 h-16 rounded-full bg-card border border-border/10 flex items-center justify-center mx-auto mb-4">
      {type === 'favorites' ? <Heart className="w-7 h-7 text-muted-foreground" /> : <Music className="w-7 h-7 text-muted-foreground" />}
    </div>
    <h3 className="text-base font-bold mb-1">{type === 'favorites' ? 'Aucun favori' : 'Bibliothèque vide'}</h3>
    <p className="text-muted-foreground text-sm mb-5">{type === 'favorites' ? 'Ajoute des titres en favoris' : 'Importe tes fichiers audio'}</p>
    {type !== 'favorites' && (
      <button onClick={onImport} className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm">
        Importer
      </button>
    )}
  </div>
);

export default Library;
