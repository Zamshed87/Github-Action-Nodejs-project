import moment from "moment";
import { toast } from "react-toastify";

export const EmpFilterType = [
  {
    label: "Monthly Basis",
    value: 1,
  },
  {
    label: "Daily Basis",
    value: 2,
  },
];
export const AttendanceType = [
  {
    value: 1,
    label: "Present",
    code: "present",
  },
  {
    value: 2,
    label: "Absent",
    code: "absent",
  },
  {
    value: 3,
    label: "Late",
    code: "late",
  },
  {
    value: 4,
    label: "Changed In/Out Time", // label name depend on the requirement
    code: "Changed In/Out Time", // code name depend on the requirement
  },
];

export const submitHandler = async ({
  ManualAttendance,
  form,
  selectedPayloadState,
  orgId,
  employeeId,
  wgId,
  buId,
  selectedRow,
  getAttendanceFilterData,
  setOpenModal,
  setSelectedRow,
}: any) => {
  if (ManualAttendance?.loading)
    return toast.warn("Please wait for the previous request to complete");

  await form
    .validateFields(["intime", "outtime"])
    .then(() => {
      const values = form.getFieldsValue(true);
      let payload: any[] = [];
      if (values?.attendanceAdujust?.label === "Changed In/Out Time") {
        const isEmpty = selectedPayloadState?.some(
          (item: any) => !item?.intimeUpdate || !item?.outtimeUpdate
        );
        if (isEmpty) {
          return toast.warn("Please fill all time fields");
        }
        payload = selectedPayloadState.map((item: any) => {
          const inTImeStr =
            item?.inDateUpdate +
            "T" +
            moment(item?.intimeUpdate).format("HH:mm:ss");
          const outTimeStr =
            item?.outDateUpdate +
            "T" +
            moment(item?.outtimeUpdate).format("HH:mm:ss");
          return {
            id: item?.ManualAttendanceId || 0,
            accountId: orgId,
            attendanceSummaryId: item?.AutoId,
            employeeId: item?.EmployeeId,
            attendanceDate: item?.AttendanceDate,
            inDateTime: inTImeStr || null,
            outDateTime: outTimeStr || null,

            currentStatus: item?.isPresent
              ? "Present"
              : item?.isLeave
              ? "Leave"
              : "Absent",
            requestStatus: values?.attendanceAdujust?.label,
            remarks: item?.reasonUpdate || "By HR",
            isApproved: true,
            isActive: true,
            isManagement: true,
            insertUserId: employeeId,
            insertDateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
            workPlaceGroup: wgId,
            businessUnitId: buId,
            isAdditionalCalendar: item?.isAdditionalCalendar ? true : false,
            additionalCalendarId: item?.isAdditionalCalendar
              ? item?.additionalCalendarId
              : 0,
          };
        });
      } else {
        payload = selectedRow.map((item: any) => {
          return {
            id: item?.ManualAttendanceId || 0,
            accountId: orgId,
            attendanceSummaryId: item?.AutoId,
            employeeId: item?.EmployeeId,
            attendanceDate: item?.AttendanceDate,
            inDateTime:
              values?.attendanceAdujust?.label === "Absent" ||
              values?.attendanceAdujust?.label === "Late" ||
              values?.attendanceAdujust?.label === "Present"
                ? null
                : values?.intime
                ? moment(values?.intime).format("YYYY-MM-DDTHH:mm:ss")
                : moment(moment(item?.InTime, "h:mma")).format(
                    "YYYY-MM-DDTHH:mm:ss"
                  ) || null,
            outDateTime:
              values?.attendanceAdujust?.label === "Absent" ||
              values?.attendanceAdujust?.label === "Late" ||
              values?.attendanceAdujust?.label === "Present"
                ? null
                : values?.outtime
                ? moment(values?.outtime).format("YYYY-MM-DDTHH:mm:ss")
                : moment(moment(item?.OutTime, "h:mma")).format(
                    "YYYY-MM-DDTHH:mm:ss"
                  ) || null,

            currentStatus: item?.isPresent
              ? "Present"
              : item?.isLeave
              ? "Leave"
              : "Absent",
            requestStatus: values?.attendanceAdujust?.label,
            remarks: item?.strReason || "By HR",
            isApproved: true,
            isActive: true,
            isManagement: true,
            insertUserId: employeeId,
            insertDateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
            workPlaceGroup: wgId,
            businessUnitId: buId,
          };
        });
      }
      ManualAttendance?.action({
        method: "post",
        urlKey: "ManualAttendance",
        payload,
        toast: true,
        onSuccess: () => {
          form.setFieldsValue({
            openModal: false,
            attendanceAdujust: undefined,
            intime: "",
            outtime: "",
            reason: "",
            reasonAll: false,
          });
          setOpenModal(false);
          setSelectedRow([]);
          getAttendanceFilterData();
        },
      });
    })
    .catch(() => {
      // console.error("Validate Failed:", info);
    });
};
