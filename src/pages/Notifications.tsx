import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  ChevronLeft, 
  Bell, 
  Music, 
  Heart, 
  Users, 
  Download,
  CheckCircle2,
  Star,
  Disc3,
  Gift,
  Megaphone,
  Settings,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface Notification {
  id: string;
  type: 'music' | 'social' | 'system' | 'promo';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: typeof Bell;
  iconBg: string;
  iconColor: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'music',
    title: 'Nouvelle musique disponible',
    message: 'Découvrez les dernières tendances musicales',
    time: 'Il y a 5 min',
    read: false,
    icon: Music,
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-500',
  },
  {
    id: '2',
    type: 'social',
    title: 'Nouvel abonné',
    message: 'MusicLover vous suit maintenant',
    time: 'Il y a 1h',
    read: false,
    icon: Users,
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-500',
  },
  {
    id: '3',
    type: 'promo',
    title: 'Offre spéciale Premium',
    message: '50% de réduction sur l\'abonnement annuel',
    time: 'Il y a 2h',
    read: true,
    icon: Gift,
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-500',
  },
  {
    id: '4',
    type: 'system',
    title: 'Mise à jour terminée',
    message: 'MusicFlow a été mis à jour avec de nouvelles fonctionnalités',
    time: 'Hier',
    read: true,
    icon: CheckCircle2,
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-500',
  },
  {
    id: '5',
    type: 'music',
    title: 'Playlist mise à jour',
    message: 'Votre playlist "Favoris" a été mise à jour',
    time: 'Hier',
    read: true,
    icon: Disc3,
    iconBg: 'bg-pink-500/20',
    iconColor: 'text-pink-500',
  },
];

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    pushEnabled: true,
    musicUpdates: true,
    socialActivity: true,
    promotions: false,
    systemAlerts: true,
  });

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="p-5 pt-safe">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-primary">{unreadCount} non lues</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-white/10 text-muted-foreground'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'unread' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-white/10 text-muted-foreground'
            }`}
          >
            Non lues ({unreadCount})
          </button>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="ml-auto px-4 py-2 rounded-full text-sm font-medium text-primary"
            >
              Tout lire
            </button>
          )}
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mx-5 mb-4 bg-card/60 backdrop-blur rounded-2xl p-4 animate-fade-in">
          <h3 className="font-semibold mb-4">Paramètres de notification</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-blue-500" />
                <span>Notifications push</span>
              </div>
              <Switch 
                checked={settings.pushEnabled}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, pushEnabled: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-green-500" />
                <span>Mises à jour musicales</span>
              </div>
              <Switch 
                checked={settings.musicUpdates}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, musicUpdates: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-500" />
                <span>Activité sociale</span>
              </div>
              <Switch 
                checked={settings.socialActivity}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, socialActivity: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-amber-500" />
                <span>Promotions</span>
              </div>
              <Switch 
                checked={settings.promotions}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, promotions: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Megaphone className="w-5 h-5 text-red-500" />
                <span>Alertes système</span>
              </div>
              <Switch 
                checked={settings.systemAlerts}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, systemAlerts: checked }))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="px-5 pb-36">
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 rounded-2xl transition-colors ${
                  notification.read ? 'bg-white/5' : 'bg-primary/10 border border-primary/20'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl ${notification.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <notification.icon className={`w-6 h-6 ${notification.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground/60 mt-2">{notification.time}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 rounded-full hover:bg-white/10"
                        >
                          <Check className="w-4 h-4 text-green-500" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 rounded-full hover:bg-white/10"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear All Button */}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="w-full py-4 rounded-xl bg-red-500/10 text-red-500 font-medium mt-4"
              >
                <Trash2 className="w-4 h-4 inline mr-2" />
                Supprimer toutes les notifications
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Aucune notification</h3>
            <p className="text-muted-foreground">
              Vous êtes à jour !
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
