import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  ChevronLeft, Bell, Music, Film, Heart, CheckCircle2, Disc3, Settings, Trash2, Check, X
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useMusic } from '@/contexts/MusicContext';
import { useVideo } from '@/contexts/VideoContext';

interface Notification {
  id: string;
  type: 'music' | 'video' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: typeof Bell;
  iconBg: string;
  iconColor: string;
}

const Notifications = () => {
  const navigate = useNavigate();
  const { tracks } = useMusic();
  const { videos } = useVideo();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    pushEnabled: true, musicUpdates: true, videoUpdates: true, systemAlerts: true,
  });

  useEffect(() => {
    const notifs: Notification[] = [];
    tracks.forEach((track, i) => {
      notifs.push({
        id: `track-${track.id}`, type: 'music', title: 'Chanson importée',
        message: `"${track.title}" par ${track.artist} ajouté à la bibliothèque`,
        time: i === 0 ? 'Récemment' : `Il y a ${i + 1} import${i > 0 ? 's' : ''}`,
        read: i > 1, icon: Music, iconBg: 'bg-blue-500/20', iconColor: 'text-blue-500',
      });
    });
    videos.forEach((video, i) => {
      notifs.push({
        id: `video-${video.id}`, type: 'video', title: 'Vidéo importée',
        message: `"${video.title}" ajouté à vos vidéos`,
        time: i === 0 ? 'Récemment' : `Il y a ${i + 1} import${i > 0 ? 's' : ''}`,
        read: i > 0, icon: Film, iconBg: 'bg-purple-500/20', iconColor: 'text-purple-500',
      });
    });
    if (tracks.length > 0) {
      const favCount = tracks.filter(t => t.isFavorite).length;
      if (favCount > 0) {
        notifs.push({
          id: 'fav-summary', type: 'music', title: 'Favoris',
          message: `Vous avez ${favCount} chanson${favCount > 1 ? 's' : ''} en favoris`,
          time: 'Résumé', read: true, icon: Heart, iconBg: 'bg-red-500/20', iconColor: 'text-red-500',
        });
      }
    }
    if (notifs.length === 0) {
      notifs.push({
        id: 'welcome', type: 'system', title: 'Bienvenue sur LumyVortex',
        message: 'Importez vos chansons et vidéos pour commencer',
        time: 'Maintenant', read: false, icon: CheckCircle2, iconBg: 'bg-green-500/20', iconColor: 'text-green-500',
      });
    }
    setNotifications(notifs);
  }, [tracks, videos]);

  const filteredNotifications = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;
  const unreadCount = notifications.filter(n => !n.read).length;
  const markAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const deleteNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
  const clearAll = () => setNotifications([]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <header className="px-4 pt-11 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base font-bold">Notifications</h1>
              {unreadCount > 0 && <p className="text-xs text-primary">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>}
            </div>
          </div>
          <button onClick={() => setShowSettings(!showSettings)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex gap-2 mb-3">
          {(['all', 'unread'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f ? 'bg-primary text-primary-foreground' : 'bg-white/10 text-muted-foreground'
              }`}
            >
              {f === 'all' ? 'Toutes' : `Non lues (${unreadCount})`}
            </button>
          ))}
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="ml-auto px-3 py-1.5 rounded-full text-xs font-medium text-primary">
              Tout lire
            </button>
          )}
        </div>
      </header>

      {showSettings && (
        <div className="mx-4 mb-3 bg-card/60 backdrop-blur rounded-xl p-3 animate-fade-in">
          <h3 className="text-sm font-semibold mb-3">Paramètres</h3>
          <div className="space-y-3">
            {[
              { key: 'pushEnabled', icon: Bell, color: 'text-blue-500', label: 'Notifications push' },
              { key: 'musicUpdates', icon: Music, color: 'text-green-500', label: 'Mises à jour musique' },
              { key: 'videoUpdates', icon: Film, color: 'text-purple-500', label: 'Mises à jour vidéos' },
              { key: 'systemAlerts', icon: Disc3, color: 'text-amber-500', label: 'Alertes système' },
            ].map(({ key, icon: Icon, color, label }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-sm">{label}</span>
                </div>
                <Switch 
                  checked={settings[key as keyof typeof settings]}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, [key]: checked }))}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 pb-32">
        {filteredNotifications.length > 0 ? (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                  notification.read ? 'bg-white/5' : 'bg-primary/10 border border-primary/20'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg ${notification.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <notification.icon className={`w-4 h-4 ${notification.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold truncate">{notification.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{notification.message}</p>
                      <p className="text-[11px] text-muted-foreground/60 mt-1">{notification.time}</p>
                    </div>
                    <div className="flex items-center">
                      {!notification.read && (
                        <button onClick={() => markAsRead(notification.id)} className="p-1.5 rounded-full hover:bg-white/10">
                          <Check className="w-3.5 h-3.5 text-green-500" />
                        </button>
                      )}
                      <button onClick={() => deleteNotification(notification.id)} className="p-1.5 rounded-full hover:bg-white/10">
                        <X className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {notifications.length > 0 && (
              <button onClick={clearAll} className="w-full py-2.5 rounded-lg bg-red-500/10 text-red-500 font-medium text-xs mt-3">
                <Trash2 className="w-3.5 h-3.5 inline mr-1.5" />
                Supprimer tout
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-14">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold mb-1">Aucune notification</h3>
            <p className="text-xs text-muted-foreground">Vous êtes à jour !</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
