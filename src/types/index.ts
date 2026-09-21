/**
 * Production-Ready Domain Types for Construction Workforce Salary & Expense Management System
 * Mirrors the Java 21 Spring Boot 3 DTOs and JPA Entities
 */

export type Role = 'ADMIN' | 'EMPLOYEE';

export type EmploymentType = 'MONTHLY_SALARY' | 'DAILY_WAGE' | 'CONTRACT_WORKER' | 'TEMPORARY_WORKER';

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'TERMINATED';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'PAID_LEAVE' | 'UNPAID_LEAVE' | 'HOLIDAY';

export type ExpenseCategory = 
  | 'FOOD'
  | 'TRAVEL'
  | 'RENT'
  | 'MEDICAL'
  | 'DAILY_EXPENSE'
  | 'BONUS'
  | 'ADVANCE'
  | 'ACCOMMODATION'
  | 'OTHER';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';

export type TravelType = 'BUS' | 'TRAIN' | 'FLIGHT' | 'TAXI' | 'AUTO' | 'COMPANY_VEHICLE' | 'OTHER';

export type BonusType = 'PERFORMANCE' | 'FESTIVAL' | 'PROJECT' | 'SPECIAL' | 'OTHER';

export type PaymentMethod = 'BANK_TRANSFER' | 'UPI' | 'CASH' | 'OTHER';

export type PaymentStatus = 'DRAFT' | 'CALCULATED' | 'APPROVED' | 'PROCESSED' | 'PAID' | 'CANCELLED';

export interface User {
  id: number;
  username: string;
  role: Role;
  employeeId?: string;
  fullName: string;
  avatarUrl?: string;
}

export interface Employee {
  id: string; // e.g. EMP-101
  fullName: string;
  parentName: string; // Father's/Mother's name
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  mobileNumber: string;
  alternateMobileNumber?: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  joiningDate: string;
  department: string;
  designation: string;
  skillTrade: string; // Mason, Carpenter, Electrician, Site Engineer, Welder, Helper
  employmentType: EmploymentType;
  
  // Financial Configuration
  monthlySalary: number; // For monthly employees
  dailyWage: number;     // For daily wage employees
  foodAllowance: number; // Monthly allocated limit
  travelAllowance: number;
  rentAllowance: number;
  otherAllowance: number;

  // Banking & Identity (masked in UI for privacy)
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;
  upiId?: string;
  aadhaarNumberMasked: string; // e.g. XXXX-XXXX-1234
  panNumberMasked: string;     // e.g. ABCDE****F

  // Accommodation
  accommodationStatus: 'COMPANY_PROVIDED' | 'SELF_RENTED' | 'NOT_APPLICABLE';
  rentResponsibility: 'COMPANY_PAID' | 'EMPLOYEE_PAID';
  
  status: EmployeeStatus;
  profilePhoto: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  hoursWorked: number;
  recordedBy: string;
  remarks?: string;
  checkInTime?: string;
  checkOutTime?: string;
  overtimeHours?: number;
}

export type SyncStatus = 'PENDING' | 'SYNCED' | 'FAILED' | 'CONFLICT';
export type TransportMode = 'COMPANY_VEHICLE' | 'BUS' | 'TRAIN' | 'AUTO' | 'TAXI' | 'FLIGHT' | 'OTHER';

export interface ExpenseRecord {
  id: string;
  employeeId: string;
  title?: string;
  category: ExpenseCategory;
  amount: number;
  expenseDate: string;
  description: string;
  paymentMethod: PaymentMethod;
  receiptUrl?: string;
  receiptName?: string;
  createdBy?: string;
  approvedBy?: string;
  approvalStatus: ApprovalStatus;
  approvalDate?: string;
  remarks?: string;
  paidByCompany?: boolean;
  travelFrom?: string;
  travelTo?: string;
  transportMode?: TransportMode;
  ticketNumber?: string;
  
