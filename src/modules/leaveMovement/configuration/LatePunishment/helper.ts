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

const calculationType = [
  {
    label: "Each Day",
    value: 1,
  },
  {
    label: "Day Range",
    value: 2,
  },
  {
    label: "Time Based",
    value: 3,
  },
];

const calculatedBy = [
  {
    label: "Sum of Late Time",
    value: 1,
  },
  {
    label: "Actual Late Time",
    value: 2,
  },
];

const punishmentType = [
  {
    label: "Leave Deduct",
    value: 1,
  },
  {
    label: "Amount Deduct",
    value: 2,
  },
];

const leaveDeductType = [
  {
    label: "Full Day",
    value: 1,
  },
  {
    label: "Half Day",
    value: 2,
  },
  {
    label: "Actual Clock Time",
    value: 3,
  },
];

const amountDeductFrom = [
  {
    label: "Gross Salary",
    value: 1,
  },
  {
    label: "Basic Salary",
    value: 2,
  },
  {
    label: "Fixed Amount",
    value: 3,
  },
];

const amountDeductType = [
  {
    label: "Actual Time",
    value: 1,
  },
  {
    label: "1 Day Salary",
    value: 2,
  },
];

const daysArray = Array.from({ length: 31 }, (_, i) => ({
  label: (i + 1).toString(),
  value: i + 1,
}));

export const LatePunishment = (
  workplaceDDL: any[],
  getEmploymentType: () => void,
  getEmployeDepartment: () => void,
  getEmployeDesignation: () => void,
  employmentTypeDDL: any[],
  empDepartmentDDL: any[],
  empDesignationDDL: any[],
  DayRangeComponent: any,
  CustomCheckbox: any,
  values: any
) => {
  return [
    {
      type: "textbox",
      label: "Punishment Policy Name",
      varname: "policyName",
      placeholder: "Enter policy name",
      rules: [
        { required: true, message: "Punishment Policy Name is required!" },
      ],
      col: 6,
    },
    {
      type: "ddl",
      label: "Workplace",
      varname: "workplace",
      ddl: workplaceDDL,
      placeholder: "Select workplace",
      // rules: [{ required: true, message: "Workplace is required!" }],
      onChange: (value: any) => {
        getEmploymentType();
        getEmployeDepartment();
        getEmployeDesignation();
      },
      col: 6,
    },
    {
      type: "ddl",
      label: "Employment Type",
      varname: "employmentType",
      ddl: employmentTypeDDL || [],
      mode: "multiple",
      placeholder: "Select employment type",
      // rules: [{ required: true, message: "Employment Type is required!" }],
      col: 6,
    },
    {
      type: "ddl",
      label: "Designation",
      varname: "designation",
      ddl: empDesignationDDL || [],
      placeholder: "Select designation",
      mode: "multiple",
      // rules: [{ required: true, message: "Designation is required!" }],
      col: 6,
    },
    {
      type: "ddl",
      label: "Department",
      varname: "department",
      ddl: empDepartmentDDL || [],
      mode: "multiple",
      placeholder: "Select department",
      // rules: [{ required: true, message: "Department is required!" }],
      col: 6,
    },
    {
      type: "textbox",
      label: "Policy Description",
      varname: "policyDescription",
      placeholder: "Enter policy description",
      rules: [{ required: true, message: "Policy Description is required!" }],
      col: 6,
    },
    {
      type: "empty",
      col: 24,
    },
    {
      type: "divider",
      col: 24,
    },
    {
      type: "ddl",
      label: "Late Calculation Type",
      varname: "lateCalculationType",
      ddl: calculationType || [],
      placeholder: "Select late calculation type",
      rules: [
        { required: true, message: "Late Calculation Type is required!" },
      ],
      col: 6,
    },
    ...(values?.lateCalculationType?.value === 1
      ? [
          {
            type: "ddl",
            label: "Each Day Count by",
            varname: "eachDayCountBy",
            ddl: daysArray || [],
            placeholder: "Select Each Day Count by",
            col: 6,
          },
        ]
      : []),
    ...(values?.lateCalculationType?.value === 2
      ? [
          {
            type: "component",
            component: DayRangeComponent,
            col: 6,
          },
        ]
      : []),
    ...(values?.lateCalculationType?.value !== 3
      ? [
          {
            type: "component",
            component: CustomCheckbox,
            col: 6,
          },
        ]
      : []),

    {
      type: "number",
      label: "Minimum Late Time (Minutes)",
      varname: "minimumLateTime",
      placeholder: "Enter minimum late time",
      // rules: [{ required: true, message: "Minimum Late Time is required!" }],
      col: 6,
    },
    {
      type: "number",
      label: "Maximum Late Time (Minutes)",
      varname: "maximumLateTime",
      placeholder: "Enter maximum late time",
      // rules: [{ required: true, message: "Maximum Late Time is required!" }],
      col: 6,
    },
    ...(values?.lateCalculationType?.value !== 3
      ? [
          {
            type: "ddl",
            label: "Calculated By",
            varname: "calculatedBy",
            ddl: calculatedBy || [],
            placeholder: "Select calculation type",
            rules: [{ required: true, message: "Calculated By is required!" }],
            col: 6,
          },
        ]
      : []),

    {
      type: "ddl",
      label: "Punishment Type",
      varname: "punishmentType",
      ddl: punishmentType || [],
      placeholder: "Select punishment type",
      rules: [{ required: true, message: "Punishment Type is required!" }],
      col: 6,
    },
    ...(values?.punishmentType?.value === 1
      ? [
          {
            type: "ddl",
            label: "Leave Deduct Type",
            varname: "leaveDeductType",
            ddl: leaveDeductType || [],
            placeholder: "Select leave deduct type",
            rules: [
              // { required: true, message: "Leave Deduct Type is required!" },
            ],
            col: 6,
          },
        ]
      : []),
    ...(values?.leaveDeductType?.value !== 3
      ? [
          {
            type: "number",
            label: "Leave Deduct Qty.",
            varname: "leaveDeductQty",
            placeholder: "Enter leave deduct quantity",
            rules: [
              // { required: true, message: "Leave Deduct Qty. is required!" },
            ],
            col: 6,
          },
        ]
      : []),
    ...(values?.punishmentType?.value === 2
      ? [
          {
            type: "ddl",
            label: "Amount Deduct From",
            varname: "amountDeductFrom",
            ddl: amountDeductFrom || [],
            placeholder: "Select amount deduct from",
            rules: [
              // { required: true, message: "Amount Deduct From is required!" },
            ],
            col: 6,
          },
        ]
      : []),
    ...(values?.amountDeductFrom?.value !== 3
      ? [
          {
            type: "ddl",
            label: "Amount Deduct Type Time",
            varname: "amountDeductType",
            ddl: amountDeductType || [],
            placeholder: "Select amount deduct type",
            rules: [
              // { required: true, message: "Amount Deduct Type is required!" },
            ],
            col: 6,
          },
        ]
      : []),
    ...(values?.punishmentType?.value === 2
      ? [
          {
            type: "number",
            label: "% of Amount (Based on 1 day)/ Fixed",
            varname: "amountPercentage",
            placeholder: "Enter amount percentage",
            rules: [
              // { required: true, message: "Amount Percentage is required!" },
            ],
            col: 6,
          },
        ]
      : []),
  ];
};

export const addHandler = (setData: any, data: DataState, values: any) => {
  if (values?.minimumLateTime > values?.maximumLateTime) {
    return toast.error(
      "Maximum Late Time should be bigger than Minimum Late Time"
    );
  }
  const dayRange: string = values?.dayRange
    ?.map((date: string) => new Date(date).getUTCDate())
    .join("-");

  console.log("values.isConsecutiveDay", values.isConsecutiveDay);

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
      lateCalculationType:
        values.lateCalculationType?.label || values.lateCalculationType,
      lateCalculationTypeId: values.lateCalculationType?.value || null,
      eachDayCountBy: values.eachDayCountBy?.label || values.eachDayCountBy,
      eachDayCountById: values.eachDayCountBy?.value || null,
      dayRange: dayRange,
      dayRangeId: values.dayRange?.value || null,
      isConsecutiveDay: values.isConsecutiveDay,
      minimumLateTime: values.minimumLateTime || 0,
      maximumLateTime: values.maximumLateTime || 0,
      lateTimeCalculatedBy: values.calculatedBy?.label || values.calculatedBy,
      lateTimeCalculatedById: values.calculatedBy?.value || null,
      punishmentType: values.punishmentType?.label || values.punishmentType,
      punishmentTypeId: values.punishmentType?.value || null,
      leaveDeductType: values.leaveDeductType?.label || values.leaveDeductType,
      leaveDeductTypeId: values.leaveDeductType?.value || null,
      leaveDeductQty: values.leaveDeductQty,
      amountDeductFrom:
        values.amountDeductFrom?.label || values.amountDeductFrom,
      amountDeductFromId: values.amountDeductFrom?.value || null,
      amountDeductType:
        values.amountDeductType?.label || values.amountDeductType,
      amountDeductTypeId: values.amountDeductType?.value || null,
      amountPercentage: values.amountPercentage,
    },
  ]);
  // form.resetFields();
};

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
        lateCalculationType: item.lateCalculationTypeId || 0,
        lateCalculationTypeDescription: item.lateCalculationType || "",
        eachDayCountBy: item.eachDayCountById || 0,
        startDay: item.dayRange ? parseInt(item.dayRange.split("-")[0]) : 0,
        endDay: item.dayRange ? parseInt(item.dayRange.split("-")[1]) : 0,
        isConsecutiveDay: item.isConsecutiveDay || false,
        minimumLateTime: item.minimumLateTime || 0,
        maximumLateTime: item.maximumLateTime || 0,
        lateTimeCalculatedBy: item.lateTimeCalculatedById || 0,
        lateTimeCalculatedByDescription: item.lateTimeCalculatedBy || "",
        punishmentType: item.punishmentTypeId || 0,
        punishmentTypeDescription: item.punishmentType || "",
        leaveDeductType: item.leaveDeductTypeId || 0,
        leaveDeductTypeDescription: item.leaveDeductType || "",
        leaveDeductQty: item.leaveDeductQty || 0,
        amountDeductFrom: item.amountDeductFromId || 0,
        amountDeductFromDescription: item.amountDeductFrom || "",
        amountDeductType: item.amountDeductTypeId || 0,
        amountDeductTypeDescription: item.amountDeductType || "",
        amountOrPercentage: item.amountPercentage || 0,
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
