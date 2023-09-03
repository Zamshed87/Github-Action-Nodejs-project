import axios from "axios";
import { toast } from "react-toastify";

export const getAllGrossWiseBasicLanding = async (
  accId,
  buId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Payroll/GetAllGrossWiseBasic?IntAccountId=${accId}&IntBusinessUnitId=${buId}`
    );
    if (res?.data) {
      const modified = res?.data?.map((item) => ({
        ...item,
      }));
      modified?.length > 0 && setter(modified);
    }
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const createGrossWiseBasic = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Payroll/CRUDGrossWiseBasicConfig`, payload);
    cb && cb();
    toast.success(res.data?.message || " Create Successfully", {
      toastId: "GrossWiseBasicConfig",
    });
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong", {
      toastId: "GrossWiseBasicConfig",
    });
    setLoading && setLoading(false);
  }
};

export const getAllGrossWiseBasicById = async (
  accId,
  buId,
  id,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Payroll/GetAllGrossWiseBasic?IntAccountId=${accId}&IntBusinessUnitId=${buId}&IntGrossWiseBasicId=${id}`
    );
    if (res?.data?.length > 0) {
      const modified = {
        ...res?.data[0],
        minSalary: res?.data[0]?.numMinGross,
        maxSalary: res?.data[0]?.numMaxGross,
        numPercentageOfBasic: res?.data[0]?.numPercentageOfBasic,
      };
      setter(modified);
    }
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
  }
};
