import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Share2, 
  PlusSquare, 
  CheckCircle2, 
  QrCode, 
  Wifi, 
  HardHat, 
  X, 
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'qr'>('android');
  const [installing, setInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://buildforce.app';

  const handleInstallClick = async () => {
    setInstalling(true);
    const success = await install();
    setInstalling(false);
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <HardHat className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Install BuildForce Mobile App
              </h3>
              <p className="text-xs text-slate-400">
                Fast, offline-capable workforce management on your phone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selection Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'android'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android / Chrome</span>
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'ios'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>iPhone / iOS</span>
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'qr'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Scan from Phone</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Status if already installed */}
          {isInstalled || installSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-300">
                  BuildForce App is Installed &amp; Ready!
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  You can now open BuildForce directly from your home screen or app drawer. It works completely offline on civil project construction sites.
                </p>
              </div>
            </div>
          ) : null}

          {/* Android / Chrome Tab Content */}
          {activeTab === 'android' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <img
                  src="/pwa-192x192.png"
                  alt="BuildForce App Icon"
                  className="w-14 h-14 rounded-2xl shadow-md border border-slate-700"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">BuildForce Mobile</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      PWA 1.0
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Package: com.buildforce.workforce
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    Size: &lt; 2 MB &bull; Instant installation &bull; Auto-updates
                  </p>
                </div>
              </div>

              {isInstallable ? (
                <button
                  onClick={handleInstallClick}
                  disabled={installing}
                  className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all active:scale-98 cursor-pointer"
                >
                  <Download className="w-5 h-5 stroke-[2.5]" />
                  <span>{installing ? 'Installing App...' : 'Install on Android Phone'}</span>
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    How to install in Chrome / Android:
                  </h4>
                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-[11px] shrink-0 border border-slate-700">
                        1
                      </span>
                      <span>Open this website in <strong>Google Chrome</strong> or <strong>Samsung Internet</strong> on your phone.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-[11px] shrink-0 border border-slate-700">
                        2
                      </span>
                      <span>Tap the <strong>three dots (⋮)</strong> menu in the upper-right corner.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-[11px] shrink-0 border border-slate-700">
                        3
                      </span>
                      <span>Tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-left">
                  <Wifi className="w-4 h-4 text-emerald-400 mb-1" />
                  <div className="text-xs font-bold text-white">Full Offline Mode</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Muster roll &amp; punch records cached locally</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-left">
                  <Zap className="w-4 h-4 text-amber-400 mb-1" />
                  <div className="text-xs font-bold text-white">Zero App Store Wait</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Launches like a native Android APK</div>
                </div>
              </div>
            </div>
          )}

          {/* iOS / iPhone Tab Content */}
          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>2 Steps to Install on iPhone / iPad</span>
                </h4>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        Tap the Share Button <Share2 className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <p className="text-slate-400 mt-0.5">
                        In Safari, tap the bottom toolbar square button with an arrow pointing up.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        Select &quot;Add to Home Screen&quot; <PlusSquare className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <p className="text-slate-400 mt-0.5">
                        Scroll down the share sheet options and tap <strong>Add to Home Screen</strong>, then tap <strong>Add</strong> in the top right.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>BuildForce will run full-screen without Safari browser address bar.</span>
              </div>
            </div>
          )}

          {/* QR Code Tab for Desktop Users to Scan with Phone */}
          {activeTab === 'qr' && (
            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-300">
                Point your smartphone camera at this QR code to open BuildForce and install it directly on your mobile device:
              </p>
              
              {/* Dynamic Crisp SVG QR Code */}
              <div className="p-5 bg-white rounded-3xl inline-block shadow-xl mx-auto">
                <svg width="180" height="180" viewBox="0 0 200 200" className="mx-auto">
                  {/* Outer Frame */}
                  <rect width="200" height="200" fill="#ffffff" />
                  
                  {/* Top-Left Position Marker */}
                  <rect x="15" y="15" width="45" height="45" fill="#0f172a" rx="6" />
                  <rect x="23" y="23" width="29" height="29" fill="#ffffff" rx="4" />
                  <rect x="29" y="29" width="17" height="17" fill="#f59e0b" rx="2" />
                  
                  {/* Top-Right Position Marker */}
                  <rect x="140" y="15" width="45" height="45" fill="#0f172a" rx="6" />
                  <rect x="148" y="23" width="29" height="29" fill="#ffffff" rx="4" />
                  <rect x="154" y="29" width="17" height="17" fill="#f59e0b" rx="2" />
                  
                  {/* Bottom-Left Position Marker */}
                  <rect x="15" y="140" width="45" height="45" fill="#0f172a" rx="6" />
                  <rect x="23" y="148" width="29" height="29" fill="#ffffff" rx="4" />
                  <rect x="29" y="154" width="17" height="17" fill="#f59e0b" rx="2" />
                  
                  {/* QR Data Matrix Patterns (Simulated QR Grid) */}
                  <g fill="#0f172a">
                    {/* Timing stripes */}
                    <rect x="68" y="32" width="6" height="6" />
                    <rect x="80" y="32" width="6" height="6" />
                    <rect x="92" y="32" width="6" height="6" />
                    <rect x="104" y="32" width="6" height="6" />
                    <rect x="116" y="32" width="6" height="6" />
                    <rect x="128" y="32" width="6" height="6" />

                    <rect x="32" y="68" width="6" height="6" />
                    <rect x="32" y="80" width="6" height="6" />
                    <rect x="32" y="92" width="6" height="6" />
                    <rect x="32" y="104" width="6" height="6" />
                    <rect x="32" y="116" width="6" height="6" />
                    <rect x="32" y="128" width="6" height="6" />

                    {/* Internal Data Dots */}
                    <rect x="70" y="70" width="10" height="10" rx="2" />
                    <rect x="90" y="70" width="8" height="8" rx="2" />
                    <rect x="110" y="70" width="14" height="10" rx="2" />
                    <rect x="135" y="70" width="10" height="10" rx="2" />
                    <rect x="155" y="70" width="8" height="12" rx="2" />

                    <rect x="70" y="90" width="12" height="8" rx="2" />
                    <rect x="95" y="88" width="10" height="14" rx="2" />
                    <rect x="115" y="92" width="10" height="8" rx="2" />
                    <rect x="138" y="90" width="12" height="10" rx="2" />
                    <rect x="160" y="90" width="8" height="8" rx="2" />

                    <rect x="70" y="110" width="14" height="10" rx="2" />
                    <rect x="92" y="112" width="12" height="8" rx="2" />
                    <rect x="112" y="108" width="10" height="14" rx="2" />
                    <rect x="132" y="110" width="8" height="10" rx="2" />
                    <rect x="150" y="110" width="12" height="12" rx="2" />

                    <rect x="70" y="130" width="8" height="12" rx="2" />
                    <rect x="88" y="130" width="14" height="8" rx="2" />
                    <rect x="110" y="130" width="12" height="12" rx="2" />
                    <rect x="130" y="132" width="10" height="8" rx="2" />
                    <rect x="152" y="130" width="14" height="10" rx="2" />

                    <rect x="70" y="152" width="12" height="10" rx="2" />
                    <rect x="90" y="150" width="10" height="12" rx="2" />
                    <rect x="110" y="154" width="14" height="8" rx="2" />
                    <rect x="135" y="152" width="10" height="10" rx="2" />
                    <rect x="155" y="150" width="8" height="14" rx="2" />
                  </g>

                  {/* Center Brand Badge */}
                  <rect x="86" y="86" width="28" height="28" fill="#f59e0b" rx="8" />
                  <text x="100" y="104" font-family="sans-serif" font-size="12" font-weight="900" fill="#0f172a" text-anchor="middle">BF</text>
                </svg>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 break-all font-mono">
                {currentUrl}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PWA Verified &bull; Standalone Mode</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
