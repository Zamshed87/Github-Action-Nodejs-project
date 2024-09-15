import axios from "axios";
import { currentYear } from "modules/CompensationBenefits/reports/salaryReport/helper";
import { toast } from "react-toastify";

export const getEmployeeLeaveBalanceAndHistory = async (
  employeeId,
  viewType,
  setter,
  setLoading,
  setAllData,
  year
) => {
  setLoading && setLoading(true);
  try {
    // /LeaveMovement/GetEmployeeLeaveBalanceAndHistory?EmployeeId=1&ViewType=LeaveBalance&IntYear=2023
    const res = await axios.get(
      `/LeaveMovement/GetEmployeeLeaveBalanceAndHistory?EmployeeId=${employeeId}&ViewType=${viewType}&IntYear=${
        year || currentYear()
      }`
    );
    if (res?.data) {
      setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getEmployeeLeaveEncashmentHistory = async (
  employeeId,
  orgId,
  setter,
  setLoading,
  setAllData,
  year
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `LeaveMovement/GetEncashmentApplicationById?accountId=${orgId}&employeeId=${employeeId}&IntYear=${
        year || currentYear()
      }`
    );
    if (res?.data) {
      setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const createLeaveEncashmentApplication = async (
  payload,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/LeaveMovement/LeaveEncashment`, payload);
    cb && cb();
    if(res?.data?.statusCode === 200){
      toast.success(res?.data?.message || "Submitted Successfully");
    }
    if(res?.data?.statusCode === 500){
      toast.warn(res?.data?.message || "Something went wrong");
    }
    setLoading && setLoading(false);
  } catch (error) {
    console.log(error, "Error from encashment");
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const demoPopupForDeleteNew = async (
  callback,
  setLoading,
  id,
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(`/LeaveMovement/LeaveEncashmentDelete?LeaveEnaashmentId=${id}`);
    callback && callback();
    if(res?.data?.statusCode === 200){
      toast.success(res?.data?.message || "Submitted Successfully");
    }
    if(res?.data?.statusCode === 500){
      toast.warn(res?.data?.message || "Something went wrong");
    }
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const getDaysNHoursInColumnForLeaveTable = (totalMin, value) => {
  let result = 0;
  const tempTotal = totalMin / value;
  const intNumber = parseInt(totalMin / value);
  const fractionDiff = tempTotal - intNumber;
  if (0.25 >= fractionDiff) {
    result = Math.floor(tempTotal);
  } else if (0.25 < fractionDiff && 0.75 >= fractionDiff) {
    result = intNumber + 0.5;
  } else {
    result = Math.ceil(tempTotal);
  }
  return result;
};