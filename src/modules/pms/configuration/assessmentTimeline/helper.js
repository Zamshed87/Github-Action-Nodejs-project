import axios from "axios";
import { toast } from "react-toastify";

export const AssesmentTimelineSetup = (yearsDDL, leadershipApi, type, form) => {
  return [
    {
      type: "ddl",
      label: "Level of Leadership",
      varname: "leadership",
      ddl: leadershipApi || [],
      placeholder: "Select the leadership",
      rules: [{ required: true, message: "Level of Leadership is required!" }],
      disabled: type === "view" || type === "edit",
      col: 8,
    },
    {
      type: "ddl",
      label: "Years",
      varname: "years",
      ddl: yearsDDL,
      placeholder: "Years",
      rules: [{ required: true, message: "Years is required!" }],
      disabled: type === "view",
      col: 8,
    },
  ];
};

export const handleAssesmentTimelineSetup = async (
  values,
  profileData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  const payload = {
    yearId: values?.years?.value,
    positionGroupId: values?.leadership?.value,
  };
  try {
    const res = await axios.post(`/PMS/AssesmentTimelineSetup`, payload);
    cb && cb();
    toast.success(res?.data?.message);
    setLoading && setLoading(false);
    // form.resetFields();
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};
