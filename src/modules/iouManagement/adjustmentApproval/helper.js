import axios from "axios";
import { toast } from "react-toastify";

export const getAllIOUListDataForApproval = async (
  payload,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/IOUAdjustmentLanding`,
      payload
    );
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

export const IOUApproveReject = async (payload, cb) => {
  try {
    const res = await axios.post(
      `/ApprovalPipeline/IOUAdjustmentApproval`,
      payload
    );
    cb && cb();
    toast.success(res?.data || "Submitted Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

export const getAllIOUListDataLanding = async (
  accId,
  buId,
  employeeId,
  intIOUId,
  applicationDate,
  fromDate,
  toDate,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `Employee/GetAllIOULanding?strReportType=DocList&intAccountId=${accId}&intBusinessUnitId=${buId}&intEmployeeId=${employeeId}&intIOUId=${intIOUId}&applicationDate=${applicationDate}&fromDate=${fromDate}&toDate=${toDate}&status=&strDocFor=ADJUSTMENT`
    );
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
