import axios from "axios";
import { toast } from "react-toastify";

export const updateEmployeeProfile = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/UpdateEmployeeProfile`, payload);
    cb && cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};
export const updateFBProfile = async (
  payload,
  setLoading,
  cb,
  response,
  empId,
  strLoginId
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Auth/LoginOAuth2FRegistration?id=${response?.id}&employeeId=${empId}&loginId=${strLoginId}`
    );
    cb && cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};
