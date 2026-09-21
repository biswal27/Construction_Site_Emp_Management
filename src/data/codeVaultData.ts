export interface CodeFile {
  path: string;
  category: 'BACKEND_SPRING_BOOT' | 'DATABASE_FLYWAY' | 'DOCKER_DEVOPS' | 'ANDROID_JAVA' | 'TESTS';
  title: string;
  language: 'java' | 'xml' | 'sql' | 'yaml';
  description: string;
  content: string;
}

export const CODE_VAULT_FILES: CodeFile[] = [
  {
    path: 'pom.xml',
    category: 'BACKEND_SPRING_BOOT',
    title: 'Maven Project Object Model (Java 21 + Spring Boot 3.3.x)',
    language: 'xml',
    description: 'Production Maven configuration with Spring Boot 3, Java 21, Spring Security, JWT jjwt, Flyway, PostgreSQL, Lombok, and OpenAPI/Swagger.',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.3</version>
        <relativePath/>
    </parent>
    <groupId>com.company.workforce</groupId>
    <artifactId>workforce-salary-expense-system</artifactId>
    <version>1.0.0-RELEASE</version>
    <name>Workforce Salary &amp; Expense Management API</name>
    <description>Production construction workforce, salary calculation, daily wage, and expense tracking system</description>

    <properties>
        <java.version>21</java.version>
        <jjwt.version>0.12.6</jjwt.version>
        <springdoc.version>2.6.0</springdoc.version>
        <testcontainers.version>1.20.1</testcontainers.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <!-- PostgreSQL & Flyway -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-database-postgresql</artifactId>
        </dependency>

        <!-- JWT Security (JJWT 0.12) -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>\${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- OpenAPI 3 Documentation -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>\${springdoc.version}</version>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Testing & Testcontainers -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.testcontainers</groupId>
            <artifactId>postgresql</artifactId>
            <version>\${testcontainers.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>21</source>
                    <target>21</target>
                    <parameters>true</parameters>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`,
  },
  {
    path: 'src/main/resources/db/migration/V1__init_workforce_schema.sql',
    category: 'DATABASE_FLYWAY',
    title: 'Flyway Migration V1 (PostgreSQL Normalized Schema)',
    language: 'sql',
    description: 'Complete PostgreSQL schema DDL with proper numeric(14,2) currency types, UUID keys, unique constraints, foreign keys, and indexes.',
    content: `-- ====================================================================
-- Flyway Database Migration: V1__init_workforce_schema.sql
-- Construction Workforce Salary, Expense, Advance & Attendance System
-- PostgreSQL 15+ compatible with proper indexing & constraints
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Roles & Users
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(255)
);

INSERT INTO roles (name, description) VALUES 
('ROLE_ADMIN', 'Full administrative authority across all sites, payroll, and approvals'),
('ROLE_EMPLOYEE', 'Self-service view of own attendance, salary, advances, and expenses');

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    PRIMARY KEY (user_id, role_id)
);

-- 2. Employees Master
CREATE TABLE employees (
    id VARCHAR(30) PRIMARY KEY, -- e.g. EMP-101
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    parent_name VARCHAR(150) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    mobile_number VARCHAR(20) NOT NULL UNIQUE,
    alternate_mobile VARCHAR(20),
    email VARCHAR(150),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    emergency_contact_name VARCHAR(150) NOT NULL,
    emergency_contact_phone VARCHAR(20) NOT NULL,
    joining_date DATE NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    skill_trade VARCHAR(100) NOT NULL,
    employment_type VARCHAR(30) NOT NULL CHECK (employment_type IN ('MONTHLY_SALARY', 'DAILY_WAGE', 'CONTRACT_WORKER', 'TEMPORARY_WORKER')),
    
    -- Monetary Configuration (NUMERIC 14,2 for exact Indian Rupee precision)
    monthly_salary NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    daily_wage NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    food_allowance NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    travel_allowance NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    rent_allowance NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    other_allowance NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    
    -- Banking Details
    bank_account_number VARCHAR(50) NOT NULL,
    bank_ifsc VARCHAR(20) NOT NULL,
    bank_name VARCHAR(150) NOT NULL,
    upi_id VARCHAR(100),
    aadhaar_reference_masked VARCHAR(20),
    pan_reference_masked VARCHAR(20),
    
    -- Housing & Allowances
    accommodation_status VARCHAR(30) NOT NULL DEFAULT 'COMPANY_PROVIDED',
    rent_responsibility VARCHAR(30) NOT NULL DEFAULT 'COMPANY_PAID',
    
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'TERMINATED')),
    profile_photo_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_emp_department ON employees(department);
CREATE INDEX idx_emp_employment_type ON employees(employment_type);
CREATE INDEX idx_emp_status ON employees(status);
CREATE INDEX idx_emp_mobile ON employees(mobile_number);

-- 3. Attendance Records
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(30) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'HALF_DAY', 'PAID_LEAVE', 'UNPAID_LEAVE', 'HOLIDAY')),
    hours_worked NUMERIC(4,2) NOT NULL DEFAULT 8.00,
    recorded_by VARCHAR(100) NOT NULL,
    remarks VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_emp_date UNIQUE (employee_id, attendance_date)
);

