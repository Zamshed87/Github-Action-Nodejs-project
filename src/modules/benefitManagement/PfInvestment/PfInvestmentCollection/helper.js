import axios from "axios";
import { toast } from "react-toastify";

export const createInvestmentCollection = async (
  payload,
  setLoading,
  resetData,
) => {
  setLoading?.(true);
  try {
    const res = await axios.post(`/PFInvestment/CreateCollection
`, payload);
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading?.(false);
    resetData?.();
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    setLoading?.(false);
  }
};
