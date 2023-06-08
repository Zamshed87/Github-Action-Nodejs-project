import axios from "axios";
import { toast } from "react-toastify";

export const getDashboardCompPermissionLanding = async (setter, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/SaasMasterData/DashComponentPermissionLanding`
    );
    const modifyData = res?.data?.map((itm) => {
      return {
        ...itm,
      };
    });
    setter(modifyData);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getDashboardCompPermissionLandingById = async (
  accId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/SaasMasterData/DashComponentPermissionByAccount?IntAccountId=${accId}`
    );
    const modifyData = res?.data?.map((itm) => {
      return {
        ...itm,
      };
    });
    setter(modifyData);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const createDashboardComponentPermission = async (
  payload,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/SaasMasterData/DashComponentPermissionCRUD`,
      payload
    );
    cb && cb();
    toast.success(res.data?.message || "Successfully", { toastId: 101 });
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong", {
      toastId: 101,
    });
    setLoading && setLoading(false);
  }
};
