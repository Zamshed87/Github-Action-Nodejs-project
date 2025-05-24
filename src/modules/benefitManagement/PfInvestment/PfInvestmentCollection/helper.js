import axios from "axios";
import { toast } from "react-toastify";

export const createInvestmentCollection = async (
  payload,
  setLoading,
  resetData
) => {
  setLoading?.(true);
  try {
    const res = await axios.post(
      `/PFInvestment/CreateCollection
`,
      payload
    );
    toast.success(res?.data?.message?.[0] || "Submitted Successfully");
    setLoading?.(false);
    resetData?.();
  } catch (error) {
    toast.error(error?.response?.data?.message?.[0] || "Something went wrong");
    setLoading?.(false);
  }finally {
    setLoading?.(false);
  }
};
export const getInvestmentCollection = async (
  investmentId,
  setLoading,
  setData
) => {
  setLoading?.(true);
  try {
    const res =
      await axios.get(`/PFInvestment/GetById?InvestmentId=${investmentId}`);
    // toast.success(res?.data?.message || "Retrieved Successfully");
    setLoading?.(false);
    setData?.(res?.data?.data || []);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    setLoading?.(false);
    setData?.([]);
  }
};
