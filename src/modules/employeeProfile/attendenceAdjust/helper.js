import { toast } from "react-toastify";
import axios from "axios";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try{
  const regex = new RegExp(keywords?.toLowerCase());
  let newDta = allData?.filter((item) =>
    regex.test(item?.EmployeeName?.toLowerCase())
  );
  setRowDto(newDta);
  } catch{setRowDto([])}
};

export const getTimeSheetAllLanding = async (
  partType,
  buId,
  setAllData,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/emp/EmployeeTimeSheet/TimeSheetAllLanding?PartType=${partType}&BuninessUnitId=${buId}`
    );
    if (res?.data) {
      const modifyRowData = res?.data?.Result?.map((item) => ({
        ...item,
        presentStatus: false,
      }));
      setAllData && setAllData(modifyRowData);
      setter(modifyRowData);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const manualAttendanceAction = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/Employee/ManualAttendance`,
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

export const getAttendanceAdjustmentFilter = async (
  setAllData,
  setter,
  setIsLoading,
  payload,
  cb
) => {
  setIsLoading(true);
  try {
    let res = await axios.post(
      `/Employee/AttendanceAdjustmentFilter`,
      payload
    );
    setIsLoading(false);
    const newList = res?.data?.Result?.map((item) => ({
      ...item,
      presentStatus: false,
    }));
    setAllData && setAllData(newList);
    setter(newList);
    cb && cb();
  } catch (err) {
    setIsLoading(false);
    setter("");
  }
};
