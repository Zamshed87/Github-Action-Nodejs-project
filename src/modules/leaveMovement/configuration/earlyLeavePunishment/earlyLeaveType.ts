import {
  Department,
  Designation,
  EmploymentType,
} from "../LatePunishment/type";

export interface EarlyLeavePunishmentData {
  policyName: string;
  workplace: string;
  workplaceId: number | null;
  employmentType: string;
  employmentTypeId: number | null;
  designation: string;
  designationId: number | null;
  department: string;
  departmentId: number | null;
  policyDescription: string;
  earlyLeaveCalculationType: string;
  earlyLeaveCalculationTypeId: number | null;
  eachDayCountBy: string | null;
  eachDayCountById: number | null;
  dayRange: string | null;
  dayRangeId: [number, number];
  isConsecutiveDay: boolean;
  minimumEarlyLeaveTime: number;
  maximumEarlyLeaveTime: number;
  earlyLeaveTimeCalculatedBy: string;
  earlyLeaveTimeCalculatedById: number | null;
  punishmentType: string;
  punishmentTypeId: number | null;
  leaveDeductType: string;
  leaveDeductTypeId: number | null;
  leaveDeductQty: number;
  amountDeductFrom: string;
  amountDeductFromId: number | null;
  amountDeductType: string;
  amountDeductTypeId: number | null;
  amountPercentage: number;
}

export type DataState = EarlyLeavePunishmentData[];

export interface EarlyLeavePunishmentElement {
  earlyLeaveCalculationType: number;
  earlyLeaveCalculationTypeDescription: string;
  eachDayCountBy: number;
  startDay: number;
  endDay: number;
  isConsecutiveDay: boolean;
  minimumEarlyLeaveTime: number;
  maximumEarlyLeaveTime: number;
  earlyLeaveTimeCalculatedBy: number;
  earlyLeaveTimeCalculatedByDescription: string;
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

export interface LeaveDeduction {
  serialNo: number;
  leaveTypeId: number;
  leaveTypeName: string;
  id: number;
}

export type LeaveDeductionDataState = LeaveDeduction[];

export interface EarlyLeavePunishmentPayload {
  accountId: number;
  businessUnitId: number;
  workplaceGroupId: number;
  workplaceId: number;
  name: string;
  description: string;
  isActive: boolean;
  actionBy: number;
  elements: EarlyLeavePunishmentElement[];
  departments: Department[];
  designations: Designation[];
  employmentTypes: EmploymentType[];
  leaveDeductions: LeaveDeduction[];
}
