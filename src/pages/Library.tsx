import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Music, Grid3X3, List, X, Play, Pause, Camera, Image, Heart, MoreVertical } from 'lucide-react';
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
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [targetTrackId, setTargetTrackId] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const favorites = tracks.filter(t => t.isFavorite);
  const displayTracks = activeTab === 'favorites' ? favorites : tracks;

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
    { key: 'all' as const, label: `Tout (${tracks.length})` },
    { key: 'favorites' as const, label: `Favoris (${favorites.length})` },
    { key: 'playlists' as const, label: 'Playlists' },
  ];

  return (
    <div className="min-h-screen pb-36 bg-background">
      {/* Header */}
      <header className="px-5 pt-14 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Bibliothèque</h1>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center"
          >
            <Plus className="w-4 h-4 text-background" />
          </button>
        </div>
        <input ref={fileInputRef} type="file" accept="audio/*" multiple onChange={handleFileSelect} className="hidden" />
      </header>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'bg-foreground text-background'
                  : 'bg-card border border-border/30 text-muted-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-5">
        {activeTab !== 'playlists' ? (
          <>
            {/* View toggle */}
            {displayTracks.length > 0 && (
              <div className="flex items-center justify-end gap-1 mb-3">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            )}

            {displayTracks.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-2 gap-3">
                  {displayTracks.map(track => {
                    const isActive = currentTrack?.id === track.id;
                    return (
                      <button key={track.id} onClick={() => handleTrackPlay(track)} className="text-left">
                        <div className="relative aspect-square rounded-xl overflow-hidden mb-1.5">
                          <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          {isActive && isPlaying && (
                            <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center">
                              <Pause className="w-3.5 h-3.5 text-background" fill="currentColor" />
                            </div>
                          )}
                          {track.isFavorite && (
                            <div className="absolute top-2 right-2">
                              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs font-semibold truncate">{track.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{track.artist}</p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-0.5">
                  {displayTracks.map(track => {
                    const isActive = currentTrack?.id === track.id;
                    return (
                      <div
                        key={track.id}
                        className={`flex items-center gap-3 p-2.5 rounded-xl ${isActive ? 'bg-card' : ''}`}
                      >
                        <button onClick={() => handleTrackPlay(track)} className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0">
                          <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                        </button>
                        <button onClick={() => handleTrackPlay(track)} className="flex-1 min-w-0 text-left">
                          <p className="text-xs font-semibold truncate">{track.title}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{track.artist}</p>
                        </button>
                        <div className="flex items-center gap-1 shrink-0">
                          {track.isFavorite && <Heart className="w-3 h-3 text-red-500 fill-red-500" />}
                          <button
                            onClick={() => { setSelectedTrack(track); setShowOptions(true); }}
                            className="p-1.5"
                          >
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
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
          /* Playlists tab */
          <div>
            {playlists.length > 0 ? (
              <div className="space-y-2">
                {playlists.map(playlist => (
                  <button
                    key={playlist.id}
                    onClick={() => navigate(`/playlist/${playlist.id}`)}
                    className="w-full flex items-center gap-3 bg-card/60 border border-border/20 rounded-xl p-3"
                  >
                    <img src={playlist.cover} alt={playlist.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-semibold text-sm truncate">{playlist.name}</p>
                      <p className="text-[11px] text-muted-foreground">{playlist.trackIds.length} titre{playlist.trackIds.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 ml-0.5" fill="currentColor" />
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => setShowCreatePlaylist(true)}
                  className="w-full py-3 rounded-xl border border-dashed border-border/40 text-muted-foreground text-xs font-medium flex items-center justify-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nouvelle playlist
                </button>
              </div>
            ) : (
              <div className="text-center py-16">
                <Music className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold text-sm mb-2">Aucune playlist</h3>
                <p className="text-muted-foreground text-xs mb-5">Crée ta première playlist</p>
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
          <div className="relative bg-card rounded-2xl p-5 w-full max-w-sm border border-border/20 animate-fade-in">
            <button onClick={() => setShowCreatePlaylist(false)} className="absolute top-4 right-4">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
            <h3 className="text-sm font-bold mb-4">Nouvelle playlist</h3>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Nom de la playlist"
              className="w-full bg-muted rounded-xl px-4 py-3 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring mb-4 text-sm"
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
              <button onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center gap-2 p-5 bg-muted/50 rounded-2xl">
                <Camera className="w-6 h-6 text-muted-foreground" />
                <span className="font-medium text-xs">Caméra</span>
              </button>
              <button onClick={() => galleryInputRef.current?.click()} className="flex flex-col items-center gap-2 p-5 bg-muted/50 rounded-2xl">
                <Image className="w-6 h-6 text-muted-foreground" />
                <span className="font-medium text-xs">Galerie</span>
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
    <div className="w-16 h-16 rounded-full bg-card border border-border/20 flex items-center justify-center mx-auto mb-4">
      {type === 'favorites' ? <Heart className="w-6 h-6 text-muted-foreground" /> : <Music className="w-6 h-6 text-muted-foreground" />}
    </div>
    <h3 className="text-sm font-bold mb-2">{type === 'favorites' ? 'Aucun favori' : 'Bibliothèque vide'}</h3>
    <p className="text-muted-foreground text-xs mb-5">{type === 'favorites' ? 'Ajoute des titres en favoris' : 'Importe tes fichiers audio'}</p>
    {type !== 'favorites' && (
      <button onClick={onImport} className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm">
        Importer
      </button>
    )}
  </div>
);

export default Library;
