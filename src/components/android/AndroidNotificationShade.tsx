import React from 'react';
import { 
  Wifi, 
  MapPin, 
  Flashlight, 
  RefreshCw, 
  Palette, 
  Smartphone, 
  Volume2, 
  CheckCheck, 
  X, 
  Clock, 
  HardHat, 
  ShieldCheck, 
  ChevronUp,
  UserPlus,
  UserCheck,
  Lock
} from 'lucide-react';
import { MaterialTheme, AndroidNotification } from './types';
import { THEMES } from './themeUtils';

interface AndroidNotificationShadeProps {
  isOpen: boolean;
  onClose: () => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  theme: MaterialTheme;
  onSelectTheme: (t: MaterialTheme) => void;
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
  notifications: AndroidNotification[];
  onClearNotifications: () => void;
  onTriggerSync: () => void;
  syncing: boolean;
  onOpenInstallModal?: () => void;
  onOpenRegisterUser?: () => void;
  onOpenAddEmployee?: () => void;
  isAdmin?: boolean;
}

export const AndroidNotificationShade: React.FC<AndroidNotificationShadeProps> = ({
  isOpen,
  onClose,
  isOnline,
  onToggleOnline,
  theme,
  onSelectTheme,
  isFrameMode,
  onToggleFrameMode,
  notifications,
  onClearNotifications,
  onTriggerSync,
  syncing,
  onOpenInstallModal,
  onOpenRegisterUser,
  onOpenAddEmployee,
  isAdmin = true,
}) => {
  if (!isOpen) return null;

  const currentTheme = THEMES[theme];

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col animate-in fade-in slide-in-from-top-4 duration-200 select-none overflow-hidden">
      {/* Header bar with time and battery */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-slate-800/80">
        <div>
          <div className="text-xl font-bold font-mono text-white tracking-tight">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-xs text-slate-400">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          title="Close Quick Settings"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Quick Setting Tiles Grid */}
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
            Android Quick Settings
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {/* Internet / Online */}
            <button
              onClick={onToggleOnline}
              className={`p-3 rounded-2xl flex flex-col items-start gap-1 transition-all text-left ${
                isOnline
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              <Wifi className="w-5 h-5" />
              <div>
                <div className="text-xs font-bold">{isOnline ? 'Online 5G' : 'Offline'}</div>
                <div className="text-[10px] text-slate-400">{isOnline ? 'Cloud Synced' : 'Room DB'}</div>
              </div>
            </button>

            {/* GPS Site Lock */}
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex flex-col items-start gap-1 text-left">
              <MapPin className="w-5 h-5" />
              <div>
                <div className="text-xs font-bold">GPS Geofence</div>
                <div className="text-[10px] text-slate-400">Sec 62 (In Site)</div>
              </div>
            </div>

            {/* WorkManager Sync */}
            <button
              onClick={onTriggerSync}
              className={`p-3 rounded-2xl flex flex-col items-start gap-1 transition-all text-left ${
                syncing
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                  : 'bg-slate-800/80 text-slate-200 border border-slate-700 hover:bg-slate-700/80'
              }`}
            >
              <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
              <div>
                <div className="text-xs font-bold">WorkManager</div>
                <div className="text-[10px] text-slate-400">{syncing ? 'Syncing...' : 'Tap to Sync'}</div>
              </div>
            </button>

            {/* Frame Toggle */}
            <button
              onClick={onToggleFrameMode}
              className="p-3 rounded-2xl bg-slate-800/80 text-slate-200 border border-slate-700 hover:bg-slate-700/80 flex flex-col items-start gap-1 text-left"
            >
              <Smartphone className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="text-xs font-bold">{isFrameMode ? 'Phone Frame' : 'Fullscreen'}</div>
                <div className="text-[10px] text-slate-400">Toggle Bezel</div>
              </div>
            </button>

            {/* Sound Profile */}
            <div className="p-3 rounded-2xl bg-slate-800/80 text-slate-200 border border-slate-700 flex flex-col items-start gap-1 text-left">
              <Volume2 className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs font-bold">Site Haptics</div>
                <div className="text-[10px] text-slate-400">Vibrate on Punch</div>
              </div>
            </div>

            {/* Site Security Status */}
            <div className="p-3 rounded-2xl bg-slate-800/80 text-slate-200 border border-slate-700 flex flex-col items-start gap-1 text-left">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs font-bold">Biometric OK</div>
                <div className="text-[10px] text-slate-400">Face + Finger</div>
              </div>
            </div>

            {/* Admin Controls / RBAC Status Tile */}
            {isAdmin ? (
              <div className="col-span-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Admin Quick Actions</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-bold">RBAC</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Exclusive privilege to register users &amp; add workers</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {onOpenRegisterUser && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenRegisterUser();
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow-sm transition"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Register User</span>
                    </button>
                  )}
                  {onOpenAddEmployee && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAddEmployee();
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-[11px] flex items-center gap-1 transition"
                    >
                      <span>+ Worker</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="col-span-3 p-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Worker Persona: User registration and employee creation require Admin privileges.</span>
              </div>
            )}

            {/* Install on Mobile Tile */}
            {onOpenInstallModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenInstallModal();
                }}
                className="col-span-3 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-slate-800 border border-amber-500/40 text-left flex items-center justify-between transition hover:bg-amber-500/25 active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center shadow-sm">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Install BuildForce on Phone</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-extrabold uppercase">PWA</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Add to home screen for instant biometric punch &amp; offline mode</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-400 pr-2">Install &rarr;</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Material You Palette Picker */}
        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-200">
            <Palette className="w-4 h-4 text-amber-400" />
            <span>Material You Dynamic Color Accent</span>
          </div>
          <div className="flex items-center gap-2">
            {(['amber', 'blue', 'emerald', 'coral', 'amoled'] as MaterialTheme[]).map((t) => (
              <button
                key={t}
                onClick={() => onSelectTheme(t)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border ${
                  theme === t
                    ? `${THEMES[t].primary} ring-2 ring-white/40 shadow-sm`
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Live Notifications Stream */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Notifications ({notifications.length})
            </h4>
            {notifications.length > 0 && (
              <button
                onClick={onClearNotifications}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            {notifications.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
                No active notifications. All site updates synced!
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800/90 shadow-sm space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>{n.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Swipe up close handle */}
      <div
        onClick={onClose}
        className="py-2 flex flex-col items-center justify-center border-t border-slate-800/80 cursor-pointer hover:bg-slate-900/60 transition-colors"
      >
        <ChevronUp className="w-5 h-5 text-slate-400 animate-bounce" />
        <span className="text-[10px] font-semibold text-slate-400">Tap or swipe up to collapse</span>
      </div>
    </div>
  );
};
