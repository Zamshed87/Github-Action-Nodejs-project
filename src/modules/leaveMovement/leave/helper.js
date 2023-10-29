import axios from "axios";
import { toast } from "react-toastify";

export const getEmployeeLeaveBalanceAndHistory = async (
  employeeId,
  viewType,
  setter,
  setLoading,
  setAllData
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/LeaveMovement/GetEmployeeLeaveBalanceAndHistory?EmployeeId=${employeeId}&ViewType=${viewType}`
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

export const getAllAnnouncement = async (
  applicationId,
  setter
) => {
  try {
    const res = await axios.get(`/ApprovalPipeline/GetApplicationApprovalLogByReference?ReferenceName=Leave%20Application&ReferenceId=${applicationId}`);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const attachment_action = async (
  accountId,
  tableReferrence,
  documentTypeId,
  buId,
  userId,
  attachment,
  setLoading
) => {
  setLoading && setLoading(true);
  let formData = new FormData();
  formData.append("files", attachment[0]);
  try {
    let { data } = await axios.post(
      `/Document/UploadFile?accountId=${accountId}&tableReferrence=${tableReferrence}&documentTypeId=${documentTypeId}&businessUnitId=${buId}&createdBy=${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setLoading && setLoading(false);
    toast.success("Upload  successfully");
    return data;
  } catch (error) {
    setLoading && setLoading(false);
    toast.error("File Size is too large or inValid File!");
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

export const getAllLeaveApplicatonListData = async (
  payload,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/LeaveMovement/LeaveApplicationLanding`,
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

export const getAllLeaveApplicatonListDataForApproval = async (
  payload,
  setter,
  setAllData,
  setFilterData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/LeaveApplicationLanding`,
      payload
    );
    if (res?.data) {
      setAllData && setAllData(res?.data);
      setter(res?.data);
      setFilterData(res?.data);
    }
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setFilterData([]);
    setLoading && setLoading(false);
  }
};

export const leaveApproveReject = async (payload, cb) => {
  try {
    const res = await axios.post(
      `/ApprovalPipeline/LeaveApplicationApproval`,
      payload
    );
    cb && cb();
    toast.success(res?.data || "Submitted Successfully");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

//Encashment Landing
export const getLeaveAndEncashmentListByEmployeeId = async (
  empId,
  setter,
  setAllData,
  setIsLoading,
  cb
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/LeaveMovement/LeaveAndEncashmentListByEmployeeId?EmployeeId=${empId}`
    );
    setIsLoading(false);
    setter(res?.data);
    setAllData(res?.data);
    cb && cb();
  } catch (err) {
    setIsLoading(false);
    setter([]);
    setAllData([]);
  }
};

//Create or Edit
export const getLeaveEncashmenApplication = async (payload, cb) => {
  try {
    const res = await axios.post(
      `/LeaveMovement/LeaveEncashmenApplication`,
      payload
    );
    toast.success(res?.data || "Created Successfully");
    cb && cb();
  } catch (error) {
    toast.warn(error?.response?.data || "Something went wrong");
  }
};

export const getEncashmentBalanceByEmployeeId = async (empId, cb) => {
  try {
    let res = await axios.get(
      `/LeaveMovement/GetEncashmentBalanceByEmployeeId?EmployeeId=${empId}`
    );
    res?.data?.totalBalance && cb(res?.data?.totalBalance);
  } catch (err) {}
};
