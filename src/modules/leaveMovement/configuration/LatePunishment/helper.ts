import { FormInstance } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import {
  DataState,
  Department,
  Designation,
  EmploymentType,
  LeaveDeduction,
  LeaveDeductionDataState,
} from "./type";

export function eachDayDuplicacyCheck(data: DataState, values: any, form: any) {
  const conflictingPolicies = data.filter(
    (policy) =>
      policy.isConsecutiveDay === values.isConsecutiveDay &&
      policy.lateCalculationTypeId === 1
  );

  for (const policy of conflictingPolicies) {
    const oldMin = policy.minimumLateTime;
    const oldMax = policy.maximumLateTime;
    const newMin = values.minimumLateTime;
    const newMax = values.maximumLateTime;

    const isOverlapping = Math.max(oldMin, newMin) <= Math.min(oldMax, newMax);

    if (isOverlapping) {
      toast.error(
        "You cannot set overlapping late time range" + values.isConsecutiveDay
      );
      return false;
    }
  }
}
const isDateRangeOverlap = (
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
): boolean => {
  return !(endA < startB || startA > endB);
};

export function isDayRangeOverlapping(data: any[], values: any): any {
  const [newStartISO, newEndISO] = values.dayRange;
  const newStartDate = new Date(newStartISO);
  const newEndDate = new Date(newEndISO);

  const hasOverlap = data.some((item) => {
    const range = item.dayRangeId;
    if (!range || range.length < 2) return false;

    const [startDay, endDay] = range;

    // Clone newStartDate to create proper base
    const baseDate = new Date(newStartDate);
    const existingStartDate = new Date(baseDate);
    const existingEndDate = new Date(baseDate);

    existingStartDate.setDate(
      baseDate.getDate() - (baseDate.getDate() - startDay)
    );
    existingEndDate.setDate(baseDate.getDate() - (baseDate.getDate() - endDay));

    return isDateRangeOverlap(
      newStartDate,
      newEndDate,
      existingStartDate,
      existingEndDate
    );
  });

  if (hasOverlap) {
    toast.error("Day range overlaps with an existing policy.");
    return false;
  }

  return true; // No overlap, safe to proceed
}

export function isTimeBasedOverlaped(data: any[], values: any): boolean {
  const conflictingPolicies = data.filter(
    (policy) => policy.lateCalculationTypeId === 3
  );
  for (const policy of conflictingPolicies) {
    const oldMin = policy.minimumLateTime;
    const oldMax = policy.maximumLateTime;
    const newMin = values.minimumLateTime;
    const newMax = values.maximumLateTime;

    const isOverlapping = Math.max(oldMin, newMin) <= Math.min(oldMax, newMax);

    if (isOverlapping) {
      toast.error("You cannot set overlapping late time range");
      return true;
    }
  }
  return false;
}

