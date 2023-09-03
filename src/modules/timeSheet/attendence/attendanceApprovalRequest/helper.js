import Axios from "axios";
import { toast } from "react-toastify";

//landing get api
export const getManualAttendanceApprovalList = async (
  partType,
  businessUnitId,
  employeeId,
  year,
  month,
  setLoading,
  setter
) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.get(
      `/Employee/TimeSheetAllLanding?PartType=${partType}&BuninessUnitId=${businessUnitId}&intId=${employeeId}&intYear=${year}&intMonth=${month}`
    );
    setLoading && setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading && setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

// edit attendence request
export const editManualAttendance = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await Axios.post(`/Employee/ManualAttendance`, data);
    setLoading(false);
    cb();
    toast.success(res?.data?.message || "Success");
  } catch (error) {
    setLoading(false);

    toast.error(error?.response?.data?.message);
  }
};
