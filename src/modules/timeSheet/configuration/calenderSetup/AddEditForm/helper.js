import moment from "moment";
import { toast } from "react-toastify";
import { todayDate } from "../../../../../utility/todayDate";
import axios from "axios";

export function format_ms(time_ms) {
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  hours = parseInt(time_ms / 3600000).toString();

  time_ms %= 3600000;

  minutes = parseInt(time_ms / 60000).toString();

  time_ms %= 60000;

  seconds = parseInt(time_ms / 1000).toString();

  return (
    hours + ":" + minutes.padStart(2, "0") + ":" + seconds.padStart(2, "0")
  );
}

export const onCreateCalendarSetupWithValidation = (
  values,
  employeeId,
  orgId,
  buId,
  id,
  cb,
  onHide,
  getLanding,
  setRowDto,
  setAllData,
  createTimeSheetActionForCalender,
  setLoading,
  wgId,
  tableData,
  deleteRowData,
  setDeleteRowData
) => {
  let demoStartTime = moment(values?.startTime, "HH:mm").subtract(12, "hours");
  let demoEndTime = moment(values?.endTime, "HH:mm").add(12, "hours");

  if (moment.duration(values?.startTime) > moment.duration(values?.endTime)) {
    let demoWorkHour = moment
      .duration(demoEndTime.diff(demoStartTime))
      .asHours();
    if (parseInt(values?.minWork) > demoWorkHour) {
      toast.error("Minimum working hour is greater than duration");
      return;
    }
  } else {
    const tempMinWork = parseInt(
      format_ms(
        moment.duration(values?.endTime) - moment.duration(values?.startTime)
      )
    );

    if (parseInt(values?.minWork) > tempMinWork) {
      toast.error("Minimum working hour is greater than duration");
      return;
    }
  }
  let userList = tableData?.map((item) => {
    return {
      calendarId: id || 0,
      calenderName: values?.calendarName || "",
      intWorkplaceId: item?.intWorkplaceId || 0,
      strWorkplaceName: item?.strWorkplace || "",
      intAccountId: orgId,
      intBusinessUnitId: buId,
      intCreatedBy: employeeId,
      intCalenderRowId: item?.intCalenderRowId || 0,
      isCreate: true,
      isDelete: false,
    };
  });

  let deleteList = deleteRowData?.map((item) => {
    return {
      calendarId: id || 0,
      calenderName: values?.calendarName || "",
      intWorkplaceId: item?.intWorkplaceId || 0,
      strWorkplaceName: item?.strWorkplace || "",
      intAccountId: orgId,
      intBusinessUnitId: buId,
      intCreatedBy: employeeId,
      intCalenderRowId: item?.intCalenderRowId || 0,
      isCreate: false,
      isDelete: true,
    };
  });

  let editList = [];

  userList.map((itm) => {
    if (itm?.intCalenderRowId <= 0) {
      editList.push(itm);
    }
  });
  const payload = {
    calenderId: id || 0,
    strCalenderCode: "",
    strCalenderName: values?.calendarName || "",
    dteStartTime: id
      ? moment(values?.startTime, "HH:mm").format("HH:mm:ss")
      : `${values?.startTime}:00` || "00:00:00",
    dteExtendedStartTime: id
      ? moment(values?.allowedStartTime, "HH:mm").format("HH:mm:ss")
      : `${values?.allowedStartTime}:00` || "00:00:00",
    dteLastStartTime: id
      ? moment(values?.lastStartTime, "HH:mm").format("HH:mm:ss")
      : `${values?.lastStartTime}:00` || "00:00:00",
    dteEndTime: id
      ? moment(values?.endTime, "HH:mm").format("HH:mm:ss")
      : `${values?.endTime}:00` || "00:00:00",
    numMinWorkHour: +values?.minWork || 0,
    intAccountId: orgId,
    intBusinessUnitId: buId,
    intCreatedBy: employeeId,
    dteCreatedAt: "2023-08-30T09:23:42.542Z",
    intUpdatedBy: employeeId,
    dteUpdatedAt: "2023-08-30T09:23:42.542Z",
    isActive: true,
    dteBreakStartTime: id
      ? moment(values?.breakStartTime, "HH:mm").format("HH:mm:ss")
      : `${values?.breakStartTime}:00` || "00:00:00",
    dteBreakEndTime: id
      ? moment(values?.breakEndTime, "HH:mm").format("HH:mm:ss")
      : `${values?.breakEndTime}:00` || "00:00:00",
    dteOfficeStartTime: id
      ? moment(values?.officeStartTime, "HH:mm").format("HH:mm:ss")
      : `${values?.officeStartTime}:00` || "00:00:00",
    dteOfficeCloseTime: id
      ? moment(values?.officeCloseTime, "HH:mm").format("HH:mm:ss")
      : `${values?.officeCloseTime}:00` || "00:00:00",
    isNightShift: values?.nightShift || false,
    timeSheetCalenderRows: id ? [...deleteList, ...editList] : userList,
  };

  const callback = () => {
    cb();
    onHide();
    getLanding();
  };
  createTimeSheetActionForCalender(payload, setLoading, callback);
};

// const validateTime = (timeName, theTime, startTime, endTime) => {
//   theTime = moment.duration(theTime).asHours();
//   startTime = moment.duration(startTime).asHours();
//   endTime = moment.duration(endTime).asHours();

//   if (startTime <= theTime && theTime < endTime) return true;

//   theTime = modifyDuration(theTime);
//   startTime = modifyDuration(startTime);
//   endTime = modifyDuration(endTime);
//   if (startTime <= theTime && theTime < endTime) return true;

//   toast.warn(`${timeName || "Time"} is not in range`);
//   return false;
// };

// const modifyDuration = (duration) => {
//   if (duration > 12) return duration - 12;
//   return duration + 12;
// };

export const getTimeSheetCalenderById = async (
  buId,
  id,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `TimeSheet/GetTimeSheetCalenderById?IntCalenderId=${id}&IntBusinessUnitId=${buId}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