export const addHandler = (
  setData: any,
  data: DataState,
  // values: any,
  form: any
) => {
  const values = form.getFieldsValue(true);

  if (values?.minimumLateTime > values?.maximumLateTime) {
    return toast.error(
      "Maximum Late Time should be bigger than Minimum Late Time"
    );
  }
  if (values.lateCalculationType?.value === 1) {
    const validated = eachDayDuplicacyCheck(data, values, form);

    if (validated === false) return null;
  }
  if (
    values.lateCalculationType?.value === 2 &&
    !isDayRangeOverlapping(data, values)
  ) {
    return null;
  }
  if (
    values.lateCalculationType?.value === 3 &&
    isTimeBasedOverlaped(data, values)
  ) {
    return null;
  }
  const [startDateStr, endDateStr] = values?.dayRange || [];

  setData([
    ...data,
    {
      idx: crypto.randomUUID(),
      policyName: values.policyName,
      workplace: values.workplace?.label || values.workplace,
      workplaceId: values.workplace?.value || null,
      employmentType: values.employmentType?.label || values.employmentType,
      employmentTypeId: values.employmentType?.value || null,
      designation: values.designation?.label || values.designation,
      designationId: values.designation?.value || null,
      department: values.department?.label || values.department,
      departmentId: values.department?.value || null,
      policyDescription: values.policyDescription,
      lateCalculationTypeDescription: values.lateCalculationType?.label || "-",
      lateCalculationType: values.lateCalculationType?.value || null,
      eachDayCountBy: values.eachDayCountBy?.label || values.eachDayCountBy,
      eachDayCountById: values.eachDayCountBy?.value || null,
      startDay: startDateStr
        ? new Date(startDateStr).getUTCDate().toString()
        : "",
      endDay: endDateStr ? new Date(endDateStr).getUTCDate().toString() : "",
      // dayRange: dayRange,
      dayRangeId: values.dayRange
        ? [
            new Date(values.dayRange[0]).getUTCDate(),
            new Date(values.dayRange[1]).getUTCDate(),
          ]
        : [],
      isConsecutiveDay: values.isConsecutiveDay,
      minimumLateTime: values.minimumLateTime || 0,
      maximumLateTime: values.maximumLateTime || 0,
      lateTimeCalculatedByDescription:
        values.calculatedBy?.label || values.calculatedBy,
      lateTimeCalculatedBy: values.calculatedBy?.value || null,
      punishmentType: values.punishmentType?.value || 0,
      punishmentTypeDescription: values.punishmentType?.label || "-",
      leaveDeductType: values.leaveDeductType?.value || 0,
      leaveDeductTypeDescription: values.leaveDeductType?.label || "-",
      leaveDeductQty: values.leaveDeductQty,
      amountDeductFromDescription: values.amountDeductFrom?.label || "-",
      amountDeductFrom: values.amountDeductFrom?.value || 0,
      amountDeductTypeDescription: values.amountDeductType?.label || "-",
      amountDeductType: values.amountDeductType?.value || 0,
      amountOrPercentage: values.amountPercentage,
    },
  ]);
  form.resetFields([...lateSpecificFields, ...commonFieldsToReset]);
};

const lateSpecificFields = [
  "lateCalculationType",
  "minimumLateTime",
  "maximumLateTime",
];

export const commonFieldsToReset = [
  "eachDayCountBy",
  "dayRange",
  "isConsecutiveDay",
  "calculatedBy",
  "punishmentType",
  "leaveDeductType",
  "leaveDeductQty",
  "amountDeductFrom",
  "amountDeductType",
  "amountPercentage",
];

type BasePunishmentPayload = {
  accountId: number;
  businessUnitId: number;
  workplaceGroupId: number;
  workplaceId: number;
  name: string;
  description: string;
  isActive: boolean;
  actionBy: number;
  elements: any[];
  departments: Department[];
  designations: Designation[];
  employmentTypes: EmploymentType[];
  leaveDeductions: LeaveDeduction[];
};

export const createEditPunishmentConfig = async (
  endpoint: string,
  profileData: any,
  form: FormInstance<any>,
  data: any,
  leaveDeductionData: LeaveDeductionDataState,
  setLoading: any,
  cb: any,
  type: "late" | "early"
) => {
  setLoading(true);
  try {
    const { orgId, buId, wgId, wId, intAccountId } = profileData;
    const values = form.getFieldsValue(true);

    const payload = mapPunishmentPayload(
      values,
      data,
      leaveDeductionData,
      orgId,
      buId,
      wgId,
      wId,
      intAccountId,
      type
    );

    await axios.post(endpoint, payload);

    form.resetFields();
    toast.success("Created Successfully", { toastId: 1222 });
    cb?.();
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.Message || "Something went wrong";
    toast.warn(errorMessage);
  } finally {
    setLoading(false);
  }
};

