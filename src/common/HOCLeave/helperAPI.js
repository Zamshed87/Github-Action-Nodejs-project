import axios from "axios";
import { toast } from "react-toastify";

const currentYear = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  return currentYear;
};

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

export const createLeaveApplication = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/LeaveMovement/CRUDLeaveApplication`,
      payload
    );
    cb && cb();
    toast.success(res?.data?.Result?.Message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};
