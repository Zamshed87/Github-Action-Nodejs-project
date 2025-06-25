import axios from "axios";
import { toast } from "react-toastify";

export const createPFInvestment = async (payload, setLoading, resetData) => {
  setLoading?.(true);
  try {
    const res = await axios.post(
      `/PFInvestment/Create`,
      payload
    );
    toast.success(res?.data?.message?.[0] || "Created Successfully");
    setLoading?.(false);
    resetData?.();
  } catch (error) {
    toast.error(error?.response?.data?.message?.[0] || "Something went wrong");
    setLoading?.(false);
  }
};
export const createPFInvestmentEdit = async (payload, setLoading, resetData) => {
  setLoading?.(true);
  try {
    const res = await axios.post(
      `/PFInvestment/Edit`,
      payload
    );
    toast.success(res?.data?.message?.[0] || "Edited Successfully");
    setLoading?.(false);
    resetData?.();
  } catch (error) {
    toast.error(error?.response?.data?.message?.[0] || "Something went wrong");
    setLoading?.(false);
  }
};
export const getPFData = async (accountId, setLoading, setData) => {
  setLoading?.(true);
  try {
    const res = await axios.get(
      `/PFInvestment/GetPFData?AccountId=${accountId}`,
    );
    // toast.success(res?.data?.message || "Data retrieved successfully");
    setData?.(res?.data?.data || []);
    setLoading?.(false);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    setLoading?.(false);
  }
};