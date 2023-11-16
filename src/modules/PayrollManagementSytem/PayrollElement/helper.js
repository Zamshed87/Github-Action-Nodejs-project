import axios from "axios";
import { toast } from "react-toastify";

export const getAllPayrollElementType = async (
  accId,
  wId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Payroll/GetAllPayrollElementType?accountId=${accId}&workplaceId=${wId}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const savePayrollElementType = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Payroll/SavePayrollElementType`, payload);
    cb && cb();
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const deletePayrollElementTypeById = async (id, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Payroll/DeletePayrollElementTypeById?id=${id}`
    );
    if (res?.data) {
      cb && cb();
      toast.success(res?.data?.message || "Delete Successfully");
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
