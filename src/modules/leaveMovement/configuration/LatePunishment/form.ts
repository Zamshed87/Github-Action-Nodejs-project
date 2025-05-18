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

const getcalculatedBy = (value: number) => {
  if (value === 1)
    return [
      {
        label: "Actual Late Time",
        value: 2,
      },
    ];
  else
    return [
      {
        label: "Sum of Late Time",
        value: 1,
      },
      {
        label: "Actual Late Time",
        value: 2,
      },
    ];
};

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

const getleaveDeductType = (value: number) => {
  if (value === 1) {
    return [
      {
        label: "Full Day",
        value: 1,
      },
      {
        label: "Half Day",
        value: 2,
      },
    ];
  } else
    return [
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
};

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
      label: "Late Calculation Type",
      varname: "lateCalculationType",
      ddl: calculationType || [],
      placeholder: "Select late calculation type",
      onChange: () => {
        form.setFieldsValue({
          eachDayCountBy: undefined,
          dayRange: undefined,
          calculatedBy: undefined,
        });
      },
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
    ...(values?.lateCalculationType?.value !== 3
      ? [
          {
            type: "ddl",
            label: "Late Time Calculated By",
            varname: "calculatedBy",
            ddl: getcalculatedBy(values?.lateCalculationType?.value) || [],
            placeholder: "Select calculation type",
            rules: [{ required: true, message: "Calculated By is required!" }],
            col: 6,
          },
        ]
      : []),

    {
      type: "number",
      label: "Minimum Late Time (Minutes)",
      varname: "minimumLateTime",
      placeholder: "Enter minimum late time",
      rules: [{ required: true, message: "Minimum Late Time is required!" }],
      col: 6,
    },
    {
      type: "number",
      label: "Maximum Late Time (Minutes)",
      varname: "maximumLateTime",
      placeholder: "Enter maximum late time",
      rules: [{ required: true, message: "Maximum Late Time is required!" }],
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
    },
    ...(values?.punishmentType?.value === 1
      ? [
          {
            type: "ddl",
            label: "Leave Deduct Type",
            varname: "leaveDeductType",
            ddl: getleaveDeductType(values?.lateCalculationType?.value) || [],
            placeholder: "Select leave deduct type",
            rules: [
              { required: true, message: "Leave Deduct Type is required!" },
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
            label: "Leave Deduct Qty.",
            varname: "leaveDeductQty",
            placeholder: "Enter leave deduct quantity",
            rules: [
              { required: true, message: "Leave Deduct Qty. is required!" },
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
              { required: true, message: "Amount Deduct From is required!" },
            ],
            col: 6,
          },
        ]
      : []),
    ...(values?.amountDeductFrom?.value === 1 &&
    values?.amountDeductFrom?.value === 2
      ? [
          {
            type: "ddl",
            label: "Amount Deduct Type Time",
            varname: "amountDeductType",
            ddl: amountDeductType || [],
            placeholder: "Select amount deduct type",
            rules: [
              { required: true, message: "Amount Deduct Type is required!" },
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