const mapPunishmentPayload = (
  values: any,
  dataState: any[],
  leaveDeductionData: LeaveDeductionDataState,
  orgId: number,
  buId: number,
  wgId: number,
  wId: number,
  accountId: number,
  type: "late" | "early"
): BasePunishmentPayload => {
  const elements = dataState.map((item: any) => {
    const isLate = type === "late";
    return {
      ...(isLate
        ? {
            lateCalculationType: item.lateCalculationType || 0,
            lateCalculationTypeDescription:
              item.lateCalculationTypeDescription || "",
            minimumLateTime: item.minimumLateTime || 0,
            maximumLateTime: item.maximumLateTime || 0,
            lateTimeCalculatedBy: item.lateTimeCalculatedBy || 0,
            lateTimeCalculatedByDescription:
              item.lateTimeCalculatedByDescription || "",
          }
        : {
            earlyLeaveCalculationType: item.earlyLeaveCalculationType || 0,
            earlyLeaveCalculationTypeDescription:
              item.earlyLeaveCalculationTypeDescription || "",
            minimumEarlyLeaveTime: item.minimumEarlyLeaveTime || 0,
            maximumEarlyLeaveTime: item.maximumEarlyLeaveTime || 0,
            earlyLeaveTimeCalculatedBy: item.earlyLeaveTimeCalculatedBy || 0,
            earlyLeaveTimeCalculatedByDescription:
              item.earlyLeaveTimeCalculatedByDescription || "",
          }),
      eachDayCountBy: item.eachDayCountById || 0,
      startDay: item.startDay || 0,
      endDay: item.endDay || 0,
      isConsecutiveDay: item.isConsecutiveDay || false,
      punishmentType: item.punishmentType || 0,
      punishmentTypeDescription: item.punishmentTypeDescription || "",
      leaveDeductType: item.leaveDeductType || 0,
      leaveDeductTypeDescription: item.leaveDeductTypeDescription || "",
      leaveDeductQty: item.leaveDeductQty || 0,
      amountDeductFrom: item.amountDeductFrom || 0,
      amountDeductFromDescription: item.amountDeductFromDescription || "",
      amountDeductType: item.amountDeductType || 0,
      amountDeductTypeDescription: item.amountDeductTypeDescription || "",
      amountOrPercentage: item.amountOrPercentage || 0,
      id: item.id || 0,
    };
  });

  return {
    accountId: accountId || 0,
    businessUnitId: buId || 0,
    workplaceGroupId: wgId || 0,
    workplaceId: wId || 0,
    name: values?.policyName || "",
    description: values?.policyDescription || "",
    isActive: true,
    actionBy: values?.employeeId || 0,
    elements,
    departments: (values?.department || []).map((dept: any) => ({
      departmentId: dept.value || 0,
      departmentName: dept.label || "",
      id: 0,
    })),
    designations: (values?.designation || []).map((des: any) => ({
      designationId: des.value || 0,
      designationName: des.label || "",
      id: 0,
    })),
    employmentTypes: (values?.employmentType || []).map((emp: any) => ({
      employmentTypeId: emp.value || 0,
      employmentTypeName: emp.label || "",
      id: 0,
    })),
    leaveDeductions: (leaveDeductionData || []).map((ld: any, i: number) => ({
      serialNo: i,
      leaveTypeId: ld.leaveTypeId || 0,
      leaveTypeName: ld.leaveTypeName || "",
      id: 0,
    })),
  };
};

export const addLeaveDeductions = (
  setData: any,
  data: LeaveDeductionDataState,
  values: any
) => {
  setData([
    ...data,
    {
      serialNo: data.length + 1,
      leaveTypeId: values?.leaveType?.value,
      leaveTypeName: values?.leaveType?.label,
      id: 0,
    },
  ]);
};

export const statusChangePunishmentConfig = async (
  url: string,
  id: number,
  status: boolean | string,
  cb: any,
  type: "late" | "early"
) => {
  try {
    await axios.put(`/${url}/SetStatus/${id}?isActive=${status}`, {});
    toast.success("Updated Successfully", { toastId: 1222 });
    cb?.();
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.Message || "Something went wrong";
    toast.warn(errorMessage);
  } finally {
  }
};
