/**
 * BuildForce - Construction Workforce Salary & Expense Management System
 * Production-ready enterprise application for civil and structural construction businesses
 */

import React, { useState } from 'react';
import {
  Employee,
  AttendanceRecord,
  ExpenseRecord,
  SalaryAdvance,
  BonusRecord,
  AccommodationLease,
  User,
  ApprovalStatus,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_EXPENSES,
  INITIAL_ADVANCES,
  INITIAL_BONUSES,
  INITIAL_LEASES,
} from './data/initialData';
import { Header } from './components/layout/Header';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { EmployeeDashboard } from './components/dashboard/EmployeeDashboard';
import { EmployeeList } from './components/employees/EmployeeList';
import { EmployeeDetailModal } from './components/employees/EmployeeDetailModal';
import { EmployeeFormModal } from './components/employees/EmployeeFormModal';
import { AttendanceManager } from './components/attendance/AttendanceManager';
import { SalaryManager } from './components/salary/SalaryManager';
import { PayslipModal } from './components/salary/PayslipModal';
import { SalaryProcessingModal } from './components/salary/SalaryProcessingModal';
import { ExpenseManager } from './components/expenses/ExpenseManager';
import { NewExpenseModal } from './components/expenses/NewExpenseModal';
import { AdvanceManager } from './components/advances/AdvanceManager';
import { AccommodationManager } from './components/accommodation/AccommodationManager';
import { ReportsManager } from './components/reports/ReportsManager';
import { AndroidOfflineSyncModal } from './components/architecture/AndroidOfflineSyncModal';
import { AndroidApp } from './components/android/AndroidApp';
import { PWAInstallModal } from './components/pwa/PWAInstallModal';
import { QuickGuideModal } from './components/common/QuickGuideModal';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { RegisterUserModal } from './components/users/RegisterUserModal';
import { UserManager } from './components/users/UserManager';

