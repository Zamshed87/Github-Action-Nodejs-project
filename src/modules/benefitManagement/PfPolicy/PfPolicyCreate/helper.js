import axios from "axios";
import { PButton } from "Components";
import { toast } from "react-toastify";

export const createAbsentPunishment = async (
  payload,
  setLoading,
  setDetailList
) => {
  setLoading?.(true);
  try {
    const res = await axios.post(`/AbsentPunishment/Create`, payload);
    console.log(res);
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading?.(false);
    setDetailList?.([]);
  } catch (error) {
    toast.error(error?.response?.data?.message?.[0] || "Something went wrong");
    setLoading?.(false);
    setDetailList?.([]);
  }
};
