import axios from "axios";
import { toast } from "react-toastify";
import { dateFormatterForInput } from "../../../utility/dateFormatter";

export const getEmployeeProfileViewData = async (
  id,
  setter,
  setLoading,
  buId,
  wgId
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/EmployeeProfileView?employeeId=${id}&businessUnitId=${buId}&workplaceGroupId=${wgId}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getOvertimeLandingData = async (
  payload,
  setter,
  setLoading,
  cb,
  setAlldata
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/OverTimeFilter`, payload);
    cb && cb();
    setter(res?.data);
    setAlldata && setAlldata(res?.data);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
  }
};

export const overtimeEntry_API = async (paylaod, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(`/TimeSheet/TimeSheetCRUD`, paylaod);
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getOvertimeById = async (payload, setter, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/OverTimeFilter`, payload);
    if (res?.data?.length > 0) {
      const modifyData = {
        employee: {
          value: res?.data[0]?.EmployeeId,
          label: res?.data[0]?.strEmployeeName,
        },
        workPlace: {
          value: res?.data[0]?.WorkplaceId,
          label: res?.data[0]?.WorkplaceName,
        },
        date: dateFormatterForInput(res?.data[0]?.OvertimeDate),
        startTime: res?.data[0]?.StartTime,
        endTime: res?.data[0]?.EndTime,
        overTimeHour: res?.data[0]?.OvertimeHour,
        reason: res?.data[0]?.Reason,
        duration: res?.data[0]?.StartTime ? "range" : "hourly",
      };

      cb?.(res?.data[0]);
      setter(modifyData);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
  }
};

// Overtime approval API
export const getAllOvertimeApplicationListDataForApproval = async (
  payload,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/ApprovalPipeline/OverTimeLanding`, payload);
    if (res?.data) {
      setAllData && setAllData(res?.data);
      setter(res?.data);
    }
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
  }
};

export const overtimeApproveReject = async (payload, cb) => {
  try {
    const res = await axios.post(`/ApprovalPipeline/OverTimeApproval`, payload);
    cb && cb();
    toast.success(res?.data || "Submitted Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};
