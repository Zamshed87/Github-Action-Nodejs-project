import axios from "axios";
import { toast } from "react-toastify";
import { setCustomFieldsValue } from "utility/filter/helper";

export const EvaluationPipelineForm = (leadershipApi, type, form) => {
  return [
    {
      type: "ddl",
      label: "Level of Leadership",
      varname: "leadership",
      mode: "multiple",
      ddl: leadershipApi || [],
      placeholder: "Select the leadership",
      rules: [{ required: true, message: "Level of Leadership is required!" }],
      disabled: type === "view" || (type === "edit" && true),
      col: 8,
      onChange: (value, op) => {
        form.setFieldsValue({
          leadership: op,
        });
        setCustomFieldsValue(form, "leadership", op);
      },
    },
    {
      type: "ddl",
      label: "Evaluation Criteria",
      varname: "evaluationCriteria",
      ddl: [
        { label: "KPI", value: 1 },
        { label: "BAR", value: 2 },
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
    col: 6,
  };

  // Base configuration without "Score Weight (%)"
  const formConfig = [
    {
      type: "ddl",
      label: "Stakeholder Type",
      varname: "stakeholderType",
      ddl: [
        { label: "Self", value: 1 },
        { label: "Individual Employee", value: 2 },
        { label: "Supervisor", value: 3 },
        { label: "Dotted Supervisor", value: 4 },
        { label: "Line Manager", value: 5 },
        { label: "User Group", value: 6 },
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
      rules: [{ required: true, message: "Stakeholder is required!" }],
    });
  } else if (st?.label === "User Group") {
    formConfig.push({
      ...commonStakeholderConfig,
      ddl: userGrp || [],
      rules: [{ required: true, message: "Stakeholder is required!" }],
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

export const handleEvaluationPipelineSetting = async (
  form,
  profileData,
  stakeholderField,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  const values = form.getFieldsValue(true);
  console.log("values", values);
  console.log("profileData", profileData);
  console.log("stakeholderField", stakeholderField);
  if (getTotalWeight(stakeholderField) !== 100) {
    setLoading && setLoading(false);
    return toast.error("Total weight should be 100");
  }
  const payload = {
    evaluationHeaderId: 0, // This value is hardcoded if create
    evaluationCriteriaId: values?.evaluationCriteria?.value,
    remarks: values?.comments,
    accountId: profileData?.intAccountId,
    actionBy: profileData?.employeeId,
    positionGroupId: values?.leadership?.map((item) => {
      return { positionGroupId: item?.value };
    }),
    rowDto: stakeholderField?.map((item) => {
      return {
        rowId: 0, // This value is hardcoded if create
        stakeholderTypeId: item?.stakeholderTypeId,
        stakeholderId: item?.stakeholderId || 0,
        scoreWeight: item?.scoreWeight,
      };
    }),
  };
  try {
    const res = await axios.post(`/PMS/EvaluationPipelineSetupCreate`, payload);
    cb && cb();
    toast.success(res?.data?.message);
    setLoading && setLoading(false);
    form.resetFields();
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const getTotalWeight = (stakeholderField) => {
  return stakeholderField?.reduce((acc, curr) => {
    return acc + curr.scoreWeight;
  }, 0);
};

export const ViewEvaluationPipeline = async (
  recordId,
  setLoading,
  setSingleData,
  cb
) => {
  try {
    setLoading(true);

    const res = await axios.get(
      `/PMS/GetEvaluationPipelineSetupById?evaluationHeaderId=${recordId}`
    );
    if (res?.data) {
      cb && cb(res?.data);
      setLoading(false);
      setSingleData && setSingleData(res?.data);
    }
    setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.Message || "Something went wrong");
    setSingleData && setSingleData({});
    setLoading(false);
  }
};
