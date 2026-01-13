import { useRef, useState } from 'react';
import { Plus, Music, Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import TrackCard from '@/components/TrackCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Library = () => {
  const { tracks, addTrack } = useMusic();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'artist'>('recent');

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

  return (
    <div className="min-h-screen pb-36 bg-background">
      <header className="p-5 pt-safe">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Bibliothèque</h1>
            <p className="text-muted-foreground mt-1">
              {tracks.length} morceaux • {favorites.length} favoris
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
          >
            <Plus className="w-6 h-6 text-primary-foreground" />
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
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-muted-foreground'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'name' | 'artist')}
              className="bg-white/5 border-0 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="recent">Récents</option>
              <option value="name">Titre</option>
              <option value="artist">Artiste</option>
            </select>
            <button className="p-2 rounded-lg text-muted-foreground hover:text-white transition-colors">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
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
        <TabsList className="w-full bg-white/5 mb-5 p-1 rounded-xl">
          <TabsTrigger 
            value="all" 
            className="flex-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Tous ({tracks.length})
          </TabsTrigger>
          <TabsTrigger 
            value="favorites" 
            className="flex-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Favoris ({favorites.length})
          </TabsTrigger>
          <TabsTrigger 
            value="playlists" 
            className="flex-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Playlists
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {sortedTracks.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-4">
                {sortedTracks.map((track) => (
                  <TrackCard key={track.id} track={track} />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {sortedTracks.map((track) => (
                  <TrackCard key={track.id} track={track} variant="list" />
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
              <div className="grid grid-cols-2 gap-4">
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
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Aucun favori pour l'instant</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Ajoutez des morceaux à vos favoris
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="playlists" className="mt-0">
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Créez votre première playlist</h3>
            <p className="text-muted-foreground mb-4">
              Organisez vos morceaux par ambiance ou occasion
            </p>
            <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold">
              Nouvelle playlist
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const EmptyState = ({ onImport }: { onImport: () => void }) => (
  <div className="text-center py-16">
    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-5">
      <Music className="w-10 h-10 text-primary" />
    </div>
    <h3 className="text-xl font-bold mb-2">Votre bibliothèque est vide</h3>
    <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
      Importez vos fichiers audio MP3 depuis votre appareil pour commencer
    </p>
    <button
      onClick={onImport}
      className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/30 transition-transform hover:scale-105"
    >
      Importer de la musique
    </button>
  </div>
);

export default Library;