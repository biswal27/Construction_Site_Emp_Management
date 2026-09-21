import React, { useState } from 'react';
import { Download, X, HardHat, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

export const PWAInstallBanner: React.FC = () => {
  const { isInstalled, isInstallable, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  if (isInstalled || dismissed) return null;

  const handleAction = async () => {
    if (isInstallable) {
      const ok = await install();
      if (!ok) setModalOpen(true);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <div className="mx-3 mt-2 p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-slate-900 border border-amber-500/30 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm font-bold">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
              <span>Install Mobile App</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-400 font-extrabold uppercase">
                Offline
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              Works like a native Android APK on your phone
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleAction}
            className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shadow-sm transition active:scale-95"
          >
            Install
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
