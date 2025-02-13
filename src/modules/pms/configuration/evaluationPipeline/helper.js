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
  st,
  type,
  form,
  getEmployee,
  CommonEmployeeDDL,
  doUserGrp,
  userGrp
) => {
  console.log(st);

  // Common configurations for the "Stakeholder" field
  const commonStakeholderConfig = {
    type: "ddl",
    label: "Stakeholder",
    varname: "stakeholder",
    placeholder: "Select the stakeholder",
    rules: [{ required: true, message: "Stakeholder is required!" }],
    col: 6,
  };

  // Base configuration without "Score Weight (%)"
  const formConfig = [
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
      onChange: (label) => {
        form.setFieldsValue({ stakeholder: undefined });
        if (label === "User Group") {
          doUserGrp();
        }
      },
    },
  ];

  // Add Stakeholder field based on the selected type
  if (st?.label === "Individual Employee") {
    formConfig.push({
      ...commonStakeholderConfig,
      ddl: CommonEmployeeDDL?.data || [],
      onSearch: (value) => {
        getEmployee(value);
      },
      showSearch: true,
      filterOption: false,
      allowClear: true,
      loading: CommonEmployeeDDL?.loading,
    });
  } else if (st?.label === "User Group") {
    formConfig.push({
      ...commonStakeholderConfig,
      ddl: userGrp || [],
    });
  } else if (
    ["Self", "Supervisor", "Dotted Supervisor", "Line Manager"].includes(
      st?.label
    )
  ) {
    formConfig.push({
      ...commonStakeholderConfig,
      ddl: [],
      disabled: true,
    });
  }

  // Add "Score Weight (%)" as the last object
  formConfig?.push({
    type: "number",
    label: "Score Weight (%)",
    varname: "scoreWeight",
    placeholder: "Score Weight (%)",
    rules: [{ required: true, message: "Score Weight (%) is required!" }],
    col: 6,
  });

  return formConfig;
};
