export const EvaluationPipelineForm = (leadershipApi, type) => {
  return [
    {
      type: "ddl",
      label: "Level of Leadership",
      varname: "leadership",
      ddl: leadershipApi || [],
      placeholder: "Select the leadership",
      rules: [{ required: true, message: "Level of Leadership is required!" }],
      disabled: type === "view" || (type === "edit" && true),
      col: 8,
    },
    {
      type: "ddl",
      label: "Evaluation Criteria",
      varname: "evaluationCriteria",
      ddl: [
        { label: "KPI", value: "KPI" },
        { label: "BAR", value: "BAR" },
      ],
      placeholder: "Evaluation Criteria",
      rules: [{ required: true, message: "Evaluation Criteria is required!" }],
      disabled: type === "view" || (type === "edit" && true),
      col: 8,
    },
    {
      type: "text",
      label: "Comments",
      varname: "comments",
      placeholder: "Comments",
      disabled: type === "view" || (type === "edit" && true),
      col: 8,
    },
  ];
};

export const StakeholderForm = (
  getStakeholderType,
  stakeholderApi,
  type,
  form
) => {
  const values = form.getFieldsValue(true);
  console.log(values?.stakeholderType?.label, "adnan");
  return [
    {
      type: "ddl",
      label: "Stakeholder Type",
      varname: "stakeholderType",
      ddl: [
        { label: "Self", value: "Self" },
        { label: "Individual Employee", value: "Individual Employee" },
        { label: "Supervisor", value: "Supervisor" },
        { label: "Dotted Supervisor", value: "Dotted Supervisor" },
        { label: "Line Manager", value: "Line Manager" },
        { label: "User Group", value: "User Group" },
      ],
      placeholder: "Select the Stakeholder Type",
      rules: [{ required: true, message: "Stakeholder Type is required!" }],
      col: 6,
      onChange: (value, op) => {
        getStakeholderType(op);
      },
    },
    {
      type: "ddl",
      label: "Stakeholder",
      varname: "stakeholder",
      disabled: values?.stakeholderType?.label === "Self",
      ddl: stakeholderApi || [],
      placeholder: "Select the stakeholder",
      rules: [{ required: true, message: "Stakeholder Type is required!" }],
      col: 6,
    },
    {
      type: "number",
      label: "Score Weight (%)",
      varname: "scoreWeight",
      placeholder: "Score Weight (%)",
      rules: [{ required: true, message: "Score Weight (%) is required!" }],
      col: 6,
    },
  ];
};
