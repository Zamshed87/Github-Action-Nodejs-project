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
  isSeen = "",
  setFilterLatestNthDayData
) => {
  setNotificationLoading && setNotificationLoading(true);
  try {
    const res = await axios.get(
      `/Notification/GetAllNotificationByUser?pageNo=${pageNo}&pageSize=${pageSize}&employeeId=${employeeId}&accountId=${accId}&isSeen=${isSeen}`
    );
    // const res = { data: fakeData };
    setTimeout(() => {
      setNotificationLoading && setNotificationLoading(false);
    }, 500);

    if (typeof setFilterLatestNthDayData === "function") {
      const filterData = getLastSevenDaysEntries(res?.data) || [];
      setFilterLatestNthDayData?.(filterData);
      const result = res?.data.filter(obj1 => !filterData.some(obj2 => obj1.intId === obj2.intId));
      setter(result);
    } else {
      setter?.([...rowDto, ...res?.data]);
    }
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
    if (res?.data?.intId === notificationId || res?.status === 200) {
      const newData = rowDto.map((item) => {
        if (item?.id === notificationId) {
          return { ...item, isSeenRealTimeNotify: true };
        }
        return item;
      });
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

export function filterLastNthDays(data, day = 7) {
  // Convert date strings to Date objects
  const dates = data.map((item) => new Date(item.dteCreateAt));

  // Find the latest date
  const latestDate = new Date(Math.max(...dates));

  // Calculate the cutoff date (7 days before the latest date)
  const cutoffDate = new Date(latestDate);
  cutoffDate.setDate(latestDate.getDate() - day);

  // Filter the data for objects created within the last 7 days from the latest date
  return data.filter((item) => new Date(item.dteCreateAt) >= cutoffDate);
}

function getLastSevenDaysEntries(data) {
  // Get today's date and set the time to 00:00:00 for accurate comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Calculate the date 7 days ago from today
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  // Filter the data to get entries between today and the last 7 days
  const filteredData = data.filter(item => {
    const itemDate = new Date(item.dteCreateAt);
    return itemDate >= sevenDaysAgo;
  });
  return filteredData;
}

const fakeData = [
  {
    intId: 3,
    intAccountId: 4,
    intModuleId: 1,
    strModule: "Policy 4",
    strFeature: "policy",
    intFeatureTableAutoId: 4,
    intEmployeeId: 0,
    intReceiverId: 3917,
    isRealTimeNotify: false,
    isSeenRealTimeNotify: false,
    strRealTimeNotifyTitle: null,
    strRealTimeNotifyDetails: null,
    dteSeenAt: "2024-07-04T11:15:28.567",
    dteCreateAt: "2024-07-04T11:15:28.18",
    intCreatedBy: 0,
    timeDifference: "1d",
    notification: {
      intId: 3,
      intAccountId: 4,
      intModuleId: 1,
      strModule: "Policy",
      strFeature: "policy",
      intFeatureTableAutoId: 4,
      intEmployeeId: 0,
      intReceiverId: 3917,
      isRealTimeNotify: false,
      isSeenRealTimeNotify: false,
      strRealTimeNotifyTitle: null,
      strRealTimeNotifyDetails: null,
      strRealTimeNotifyDetilsHtml: null,
      isPushNotify: true,
      isSendPushNotify: true,
      strPushNotifyTitle: "Organization Policy",
      strPushNotifyDetails: "test",
      strPushNotifyDetilsHtml: null,
      isMail: false,
      isSendMail: false,
      strMailTo: null,
      strCcList: null,
      strBccList: null,
      strMailTitle: null,
      strMailBody: null,
      strMailBodyHtml: null,
      isSms: false,
      isSendSms: false,
      strSmsTitle: null,
      strSmsBody: null,
      dteSeenAt: "2024-07-02T21:15:28.567",
      dteCreateAt: "2024-07-02T15:15:28.18",
      intCreatedBy: 0,
      isActive: true,
    },
  },
  {
    intId: 3,
    intAccountId: 4,
    intModuleId: 1,
    strModule: "Policy 2",
    strFeature: "policy",
    intFeatureTableAutoId: 4,
    intEmployeeId: 0,
    intReceiverId: 3917,
    isRealTimeNotify: false,
    isSeenRealTimeNotify: false,
    strRealTimeNotifyTitle: null,
    strRealTimeNotifyDetails: null,
    dteSeenAt: "2024-07-02T21:15:28.567",
    dteCreateAt: "2024-07-02T15:15:28.18",
    intCreatedBy: 0,
    timeDifference: "1d",
    notification: {
      intId: 3,
      intAccountId: 4,
      intModuleId: 1,
      strModule: "Policy",
      strFeature: "policy",
      intFeatureTableAutoId: 4,
      intEmployeeId: 0,
      intReceiverId: 3917,
      isRealTimeNotify: false,
      isSeenRealTimeNotify: false,
      strRealTimeNotifyTitle: null,
      strRealTimeNotifyDetails: null,
      strRealTimeNotifyDetilsHtml: null,
      isPushNotify: true,
      isSendPushNotify: true,
      strPushNotifyTitle: "Organization Policy",
      strPushNotifyDetails: "test",
      strPushNotifyDetilsHtml: null,
      isMail: false,
      isSendMail: false,
      strMailTo: null,
      strCcList: null,
      strBccList: null,
      strMailTitle: null,
      strMailBody: null,
      strMailBodyHtml: null,
      isSms: false,
      isSendSms: false,
      strSmsTitle: null,
      strSmsBody: null,
      dteSeenAt: "2024-07-02T21:15:28.567",
      dteCreateAt: "2024-07-02T15:15:28.18",
      intCreatedBy: 0,
      isActive: true,
    },
  },
  {
    intId: 4,
    intAccountId: 4,
    intModuleId: 1,
    strModule: "Policy 1",
    strFeature: "policy",
    intFeatureTableAutoId: 4,
    intEmployeeId: 0,
    intReceiverId: 3917,
    isRealTimeNotify: false,
    isSeenRealTimeNotify: false,
    strRealTimeNotifyTitle: null,
    strRealTimeNotifyDetails: null,
    dteSeenAt: "2024-07-01T21:15:28.567",
    dteCreateAt: "2024-07-01T15:15:28.18",
    intCreatedBy: 0,
    timeDifference: "1d",
    notification: {
      intId: 4,
      intAccountId: 4,
      intModuleId: 1,
      strModule: "Policy",
      strFeature: "policy",
      intFeatureTableAutoId: 4,
      intEmployeeId: 0,
      intReceiverId: 3917,
      isRealTimeNotify: false,
      isSeenRealTimeNotify: false,
      strRealTimeNotifyTitle: null,
      strRealTimeNotifyDetails: null,
      strRealTimeNotifyDetilsHtml: null,
      isPushNotify: true,
      isSendPushNotify: true,
      strPushNotifyTitle: "Organization Policy",
      strPushNotifyDetails: "test",
      strPushNotifyDetilsHtml: null,
      isMail: false,
      isSendMail: false,
      strMailTo: null,
      strCcList: null,
      strBccList: null,
      strMailTitle: null,
      strMailBody: null,
      strMailBodyHtml: null,
      isSms: false,
      isSendSms: false,
      strSmsTitle: null,
      strSmsBody: null,
      dteSeenAt: "2024-07-02T21:15:28.567",
      dteCreateAt: "2024-07-02T15:15:28.18",
      intCreatedBy: 0,
      isActive: true,
    },
  },
  {
    intId: 5,
    intAccountId: 4,
    intModuleId: 1,
    strModule: "Policy 21 6",
    strFeature: "policy",
    intFeatureTableAutoId: 4,
    intEmployeeId: 0,
    intReceiverId: 3917,
    isRealTimeNotify: false,
    isSeenRealTimeNotify: false,
    strRealTimeNotifyTitle: null,
    strRealTimeNotifyDetails: null,
    dteSeenAt: "2024-06-30T21:15:28.567",
    dteCreateAt: "2024-06-30T15:15:28.18",
    intCreatedBy: 0,
    timeDifference: "1d",
    notification: {
      intId: 5,
      intAccountId: 4,
      intModuleId: 1,
      strModule: "Policy",
      strFeature: "policy",
      intFeatureTableAutoId: 4,
      intEmployeeId: 0,
      intReceiverId: 3917,
      isRealTimeNotify: false,
      isSeenRealTimeNotify: false,
      strRealTimeNotifyTitle: null,
      strRealTimeNotifyDetails: null,
      strRealTimeNotifyDetilsHtml: null,
      isPushNotify: true,
      isSendPushNotify: false,
      strPushNotifyTitle: "Organization Policy",
      strPushNotifyDetails: "test",
      strPushNotifyDetilsHtml: null,
      isMail: false,
      isSendMail: false,
      strMailTo: null,
      strCcList: null,
      strBccList: null,
      strMailTitle: null,
      strMailBody: null,
      strMailBodyHtml: null,
      isSms: false,
      isSendSms: false,
      strSmsTitle: null,
      strSmsBody: null,
      dteSeenAt: "2024-07-02T21:15:28.567",
      dteCreateAt: "2024-07-02T15:15:28.18",
      intCreatedBy: 0,
      isActive: true,
    },
  },
  {
    intId: 6,
    intAccountId: 4,
    intModuleId: 1,
    strModule: "Policy 20 6",
    strFeature: "policy",
    intFeatureTableAutoId: 4,
    intEmployeeId: 0,
    intReceiverId: 3917,
    isRealTimeNotify: false,
    isSeenRealTimeNotify: false,
    strRealTimeNotifyTitle: null,
    strRealTimeNotifyDetails: null,
    dteSeenAt: "2024-06-20T21:15:28.567",
    dteCreateAt: "2024-06-20T15:15:28.18",
    intCreatedBy: 0,
    timeDifference: "1d",
    notification: {
      intId: 6,
      intAccountId: 4,
      intModuleId: 1,
      strModule: "Policy",
      strFeature: "policy",
      intFeatureTableAutoId: 4,
      intEmployeeId: 0,
      intReceiverId: 3917,
      isRealTimeNotify: false,
      isSeenRealTimeNotify: false,
      strRealTimeNotifyTitle: null,
      strRealTimeNotifyDetails: null,
      strRealTimeNotifyDetilsHtml: null,
      isPushNotify: true,
      isSendPushNotify: false,
      strPushNotifyTitle: "Organization Policy",
      strPushNotifyDetails: "test",
      strPushNotifyDetilsHtml: null,
      isMail: false,
      isSendMail: false,
      strMailTo: null,
      strCcList: null,
      strBccList: null,
      strMailTitle: null,
      strMailBody: null,
      strMailBodyHtml: null,
      isSms: false,
      isSendSms: false,
      strSmsTitle: null,
      strSmsBody: null,
      dteSeenAt: "2024-07-02T21:15:28.567",
      dteCreateAt: "2024-07-02T15:15:28.18",
      intCreatedBy: 0,
      isActive: true,
    },
  },
  {
    intId: 7,
    intAccountId: 4,
    intModuleId: 1,
    strModule: "Policy 19 6",
    strFeature: "policy",
    intFeatureTableAutoId: 4,
    intEmployeeId: 0,
    intReceiverId: 3917,
    isRealTimeNotify: false,
    isSeenRealTimeNotify: false,
    strRealTimeNotifyTitle: null,
    strRealTimeNotifyDetails: null,
    dteSeenAt: "2024-06-20T21:15:28.567",
    dteCreateAt: "2024-06-20T15:15:28.18",
    intCreatedBy: 0,
    timeDifference: "1d",
    notification: {
      intId: 7,
      intAccountId: 4,
      intModuleId: 1,
      strModule: "Policy",
      strFeature: "policy",
      intFeatureTableAutoId: 4,
      intEmployeeId: 0,
      intReceiverId: 3917,
      isRealTimeNotify: false,
      isSeenRealTimeNotify: false,
      strRealTimeNotifyTitle: null,
      strRealTimeNotifyDetails: null,
      strRealTimeNotifyDetilsHtml: null,
      isPushNotify: true,
      isSendPushNotify: false,
      strPushNotifyTitle: "Organization Policy",
      strPushNotifyDetails: "test",
      strPushNotifyDetilsHtml: null,
      isMail: false,
      isSendMail: false,
      strMailTo: null,
      strCcList: null,
      strBccList: null,
      strMailTitle: null,
      strMailBody: null,
      strMailBodyHtml: null,
      isSms: false,
      isSendSms: false,
      strSmsTitle: null,
      strSmsBody: null,
      dteSeenAt: "2024-07-02T21:15:28.567",
      dteCreateAt: "2024-07-02T15:15:28.18",
      intCreatedBy: 0,
      isActive: true,
    },
  },
  {
    intId: 8,
    intAccountId: 4,
    intModuleId: 1,
    strModule: "Policy 18 6",
    strFeature: "policy",
    intFeatureTableAutoId: 4,
    intEmployeeId: 0,
    intReceiverId: 3917,
    isRealTimeNotify: false,
    isSeenRealTimeNotify: false,
    strRealTimeNotifyTitle: null,
    strRealTimeNotifyDetails: null,
    dteSeenAt: "2024-06-19T21:15:28.567",
    dteCreateAt: "2024-06-19T15:15:28.18",
    intCreatedBy: 0,
    timeDifference: "1d",
    notification: {
      intId: 8,
      intAccountId: 4,
      intModuleId: 1,
      strModule: "Policy",
      strFeature: "policy",
      intFeatureTableAutoId: 4,
      intEmployeeId: 0,
      intReceiverId: 3917,
      isRealTimeNotify: false,
      isSeenRealTimeNotify: false,
      strRealTimeNotifyTitle: null,
      strRealTimeNotifyDetails: null,
      strRealTimeNotifyDetilsHtml: null,
      isPushNotify: true,
      isSendPushNotify: false,
      strPushNotifyTitle: "Organization Policy",
      strPushNotifyDetails: "test",
      strPushNotifyDetilsHtml: null,
      isMail: false,
      isSendMail: false,
      strMailTo: null,
      strCcList: null,
      strBccList: null,
      strMailTitle: null,
      strMailBody: null,
      strMailBodyHtml: null,
      isSms: false,
      isSendSms: false,
      strSmsTitle: null,
      strSmsBody: null,
      dteSeenAt: "2024-07-02T21:15:28.567",
      dteCreateAt: "2024-07-02T15:15:28.18",
      intCreatedBy: 0,
      isActive: true,
    },
  },
  {
    intId: 9,
    intAccountId: 4,
    intModuleId: 1,
    strModule: "Policy 17 6",
    strFeature: "policy",
    intFeatureTableAutoId: 4,
    intEmployeeId: 0,
    intReceiverId: 3917,
    isRealTimeNotify: false,
    isSeenRealTimeNotify: false,
    strRealTimeNotifyTitle: null,
    strRealTimeNotifyDetails: null,
    dteSeenAt: "2024-06-15T21:15:28.567",
    dteCreateAt: "2024-06-15T15:15:28.18",
    intCreatedBy: 0,
    timeDifference: "1d",
    notification: {
      intId: 9,
      intAccountId: 4,
      intModuleId: 1,
      strModule: "Policy",
      strFeature: "policy",
      intFeatureTableAutoId: 4,
      intEmployeeId: 0,
      intReceiverId: 3917,
      isRealTimeNotify: false,
      isSeenRealTimeNotify: false,
      strRealTimeNotifyTitle: null,
      strRealTimeNotifyDetails: null,
      strRealTimeNotifyDetilsHtml: null,
      isPushNotify: true,
      isSendPushNotify: false,
      strPushNotifyTitle: "Organization Policy",
      strPushNotifyDetails: "test",
      strPushNotifyDetilsHtml: null,
      isMail: false,
      isSendMail: false,
      strMailTo: null,
      strCcList: null,
      strBccList: null,
      strMailTitle: null,
      strMailBody: null,
      strMailBodyHtml: null,
      isSms: false,
      isSendSms: false,
      strSmsTitle: null,
      strSmsBody: null,
      dteSeenAt: "2024-07-02T21:15:28.567",
      dteCreateAt: "2024-07-02T15:15:28.18",
      intCreatedBy: 0,
      isActive: true,
    },
  },
  {
    intId: 10,
    intAccountId: 4,
    intModuleId: 1,
    strModule: "Policy 16 6",
    strFeature: "policy",
    intFeatureTableAutoId: 4,
    intEmployeeId: 0,
    intReceiverId: 3917,
    isRealTimeNotify: false,
    isSeenRealTimeNotify: false,
    strRealTimeNotifyTitle: null,
    strRealTimeNotifyDetails: null,
    dteSeenAt: "2024-06-15T21:15:28.567",
    dteCreateAt: "2024-06-15T15:15:28.18",
    intCreatedBy: 0,
    timeDifference: "1d",
    notification: {
      intId: 10,
      intAccountId: 4,
      intModuleId: 1,
      strModule: "Policy",
      strFeature: "policy",
      intFeatureTableAutoId: 4,
      intEmployeeId: 0,
      intReceiverId: 3917,
      isRealTimeNotify: false,
      isSeenRealTimeNotify: false,
      strRealTimeNotifyTitle: null,
      strRealTimeNotifyDetails: null,
      strRealTimeNotifyDetilsHtml: null,
      isPushNotify: true,
      isSendPushNotify: false,
      strPushNotifyTitle: "Organization Policy",
      strPushNotifyDetails: "test",
      strPushNotifyDetilsHtml: null,
      isMail: false,
      isSendMail: false,
      strMailTo: null,
      strCcList: null,
      strBccList: null,
      strMailTitle: null,
      strMailBody: null,
      strMailBodyHtml: null,
      isSms: false,
      isSendSms: false,
      strSmsTitle: null,
      strSmsBody: null,
      dteSeenAt: "2024-07-02T21:15:28.567",
      dteCreateAt: "2024-07-02T15:15:28.18",
      intCreatedBy: 0,
      isActive: true,
    },
  },
  {
    intId: 36,
    intAccountId: 4,
    intModuleId: 1,
    strModule: "Policy 10 6",
    strFeature: "policy",
    intFeatureTableAutoId: 4,
    intEmployeeId: 0,
    intReceiverId: 3917,
    isRealTimeNotify: false,
    isSeenRealTimeNotify: false,
    strRealTimeNotifyTitle: "test by shahed title",
    strRealTimeNotifyDetails: "test by shahed",
    dteSeenAt: "2024-06-10T21:15:28.567",
    dteCreateAt: "2024-06-10T15:15:28.18",
    intCreatedBy: 0,
    timeDifference: "1d",
    notification: {
      intId: 36,
      intAccountId: 4,
      intModuleId: 1,
      strModule: "Policy",
      strFeature: "policy",
      intFeatureTableAutoId: 4,
      intEmployeeId: 0,
      intReceiverId: 3917,
      isRealTimeNotify: false,
      isSeenRealTimeNotify: false,
      strRealTimeNotifyTitle: "test by shahed title",
      strRealTimeNotifyDetails: "test by shahed",
      strRealTimeNotifyDetilsHtml: null,
      isPushNotify: true,
      isSendPushNotify: false,
      strPushNotifyTitle: "Organization Policy",
      strPushNotifyDetails: "test",
      strPushNotifyDetilsHtml: null,
      isMail: false,
      isSendMail: false,
      strMailTo: null,
      strCcList: null,
      strBccList: null,
      strMailTitle: null,
      strMailBody: null,
      strMailBodyHtml: null,
      isSms: false,
      isSendSms: false,
      strSmsTitle: null,
      strSmsBody: null,
      dteSeenAt: "2024-07-02T21:15:28.567",
      dteCreateAt: "2024-07-02T15:15:28.18",
      intCreatedBy: 0,
      isActive: true,
    },
  },
  {
    intId: 2,
    intAccountId: 4,
    intModuleId: 1,
    strModule: "Employee Management 10 6",
    strFeature: "movement_application",
    intFeatureTableAutoId: 10256,
    intEmployeeId: 3509,
    intReceiverId: 3917,
    isRealTimeNotify: true,
    isSeenRealTimeNotify: true,
    strRealTimeNotifyTitle: "Movement Application",
    strRealTimeNotifyDetails:
      "Mr. 10MS Ltd._Test Apply For 1 day Full Day Movement.",
    dteSeenAt: "2024-06-10T21:15:28.567",
    dteCreateAt: "2024-06-10T15:15:28.18",
    intCreatedBy: 0,
    timeDifference: "1d",
    notification: {
      intId: 2,
      intAccountId: 4,
      intModuleId: 1,
      strModule: "Employee Management",
      strFeature: "movement_application",
      intFeatureTableAutoId: 10256,
      intEmployeeId: 3509,
      intReceiverId: 3917,
      isRealTimeNotify: true,
      isSeenRealTimeNotify: true,
      strRealTimeNotifyTitle: "Movement Application",
      strRealTimeNotifyDetails:
        "Mr. 10MS Ltd._Test Apply For 1 day Full Day Movement.",
      strRealTimeNotifyDetilsHtml: null,
      isPushNotify: false,
      isSendPushNotify: false,
      strPushNotifyTitle: null,
      strPushNotifyDetails: null,
      strPushNotifyDetilsHtml: null,
      isMail: true,
      isSendMail: false,
      strMailTo: "",
      strCcList: null,
      strBccList: null,
      strMailTitle: "Movement Request from  Mr.  10MS Ltd._Test",
      strMailBody: null,
      strMailBodyHtml:
        "<!DOCTYPE html><html><body><div><p>Dear Concern,</p><p>I'm requesting Full Day Movement from 11 Jul,02024 to 11 Jul,02024 for bvgfdsa.</p><p> I'll ensure all pending tasks are completed or delegated and minimal team workflow disruption. </p><p> Thank you for your consideration. </p><p> To login use this URL: https://app.peopledesk.io/ </p><p> Best regards, </p><p> 10MS Ltd._Test </p></div></body></html>",
      isSms: false,
      isSendSms: false,
      strSmsTitle: null,
      strSmsBody: null,
      dteSeenAt: "2024-07-02T21:02:01.92",
      dteCreateAt: "2024-07-02T15:02:01.903",
      intCreatedBy: 0,
      isActive: true,
    },
  },
  {
    intId: 1,
    intAccountId: 4,
    intModuleId: 1,
    strModule: "Employee Management 7 6",
    strFeature: "leave_application",
    intFeatureTableAutoId: 12930,
    intEmployeeId: 3509,
    intReceiverId: 3917,
    isRealTimeNotify: true,
    isSeenRealTimeNotify: false,
    strRealTimeNotifyTitle: "Leave Application",
    strRealTimeNotifyDetails:
      "Mr. 10MS Ltd._Test Apply For 1 day Casual Leave.",
    dteSeenAt: "2024-06-07T21:15:28.567",
    dteCreateAt: "2024-06-07T15:15:28.18",
    intCreatedBy: 0,
    timeDifference: "1d",
    notification: {
      intId: 1,
      intAccountId: 4,
      intModuleId: 1,
      strModule: "Employee Management",
      strFeature: "leave_application",
      intFeatureTableAutoId: 12930,
      intEmployeeId: 3509,
      intReceiverId: 3917,
      isRealTimeNotify: true,
      isSeenRealTimeNotify: false,
      strRealTimeNotifyTitle: "Leave Application",
      strRealTimeNotifyDetails:
        "Mr. 10MS Ltd._Test Apply For 1 day Casual Leave.",
      strRealTimeNotifyDetilsHtml: null,
      isPushNotify: true,
      isSendPushNotify: false,
      strPushNotifyTitle: "Leave Application",
      strPushNotifyDetails: "Mr. 10MS Ltd._Test Apply For 1 day Casual Leave.",
      strPushNotifyDetilsHtml: null,
      isMail: false,
      isSendMail: false,
      strMailTo: null,
      strCcList: null,
      strBccList: null,
      strMailTitle: null,
      strMailBody: null,
      strMailBodyHtml: null,
      isSms: false,
      isSendSms: false,
      strSmsTitle: null,
      strSmsBody: null,
      dteSeenAt: "2024-07-02T13:31:14.85",
      dteCreateAt: "2024-07-02T07:31:14.56",
      intCreatedBy: 0,
      isActive: true,
    },
  },
];