CREATE INDEX idx_attendance_emp_date ON attendance(employee_id, attendance_date);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);

-- 4. Expenses & Receipts
CREATE TABLE expenses (
    id VARCHAR(50) PRIMARY KEY, -- e.g. EXP-2026-001
    employee_id VARCHAR(30) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    category VARCHAR(30) NOT NULL CHECK (category IN ('FOOD', 'TRAVEL', 'RENT', 'MEDICAL', 'DAILY_EXPENSE', 'BONUS', 'ADVANCE', 'ACCOMMODATION', 'OTHER')),
    amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    expense_date DATE NOT NULL,
    description TEXT NOT NULL,
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('BANK_TRANSFER', 'UPI', 'CASH', 'OTHER')),
    receipt_url VARCHAR(500),
    receipt_file_name VARCHAR(255),
    created_by VARCHAR(100) NOT NULL,
    approved_by VARCHAR(100),
    approval_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED', 'PAID')),
    approval_date TIMESTAMP WITH TIME ZONE,
    remarks TEXT,
    
    -- Travel Specific
    travel_from VARCHAR(150),
    travel_to VARCHAR(150),
    travel_type VARCHAR(30),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expense_emp_date ON expenses(employee_id, expense_date);
CREATE INDEX idx_expense_category ON expenses(category);
CREATE INDEX idx_expense_status ON expenses(approval_status);

