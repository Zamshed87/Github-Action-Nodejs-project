import axios from "axios";
import { toast } from "react-toastify";
import { dateFormatterForInput } from "../../../utility/dateFormatter";
import { getDifferenceBetweenTime } from "../../../utility/getDifferenceBetweenTime";

const twentyFourHourFormat = (hour, minute, amPM) => {
  let time = null;
  if (amPM.toLowerCase() === "pm") {
    time = `${hour + 12}:${minute}`;
  } else {
    time = `${hour}:${minute}`;
  }
  return time;
};

export const processBulkUploadOvertimeAction = async (
  data,
  setter,
  setLoading,
  buId,
  employeeId
) => {
  try {
    setLoading(true);
    let date = new Date();
    let payload = data.map((item) => ({
      autoId: 0,
      employeeId: employeeId,
      employeeCode: `${item["Employee Code"]}`,
      businessUnitId: buId,
      year: date.getFullYear(),
      month: item["Month"],
      day: item["Day"],
      fromTime: "",
      toTime: "",
      EmployeeName: "",
      EmployeeId: 0,
      EmployeeDesignationName: "",
      fromHour: item["Start Hour"],
      fromMinute: item["Start Minutes"],
      fromAmPm: item["Start AM/PM"],
      toHour: item["End Hour"],
      toMinute: item["End Minutes"],
      toAmPm: item["End AM/PM"],
      insertBy: employeeId,
      remarks: item["Remarks"],
    }));
    const res = await axios.post(`/Employee/CreateOvertimeUpload`, payload);
    let newData = res?.data.map((item) => {
      let difference = getDifferenceBetweenTime(
        dateFormatterForInput(item?.onlyDate),
        twentyFourHourFormat(item?.fromHour, item?.fromMinute, item?.fromAmPm),
        twentyFourHourFormat(item?.toHour, item?.toMinute, item?.toAmPm)
      );

      const hour = difference?.split(":")[0];
      const min = difference?.split(":")[1];

      let overTime = `${hour}.${min}`;
      return {
        ...item,
        overtimeHour: +overTime,
      };
    });
    setter(newData);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
    toast.warn("Failed to process!");
  }
};

export const saveBulkUploadAction = async (setLoading, data) => {
  try {
    setLoading(true);
    const res = await axios.post(`/Employee/SubmitOvertimeUpload`, data);
    setLoading(false);
    toast.success(res?.data?.message || "Successful");
  } catch (error) {
    setLoading(false);
    toast.warn("Failed, try again");
  }
};
