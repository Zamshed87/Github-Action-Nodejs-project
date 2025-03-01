import axios from "axios";
import { toast } from "react-toastify";

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

export const handleBehavouralFactorClone = async (
  values,
  profileData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  const payload = {
    fromPositionGroupId: values?.fromLeadership?.value,
    toPositionGroupId: values?.toLeadership?.value,
    actionBy: profileData?.intEmployeeId,
  };
  try {
    const res = await axios.post(`/PMS/CloneQuestionnaireHeader`, payload);
    cb && cb();
    toast.success(res?.data?.message);
    setLoading && setLoading(false);
    // form.resetFields();
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
