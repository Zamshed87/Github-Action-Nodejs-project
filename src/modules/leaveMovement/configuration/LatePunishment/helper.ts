import { toast } from "react-toastify";
import {
  DataState,
  Department,
  Designation,
  EmploymentType,
  LatePunishmentElement,
  LatePunishmentPayload,
  LeaveDeduction,
  LeaveDeductionDataState,
} from "./type";
import { FormInstance } from "antd";
import { SetStateAction } from "react";
import axios from "axios";

function eachDayDuplicacyCheck(data: DataState, values: any, form: any) {
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
    console.log(oldMin, oldMax);
    console.log(newMin, newMax);

    const isOverlapping = Math.max(oldMin, newMin) <= Math.min(oldMax, newMax);
    console.log(isOverlapping);

    if (isOverlapping) {
      toast.error(
        "You cannot set overlapping late time range" + values.isConsecutiveDay
      );
      return false;
    }
    console.log(policy.eachDayCountBy, "policy.eachDayCountBy");
    console.log(policy.eachDayCountById, "policy.eachDayCountById");
  }
}

function isDayRangeOverlapping(data: any[], values: any): boolean {
  // if (!Array.isArray(values?.dayRange)) return false;
  const [newStart, newEnd] = [
    new Date(values.dayRange[0]).getUTCDate(),
    new Date(values.dayRange[1]).getUTCDate(),
  ];
  const conflictingPolicies = data.filter(
    (policy) => policy.lateCalculationTypeId === 2
  );

  for (const policy of conflictingPolicies) {
    const [oldStart, oldEnd] = policy.dayRangeId;

    const isOverlapping =
      Math.max(newStart, oldStart) <= Math.min(newEnd, oldEnd);

    if (isOverlapping) {
      toast.error(
        `Day Range [${newStart}, ${newEnd}] overlaps with existing range [${oldStart}, ${oldEnd}]`
      );
      return true;
    }
  }

  return false; // ✅ No conflicts
}

function isTimeBasedOverlaped(data: any[], values: any): boolean {
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
    isDayRangeOverlapping(data, values)
  ) {
    return null;
  }
  if (
    values.lateCalculationType?.value === 3 &&
    isTimeBasedOverlaped(data, values)
  ) {
    return null;
  }
  console.log(values, "values22");
  const dayRange: string = values?.dayRange
    ?.map((date: string) => new Date(date).getUTCDate())
    .join("-");

  console.log("values.eachDayCountBy", values.eachDayCountBy?.label);

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
      dayRange: dayRange,
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
  form.resetFields(fieldsToReset);
};

const fieldsToReset = [
  "lateCalculationType",
  "eachDayCountBy",
  "dayRange",
  "isConsecutiveDay",
  "minimumLateTime",
  "maximumLateTime",
  "calculatedBy",
  "punishmentType",
  "leaveDeductType",
  "leaveDeductQty",
  "amountDeductFrom",
  "amountDeductType",
  "amountPercentage",
]; // dynamically computed array

export const createEditLatePunishmentConfig = async (
  profileData: any,
  form: FormInstance<any>,
  data: DataState,
  leaveDeductionData: LeaveDeductionDataState,
  setLoading: { (value: SetStateAction<boolean>): void; (arg0: boolean): void },
  cb: any
) => {
  setLoading(true);
  try {
    const { orgId, buId, wgId, wId, employeeId, intAccountId } = profileData;
    const values = form.getFieldsValue(true);

    const payload = mapLatePunishmentPayload(
      values,
      data,
      leaveDeductionData,
      orgId,
      buId,
      wgId,
      wId,
      intAccountId
    );
    const res = await axios.post(`/LatePunishmentpolicy`, payload);
    form.resetFields();
    toast.success("Created Successfully", { toastId: 1222 });
    cb && cb();
    setLoading(false);
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.Message || "Something went wrong";
    toast.warn(errorMessage);
  } finally {
    setLoading(false);
  }
};

const mapLatePunishmentPayload = (
  values: any,
  dataState: any[],
  leaveDeductionData: LeaveDeductionDataState,
  orgId: number,
  buId: number,
  wgId: number,
  wId: number,
  accountId: number
): LatePunishmentPayload => {
  const payload: LatePunishmentPayload = {
    accountId: accountId || 0,
    businessUnitId: buId || 0,
    workplaceGroupId: wgId || 0,
    workplaceId: wId || 0,
    name: values?.policyName || "",
    description: values?.policyDescription || "",
    isActive: true,
    actionBy: values?.employeeId || 0,
    elements: dataState.map(
      (item: any): LatePunishmentElement => ({
        lateCalculationType: item.lateCalculationType || 0,
        lateCalculationTypeDescription:
          item.lateCalculationTypeDescription || "",
        eachDayCountBy: item.eachDayCountById || 0,
        startDay: item.dayRange ? parseInt(item.dayRange.split("-")[0]) : 0,
        endDay: item.dayRange ? parseInt(item.dayRange.split("-")[1]) : 0,
        isConsecutiveDay: item.isConsecutiveDay || false,
        minimumLateTime: item.minimumLateTime || 0,
        maximumLateTime: item.maximumLateTime || 0,
        lateTimeCalculatedBy: item.lateTimeCalculatedBy || 0,
        lateTimeCalculatedByDescription:
          item.lateTimeCalculatedByDescription || "",
        punishmentType: item.punishmentType || 0,
        punishmentTypeDescription: item.punishmentTypeDescription || "",
        leaveDeductType: item.leaveDeductType || 0,
        leaveDeductTypeDescription: item.leaveDeductTypeDescription || "",
        leaveDeductQty: item.leaveDeductQty || 0,
        amountDeductFrom: item.amountDeductFrom || 0,
        amountDeductFromDescription: item.amountDeductFromDescription || 0,
        amountDeductType: item.amountDeductType || 0,
        amountDeductTypeDescription: item.amountDeductTypeDescription || "",
        amountOrPercentage: item.amountOrPercentage || 0,
        id: item.id || 0,
      })
    ),
    departments: (values?.department || []).map(
      (dept: any): Department => ({
        departmentId: dept.value || 0,
        departmentName: dept.label || "",
        id: 0,
      })
    ),
    designations: (values?.designation || []).map(
      (design: any): Designation => ({
        designationId: design.value || 0,
        designationName: design.label || "",
        id: 0,
      })
    ),
    employmentTypes: (values?.employmentType || []).map(
      (empType: any): EmploymentType => ({
        employmentTypeId: empType.value || 0,
        employmentTypeName: empType.label || "",
        id: 0,
      })
    ),
    leaveDeductions: (leaveDeductionData || []).map(
      (ld: any, index: number): LeaveDeduction => ({
        serialNo: index,
        leaveTypeId: ld.leaveTypeId || 0,
        leaveTypeName: ld.leaveTypeName || "",
        id: 0,
      })
    ),
  };

  return payload;
};

export const addLeaveDeductions = (
  setData: any,
  data: LeaveDeductionDataState,
  values: any
) => {
  console.log("values", values);
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