export default function App() {
  // Navigation, App View Mode & Role State
  const [appMode, setAppMode] = useState<'android' | 'desktop'>('android');
  const [isFrameMode, setIsFrameMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isRegisterUserModalOpen, setIsRegisterUserModalOpen] = useState<boolean>(false);

  // Core Workforce State
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);
  const [advances, setAdvances] = useState<SalaryAdvance[]>(INITIAL_ADVANCES);
  const [bonuses, setBonuses] = useState<BonusRecord[]>(INITIAL_BONUSES);
  const [leases, setLeases] = useState<AccommodationLease[]>(INITIAL_LEASES);

  // Active Employee Profile for Worker View (Default: Ravi Kumar - EMP-101)
  const [currentEmployee, setCurrentEmployee] = useState<Employee>(INITIAL_EMPLOYEES[0]);

  // Modal Control States
  const [selectedDetailEmployee, setSelectedDetailEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState<boolean>(false);
  const [selectedPayslipEmployee, setSelectedPayslipEmployee] = useState<Employee | null>(null);
  const [isSalaryProcessingOpen, setIsSalaryProcessingOpen] = useState<boolean>(false);
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState<boolean>(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);

  // RBAC Permission Gate Handlers
  const handleOpenAddEmployee = () => {
    if (currentUser.role !== 'ADMIN') {
      alert('Access Denied: Only administrators are authorized to add new employees.');
      return;
    }
    setEditingEmployee(null);
    setIsNewEmployeeModalOpen(true);
  };

  const handleOpenRegisterUser = () => {
    if (currentUser.role !== 'ADMIN') {
      alert('Access Denied: Only administrators are authorized to register new user accounts.');
      return;
    }
    setIsRegisterUserModalOpen(true);
  };

  const handleRegisterUser = (newUser: Omit<User, 'id'>) => {
    if (currentUser.role !== 'ADMIN') {
      alert('Access Denied: Only administrators can register new users.');
      return;
    }
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const created: User = {
      ...newUser,
      id: newId,
    };
    setUsers((prev) => [...prev, created]);
    setIsRegisterUserModalOpen(false);
  };

  // Expense Handlers
  const handleAddExpense = (newExp: ExpenseRecord | Omit<ExpenseRecord, 'id'>) => {
    const fullExpense: ExpenseRecord = 'id' in newExp ? newExp : {
      ...newExp,
      id: `EXP-${Date.now()}`,
    };
    setExpenses((prev) => [fullExpense, ...prev]);
  };

  const handleAddAdvance = (newAdv: Omit<SalaryAdvance, 'id'>) => {
    const fullAdvance: SalaryAdvance = {
      ...newAdv,
      id: `ADV-${Date.now()}`,
    };
    setAdvances((prev) => [fullAdvance, ...prev]);
  };

  const handleUpdateExpenseStatus = (expenseId: string, status: ApprovalStatus) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === expenseId ? { ...e, approvalStatus: status } : e))
    );
  };

  // Employee Handlers with Admin Check and optional User creation
  const handleSaveEmployee = (
    emp: Employee,
    createUserData?: { username: string; password?: string; role: 'ADMIN' | 'EMPLOYEE' }
  ) => {
    if (currentUser.role !== 'ADMIN') {
      alert('Access Denied: Only administrators are authorized to add or edit employees.');
      return;
    }

    setEmployees((prev) => {
      const exists = prev.some((e) => e.id === emp.id);
      if (exists) {
        return prev.map((e) => (e.id === emp.id ? emp : e));
      }
      return [emp, ...prev];
    });

    // Auto-create user account if requested by Admin during employee onboarding
    if (createUserData) {
      const newUserId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      const newUserAccount: User = {
        id: newUserId,
        username: createUserData.username,
        role: createUserData.role,
        employeeId: emp.id,
        fullName: emp.fullName,
        avatarUrl: emp.profilePhoto,
      };
      setUsers((prev) => [...prev, newUserAccount]);
    }

    setEditingEmployee(null);
    setIsNewEmployeeModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Application Header */}
      <Header
        currentUser={currentUser}
        onSwitchUser={(u: User) => {
          setCurrentUser(u);
          if (u.role === 'EMPLOYEE' && u.employeeId) {
            const emp = employees.find((e) => e.id === u.employeeId);
            if (emp) setCurrentEmployee(emp);
          }
        }}
        availableUsers={users}
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
        onTriggerSync={() => setIsArchitectureModalOpen(true)}
        appMode={appMode}
        onToggleAppMode={setAppMode}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onOpenRegisterUser={handleOpenRegisterUser}
      />

      {/* Main Mode Viewport: Android Mobile vs Desktop ERP Portal */}
      {appMode === 'android' ? (
        <div className="flex-1 flex items-center justify-center p-0 sm:p-6 bg-slate-950">
          <AndroidApp
            currentUser={currentUser}
            employee={currentUser.role === 'EMPLOYEE' ? currentEmployee : employees[0]}
            employees={employees}
            attendance={attendance}
            onUpdateAttendance={setAttendance}
            expenses={expenses}
            onAddExpense={handleAddExpense}
            advances={advances}
            onAddAdvance={handleAddAdvance}
            bonuses={bonuses}
            leases={leases}
            isOnline={isOnline}
            onToggleOnline={() => setIsOnline(!isOnline)}
            isFrameMode={isFrameMode}
            onToggleFrameMode={() => setIsFrameMode(!isFrameMode)}
            onOpenGuide={() => setIsGuideModalOpen(true)}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
            onOpenRegisterUser={handleOpenRegisterUser}
            onOpenAddEmployee={handleOpenAddEmployee}
          />
        </div>
      ) : (
        <div className="flex flex-1 relative overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab: NavTab) => {
            if (tab === 'codevault') {
              setIsArchitectureModalOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          userRole={currentUser.role}
          pendingExpenseCount={expenses.filter((e) => e.approvalStatus === 'PENDING').length}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Worker Switcher Pill when in Employee View */}
          {currentUser.role === 'EMPLOYEE' && (
            <div className="mb-6 p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Simulate Logged-In Worker:</span>
                <select
                  value={currentEmployee.id}
                  onChange={(e) => {
                    const found = employees.find((emp) => emp.id === e.target.value);
                    if (found) setCurrentEmployee(found);
                  }}
                  className="bg-slate-800 border border-slate-700 text-amber-400 font-bold text-xs rounded-xl px-3 py-1.5 outline-none cursor-pointer"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id} className="bg-slate-900 text-white">
                      {emp.fullName} ({emp.id}) &bull; {emp.employmentType.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-slate-400">
                Viewing personal dashboard as:{' '}
                <strong className="text-white">{currentEmployee.fullName}</strong>
              </div>
            </div>
          )}

          {/* Tab 1: Dashboard */}
          {activeTab === 'dashboard' && (
            currentUser.role === 'ADMIN' ? (
              <AdminDashboard
                employees={employees}
                attendance={attendance}
                expenses={expenses}
                advances={advances}
                bonuses={bonuses}
                leases={leases}
                onNavigateToTab={(tab: any) => setActiveTab(tab)}
                onOpenSalaryProcessing={() => setIsSalaryProcessingOpen(true)}
              />
            ) : (
              <EmployeeDashboard
                employee={currentEmployee}
                attendance={attendance}
                expenses={expenses}
                advances={advances}
                bonuses={bonuses}
                leases={leases}
                onOpenSubmitExpense={() => setIsNewExpenseModalOpen(true)}
                onOpenPayslip={(emp) => setSelectedPayslipEmployee(emp)}
              />
            )
          )}

          {/* Tab 2: Workforce Directory */}
          {activeTab === 'employees' && (
            <EmployeeList
              employees={employees}
              onSelectEmployee={(emp) => setSelectedDetailEmployee(emp)}
              onEditEmployee={(emp) => {
                if (currentUser.role !== 'ADMIN') {
                  alert('Access Denied: Only administrators can edit employee profiles.');
                  return;
                }
                setEditingEmployee(emp);
              }}
              onAddEmployee={handleOpenAddEmployee}
              onViewPayslip={(emp) => setSelectedPayslipEmployee(emp)}
              isAdmin={currentUser.role === 'ADMIN'}
              onOpenRegisterUser={handleOpenRegisterUser}
            />
          )}

          {/* Tab 3: User Accounts & System Security (Admin Only) */}
          {activeTab === 'users' && (
            <UserManager
              users={users}
              currentUser={currentUser}
              employees={employees}
              onOpenRegisterUser={handleOpenRegisterUser}
              onSwitchUser={(u) => {
                setCurrentUser(u);
                if (u.role === 'EMPLOYEE' && u.employeeId) {
                  const emp = employees.find((e) => e.id === u.employeeId);
                  if (emp) setCurrentEmployee(emp);
                }
              }}
              onOpenAddEmployee={handleOpenAddEmployee}
            />
          )}

          {/* Tab 4: Attendance & Wage Computation */}
          {activeTab === 'attendance' && (
            <AttendanceManager
              employees={employees}
              attendance={attendance}
              onUpdateAttendance={setAttendance}
              isAdmin={currentUser.role === 'ADMIN'}
            />
          )}

          {/* Tab 5: Salary & Payroll Lifecycle */}
          {activeTab === 'salary' && (
            <SalaryManager
              employees={employees}
              attendance={attendance}
              expenses={expenses}
              advances={advances}
              bonuses={bonuses}
              leases={leases}
              onOpenPayslip={(emp) => setSelectedPayslipEmployee(emp)}
              onOpenBatchProcessing={() => setIsSalaryProcessingOpen(true)}
            />
          )}

          {/* Tab 6: Expense Management */}
          {activeTab === 'expenses' && (
            <ExpenseManager
              employees={employees}
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onUpdateExpenseStatus={handleUpdateExpenseStatus}
              onOpenNewExpenseModal={() => setIsNewExpenseModalOpen(true)}
              isAdmin={currentUser.role === 'ADMIN'}
            />
          )}

          {/* Tab 7: Advances & Bonuses */}
          {activeTab === 'advances' && (
            <AdvanceManager
              employees={employees}
              advances={advances}
              bonuses={bonuses}
              onAddAdvance={(newAdv) => setAdvances((prev) => [newAdv, ...prev])}
              onAddBonus={(newBon) => setBonuses((prev) => [newBon, ...prev])}
            />
          )}

          {/* Tab 8: Accommodation & Camps */}
          {activeTab === 'accommodation' && (
            <AccommodationManager leases={leases} employees={employees} />
          )}

          {/* Tab 9: Reports & Exports */}
          {activeTab === 'reports' && (
            <ReportsManager
              employees={employees}
              attendance={attendance}
              expenses={expenses}
              advances={advances}
              bonuses={bonuses}
              leases={leases}
            />
          )}
        </main>
      </div>
      )}

      {/* Floating Modal Engines */}
      {selectedDetailEmployee && (
        <EmployeeDetailModal
          employee={selectedDetailEmployee}
          onClose={() => setSelectedDetailEmployee(null)}
          onEdit={(emp) => {
            if (currentUser.role !== 'ADMIN') {
              alert('Access Denied: Only administrators can edit employee profiles.');
              return;
            }
            setSelectedDetailEmployee(null);
            setEditingEmployee(emp);
          }}
          onViewSalarySlip={(emp) => {
            setSelectedDetailEmployee(null);
            setSelectedPayslipEmployee(emp);
          }}
        />
      )}

      {(isNewEmployeeModalOpen || editingEmployee) && (
        <EmployeeFormModal
          employee={editingEmployee}
          isAdmin={currentUser.role === 'ADMIN'}
          onClose={() => {
            setIsNewEmployeeModalOpen(false);
            setEditingEmployee(null);
          }}
          onSave={handleSaveEmployee}
        />
      )}

      {/* Admin-Only User Registration Modal */}
      <RegisterUserModal
        isOpen={isRegisterUserModalOpen}
        onClose={() => setIsRegisterUserModalOpen(false)}
        onRegisterUser={handleRegisterUser}
        employees={employees}
        existingUsers={users}
        currentAdmin={currentUser}
      />

      {selectedPayslipEmployee && (
        <PayslipModal
          employee={selectedPayslipEmployee}
          attendance={attendance}
          expenses={expenses}
          advances={advances}
          bonuses={bonuses}
          leases={leases}
          onClose={() => setSelectedPayslipEmployee(null)}
        />
      )}

      {isSalaryProcessingOpen && (
        <SalaryProcessingModal
          employees={employees}
          attendance={attendance}
          expenses={expenses}
          advances={advances}
          bonuses={bonuses}
          leases={leases}
          onClose={() => setIsSalaryProcessingOpen(false)}
          onConfirmProcessing={(results) => {
            // Updated processed records
            setIsSalaryProcessingOpen(false);
          }}
        />
      )}

      {isNewExpenseModalOpen && (
        <NewExpenseModal
          employees={employees}
          currentEmployee={currentUser.role === 'EMPLOYEE' ? currentEmployee : null}
          isAdmin={currentUser.role === 'ADMIN'}
          onClose={() => setIsNewExpenseModalOpen(false)}
          onSubmit={handleAddExpense}
        />
      )}

      {isArchitectureModalOpen && (
        <AndroidOfflineSyncModal
          isOnline={isOnline}
          onToggleOnline={() => setIsOnline(!isOnline)}
          onClose={() => setIsArchitectureModalOpen(false)}
        />
      )}

      {/* Network Status Toast */}
      <OfflineIndicator />

      {/* PWA Mobile Installation Instructions Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Quick Walkthrough Guide for Users & Workers */}
      <QuickGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onOpenInstallModal={() => {
          setIsGuideModalOpen(false);
          setIsInstallModalOpen(true);
        }}
      />
    </div>
  );
}
