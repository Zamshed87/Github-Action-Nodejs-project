import axios from "axios";
import { toast } from "react-toastify";

export const getPfProfitDetailsData = async (
  accountId,
  fromDate,
  toDate,
  setLoading,
  setData
) => {
  setLoading?.(true);
  try {
    const res = await axios.get(
      `/PFProfitShare/GetUnadjustData?AccountId=${accountId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setData?.(res?.data?.data || {});
    setLoading?.(false);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    setLoading?.(false);
  }
};
