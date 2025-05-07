import { toast } from "react-toastify";
import { DataState } from "./type";

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
            type: "checkbox",
            label: "Is Consecutive Day?",
            varname: "isConsecutiveDay",
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
