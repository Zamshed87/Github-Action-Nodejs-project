import axios from "axios";
import { toast } from "react-toastify";

export const timeSheetSave = async (payload, setLoading, cb) => {
    try {
      setLoading(true);
      const res = await axios.post(`/TimeSheet/CRUDFlexibleTimesheet`, payload);
      setLoading(false);
      cb && cb();
      toast.success(res.data?.message || "Successful");
    } catch (error) {
      toast.warn(error?.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };