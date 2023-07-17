import axios from "axios";
import { toast } from "react-toastify";

export const getPfGratuityLanding = async (accId, setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/GetEmpPfngratuity?AccountId=${accId}`
    );
    setter(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const createPfGratuityConfig = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/CRUDEmpPfngratuity`, payload);
    cb && cb();
    toast.success(res.data?.message || " Create Successfully", {
      toastId: "pfConfigCreate",
    });
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong", {
      toastId: "pfConfigCreate",
    });
    setLoading && setLoading(false);
  }
};
