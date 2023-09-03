import axios from "axios";
import { toast } from "react-toastify";

export const saveOvertimePolicy = async (payload, setLoading,cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Payroll/SaveOverTimeConfig`, payload);
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading && setLoading(false);
    cb();
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const getOverTimeConfig = async (setLoading, setter,id) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(`/Payroll/GetOverTimeConfig?accountId=${id}`, );
    // toast.success(res?.data?.message || "Submitted Successfully");
    setLoading && setLoading(false);
    setter(res?.data);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};