import { useState } from 'react';
import { Search as SearchIcon, X, Play, TrendingUp } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import TrackCard from '@/components/TrackCard';
import { Input } from '@/components/ui/input';

const GENRES = [
  { id: 1, name: 'Pop', gradient: 'from-pink-500 to-rose-600', icon: '🎵' },
  { id: 2, name: 'Hip-Hop', gradient: 'from-purple-600 to-violet-700', icon: '🎤' },
  { id: 3, name: 'Rock', gradient: 'from-red-500 to-orange-600', icon: '🎸' },
  { id: 4, name: 'Électro', gradient: 'from-cyan-400 to-blue-600', icon: '🎧' },
  { id: 5, name: 'Jazz', gradient: 'from-amber-500 to-yellow-600', icon: '🎷' },
  { id: 6, name: 'Classique', gradient: 'from-slate-400 to-slate-600', icon: '🎻' },
  { id: 7, name: 'R&B', gradient: 'from-fuchsia-500 to-pink-600', icon: '💜' },
  { id: 8, name: 'Indie', gradient: 'from-emerald-500 to-teal-600', icon: '🌿' },
];

const TRENDING_SEARCHES = [
  'Taylor Swift',
  'Bad Bunny',
  'The Weeknd',
  'Drake',
  'Dua Lipa',
];

const Search = () => {
  const { tracks, playTrack } = useMusic();
  const [query, setQuery] = useState('');

  const filteredTracks = tracks.filter(
    (track) =>
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase()) ||
      track.album.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-36 bg-background">
      {/* Header avec titre */}
      <header className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold mb-5">Découvrir</h1>
        
        {/* Barre de recherche */}
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Artistes, titres, albums..."
            className="pl-12 pr-10 h-12 bg-white/10 border-0 rounded-full text-white placeholder:text-white/40"
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

      {query ? (
        /* Résultats de recherche */
        <div className="px-5">
          {filteredTracks.length > 0 ? (
            <div className="space-y-1">
              {filteredTracks.map((track) => (
                <TrackCard key={track.id} track={track} variant="list" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="w-8 h-8 text-white/40" />
              </div>
              <p className="text-white/60">
                Aucun résultat pour "{query}"
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Page de découverte par défaut */
        <div className="px-5">
          {/* Tendances */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Tendances</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map((term, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 rounded-full bg-white/10 text-sm text-white/80 hover:bg-white/20 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </section>

          {/* Parcourir par genre */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Parcourir par genre</h2>
            <div className="grid grid-cols-2 gap-3">
              {GENRES.map((genre) => (
                <button
                  key={genre.id}
                  className={`relative h-24 rounded-2xl bg-gradient-to-br ${genre.gradient} overflow-hidden group`}
                >
                  <div className="absolute inset-0 flex items-center justify-between px-4">
                    <span className="text-white font-bold text-lg">{genre.name}</span>
                    <span className="text-3xl opacity-80">{genre.icon}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </button>
              ))}
            </div>
          </section>

          {/* Recommandations */}
          {tracks.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4">Recommandé pour vous</h2>
              <div className="space-y-2">
                {tracks.slice(0, 5).map((track) => (
                  <button
                    key={track.id}
                    onClick={() => playTrack(track)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <img
                      src={track.cover}
                      alt={track.title}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-white font-medium truncate">{track.title}</p>
                      <p className="text-white/50 text-sm truncate">{track.artist}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
