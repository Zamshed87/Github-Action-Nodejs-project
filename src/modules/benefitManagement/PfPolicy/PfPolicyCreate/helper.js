import axios from "axios";
import { toast } from "react-toastify";

export const createPFPolicy = async (
  payload,
  setLoading,
  resetData,
) => {
  setLoading?.(true);
  try {
    const res = await axios.post(`/PfPolicy/Save
`, payload);
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading?.(false);
    resetData?.();
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    setLoading?.(false);
  }
};