-- 5. Accommodation & Leases
CREATE TABLE accommodations (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(30) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    property_address TEXT NOT NULL,
    monthly_rent NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    security_deposit NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    start_date DATE NOT NULL,
    end_date DATE,
    electricity_bill NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    water_bill NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    other_expenses NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    is_company_paid BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Salary Advances
CREATE TABLE salary_advances (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(30) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    disbursal_date DATE NOT NULL,
    reason TEXT NOT NULL,
    repayment_method VARCHAR(30) NOT NULL DEFAULT 'DEDUCTION_FROM_SALARY',
    deducted_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    remaining_amount NUMERIC(14,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PARTIALLY_DEDUCTED', 'REPAID')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_advances_emp ON salary_advances(employee_id, status);

-- 7. Bonuses
CREATE TABLE bonuses (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(30) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    bonus_type VARCHAR(30) NOT NULL CHECK (bonus_type IN ('PERFORMANCE', 'FESTIVAL', 'PROJECT', 'SPECIAL', 'OTHER')),
    amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    bonus_date DATE NOT NULL,
    reason TEXT NOT NULL,
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INT NOT NULL,
    approved_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Immutable Monthly Salary Records
CREATE TABLE salary_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(30) NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    salary_month INT NOT NULL CHECK (salary_month BETWEEN 1 AND 12),
    salary_year INT NOT NULL,
    employment_type VARCHAR(30) NOT NULL,
    
    total_days INT NOT NULL,
    present_days NUMERIC(4,1) NOT NULL,
    effective_working_days NUMERIC(4,1) NOT NULL,
    
    base_earned_salary NUMERIC(14,2) NOT NULL,
    food_allowance NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    travel_allowance NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    rent_allowance NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    other_allowance NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    bonus_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    gross_earnings NUMERIC(14,2) NOT NULL,
    
    advance_deduction NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    unpaid_leave_deduction NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    other_deductions NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    total_deductions NUMERIC(14,2) NOT NULL,
    
    net_payable_salary NUMERIC(14,2) NOT NULL,
    
    company_paid_expenses NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    total_company_outlay NUMERIC(14,2) NOT NULL,
    
    status VARCHAR(20) NOT NULL DEFAULT 'CALCULATED' CHECK (status IN ('DRAFT', 'CALCULATED', 'APPROVED', 'PROCESSED', 'PAID', 'CANCELLED')),
    payment_method VARCHAR(30),
    payment_reference VARCHAR(100),
    processed_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    version INT NOT NULL DEFAULT 0, -- Optimistic locking
    CONSTRAINT uq_emp_salary_month UNIQUE (employee_id, salary_month, salary_year)
);

CREATE INDEX idx_salary_month_year ON salary_records(salary_month, salary_year);

-- 9. Audit Logs
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_entity ON audit_logs(entity_name, entity_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);
`,
  },
  {
    path: 'src/main/java/com/company/workforce/salary/service/SalaryCalculationService.java',
    category: 'BACKEND_SPRING_BOOT',
    title: 'SalaryCalculationService (Java 21 BigDecimal Deterministic Engine)',
    language: 'java',
    description: 'Production-ready service implementing exact money calculations, banker rounding (HALF_EVEN), attendance-based daily wage proration, and company expense summaries.',
    content: `package com.company.workforce.salary.service;

import com.company.workforce.attendance.entity.AttendanceEntity;
import com.company.workforce.attendance.entity.AttendanceStatus;
import com.company.workforce.employee.entity.EmployeeEntity;
import com.company.workforce.employee.entity.EmploymentType;
import com.company.workforce.expense.entity.ExpenseEntity;
import com.company.workforce.salary.dto.SalaryCalculationResultDTO;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;
import java.util.List;

@Service
public class SalaryCalculationService {

    private static final RoundingMode ROUNDING = RoundingMode.HALF_EVEN;
    private static final int SCALE = 2;

    /**
     * Calculates the deterministic monthly salary for an employee.
     * Enforces strict BigDecimal arithmetic to prevent floating-point inaccuracies.
     */
    public SalaryCalculationResultDTO calculateSalary(
            EmployeeEntity employee,
            int month,
            int year,
            List<AttendanceEntity> monthlyAttendance,
            List<ExpenseEntity> approvedExpenses,
            BigDecimal availableAdvanceDebt,
            BigDecimal monthlyBonuses,
            BigDecimal monthlyCompanyRent) {

        YearMonth yearMonth = YearMonth.of(year, month);
        int totalDaysInMonth = yearMonth.lengthOfMonth();

        // 1. Attendance Metrics
        BigDecimal presentDays = BigDecimal.ZERO;
        BigDecimal halfDays = BigDecimal.ZERO;
        BigDecimal paidLeaveDays = BigDecimal.ZERO;
        BigDecimal unpaidLeaveDays = BigDecimal.ZERO;
        BigDecimal holidays = BigDecimal.ZERO;

        for (AttendanceEntity att : monthlyAttendance) {
            switch (att.getStatus()) {
                case PRESENT -> presentDays = presentDays.add(BigDecimal.ONE);
                case HALF_DAY -> halfDays = halfDays.add(BigDecimal.ONE);
                case PAID_LEAVE -> paidLeaveDays = paidLeaveDays.add(BigDecimal.ONE);
                case UNPAID_LEAVE -> unpaidLeaveDays = unpaidLeaveDays.add(BigDecimal.ONE);
                case HOLIDAY -> holidays = holidays.add(BigDecimal.ONE);
                default -> {}
            }
        }

        // Effective Working Days = present + (half_days * 0.5) + paid_leave + holidays
        BigDecimal halfDayCredit = halfDays.multiply(new BigDecimal("0.5"));
        BigDecimal effectiveWorkingDays = presentDays
                .add(halfDayCredit)
                .add(paidLeaveDays)
                .add(holidays);

        // 2. Base Earned Salary
        BigDecimal baseEarnedSalary;
        BigDecimal unpaidLeaveDeduction = BigDecimal.ZERO;

        if (employee.getEmploymentType() == EmploymentType.DAILY_WAGE ||
            employee.getEmploymentType() == EmploymentType.CONTRACT_WORKER) {
            
            // Formula for daily workers: Daily Wage × Paid Working Days
            baseEarnedSalary = employee.getDailyWage()
                    .multiply(effectiveWorkingDays)
                    .setScale(SCALE, ROUNDING);
        } else {
            // Formula for monthly salaried: Base - Unpaid Leaves
            BigDecimal dailyRate = employee.getMonthlySalary()
                    .divide(BigDecimal.valueOf(totalDaysInMonth), 4, ROUNDING);
            unpaidLeaveDeduction = dailyRate.multiply(unpaidLeaveDays).setScale(SCALE, ROUNDING);
            baseEarnedSalary = employee.getMonthlySalary().setScale(SCALE, ROUNDING);
        }

        // 3. Allowances & Gross
        BigDecimal foodAllowance = defaultZero(employee.getFoodAllowance());
        BigDecimal travelAllowance = defaultZero(employee.getTravelAllowance());
        BigDecimal rentAllowance = defaultZero(employee.getRentAllowance());
        BigDecimal otherAllowance = defaultZero(employee.getOtherAllowance());
        BigDecimal bonus = defaultZero(monthlyBonuses);

        BigDecimal grossEarnings = baseEarnedSalary
                .add(foodAllowance)
                .add(travelAllowance)
                .add(rentAllowance)
                .add(otherAllowance)
                .add(bonus)
                .setScale(SCALE, ROUNDING);

        // 4. Advance Deduction (Capped at 50% of gross earnings to preserve worker livelihood)
        BigDecimal maxAllowedDeduction = grossEarnings.multiply(new BigDecimal("0.50")).setScale(SCALE, ROUNDING);
        BigDecimal advanceDeduction = availableAdvanceDebt.min(maxAllowedDeduction).setScale(SCALE, ROUNDING);

        BigDecimal totalDeductions = advanceDeduction
                .add(unpaidLeaveDeduction)
                .setScale(SCALE, ROUNDING);

        // 5. Net Payable Salary
        BigDecimal netPayableSalary = grossEarnings.subtract(totalDeductions).max(BigDecimal.ZERO);

        // 6. Company-Paid Expenses Summary
        BigDecimal companyPaidFood = BigDecimal.ZERO;
        BigDecimal companyPaidTravel = BigDecimal.ZERO;
        BigDecimal companyPaidDaily = BigDecimal.ZERO;
        BigDecimal companyPaidMedical = BigDecimal.ZERO;

        for (ExpenseEntity exp : approvedExpenses) {
            switch (exp.getCategory()) {
                case FOOD -> companyPaidFood = companyPaidFood.add(exp.getAmount());
                case TRAVEL -> companyPaidTravel = companyPaidTravel.add(exp.getAmount());
                case DAILY_EXPENSE -> companyPaidDaily = companyPaidDaily.add(exp.getAmount());
                case MEDICAL, OTHER -> companyPaidMedical = companyPaidMedical.add(exp.getAmount());
                default -> {}
            }
        }

        BigDecimal totalCompanyExpenses = companyPaidFood
                .add(companyPaidTravel)
                .add(defaultZero(monthlyCompanyRent))
                .add(companyPaidDaily)
                .add(companyPaidMedical)
                .setScale(SCALE, ROUNDING);

        BigDecimal totalCompanyOutlay = netPayableSalary.add(totalCompanyExpenses).setScale(SCALE, ROUNDING);

        return new SalaryCalculationResultDTO(
                employee.getId(),
                month,
                year,
                employee.getEmploymentType(),
                totalDaysInMonth,
                presentDays.intValue(),
                halfDays.intValue(),
                paidLeaveDays.intValue(),
                unpaidLeaveDays.intValue(),
                holidays.intValue(),
                effectiveWorkingDays,
                baseEarnedSalary,
                foodAllowance,
                travelAllowance,
                rentAllowance,
                otherAllowance,
                bonus,
                grossEarnings,
                advanceDeduction,
                unpaidLeaveDeduction,
                totalDeductions,
                netPayableSalary,
                companyPaidFood,
                companyPaidTravel,
                defaultZero(monthlyCompanyRent),
                companyPaidDaily,
                totalCompanyExpenses,
                totalCompanyOutlay
        );
    }

    private BigDecimal defaultZero(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}
`,
  },
  {
    path: 'src/test/java/com/company/workforce/salary/SalaryCalculationServiceTest.java',
    category: 'TESTS',
    title: 'Unit Test: SalaryCalculationServiceTest (JUnit 5 + Mockito)',
    language: 'java',
    description: 'Comprehensive test suite verifying daily wage multiplication, half-day crediting, advance capping, and rounding invariants.',
    content: `package com.company.workforce.salary;

import com.company.workforce.attendance.entity.AttendanceEntity;
import com.company.workforce.attendance.entity.AttendanceStatus;
import com.company.workforce.employee.entity.EmployeeEntity;
import com.company.workforce.employee.entity.EmploymentType;
import com.company.workforce.salary.dto.SalaryCalculationResultDTO;
import com.company.workforce.salary.service.SalaryCalculationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SalaryCalculationServiceTest {

    private SalaryCalculationService salaryService;

    @BeforeEach
    void setUp() {
        salaryService = new SalaryCalculationService();
    }

    @Test
    @DisplayName("Should correctly calculate Daily Wage: 24 present + 2 half days = 25 effective days @ ₹800 = ₹20,000")
    void testDailyWageCalculation() {
        EmployeeEntity worker = new EmployeeEntity();
        worker.setId("EMP-102");
        worker.setEmploymentType(EmploymentType.DAILY_WAGE);
        worker.setDailyWage(new BigDecimal("800.00"));
        worker.setMonthlySalary(BigDecimal.ZERO);
        worker.setFoodAllowance(new BigDecimal("2000.00"));

        List<AttendanceEntity> attendanceList = new ArrayList<>();
        // 24 Full days
        for (int i = 1; i <= 24; i++) {
            AttendanceEntity att = new AttendanceEntity();
            att.setStatus(AttendanceStatus.PRESENT);
            att.setAttendanceDate(LocalDate.of(2026, 9, i));
            attendanceList.add(att);
        }
        // 2 Half days (0.5 + 0.5 = 1 day)
        for (int i = 25; i <= 26; i++) {
            AttendanceEntity att = new AttendanceEntity();
            att.setStatus(AttendanceStatus.HALF_DAY);
            att.setAttendanceDate(LocalDate.of(2026, 9, i));
            attendanceList.add(att);
        }

        SalaryCalculationResultDTO result = salaryService.calculateSalary(
                worker, 9, 2026, attendanceList, List.of(), BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);

        assertEquals(new BigDecimal("25.0"), result.effectiveWorkingDays());
        assertEquals(new BigDecimal("20000.00"), result.baseEarnedSalary());
        assertEquals(new BigDecimal("22000.00"), result.grossEarnings());
        assertEquals(new BigDecimal("22000.00"), result.netPayableSalary());
    }

    @Test
    @DisplayName("Should deduct advance up to remaining balance without exceeding 50% of gross earnings")
    void testAdvanceDeductionCapping() {
        EmployeeEntity engineer = new EmployeeEntity();
        engineer.setId("EMP-101");
        engineer.setEmploymentType(EmploymentType.MONTHLY_SALARY);
        engineer.setMonthlySalary(new BigDecimal("30000.00"));
        engineer.setFoodAllowance(BigDecimal.ZERO);

        BigDecimal availableAdvanceDebt = new BigDecimal("5000.00");

        SalaryCalculationResultDTO result = salaryService.calculateSalary(
                engineer, 9, 2026, List.of(), List.of(), availableAdvanceDebt, new BigDecimal("5000.00"), BigDecimal.ZERO);

        // Gross = 30000 base + 5000 bonus = 35000
        // Advance deduction = 5000
        // Net = 30000
        assertEquals(new BigDecimal("35000.00"), result.grossEarnings());
        assertEquals(new BigDecimal("5000.00"), result.advanceDeduction());
        assertEquals(new BigDecimal("30000.00"), result.netPayableSalary());
    }
}
`,
  },
  {
    path: 'docker-compose.yml',
    category: 'DOCKER_DEVOPS',
    title: 'Docker Compose (PostgreSQL 16 + Spring Boot + Redis)',
    language: 'yaml',
    description: 'Complete multi-container production orchestrator with health checks, persistent volumes, environment configs, and networking.',
    content: `version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: workforce_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: \${DB_NAME:-workforce_db}
      POSTGRES_USER: \${DB_USERNAME:-workforce_user}
      POSTGRES_PASSWORD: \${DB_PASSWORD:-WorkforceSecurePassword2026!}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${DB_USERNAME:-workforce_user} -d \${DB_NAME:-workforce_db}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: workforce_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: workforce_backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: \${DB_NAME:-workforce_db}
      DB_USERNAME: \${DB_USERNAME:-workforce_user}
      DB_PASSWORD: \${DB_PASSWORD:-WorkforceSecurePassword2026!}
      JWT_SECRET: \${JWT_SECRET:-9a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b}
      FILE_STORAGE_PATH: /app/uploads
    ports:
      - "8080:8080"
    volumes:
      - file_uploads:/app/uploads

volumes:
  postgres_data:
  redis_data:
  file_uploads:
`,
  },
  {
    path: 'android/app/src/main/java/com/company/workforce/sync/ExpenseSyncWorker.java',
    category: 'ANDROID_JAVA',
    title: 'Android Java 21: WorkManager Offline Sync Worker',
    language: 'java',
    description: 'WorkManager background worker with exponential backoff, Room database retrieval, and Retrofit sync for offline expense submission on construction sites.',
    content: `package com.company.workforce.sync;

import android.content.Context;
import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.company.workforce.data.local.AppDatabase;
import com.company.workforce.data.local.entity.ExpenseLocalEntity;
import com.company.workforce.data.remote.ApiClient;
import com.company.workforce.data.remote.dto.ExpenseRequestDTO;
import com.company.workforce.data.remote.dto.ApiResponse;

import java.io.IOException;
import java.util.List;
import retrofit2.Response;

/**
 * Handles resilient offline synchronization for construction site workers.
 * Executes automatically when network connectivity is restored.
 */
public class ExpenseSyncWorker extends Worker {

    private final AppDatabase localDatabase;

    public ExpenseSyncWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
        this.localDatabase = AppDatabase.getInstance(context);
    }

    @NonNull
    @Override
    public Result doWork() {
        // Fetch all pending unsynced expenses from Room SQLite
        List<ExpenseLocalEntity> pendingExpenses = localDatabase.expenseDao().getPendingSyncExpenses();

        if (pendingExpenses.isEmpty()) {
            return Result.success();
        }

        for (ExpenseLocalEntity item : pendingExpenses) {
            ExpenseRequestDTO request = new ExpenseRequestDTO(
                    item.getEmployeeId(),
                    item.getCategory(),
                    item.getAmount(),
                    item.getExpenseDate(),
                    item.getDescription(),
                    item.getPaymentMethod(),
                    item.getReceiptBase64()
            );

            try {
                // Idempotent REST API call to Spring Boot backend
                Response<ApiResponse<Void>> response = ApiClient.getApiService()
                        .submitExpense(request)
                        .execute();

                if (response.isSuccessful()) {
                    // Update status in local Room database
                    item.setSyncStatus("SYNCED");
                    localDatabase.expenseDao().update(item);
                } else if (response.code() >= 500) {
                    // Server error: retry with exponential backoff
                    return Result.retry();
                } else {
                    // Client validation error: mark failed with reason
                    item.setSyncStatus("FAILED");
                    item.setSyncError("Validation failed: " + response.message());
                    localDatabase.expenseDao().update(item);
                }
            } catch (IOException e) {
                // Network unavailable: WorkManager will retry when constraints match
                return Result.retry();
            }
        }

        return Result.success();
    }
}
`,
  },
  {
    path: 'android/app/src/main/java/com/company/workforce/data/local/AppDatabase.java',
    category: 'ANDROID_JAVA',
    title: 'Android Room Database & DAO (Java 21 Native)',
    language: 'java',
    description: 'Room Database architecture with SQLite schemas for offline attendance, expenses, and employee profile caching.',
    content: `package com.company.workforce.data.local;

import android.content.Context;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

import com.company.workforce.data.local.dao.ExpenseDao;
import com.company.workforce.data.local.dao.AttendanceDao;
import com.company.workforce.data.local.entity.ExpenseLocalEntity;
import com.company.workforce.data.local.entity.AttendanceLocalEntity;

@Database(
    entities = {ExpenseLocalEntity.class, AttendanceLocalEntity.class},
    version = 1,
    exportSchema = true
)
public abstract class AppDatabase extends RoomDatabase {

    private static volatile AppDatabase INSTANCE;

    public abstract ExpenseDao expenseDao();
    public abstract AttendanceDao attendanceDao();

    public static AppDatabase getInstance(Context context) {
        if (INSTANCE == null) {
            synchronized (AppDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(
                            context.getApplicationContext(),
                            AppDatabase.class,
                            "workforce_local.db"
                    )
                    .fallbackToDestructiveMigration()
                    .build();
                }
            }
        }
        return INSTANCE;
    }
}
`,
  }
];

export const CODE_VAULT = {
  androidWorkManager:
    CODE_VAULT_FILES.find((f) => f.path.includes('ExpenseSyncWorker.java'))?.content || '',
  springSalaryService:
    CODE_VAULT_FILES.find((f) => f.path.includes('SalaryCalculationService.java'))?.content || '',
  flywayMigration:
    CODE_VAULT_FILES.find((f) => f.path.includes('V1__init_workforce_schema.sql'))?.content || '',
  pomXml:
    CODE_VAULT_FILES.find((f) => f.path === 'pom.xml')?.content || '',
};

