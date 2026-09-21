import React, { useState, useEffect } from 'react';
import { Smartphone, Maximize2, Minimize2 } from 'lucide-react';
import { MaterialTheme } from './types';
import { THEMES } from './themeUtils';

interface AndroidPhoneFrameProps {
  children: React.ReactNode;
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
  theme: MaterialTheme;
}

export const AndroidPhoneFrame: React.FC<AndroidPhoneFrameProps> = ({
  children,
  isFrameMode,
  onToggleFrameMode,
  theme,
}) => {
  const currentTheme = THEMES[theme];
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // When on an actual mobile device/small viewport or when user explicitly chose fullscreen mode
  if (!isFrameMode || isSmallScreen) {
    return (
      <div className="w-full h-full min-h-[calc(100vh-60px)] max-w-lg mx-auto bg-slate-950 flex flex-col relative overflow-hidden shadow-2xl sm:border-x sm:border-slate-800">
        {children}
      </div>
    );
  }

  return (
    <div className="w-full py-4 sm:py-6 px-2 sm:px-4 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm min-h-[calc(100vh-65px)]">
      {/* Device Toolbar Controls */}
      <div className="mb-3 flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full shadow-lg text-xs">
        <span className="flex items-center gap-1.5 font-bold text-slate-300">
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span>Google Pixel 8 Pro &bull; Android 15</span>
        </span>
        <span className="text-slate-600">|</span>
        <button
          onClick={onToggleFrameMode}
          className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-0.5 rounded-md hover:bg-slate-800 cursor-pointer"
          title="Switch to full-width mobile view"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Fullscreen Mode</span>
        </button>
      </div>

      {/* Realistic Modern Android Phone Shell */}
      <div className="relative w-full max-w-[420px] h-[840px] max-h-[92vh] rounded-[48px] bg-slate-900 border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(245,158,11,0.08)] ring-1 ring-slate-700/60 flex flex-col overflow-hidden">
        {/* Right side physical power & volume buttons */}
        <div className="absolute -right-[12px] top-28 w-[4px] h-10 bg-slate-700 rounded-r-sm pointer-events-none" />
        <div className="absolute -right-[12px] top-44 w-[4px] h-16 bg-slate-700 rounded-r-sm pointer-events-none" />
        <div className="absolute -left-[12px] top-36 w-[4px] h-12 bg-slate-700 rounded-l-sm pointer-events-none" />

        {/* Screen inner content container */}
        <div className="w-full h-full flex flex-col bg-slate-950 relative overflow-hidden rounded-[38px]">
          {children}
        </div>
      </div>
    </div>
  );
};

