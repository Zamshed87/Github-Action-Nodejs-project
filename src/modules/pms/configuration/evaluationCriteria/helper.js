export const formConfig = [
  {
    type: "ddl",
    label: "Level of Leadership",
    varname: "leadership",
    placeholder: "Select the leadership",
    ddl: [
      { label: "HR", value: "hr" },
      { label: "IT", value: "it" },
      { label: "Finance", value: "finance" }, // we can pass DDL also
    ],
    rules: [{ required: true, message: "Level of Leadership is required!" }],
    onChange: (value, op) => {
      console.log(value, op, "adnantest");
    },
    col: 4,
  },
  {
    type: "ddl",
    label: "Designation",
    varname: "designation",
    placeholder: "Select the Designation",
    ddl: [
      { label: "HR", value: "hr" },
      { label: "IT", value: "it" },
      { label: "Finance", value: "finance" }, // we can pass DDL also
    ],
    rules: [{ required: true, message: "Designation is required!" }],
    onChange: (value, op) => {
      console.log(value, op, "adnantest");
    },
    col: 4,
  },
  {
    type: "number",
    label: "KPI Score",
    varname: "kpiScore",
    placeholder: "KPI Score",
    col: 4,
  },
  {
    type: "number",
    label: "BAR Score",
    varname: "barScore",
    placeholder: "BAR Score",
    col: 4,
  },
];
