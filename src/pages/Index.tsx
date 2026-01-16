import { useNavigate } from 'react-router-dom';
import { Play, Pause, ChevronRight, Plus } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

const MOOD_TAGS = [
  { id: 1, name: 'Joyeux', gradient: 'from-orange-500 to-red-500' },
  { id: 2, name: 'Énergique', gradient: 'from-pink-500 to-purple-600' },
  { id: 3, name: 'Relaxant', gradient: 'from-teal-400 to-blue-500' },
  { id: 4, name: 'Focus', gradient: 'from-violet-500 to-indigo-600' },
  { id: 5, name: 'Sport', gradient: 'from-amber-500 to-orange-600' },
];

const Index = () => {
  const navigate = useNavigate();
  const { tracks, currentTrack, isPlaying, playTrack, playlists } = useMusic();

  // Créer des playlists du jour à partir des tracks existants
  const dailyPlaylists = [
    {
      id: 'daily-1',
      name: 'Toujours OK',
      cover: tracks[0]?.cover || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
      artists: tracks.slice(0, 3).map(t => t.artist).join(', ') || 'Artistes variés',
    },
    {
      id: 'daily-2', 
      name: 'Nouveautés',
      cover: tracks[1]?.cover || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300',
      artists: tracks.slice(2, 5).map(t => t.artist).join(', ') || 'Découvertes',
    },
    {
      id: 'daily-3',
      name: 'Chill Vibes',
      cover: tracks[2]?.cover || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300',
      artists: 'Ambiance détente',
    },
    {
      id: 'daily-4',
      name: 'Top Hits',
      cover: tracks[3]?.cover || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300',
      artists: 'Les plus écoutés',
    },
  ];

  return (
    <div className="min-h-screen pb-40 bg-background">
      {/* Header minimaliste */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card/60 flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5 rotate-180 text-foreground/70" />
        </button>
        <h1 className="text-xl font-semibold">Son pour vous</h1>
        <div className="w-10" />
      </header>

      {/* Mood Tags - Cercles avec gradients */}
      <section className="py-4">
        <div className="flex gap-4 overflow-x-auto px-5 no-scrollbar">
          {MOOD_TAGS.map((mood) => (
            <button
              key={mood.id}
              className="flex flex-col items-center gap-2 flex-shrink-0"
            >
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${mood.gradient} flex items-center justify-center shadow-lg`}>
                <span className="text-white text-xs font-medium">{mood.name}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Playlists du jour */}
      <section className="py-6">
        <div className="flex items-center justify-between px-5 mb-4">
          <h2 className="text-lg font-semibold">Playlists du jour</h2>
          <button className="flex items-center gap-1 text-muted-foreground">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 px-5">
          {dailyPlaylists.map((playlist, index) => (
            <button
              key={playlist.id}
              onClick={() => {
                if (tracks.length > index) {
                  playTrack(tracks[index]);
                  navigate('/player');
                }
              }}
              className="relative overflow-hidden rounded-2xl aspect-square group"
            >
              <img
                src={playlist.cover}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Effet holographique léger */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-orange-500/20 opacity-60" />
              
              {/* Label */}
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium mb-2">
                  {playlist.name}
                </span>
                <p className="text-white/70 text-xs truncate">{playlist.artists}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Récemment écoutés */}
      {tracks.length > 0 && (
        <section className="py-6">
          <div className="flex items-center justify-between px-5 mb-4">
            <h2 className="text-lg font-semibold">Récemment écoutés</h2>
            <button 
              onClick={() => navigate('/library')}
              className="text-muted-foreground"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto px-5 no-scrollbar">
            {tracks.slice(0, 8).map((track) => (
              <button
                key={track.id}
                onClick={() => {
                  playTrack(track);
                  navigate('/player');
                }}
                className="flex-shrink-0 w-32"
              >
                <div className="relative mb-2">
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-32 h-32 rounded-xl object-cover shadow-lg"
                  />
                  {currentTrack?.id === track.id && isPlaying && (
                    <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Pause className="w-3 h-3 text-primary-foreground" fill="currentColor" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium truncate text-left">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate text-left">{track.artist}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Vos playlists */}
      {playlists.length > 0 && (
        <section className="py-6">
          <div className="flex items-center justify-between px-5 mb-4">
            <h2 className="text-lg font-semibold">Vos playlists</h2>
            <button 
              onClick={() => navigate('/library')}
              className="text-muted-foreground"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto px-5 no-scrollbar">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                className="flex-shrink-0 w-36"
              >
                <div className="w-36 h-36 rounded-xl bg-card/60 flex items-center justify-center mb-2 shadow-lg overflow-hidden">
                  {playlist.cover ? (
                    <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/40 to-violet-600/40 flex items-center justify-center">
                      <Plus className="w-8 h-8 text-white/50" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium truncate text-left">{playlist.name}</p>
                <p className="text-xs text-muted-foreground text-left">{playlist.trackIds.length} titres</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {tracks.length === 0 && (
        <section className="px-5 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
            <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Commencez votre aventure</h3>
          <p className="text-muted-foreground mb-6">
            Importez vos morceaux préférés
          </p>
          <button
            onClick={() => navigate('/library')}
            className="px-6 py-3 rounded-full bg-white text-black font-medium"
          >
            Importer de la musique
          </button>
        </section>
      )}
    </div>
  );
};

export default Index;
