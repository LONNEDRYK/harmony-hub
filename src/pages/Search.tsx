import { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import TrackCard from '@/components/TrackCard';
import { Input } from '@/components/ui/input';

const Search = () => {
  const { tracks } = useMusic();
  const [query, setQuery] = useState('');

  const filteredTracks = tracks.filter(
    (track) =>
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase()) ||
      track.album.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-36 bg-background">
      <header className="p-4 pt-safe">
        <h1 className="text-2xl font-bold mb-4">Rechercher</h1>
        
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Titre, artiste, album..."
            className="pl-12 pr-10 h-12 bg-secondary border-0 rounded-xl"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
      </header>

      <div className="px-4">
        {query ? (
          filteredTracks.length > 0 ? (
            <div className="space-y-1">
              {filteredTracks.map((track) => (
                <TrackCard key={track.id} track={track} variant="list" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucun résultat pour "{query}"
              </p>
            </div>
          )
        ) : (
          <div className="py-8">
            <h2 className="text-lg font-semibold mb-4">Parcourir tout</h2>
            {tracks.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {tracks.map((track) => (
                  <TrackCard key={track.id} track={track} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Importez de la musique pour commencer
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
