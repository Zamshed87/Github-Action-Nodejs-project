import axios from "axios";
import { toast } from "react-toastify";

// landing
export const getAllNotificationsActions = async (
  rowDto,
  setter,
  pageNo,
  pageSize,
  employeeId,
  accId,
  setNotificationLoading,
  isSeen = ""
) => {
  setNotificationLoading && setNotificationLoading(true);
  try {
    const res = await axios.get(
      `/Notification/GetAllNotificationByUser?pageNo=${pageNo}&pageSize=${pageSize}&employeeId=${employeeId}&accountId=${accId}&isSeen=${isSeen}`
    );
    setTimeout(() => {
      setNotificationLoading && setNotificationLoading(false);
    }, 500);
    setter([...rowDto, ...res?.data]);
  } catch (error) {
    setNotificationLoading && setNotificationLoading(false);
    setter([]);
  }
};
export const setNotificationMarkAsSeenAPI = async ({
  notificationId,
  employeeId,
  accountId,
  rowDto = [],
  setter,
}) => {
  try {
    const res = await axios.put(
      `/Notification/MarkAsSeen?notificationId=${notificationId}&employeeId=${employeeId}&accountId=${accountId}`
    );
    if(res?.data?.intId === notificationId || res?.status === 200){
      const newData = rowDto.map((item) => {
        if (item?.id === notificationId) {
          return { ...item, isSeenRealTimeNotify: true };
        }
        return item;
      });
      console.log(newData)
      setter?.(newData);
    }
  } catch (error) {
    setter([]);
  }
};

// notification count
export const getTotalNotificationsCount = async (employeeId, accId, setter) => {
  try {
    const res = await axios.get(
      `/Notification/GetNotificationCount?employeeId=${employeeId}&accountId=${accId}`
    );
    if (res?.data > 0) {
      let element = document.getElementById("notiCount");
      element.className = "badge";
      element.innerHTML = res?.data;
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSingleLeaveApplicatonListForApprove = async (
  ViewType,
  employeeId,
  applicationId,
  setter
) => {
  try {
    const res = await axios.get(
      `/emp/LeaveMovement/GetSingleLeaveApplicatonListForApprove?ViewType=${ViewType}&EmployeeId=${employeeId}&ApplicationId=${applicationId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getSingleMovementApplicatonListForApprove = async (
  ViewType,
  employeeId,
  applicationId,
  setter
) => {
  try {
    const res = await axios.get(
      `/emp/LeaveMovement/GetSingleMovementApplicatonListForApprove?ViewType=${ViewType}&EmployeeId=${employeeId}&MovementId=${applicationId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const notificationLeaveApproveReject = async (
  payload,
  setLoading,
  cb,
  id
) => {
  const url = id
    ? `/emp/LeaveMovement/MovementApprove`
    : `/emp/LeaveMovement/LeaveApprove`;
  setLoading && setLoading(true);
  try {
    const res = await axios.post(url, payload);
    cb && cb();
    toast.success(res?.data?.Result?.Message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};
