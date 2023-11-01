import { todayDate } from "../../../../utility/todayDate";

const dayDDL = [
  { value: 1, label: "Saturday" },
  { value: 2, label: "Sunday" },
  { value: 3, label: "Monday" },
  { value: 4, label: "Tuesday" },
  { value: 5, label: "Wednesday" },
  { value: 6, label: "Thursday" },
  { value: 7, label: "Friday" },
];
const monthDDL = [
  {
    value: 1,
    label: "1st Week ",
  },
  {
    value: 2,
    label: "2nd Week ",
  },
  {
    value: 3,
    label: " 3rd Week",
  },
  {
    value: 4,
    label: "4th Week  ",
  },
  {
    value: 5,
    label: "5th Week ",
  },
];

const generatePayload = ({
  employeeId,
  userId,
  buId,
  orgId,
  autoId,
  values,
  singleData,
  isDelete,
}) => {
  return {
    partType: "ExceptionOffday",
    employeeId: employeeId,
    autoId: autoId ? autoId : 0,
    value: "",
    IntCreatedBy: employeeId,
    isActive: !isDelete,
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
    calendarName: "",
    startTime: "00:00:00",
    extendedStartTime: "00:00:00",
    lastStartTime: "00:00:00",
    endTime: "00:00:00",
    minWorkHour: 0,
    isConfirm: false,
    exceptionOffdayName: values?.daysOfWeek?.label,
    isAlternativeDay: true,
    exceptionOffdayGroupId: singleData[0]?.ExceptionOffdayGroupId,
    weekOfMonth: values?.weekOfMonth?.label || "",
    weekOfMonthId: values?.weekOfMonth?.value || 0,
    daysOfWeek: values?.daysOfWeek?.label || "",
    daysOfWeekId: values?.daysOfWeek?.value || 0,
    remarks: values?.offDayRemark || "",
    rosterGroupName: "",
    workplaceId: 0,
    workplaceGroupId: 0,
    overtimeDate: todayDate(),
    overtimeHour: 0,
    reason: "",
    breakStartTime: "",
    breakEndTime: "",
  };
};

export { monthDDL, dayDDL, generatePayload };
