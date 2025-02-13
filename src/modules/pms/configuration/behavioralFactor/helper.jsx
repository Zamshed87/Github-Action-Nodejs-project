export const makerFormConfig = (levelOfLeaderApi) => {
  return [
    {
      type: "ddl",
      label: "Level of Leadership(From Clone)",
      varname: "fromLeadership",
      placeholder: "Select the leadership",
      disabled: true,
      col: 12,
    },
    {
      type: "ddl",
      label: "Level of Leadership(To Clone)",
      varname: "toLeadership",
      placeholder: "Select the leadership",
      ddl: levelOfLeaderApi,
      rules: [{ required: true, message: "Please select the leadership" }],
      col: 12,
    },
  ];
};

export const handleBehavouralFactorClone = (
  data,
  profileData,
  setLoading,
  callback
) => {};
