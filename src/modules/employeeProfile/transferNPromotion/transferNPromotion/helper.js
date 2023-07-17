import axios from "axios";
import { toast } from "react-toastify";

/* export const getAllTransferAndPromotionLanding = async (
  orgId,
  buId,
  landingType,
  setter,
  setAllData,
  setLoading,
  fromDate,
  toDate,
) => {
  setLoading && setLoading(true);
  const filterDate = `dteFromDate=${fromDate}&dteToDate=${toDate}`
  try {
    const res = await axios.get(
      `/Employee/GetAllEmpTransferNpromotion?accountId=${orgId}&businessUnitId=${buId}&landingType=${landingType}&${filterDate}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
}; */

export const addEditTransferAndPromotion = async (payload, cb, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/Employee/SaveEmpTransferNpromotion`,
      payload
    );
    setLoading && setLoading(false);
    cb && cb();
    toast.success(res?.data?.message || "Submitted Successfully");
  } catch (error) {
    setLoading && setLoading(false);
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

export const getTransferAndPromotionHistoryById = async (
  orgId,
  employeeId,
  setter,
  setLoading,
  buId,
  wgId
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/GetEmpTransferNpromotionHistoryByEmployeeId?businessUnitId=${buId}&employeeId=${employeeId}&workplaceGroupId=${wgId}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const deleteTransferAndPromotionHistoryById = async (
  id,
  employeeId,
  history
) => {
  try {
    const res = await axios.put(
      `/Employee/DeleteEmpTransferNpromotion?id=${id}&actionBy=${employeeId}`
    );
    toast.success(res?.data?.message || "Deleted Successfully");
    history.push("/profile/transferandpromotion/transferandpromotion");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

export const releaseEmpTransferNPromotion = async (
  values,
  singleData,
  orgId,
  employeeId,
  setLoading,
  cb
) => {
  try {
    setLoading(true);
    let res = await axios.put(
      `/Employee/ReleaseEmpTransferNpromotion?accountId=${orgId}&employeeId=${singleData?.intEmployeeId}&substitutionEmployeeId=${values?.substituteEmployee?.value}&transferNPromotionId=${singleData?.intTransferNpromotionId}&ReleaseDate=${values?.releaseDate}&actionBy=${employeeId}`
    );

    setLoading(false);
    cb && cb();
    toast.success(res?.data?.message);
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message);
  }
};
