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
      `/ApprovalPipeline/IOUApplicationLanding`,
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

export const IOUApproveReject = async (payload, cb, setLoading) => {
  try {
    setLoading(true);
    const res = await axios.post(
      `/ApprovalPipeline/IOUApplicationApproval`,
      payload
    );
    cb && cb();
    toast.success(res?.data || "Submitted Successfully");
    setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading(false);
  }
};

export const getAllIOUListDataLanding = async (
  accId,
  buId,
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
      `Employee/GetAllIOULanding?strReportType=DocList&intAccountId=${accId}&intBusinessUnitId=${buId}&intIOUId=${intIOUId}&applicationDate=${applicationDate}&fromDate=${fromDate}&toDate=${toDate}&status=&strDocFor=ADVANCE`
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
