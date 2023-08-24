import moment from "moment";
import { toast } from "react-toastify";
import { todayDate } from "../../../../../utility/todayDate";

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
  getPeopleDeskAllLanding,
  setRowDto,
  setAllData,
  createTimeSheetAction,
  setLoading,
  wgId
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

  // if (
  //   !validateTime(
  //     "Extended start time",
  //     values?.allowedStartTime,
  //     values?.startTime,
  //     values?.endTime
  //   )
  // )
  //   return;

  // if (
  //   !validateTime(
  //     "Last start time",
  //     values?.lastStartTime,
  //     values?.allowedStartTime,
  //     values?.endTime
  //   )
  // )
  //   return;

  // if (
  //   !validateTime(
  //     "Break start time",
  //     values?.breakStartTime,
  //     values?.startTime,
  //     values?.endTime
  //   )
  // )
  //   return;

  // if (
  //   !validateTime(
  //     "Break End time",
  //     values?.breakEndTime,
  //     values?.breakStartTime,
  //     values?.endTime
  //   )
  // )
  //   return;

  // // if (
  // //   !validateTime(
  // //     "Office Start time",
  // //     values?.startTime,
  // //     values?.officeStartTime,
  // //     values?.officeCloseTime
  // //   )
  // // )
  // //   return;
  // if (!(values?.officeStartTime <= values.startTime)) {
  //   toast.warn(`Office Open time is not in range`);
  //   return;
  // }
  // if (!(values?.officeCloseTime >= values.endTime)) {
  //   toast.warn(`Office End time is not in range`);
  //   return;
  // }

  // !validateTime(
  //   "Office End time",
  //   values?.endTime,
  //   values?.officeStartTime,
  //   values?.officeCloseTime
  // )

  const payload = {
    partType: "Calender",
    employeeId: employeeId,
    autoId: id ? id : 0,
    value: "",
    IntCreatedBy: employeeId,
    isActive: true,
    businessUnitId: buId,
    accountId: orgId,
    holidayGroupName: "",
    year: 0,
    holidayGroupId: 0,
    holidayName: "",
    fromDate: todayDate(),
    toDate: todayDate(),
    totalDays: 0,
    calenderCode: "",
    calendarName: values?.calendarName,
    startTime: values?.startTime || "00:00:00",
    extendedStartTime: values?.allowedStartTime || "00:00:00",
    lastStartTime: values?.lastStartTime || "00:00:00",
    endTime: values?.endTime || "00:00:00",
    breakStartTime: values?.breakStartTime || "00:00:00",
    breakEndTime: values?.breakEndTime || "00:00:00",
    OfficeStartTime: values?.officeStartTime || "00:00:00",
    OfficeCloseTime: values?.officeCloseTime || "00:00:00",
    isNightShift: values?.nightShift || false,
    minWorkHour: +values?.minWork,
    isConfirm: true,
    exceptionOffdayName: "",
    isAlternativeDay: true,
    exceptionOffdayGroupId: 0,
    weekOfMonth: "",
    weekOfMonthId: 0,
    daysOfWeek: "",
    daysOfWeekId: 0,
    remarks: "",
    rosterGroupName: "",
    workplaceId: 0,
    workplaceGroupId: 0,
    overtimeDate: "2022-05-08T09:13:19.700Z",
    overtimeHour: 0,
    reason: "",
  };

  const callback = () => {
    cb();
    onHide();
    getPeopleDeskAllLanding(
      "Calender",
      orgId,
      buId,
      "",
      setRowDto,
      setAllData,
      null,
      null,
      null,
      wgId
    );
  };
  createTimeSheetAction(payload, setLoading, callback);
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
