import { useRef } from 'react';
import { Plus, Music } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import TrackCard from '@/components/TrackCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Library = () => {
  const { tracks, addTrack } = useMusic();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const favorites = tracks.filter((t) => t.isFavorite);

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
      <header className="p-4 pt-safe">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Bibliothèque</h1>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium"
          >
            <Plus className="w-5 h-5" />
            Importer
          </button>
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

      <Tabs defaultValue="all" className="px-4">
        <TabsList className="w-full bg-secondary mb-4">
          <TabsTrigger value="all" className="flex-1">
            Tous ({tracks.length})
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex-1">
            Favoris ({favorites.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {tracks.length > 0 ? (
            <div className="space-y-1">
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} variant="list" />
              ))}
            </div>
          ) : (
            <EmptyState onImport={() => fileInputRef.current?.click()} />
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-0">
          {favorites.length > 0 ? (
            <div className="space-y-1">
              {favorites.map((track) => (
                <TrackCard key={track.id} track={track} variant="list" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun favori pour l'instant</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const EmptyState = ({ onImport }: { onImport: () => void }) => (
  <div className="text-center py-12">
    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
      <Music className="w-8 h-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">Aucune musique</h3>
    <p className="text-muted-foreground mb-4">
      Importez des fichiers MP3 depuis votre appareil
    </p>
    <button
      onClick={onImport}
      className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold"
    >
      Importer de la musique
    </button>
  </div>
);

export default Library;
