import axios from "axios";
import { toast } from "react-toastify";

export const makerFormConfig = () => {
  return [
    {
      type: "text",
      label: "Level of Leadership",
      varname: "leadership",
      placeholder: "Select the leadership",
      rules: [{ required: true, message: "Level of Leadership is required!" }],
      disabled: true,
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

export const levelOfLeaderApiCall = async (
  intAccountId,
  setState,
  setLoading,
  isAll
) => {
  try {
    setLoading && setLoading(true);
    const { data } = await axios.get(
      `/SaasMasterData/GetAllMasterPosition?accountId=${intAccountId}`
    );

    const formattedData = data.map((item) => ({
      ...item,
      label: item?.strPositionGroupName,
      value: item?.intPositionGroupId,
    }));

    if (isAll) formattedData?.unshift({ label: "All", value: 0 });

    setState(formattedData || []); // Return the transformed data if needed
    setLoading && setLoading(false);
  } catch (error) {
    toast.error("Error fetching master positions:", error);
    setLoading && setLoading(false);
  }
};

export const handleEvaluationCriteriaScoreSetting = async (
  form,
  profileData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  const values = form.getFieldsValue(true);
  const payload = {
    scoreScaleId: values?.id,
    accountId: profileData?.intAccountId,
    percentageOfKPI: values?.kpiScore,
    percentageOfBAR: values?.barScore,
    actionBy: profileData?.employeeId,
    positionGroupId: values?.positionGroupId,
  };
  try {
    const res = await axios.post(
      `/PMS/SaveEvaluationCriteriaScoreSetting`,
      payload
    );
    cb && cb();
    toast.success(res?.data?.message);
    setLoading && setLoading(false);
    form.resetFields();
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
