import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight,
  Volume2, 
  Trash2, 
  Info, 
  Moon, 
  Bell,
  Smartphone,
  Globe,
  Shield,
  HelpCircle,
  Star,
  Palette,
  Wifi
} from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

const Settings = () => {
  const navigate = useNavigate();
  const { volume, setVolume, tracks, removeTrack } = useMusic();
  const [notifications, setNotifications] = useState(false);
  const [highQuality, setHighQuality] = useState(true);

  const clearLibrary = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toute votre bibliothèque ?')) {
      tracks.forEach((t) => removeTrack(t.id));
    }
  };

  const settingsSections = [
    {
      title: 'Lecture',
      items: [
        {
          icon: Volume2,
          iconBg: 'bg-blue-500/20',
          iconColor: 'text-blue-500',
          label: 'Qualité audio',
          value: 'Haute qualité',
          toggle: true,
          checked: highQuality,
          onToggle: setHighQuality,
        },
        {
          icon: Wifi,
          iconBg: 'bg-green-500/20',
          iconColor: 'text-green-500',
          label: 'Streaming Wi-Fi uniquement',
          value: '',
          toggle: true,
          checked: false,
          onToggle: () => {},
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          iconBg: 'bg-orange-500/20',
          iconColor: 'text-orange-500',
          label: 'Notifications push',
          value: '',
          toggle: true,
          checked: notifications,
          onToggle: setNotifications,
        },
      ],
    },
    {
      title: 'Apparence',
      items: [
        {
          icon: Moon,
          iconBg: 'bg-purple-500/20',
          iconColor: 'text-purple-500',
          label: 'Thème sombre',
          value: 'Activé',
          toggle: true,
          checked: true,
          disabled: true,
        },
        {
          icon: Palette,
          iconBg: 'bg-pink-500/20',
          iconColor: 'text-pink-500',
          label: 'Couleur d\'accent',
          value: 'Or',
          action: () => {},
        },
        {
          icon: Globe,
          iconBg: 'bg-cyan-500/20',
          iconColor: 'text-cyan-500',
          label: 'Langue',
          value: 'Français',
          action: () => {},
        },
      ],
    },
    {
      title: 'Stockage',
      items: [
        {
          icon: Smartphone,
          iconBg: 'bg-indigo-500/20',
          iconColor: 'text-indigo-500',
          label: 'Morceaux importés',
          value: `${tracks.length} fichiers`,
        },
        {
          icon: Trash2,
          iconBg: 'bg-red-500/20',
          iconColor: 'text-red-500',
          label: 'Vider la bibliothèque',
          value: '',
          action: clearLibrary,
          destructive: true,
        },
      ],
    },
    {
      title: 'À propos',
      items: [
        {
          icon: Info,
          iconBg: 'bg-gray-500/20',
          iconColor: 'text-gray-400',
          label: 'Version',
          value: '1.0.0',
        },
        {
          icon: Shield,
          iconBg: 'bg-emerald-500/20',
          iconColor: 'text-emerald-500',
          label: 'Confidentialité',
          value: '',
          action: () => {},
        },
        {
          icon: HelpCircle,
          iconBg: 'bg-yellow-500/20',
          iconColor: 'text-yellow-500',
          label: 'Aide & Support',
          value: '',
          action: () => {},
        },
        {
          icon: Star,
          iconBg: 'bg-amber-500/20',
          iconColor: 'text-amber-500',
          label: 'Noter l\'application',
          value: '',
          action: () => {},
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen pb-36 bg-background">
      <header className="p-5 pt-safe flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Paramètres</h1>
      </header>

      <div className="px-5 space-y-6">
        {settingsSections.map((section) => (
          <section key={section.title}>
            <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">
              {section.title}
            </h2>
            <div className="bg-card/60 backdrop-blur rounded-2xl overflow-hidden">
              {section.items.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between p-4 ${
                    index !== section.items.length - 1 ? 'border-b border-white/5' : ''
                  } ${item.action && !item.toggle ? 'cursor-pointer hover:bg-white/5' : ''}`}
                  onClick={item.action && !item.toggle ? item.action : undefined}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <div>
                      <p className={`font-medium ${item.destructive ? 'text-red-500' : ''}`}>
                        {item.label}
                      </p>
                    </div>
                  </div>
                  
                  {item.toggle ? (
                    <Switch 
                      checked={item.checked} 
                      onCheckedChange={item.onToggle}
                      disabled={item.disabled}
                    />
                  ) : item.value ? (
                    <span className="text-sm text-muted-foreground">{item.value}</span>
                  ) : item.action ? (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* App Info */}
        <div className="text-center py-8">
          <p className="text-2xl font-bold bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
            MusicFlow
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Votre musique, votre style
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;