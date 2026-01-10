import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Volume2, Trash2, Info, Moon, Bell } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

const Settings = () => {
  const navigate = useNavigate();
  const { volume, setVolume, tracks, removeTrack } = useMusic();
  const [notifications, setNotifications] = useState(false);

  const clearLibrary = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toute votre bibliothèque ?')) {
      tracks.forEach((t) => removeTrack(t.id));
    }
  };

  return (
    <div className="min-h-screen pb-36 bg-background">
      <header className="p-4 pt-safe flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full glass-button flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Paramètres</h1>
      </header>

      <div className="px-4 space-y-4">
        {/* Audio Settings */}
        <section className="glass-card p-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-primary" />
            Audio
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Volume principal</span>
                <span className="text-sm font-medium">{Math.round(volume * 100)}%</span>
              </div>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={([val]) => setVolume(val / 100)}
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="glass-card p-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h2>
          <div className="flex items-center justify-between">
            <span>Activer les notifications</span>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </section>

        {/* Appearance */}
        <section className="glass-card p-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Moon className="w-5 h-5 text-primary" />
            Apparence
          </h2>
          <div className="flex items-center justify-between">
            <span>Thème sombre</span>
            <Switch checked={true} disabled />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Le thème sombre est toujours activé pour une meilleure expérience
          </p>
        </section>

        {/* Storage */}
        <section className="glass-card p-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-primary" />
            Stockage
          </h2>
          <div className="flex items-center justify-between mb-4">
            <span>Morceaux importés</span>
            <span className="text-muted-foreground">{tracks.length} fichiers</span>
          </div>
          <button
            onClick={clearLibrary}
            disabled={tracks.length === 0}
            className="w-full py-3 rounded-xl bg-destructive/20 text-destructive font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Vider la bibliothèque
          </button>
        </section>

        {/* About */}
        <section className="glass-card p-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            À propos
          </h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Version</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Application</span>
              <span className="gradient-text font-semibold">MusicFlow</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
