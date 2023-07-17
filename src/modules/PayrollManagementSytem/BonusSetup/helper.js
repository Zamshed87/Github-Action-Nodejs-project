import axios from "axios";
import { toast } from "react-toastify";

export const getBonusNameDDL = async (payload, setter) => {
  try {
    const res = await axios.post(`/Employee/BonusAllLanding`, payload);
    setter(res?.data);
  } catch (error) {}
};

export const getBonusSetupLanding = async (payload, setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/BonusAllLanding`, payload);
    if (res?.data) {
      const modified = res?.data?.map((item) => ({
        ...item,
        statusValue: item?.isActive ? "Active" : "Inactive",
      }));
      modified?.length > 0 && setter(modified);
    }

    // setter(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const createBonusSetup = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/CRUDBonusSetup`, payload);
    cb && cb();
    toast.success(res.data?.message || " Create Successfully", {
      toastId: "bonusCreate",
    });
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong", {
      toastId: "bonusCreate",
    });
    setLoading && setLoading(false);
  }
};
