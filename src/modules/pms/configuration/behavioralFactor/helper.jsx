export const makerFormConfig = (levelOfLeaderApi) => {
  return [
    {
      type: "ddl",
      label: "Level of Leadership(From Clone)",
      varname: "leadership",
      placeholder: "Select the leadership",
      disabled: true,
      col: 12,
    },
    {
      type: "ddl",
      label: "Level of Leadership(To Clone)",
      varname: "leadership",
      placeholder: "Select the leadership",
      ddl: levelOfLeaderApi,
      rules: [{ required: true, message: "Please select the leadership" }],
      col: 12,
    },
  ];
};
