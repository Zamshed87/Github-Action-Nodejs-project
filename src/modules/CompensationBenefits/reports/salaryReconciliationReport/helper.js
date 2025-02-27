import axios from "axios";
import { toast } from "react-toastify";

export const getReconciliationReportRDLC = async ({
  setLoading,
  setterData,
  url,
  payload,
}) => {
  setLoading?.(true);
  try {
    const res = await axios.post(url, payload);
    if (res?.data) {
      setterData?.(res?.data);
      setLoading?.(false);
    } else {
      toast.warn("No data received !");
      setLoading?.(false);
    }
  } catch (error) {
    setLoading?.(false);
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};
