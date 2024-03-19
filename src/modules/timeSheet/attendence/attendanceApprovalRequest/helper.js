import Axios from "axios";
import { toast } from "react-toastify";

//landing get api
export const getManualAttendanceApprovalList = async (
  partType,
  businessUnitId,
  employeeId,
  year = null,
  month = null,
  setLoading,
  setter,
  fromDate = null,
  toDate  = null,
) => {
  setLoading && setLoading(true);
  const intYear = year ? `&intYear=${year}` : "";
  const intMonth = month ? `&intMonth=${month}` : "";
  const strfromDate =  fromDate ? `&fromDate=${fromDate}` : "";
  const stToDate = toDate ? `&toDate=${toDate}` : "";
  try {
    const res = await Axios.get(
      `/Employee/TimeSheetAllLanding?PartType=${partType}&BuninessUnitId=${businessUnitId}&intId=${employeeId}${intYear}${intMonth}${strfromDate}${stToDate}`
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
