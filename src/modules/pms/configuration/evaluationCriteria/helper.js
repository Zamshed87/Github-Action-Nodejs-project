export const makerFormConfig = (levelOfLeaderApi) => {
  return [
    {
      type: "ddl",
      label: "Level of Leadership",
      varname: "leadership",
      placeholder: "Select the leadership",
      ddl: levelOfLeaderApi || [],
      rules: [{ required: true, message: "Level of Leadership is required!" }],
      onChange: (value, op) => {
        console.log(value, op, "adnantest");
      },
      col: 12,
    },
    {
      type: "number",
      label: "KPI Score",
      varname: "kpiScore",
      placeholder: "KPI Score",
      col: 12,
      rules: [{ required: true, message: "KPI Score is required!" }],
    },
    {
      type: "number",
      label: "BAR Score",
      varname: "barScore",
      placeholder: "BAR Score",
      col: 12,
      rules: [{ required: true, message: "BAR Score is required!" }],
    },
  ];
};
