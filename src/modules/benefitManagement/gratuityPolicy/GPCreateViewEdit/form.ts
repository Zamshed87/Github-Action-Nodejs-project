export const GratuityPolicyForm = (
  workplaceDDL: any[],
  getEmploymentType: () => void,
  employmentTypeDDL: any[],
  values: any,
  form: any
) => {
  return [
    {
      type: "header",
      label: "General Configuration",
      col: 24,
    },
    {
      type: "textbox",
      label: "Policy Name",
      varname: "strPolicyName",
      placeholder: "Enter policy name",
      rules: [{ required: true, message: "Policy Name is required!" }],
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
      },
      col: 6,
    },
    {
      type: "ddl",
      label: "Employment Type",
      varname: "employmentType",
      ddl: employmentTypeDDL || [],
      placeholder: "Select employment type",
      rules: [{ required: true, message: "Employment Type is required!" }],
      col: 6,
    },
    {
      type: "ddl",
      label: "Eligibility Depend on",
      varname: "eligibilityDependOn",
      ddl: [
        {
          label: "Date of Joining",
          value: 1,
        },
        {
          label: "Date of Confirmation",
          value: 2,
        },
      ],
      placeholder: "Eligibility Depend on",
      rules: [
        { required: true, message: "Eligibility Depend on is required!" },
      ],
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
      type: "header",
      label: "Gratuity Contribution",
      col: 24,
    },
    {
      type: "number",
      label: "Service Length Start (Month)",
      varname: "intServiceLengthStartInMonth",
      placeholder: "Enter Service Length Start (Month)",
      rules: [{ required: true, message: "Service Length Start is required!" }],
      col: 6,
    },
    {
      type: "number",
      label: "Service Length End (Month)",
      varname: "intServiceLengthEndInMonth",
      placeholder: "Enter Service Length End (Month)",
      rules: [{ required: true, message: "Service Length End is required!" }],
      col: 6,
    },
    {
      type: "ddl",
      label: "Gratuity Disbursement Depend On",
      varname: "disbursementDependOn",
      ddl: [
        {
          label: "Gross",
          value: 1,
        },
        {
          label: "Basic",
          value: 2,
        },
        {
          label: "Fixed Amount",
          value: 3,
        },
      ],
      placeholder: "Enter Gratuity Disbursement Depend On",
      rules: [
        {
          required: true,
          message: "Gratuity Disbursement Depend On is required!",
        },
      ],
      col: 6,
    },
    {
      type: "number",
      label: "Gratuity Disbursement (% of Gross/ Basic Salary/ Amount)",
      varname: "numPercentageOrFixedAmount",
      placeholder: "Enter Gratuity Disbursement",
      rules: [
        { required: true, message: "Gratuity Disbursement is required!" },
      ],
      col: 6,
    },
  ];
};
