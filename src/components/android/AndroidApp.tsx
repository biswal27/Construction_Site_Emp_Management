import React, { useState } from 'react';
import { 
  Employee, 
  AttendanceRecord, 
  ExpenseRecord, 
  SalaryAdvance, 
  BonusRecord, 
  AccommodationLease, 
  User 
} from '../../types';
import { AndroidTab, MaterialTheme, AndroidNotification } from './types';
import { AndroidPhoneFrame } from './AndroidPhoneFrame';
import { AndroidStatusBar } from './AndroidStatusBar';
import { AndroidNavBar } from './AndroidNavBar';
import { AndroidNotificationShade } from './AndroidNotificationShade';
import { AndroidHomeScreen } from './AndroidHomeScreen';
import { AndroidMusterRollScreen } from './AndroidMusterRollScreen';
import { AndroidCameraScannerScreen } from './AndroidCameraScannerScreen';
import { AndroidWalletScreen } from './AndroidWalletScreen';
import { AndroidSiteHubScreen } from './AndroidSiteHubScreen';
import { AndroidKotlinStudio } from './AndroidKotlinStudio';

interface AndroidAppProps {
  currentUser: User;
  employee?: Employee;
  employees: Employee[];
  attendance: AttendanceRecord[];
  onUpdateAttendance: (records: AttendanceRecord[]) => void;
  expenses: ExpenseRecord[];
  onAddExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  advances: SalaryAdvance[];
  onAddAdvance: (advance: Omit<SalaryAdvance, 'id'>) => void;
  bonuses: BonusRecord[];
  leases: AccommodationLease[];
  isOnline: boolean;
  onToggleOnline: () => void;
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
  onOpenGuide?: () => void;
  onOpenInstallModal?: () => void;
  onOpenRegisterUser?: () => void;
  onOpenAddEmployee?: () => void;
}

export const AndroidApp: React.FC<AndroidAppProps> = ({
  currentUser,
  employee,
  employees,
  attendance,
  onUpdateAttendance,
  expenses,
  onAddExpense,
  advances,
  onAddAdvance,
  bonuses,
  leases,
  isOnline,
  onToggleOnline,
  isFrameMode,
  onToggleFrameMode,
  onOpenGuide,
  onOpenInstallModal,
  onOpenRegisterUser,
  onOpenAddEmployee,
}) => {
  const [currentTab, setCurrentTab] = useState<AndroidTab>('home');
  const [theme, setTheme] = useState<MaterialTheme>('amber');
  const [isShadeOpen, setIsShadeOpen] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<AndroidNotification[]>([
    {
      id: 'notif-1',
      title: 'WorkManager Background Sync',
      message: '14 attendance records committed to Room DB & synced to Cloud.',
      time: '08:42 AM',
      category: 'SYNC',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'GPS Site Lock: In Perimeter',
      message: 'Worker within 14m of Pier 14 - Noida Sector 62 Site.',
      time: '08:15 AM',
      category: 'ATTENDANCE',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'September Payroll Calculated',
      message: '₹1,48,500 total site payroll calculated with statutory deductions.',
      time: 'Yesterday',
      category: 'PAYROLL',
      read: false,
    },
  ]);

  const handleTriggerSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      const newNotif: AndroidNotification = {
        id: `notif-${Date.now()}`,
        title: 'Room DB Sync Completed',
        message: 'All local attendance, OT hours, and vouchers verified with server.',
        time: 'Just now',
        category: 'SYNC',
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }, 1500);
  };

  const handlePunchToday = (status: 'PRESENT' | 'HALF_DAY') => {
    const today = new Date().toISOString().split('T')[0];
    const empId = employee?.id || employees[0].id;
    const existingIdx = attendance.findIndex((a) => a.employeeId === empId && a.date === today);

    if (existingIdx >= 0) {
      const updated = [...attendance];
      updated[existingIdx] = { ...updated[existingIdx], status };
      onUpdateAttendance(updated);
    } else {
      const newRec: AttendanceRecord = {
        id: `ATT-${Date.now()}-${empId}`,
        employeeId: empId,
        date: today,
        status,
        hoursWorked: status === 'PRESENT' ? 8 : 4,
        recordedBy: 'SUPERVISOR',
        checkInTime: '08:15',
        checkOutTime: status === 'PRESENT' ? '17:00' : '13:00',
        overtimeHours: 0,
      };
      onUpdateAttendance([...attendance, newRec]);
    }
  };

  return (
    <AndroidPhoneFrame
      isFrameMode={isFrameMode}
      onToggleFrameMode={onToggleFrameMode}
      theme={theme}
    >
      {/* Android 15 Status Bar */}
      <AndroidStatusBar
        isOnline={isOnline}
        onToggleShade={() => setIsShadeOpen(!isShadeOpen)}
        unreadCount={notifications.length}
        syncing={syncing}
      />

      {/* Expandable Android Notification Shade & Quick Settings */}
      <AndroidNotificationShade
        isOpen={isShadeOpen}
        onClose={() => setIsShadeOpen(false)}
        isOnline={isOnline}
        onToggleOnline={onToggleOnline}
        theme={theme}
        onSelectTheme={setTheme}
        isFrameMode={isFrameMode}
        onToggleFrameMode={onToggleFrameMode}
        notifications={notifications}
        onClearNotifications={() => setNotifications([])}
        onTriggerSync={handleTriggerSync}
        syncing={syncing}
        onOpenInstallModal={onOpenInstallModal}
        onOpenRegisterUser={onOpenRegisterUser}
        onOpenAddEmployee={onOpenAddEmployee}
        isAdmin={currentUser.role === 'ADMIN'}
      />

      {/* Screen Viewport Router */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {currentTab === 'home' && (
          <AndroidHomeScreen
            currentUser={currentUser}
            employee={employee}
            employees={employees}
            attendance={attendance}
            onPunchToday={handlePunchToday}
            onNavigateTab={setCurrentTab}
            expenses={expenses}
            advances={advances}
            theme={theme}
            onOpenGuide={onOpenGuide}
          />
        )}

        {currentTab === 'attendance' && (
          <AndroidMusterRollScreen
            employees={employees}
            attendance={attendance}
            onUpdateAttendance={onUpdateAttendance}
            theme={theme}
            isAdmin={currentUser.role === 'ADMIN'}
            onAddEmployee={onOpenAddEmployee}
          />
        )}

        {currentTab === 'scanner' && (
          <AndroidCameraScannerScreen
            currentUser={currentUser}
            employees={employees}
            onAddExpense={onAddExpense}
            theme={theme}
          />
        )}

        {currentTab === 'wallet' && (
          <AndroidWalletScreen
            currentUser={currentUser}
            employee={employee}
            employees={employees}
            advances={advances}
            bonuses={bonuses}
            onAddAdvance={onAddAdvance}
            theme={theme}
          />
        )}

        {currentTab === 'site_hub' && (
          <AndroidSiteHubScreen
            leases={leases}
            employees={employees}
            theme={theme}
          />
        )}

        {currentTab === 'kotlin_studio' && (
          <AndroidKotlinStudio theme={theme} />
        )}
      </div>

      {/* Material 3 Bottom Navigation Bar */}
      <AndroidNavBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        theme={theme}
        pendingExpenseCount={expenses.filter((e) => e.approvalStatus === 'PENDING').length}
      />
    </AndroidPhoneFrame>
  );
};
