import axios from "axios";
import { toast } from "react-toastify";

export const getManagementDashPermissionLanding = async (
  setter,
  employee_Id,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Dashboard/ManagementDashboardPermissionLanding?EmployeeId=${employee_Id}`
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

export const getManagementDashPermissionById = async (
  accId,
  buId,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Dashboard/ManagementDashboardPermissionByAccount?IntAccountId=${accId}&IntBusinessUnitId=${buId}`
    );
    const modifyData = res?.data?.map((itm) => {
      return {
        ...itm,
      };
    });
    setAllData(modifyData);
    setter(modifyData);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const createManagementDashPermission = async (
  payload,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/Dashboard/ManagementDashboardPermissionCRUD`,
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
