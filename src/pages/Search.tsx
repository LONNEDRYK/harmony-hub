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
    <div className="min-h-screen pb-32 bg-background">
      <header className="px-4 pt-11 pb-3">
        <h1 className="text-base font-bold mb-3">Découvrir</h1>
        <div className="relative">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Artistes, titres, albums..."
            className="pl-10 pr-10 h-10 bg-white/10 border-0 rounded-full text-sm placeholder:text-white/40"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </header>

      {query ? (
        <div className="px-4">
          {filteredTracks.length > 0 ? (
            <div className="space-y-1">
              {filteredTracks.map((track) => (
                <TrackCard key={track.id} track={track} variant="list" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                <SearchIcon className="w-6 h-6 text-white/40" />
              </div>
              <p className="text-white/60 text-sm">Aucun résultat pour "{query}"</p>
            </div>
          )}
        </div>
      ) : (
        <div className="px-4">
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold">Tendances</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map((term, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(term)}
                  className="px-3.5 py-2 rounded-full bg-white/10 text-xs font-medium text-white/80 hover:bg-white/20 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-sm font-semibold mb-3">Parcourir par genre</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {GENRES.map((genre) => (
                <button
                  key={genre.id}
                  className={`relative h-20 rounded-xl bg-gradient-to-br ${genre.gradient} overflow-hidden group`}
                >
                  <div className="absolute inset-0 flex items-center justify-between px-3.5">
                    <span className="text-white font-bold text-sm">{genre.name}</span>
                    <span className="text-2xl opacity-80">{genre.icon}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {tracks.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold mb-3">Recommandé pour vous</h2>
              <div className="space-y-2">
                {tracks.slice(0, 5).map((track) => (
                  <button
                    key={track.id}
                    onClick={() => playTrack(track)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <img src={track.cover} alt={track.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate">{track.title}</p>
                      <p className="text-xs text-white/50 truncate">{track.artist}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
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
