import { MaterialTheme } from './types';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryContainer: string;
  onPrimary: string;
  accent: string;
  surface: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  border: string;
  glow: string;
}

export const THEMES: Record<MaterialTheme, ThemeColors> = {
  amber: {
    primary: 'bg-amber-500 text-slate-950',
    primaryLight: 'text-amber-400',
    primaryContainer: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    onPrimary: 'text-slate-950 font-bold',
    accent: 'bg-amber-400',
    surface: 'bg-slate-950',
    surfaceContainer: 'bg-slate-900',
    surfaceContainerHigh: 'bg-slate-800/90',
    border: 'border-amber-500/20',
    glow: 'shadow-amber-500/20',
  },
  blue: {
    primary: 'bg-sky-500 text-white',
    primaryLight: 'text-sky-400',
    primaryContainer: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    onPrimary: 'text-white font-bold',
    accent: 'bg-sky-400',
    surface: 'bg-slate-950',
    surfaceContainer: 'bg-slate-900',
    surfaceContainerHigh: 'bg-slate-800/90',
    border: 'border-sky-500/20',
    glow: 'shadow-sky-500/20',
  },
  emerald: {
    primary: 'bg-emerald-500 text-slate-950',
    primaryLight: 'text-emerald-400',
    primaryContainer: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    onPrimary: 'text-slate-950 font-bold',
    accent: 'bg-emerald-400',
    surface: 'bg-slate-950',
    surfaceContainer: 'bg-slate-900',
    surfaceContainerHigh: 'bg-slate-800/90',
    border: 'border-emerald-500/20',
    glow: 'shadow-emerald-500/20',
  },
  coral: {
    primary: 'bg-rose-500 text-white',
    primaryLight: 'text-rose-400',
    primaryContainer: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    onPrimary: 'text-white font-bold',
    accent: 'bg-rose-400',
    surface: 'bg-slate-950',
    surfaceContainer: 'bg-slate-900',
    surfaceContainerHigh: 'bg-slate-800/90',
    border: 'border-rose-500/20',
    glow: 'shadow-rose-500/20',
  },
  amoled: {
    primary: 'bg-white text-black',
    primaryLight: 'text-white',
    primaryContainer: 'bg-neutral-800 text-white border-neutral-700',
    onPrimary: 'text-black font-bold',
    accent: 'bg-white',
    surface: 'bg-black',
    surfaceContainer: 'bg-neutral-950',
    surfaceContainerHigh: 'bg-neutral-900',
    border: 'border-neutral-800',
    glow: 'shadow-white/10',
  },
};
