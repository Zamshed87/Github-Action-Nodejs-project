import { toast } from "react-toastify";

import {
  commonFieldsToReset,
  isDayRangeOverlapping,
  isTimeBasedOverlaped,
} from "../LatePunishment/helper";
import { DataState, LeaveDeductionDataState } from "./earlyLeaveType";

function eachDayDuplicacyCheck(data: DataState, values: any, form: any) {
  const conflictingPolicies = data.filter(
    (policy) =>
      policy.isConsecutiveDay === values.isConsecutiveDay &&
      policy.earlyLeaveCalculationTypeId === 1
  );

  for (const policy of conflictingPolicies) {
    const oldMin = policy.minimumEarlyLeaveTime;
    const oldMax = policy.maximumEarlyLeaveTime;
    const newMin = values.minimumEarlyLeaveTime;
    const newMax = values.maximumEarlyLeaveTime;

    const isOverlapping = Math.max(oldMin, newMin) <= Math.min(oldMax, newMax);

    if (isOverlapping) {
      toast.error("You cannot set overlapping early leave time range");
      return false;
    }
  }
}

export const addHandler = (setData: any, data: DataState, form: any) => {
  const values = form.getFieldsValue(true);

  if (values?.minimumEarlyLeaveTime > values?.maximumEarlyLeaveTime) {
    return toast.error(
      "Maximum Early Leave Time should be bigger than Minimum Early Leave Time"
    );
  }
  if (values.earlyLeaveCalculationType?.value === 1) {
    const validated = eachDayDuplicacyCheck(data, values, form);

    if (validated === false) return null;
  }
  if (
    values.earlyLeaveCalculationType?.value === 2 &&
    !isDayRangeOverlapping(data, values)
  ) {
    return null;
  }
  if (
    values.earlyLeaveCalculationType?.value === 3 &&
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
      earlyLeaveCalculationTypeDescription:
        values.earlyLeaveCalculationType?.label || "-",
      earlyLeaveCalculationType:
        values.earlyLeaveCalculationType?.value || null,
      eachDayCountBy: values.eachDayCountBy?.label || values.eachDayCountBy,
      eachDayCountById: values.eachDayCountBy?.value || null,
      startDay: startDateStr
        ? new Date(startDateStr).getUTCDate().toString()
        : "",
      endDay: endDateStr ? new Date(endDateStr).getUTCDate().toString() : "",
      dayRangeId: values.dayRange
        ? [
            new Date(values.dayRange[0]).getUTCDate(),
            new Date(values.dayRange[1]).getUTCDate(),
          ]
        : [],
      isConsecutiveDay: values.isConsecutiveDay,
      minimumEarlyLeaveTime: values.minimumEarlyLeaveTime || 0,
      maximumEarlyLeaveTime: values.maximumEarlyLeaveTime || 0,
      earlyLeaveTimeCalculatedByDescription:
        values.calculatedBy?.label || values.calculatedBy,
      earlyLeaveTimeCalculatedBy: values.calculatedBy?.value || null,
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
  form.resetFields([...earlyLeaveSpecificFields, ...commonFieldsToReset]);
};

const earlyLeaveSpecificFields = [
  "earlyLeaveCalculationType",
  "minimumEarlyLeaveTime",
  "maximumEarlyLeaveTime",
];

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
