import axios from "axios";
import { toast } from "react-toastify";
export const getAllLeaveApplicatonListDataForApproval = async (
    payload,
    setter,
    setAllData,
    setLoading,
    cb
  ) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `/ApprovalPipeline/LeaveEncashmentApplicationLanding`,
        payload
      );
      setAllData(res?.data)
      setter(res?.data);
      cb && cb();
      setLoading(false);
    } catch (error) {
      setter([]);
      setAllData([]);
      setLoading(false);
    }
  };


  export const leaveEncashmenApproveReject = async (payload,  cb) => {
    try {
      const res = await axios.post(`/ApprovalPipeline/LeaveEncashmentApplicationApproval`, payload);
      cb && cb();
      toast.success(res?.data?.Result?.Message || "Submitted Successfully");
    } catch (error) {
      toast.warn(error?.response?.data?.message || "Something went wrong");
    }
  };


  // ascending & descending
  export const commonSortByFilter = (filterType, property, allData, setRowDto) => {
    const newRowData = [...allData];
    let modifyRowData = [];

    if (filterType === "asc") {
      modifyRowData = newRowData?.sort((a, b) => {
        if (a[property] > b[property]) return -1;
        return 1;
      });
    } else {
      modifyRowData = newRowData?.sort((a, b) => {
        if (b[property] > a[property]) return -1;
        return 1;
      });
    }
    setRowDto(modifyRowData);
  };