  // Specific Travel metadata if category === 'TRAVEL'
  travelDetails?: {
    fromLocation: string;
    toLocation: string;
    travelType: TravelType;
  };
}

export interface DailyExpenseEntry {
  id: string;
  employeeId: string;
  date: string;
  foodAmount: number;
  travelAmount: number;
  otherAmount: number;
  totalDaily: number;
  description: string;
  recordedBy: string;
}

export interface AccommodationLease {
  id: string;
  employeeId?: string;
  propertyName?: string;
  address?: string;
  propertyAddress: string;
  monthlyRent: number;
  securityDeposit: number;
  depositAmount?: number;
  startDate: string;
  endDate?: string;
  electricityBill: number;
  waterBill: number;
  otherExpenses: number;
  isCompanyPaid: boolean;
  ownerName?: string;
  ownerPhone?: string;
  assignedEmployeeIds?: string[];
  capacity?: number;
  rentResponsibility?: 'COMPANY_PAID' | 'EMPLOYEE_PAID';
  status?: 'ACTIVE' | 'TERMINATED' | 'RENEWAL_DUE';
}

export interface SalaryAdvance {
  id: string;
  employeeId: string;
  amount: number;
  date: string;
  advanceDate?: string;
  totalAdvanceAmount?: number;
  monthlyDeductionAmount?: number;
  repaidAmount?: number;
  remainingAmount?: number;
  remainingBalance?: number;
  reason: string;
  repaymentMethod?: 'DEDUCTION_FROM_SALARY' | 'CASH_RETURN';
  deductedAmount?: number;
  approvedBy?: string;
  status: 'PENDING' | 'PARTIALLY_DEDUCTED' | 'REPAID' | 'ACTIVE' | 'FULLY_REPAID';
}

export interface BonusRecord {
  id: string;
  employeeId: string;
  bonusType: BonusType;
  amount: number;
  date?: string;
  declaredDate?: string;
  reason?: string;
  description?: string;
  month?: number; // 1-12
  year?: number;
  appliedMonth?: number;
  appliedYear?: number;
  approvedBy?: string;
  status?: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export interface SalaryCalculationResult {
  employeeId: string;
  month: number;
  year: number;
  employmentType: EmploymentType;
  
  // Attendance metrics
  totalDaysInMonth: number;
  presentDays: number;
  halfDays: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  holidays: number;
  effectiveWorkingDays: number; // present + (halfDays * 0.5) + paidLeaveDays + holidays

  // Earnings Breakdown
  baseEarnedSalary: number; // (dailyWage * effectiveDays) OR fixed monthly base
  foodAllowance: number;
  travelAllowance: number;
  rentAllowance: number;
  otherAllowance: number;
  bonusAmount: number;
  grossEarnings: number; // base + allowances + bonus

  // Deductions Breakdown
  advanceDeduction: number;
  unpaidLeaveDeduction: number;
  otherDeductions: number;
  totalDeductions: number;

  // Net Take Home for Employee
  netPayableSalary: number;

  // Company Expense Summary (Expenses paid by company on employee's behalf)
  companyPaidFood: number;
  companyPaidTravel: number;
  companyPaidRent: number;
  companyPaidDailyExpenses: number;
  companyPaidMedicalAndOther: number;
  totalCompanyExpenses: number;

  // Total Company Financial Outlay for this employee = Net Salary + Advances Disbursed + Total Company Expenses
  totalCompanyOutlay: number;

  status: PaymentStatus;
  processedDate?: string;
  paymentMethod?: PaymentMethod;
  transactionRef?: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
  ipAddress: string;
}

export interface DashboardMetrics {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  dailyWageCount: number;
  monthlySalariedCount: number;
  currentMonthSalaryLiability: number;
  currentMonthExpenses: number;
  totalBonusesMonth: number;
  totalAdvancesMonth: number;
  pendingExpenseApprovals: number;
  totalRentExpenses: number;
  totalFoodExpenses: number;
  totalTravelExpenses: number;
  totalCompanyExpenditure: number;
}
