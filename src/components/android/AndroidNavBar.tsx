import React from 'react';
import { Home, Users, Camera, Wallet, Building2, Code2 } from 'lucide-react';
import { AndroidTab, MaterialTheme } from './types';
import { THEMES } from './themeUtils';

interface AndroidNavBarProps {
  currentTab: AndroidTab;
  onSelectTab: (tab: AndroidTab) => void;
  theme: MaterialTheme;
  pendingExpenseCount?: number;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({
  currentTab,
  onSelectTab,
  theme,
  pendingExpenseCount = 0,
}) => {
  const themeColors = THEMES[theme];

  const navItems: { tab: AndroidTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { tab: 'home', label: 'Home', icon: Home },
    { tab: 'attendance', label: 'Muster', icon: Users },
    { tab: 'scanner', label: 'Scan', icon: Camera },
    { tab: 'wallet', label: 'Wallet', icon: Wallet },
    { tab: 'site_hub', label: 'Site Hub', icon: Building2, badge: pendingExpenseCount },
    { tab: 'kotlin_studio', label: 'Kotlin M3', icon: Code2 },
  ];

  return (
    <div className="w-full bg-slate-950/95 border-t border-slate-800/80 backdrop-blur pb-1 z-30 select-none">
      <div className="grid grid-cols-6 items-center px-1 pt-2 pb-1 gap-0.5">
        {navItems.map((item) => {
          const isActive = currentTab === item.tab;
          const Icon = item.icon;

          return (
            <button
              key={item.tab}
              onClick={() => onSelectTab(item.tab)}
              className="group flex flex-col items-center justify-center relative py-1 focus:outline-none transition-all duration-200"
            >
              {/* Material You Active Pill Indicator */}
              <div
                className={`relative px-3 py-1 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? `${themeColors.primaryContainer} border`
                    : 'text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-900/60'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? `${themeColors.primaryLight} scale-110` : 'text-slate-400'
                  }`}
                />

                {/* Badge if any */}
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-slate-950">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] tracking-tight mt-1 font-medium transition-colors ${
                  isActive ? 'text-white font-bold' : 'text-slate-400 group-hover:text-slate-300'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Android Gesture Navigation Bar Pill */}
      <div className="w-full flex justify-center py-1">
        <div className="w-32 h-1 bg-slate-600/70 rounded-full hover:bg-slate-400 transition-colors" />
      </div>
    </div>
  );
};
