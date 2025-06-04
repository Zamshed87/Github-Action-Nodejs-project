import {
  amountDeductFrom,
  amountDeductType,
  calculationType,
  daysArray,
  getcalculatedBy,
  getleaveDeductType,
  punishmentType,
} from "../LatePunishment/form";

export const EarlyLeavePunishment = (
  workplaceDDL: any[],
  getEmploymentType: any,
  getEmployeDepartment: any,
  getEmployeDesignation: any,
  employmentTypeDDL: any[],
  empDepartmentDDL: any[],
  empDesignationDDL: any[],
  DayRangeComponent: any,
  CustomCheckbox: any,
  values: any,
  form: any
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
      rules: [{ required: true, message: "Workplace is required!" }],
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
      rules: [{ required: true, message: "Employment Type is required!" }],
      col: 6,
    },
    {
      type: "ddl",
      label: "Designation",
      varname: "designation",
      ddl: empDesignationDDL || [],
      placeholder: "Select designation",
      mode: "multiple",
      rules: [{ required: true, message: "Designation is required!" }],
      col: 6,
    },
    {
      type: "ddl",
      label: "Department",
      varname: "department",
      ddl: empDepartmentDDL || [],
      mode: "multiple",
      placeholder: "Select department",
      rules: [{ required: true, message: "Department is required!" }],
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
      label: "Early Leave Calculation Type",
      varname: "earlyLeaveCalculationType",
      ddl: calculationType || [],
      placeholder: "Select early leave calculation type",
      onChange: () => {
        form.setFieldsValue({
          eachDayCountBy: undefined,
          dayRange: undefined,
          calculatedBy: undefined,
        });
      },
      rules: [
        {
          required: true,
          message: "Early Leave Calculation Type is required!",
        },
      ],
      col: 6,
    },
    ...(values?.earlyLeaveCalculationType?.value === 1
      ? [
          {
            type: "ddl",
            label: "Each Day Count by",
            varname: "eachDayCountBy",
            ddl: daysArray || [],
            placeholder: "Select Each Day Count by",
            rules: [
              { required: true, message: "Each Day Count by is required!" },
            ],
            col: 6,
          },
        ]
      : []),
    ...(values?.earlyLeaveCalculationType?.value === 2
      ? [
          {
            type: "component",
            component: DayRangeComponent,
            col: 6,
          },
        ]
      : []),
    ...(values?.earlyLeaveCalculationType?.value === 1
      ? [
          {
            type: "component",
            component: CustomCheckbox,
            col: 6,
          },
        ]
      : []),
    ...(values?.earlyLeaveCalculationType?.value !== 3
      ? [
          {
            type: "ddl",
            label: "Early Leave Time Calculated by",
            varname: "calculatedBy",
            ddl:
              getcalculatedBy(values?.earlyLeaveCalculationType?.value) || [],
            placeholder: "Select early leave calculation type",
            rules: [
              {
                required: true,
                message: "Early Leave Calculated by By is required!",
              },
            ],
            col: 6,
          },
        ]
      : []),
    {
      type: "number",
      label: "Minimum Early Leave Time (Minutes)",
      varname: "minimumEarlyLeaveTime",
      placeholder: "Enter minimum early leave time",
      rules: [
        { required: true, message: "Minimum Early Leave Time is required!" },
      ],
      col: 6,
    },
    {
      type: "number",
      label: "Maximum Early Leave Time (Minutes)",
      varname: "maximumEarlyLeaveTime",
      placeholder: "Enter maximum early leave time",
      rules: [
        { required: true, message: "Maximum Early Leave Time is required!" },
      ],
      col: 6,
    },
    {
      type: "ddl",
      label: "Punishment Type",
      varname: "punishmentType",
      ddl: punishmentType || [],
      placeholder: "Select punishment type",
      rules: [{ required: true, message: "Punishment Type is required!" }],
      col: 6,
      onChange: () => {
        form.setFieldsValue({
          leaveDeductType: undefined,
          leaveDeductQty: undefined,
          amountDeductFrom: undefined,
          amountDeductType: undefined,
          amountPercentage: undefined,
        });
      },
    },
    ...(values?.punishmentType?.value === 1
      ? [
          {
            type: "ddl",
            label: "Leave Deduction Type",
            varname: "leaveDeductType",
            ddl:
              getleaveDeductType(values?.earlyLeaveCalculationType?.value) ||
              [],
            placeholder: "Select leave deduct type",
            rules: [
              { required: true, message: "Leave Deduction Type is required!" },
            ],
            col: 6,
          },
        ]
      : []),
    ...(values?.leaveDeductType?.value === 1 ||
    values?.leaveDeductType?.value === 2
      ? [
          {
            type: "number",
            label: "Leave Deduction Qty",
            varname: "leaveDeductQty",
            placeholder: "Enter leave deduct type",
            rules: [
              { required: true, message: "Leave Deduction Qty is required!" },
            ],
            col: 6,
          },
        ]
      : []),
    ...(values?.punishmentType?.value === 2
      ? [
          {
            type: "ddl",
            label: "Amount Deduction From",
            varname: "amountDeductionFrom",
            ddl: amountDeductFrom || [],
            placeholder: "Select amount deduct from",
            rules: [
              { required: true, message: "Amount Deduction From is required!" },
            ],
            col: 6,
          },
        ]
      : []),
    ...(values?.amountDeductFrom?.value === 1 ||
    values?.amountDeductFrom?.value === 2
      ? [
          {
            type: "ddl",
            label: "Amount Deduction Type Time",
            varname: "amountDeductionType",
            dddl: amountDeductType || [],
            placeholder: "Select amount deduct type",
            rules: [
              { required: true, message: "Amount Deduction Type is required!" },
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
              { required: true, message: "Amount Percentage is required!" },
            ],
            col: 6,
          },
        ]
      : []),
  ];
};
