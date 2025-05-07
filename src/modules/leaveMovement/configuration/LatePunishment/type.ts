export interface LatePunishmentData {
  policyName: string;
  workplace: string; // Label from DDL or raw string
  workplaceId: number | null; // Value from DDL or null
  employmentType: string; // Label from DDL or raw string
  employmentTypeId: number | null; // Value from DDL or null
  designation: string; // Label from DDL or raw string
  designationId: number | null; // Value from DDL or null
  department: string; // Label from DDL or raw string
  departmentId: number | null; // Value from DDL or null
  policyDescription: string;
  lateCalculationType: string; // Label from DDL or raw string
  lateCalculationTypeId: number | null; // Value from DDL or null
  eachDayCountBy: string | null; // Label from DDL or null (empty DDL)
  eachDayCountById: number | null; // Value from DDL or null
  dayRange: string | null; // Label from DDL or null (empty DDL)
  dayRangeId: number | null; // Value from DDL or null
  isConsecutiveDay: boolean;
  minimumLateTime: number;
  maximumLateTime: number;
  lateTimeCalculatedBy: string; // Label from DDL or raw string (mapped from calculatedBy)
  lateTimeCalculatedById: number | null; // Value from DDL or null
  punishmentType: string; // Label from DDL or raw string
  punishmentTypeId: number | null; // Value from DDL or null
  leaveDeductType: string; // Label from DDL or raw string
  leaveDeductTypeId: number | null; // Value from DDL or null
  leaveDeductQty: number;
  amountDeductFrom: string; // Label from DDL or raw string
  amountDeductFromId: number | null; // Value from DDL or null
  amountDeductType: string; // Label from DDL or raw string
  amountDeductTypeId: number | null; // Value from DDL or null
  amountPercentage: number;
}

// Type for the data state (array of LatePunishmentData)
export type DataState = LatePunishmentData[];

export interface LatePunishmentElement {
  lateCalculationType: number;
  lateCalculationTypeDescription: string;
  eachDayCountBy: number;
  startDay: number;
  endDay: number;
  isConsecutiveDay: boolean;
  minimumLateTime: number;
  maximumLateTime: number;
  lateTimeCalculatedBy: number;
  lateTimeCalculatedByDescription: string;
  punishmentType: number;
  punishmentTypeDescription: string;
  leaveDeductType: number;
  leaveDeductTypeDescription: string;
  leaveDeductQty: number;
  amountDeductFrom: number;
  amountDeductFromDescription: string;
  amountDeductType: number;
  amountDeductTypeDescription: string;
  amountOrPercentage: number;
  id: number;
}

export interface Department {
  departmentId: number;
  departmentName: string;
  id: number;
}

export interface Designation {
  designationId: number;
  designationName: string;
  id: number;
}

export interface EmploymentType {
  employmentTypeId: number;
  employmentTypeName: string;
  id: number;
}

export interface LeaveDeduction {
  serialNo: number;
  leaveTypeId: number;
  leaveTypeName: string;
  id: number;
}

export interface LatePunishmentPayload {
  accountId: number;
  businessUnitId: number;
  workplaceGroupId: number;
  workplaceId: number;
  name: string;
  description: string;
  isActive: boolean;
  actionBy: number;
  elements: LatePunishmentElement[];
  departments: Department[];
  designations: Designation[];
  employmentTypes: EmploymentType[];
  leaveDeductions: LeaveDeduction[];
}
