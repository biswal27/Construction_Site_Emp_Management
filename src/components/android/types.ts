export type AndroidTab = 'home' | 'attendance' | 'scanner' | 'wallet' | 'site_hub' | 'kotlin_studio';

export type MaterialTheme = 'amber' | 'blue' | 'emerald' | 'coral' | 'amoled';

export interface AndroidNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'SYNC' | 'PAYROLL' | 'ATTENDANCE' | 'EXPENSE' | 'SYSTEM';
  read: boolean;
}
