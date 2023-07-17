import axios from "axios";
import { toast } from "react-toastify";

export const isEligableForPromotionCheck = async (
  payload,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/Employee/IsPromotionEligibleThroughIncrement`,
      payload
    );
    setLoading && setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading && setLoading(false);
    // toast.warn(error?.response?.data?.Message || "Something went wrong");
  }
};
export const addEditIncrementAndPromotion = async (payload, cb, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/CreateEmployeeIncrement`, payload);
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

export const deleteIncrementAndPromotionHistoryById = async (
  payload,
  history
) => {
  try {
    const res = await axios.post(`/Employee/CreateEmployeeIncrement`, payload);
    toast.success(res?.data?.message || "Deleted Successfully");
    history.push("/compensationAndBenefits/increment");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};
