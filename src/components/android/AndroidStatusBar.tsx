import React, { useState, useEffect } from 'react';
import { Wifi, Battery, BatteryCharging, Signal, MapPin, RefreshCw, Bell } from 'lucide-react';

interface AndroidStatusBarProps {
  isOnline: boolean;
  onToggleShade: () => void;
  unreadCount?: number;
  syncing?: boolean;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  isOnline,
  onToggleShade,
  unreadCount = 0,
  syncing = false,
}) => {
  const [timeStr, setTimeStr] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      onClick={onToggleShade}
      className="w-full h-8 px-5 flex items-center justify-between text-[11px] font-semibold text-slate-200 select-none cursor-pointer bg-slate-950/90 backdrop-blur z-30 transition-colors hover:bg-slate-900/90"
      title="Tap to pull down Android Notification Shade & Quick Settings"
    >
      {/* Left: Clock & Notifications */}
      <div className="flex items-center gap-2">
        <span className="font-mono tracking-tight font-bold text-white">{timeStr}</span>
        {unreadCount > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-500/20 px-1.5 py-0.2 rounded-full border border-amber-500/30">
            <Bell className="w-2.5 h-2.5" />
            <span>{unreadCount}</span>
          </div>
        )}
        {syncing && (
          <RefreshCw className="w-2.5 h-2.5 text-sky-400 animate-spin" />
        )}
      </div>

      {/* Center: Punch-hole camera simulator area */}
      <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-slate-800 shadow-inner flex items-center justify-center">
        <div className="w-1 h-1 rounded-full bg-slate-900" />
      </div>

      {/* Right: Connectivity, GPS, Battery */}
      <div className="flex items-center gap-2 text-slate-300">
        <div className="flex items-center gap-0.5" title="GPS Site Lock: Active">
          <MapPin className="w-3 h-3 text-emerald-400" />
        </div>
        <div className="flex items-center gap-0.5">
          <Signal className="w-3 h-3 text-slate-200" />
          <span className="text-[9px] font-mono font-bold text-slate-400">5G</span>
        </div>
        <Wifi className={`w-3 h-3 ${isOnline ? 'text-slate-200' : 'text-rose-400'}`} />
        <div className="flex items-center gap-1 font-mono text-[10px] text-slate-300">
          <span>94%</span>
          <Battery className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
