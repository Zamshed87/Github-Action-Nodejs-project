import axios from "axios";
import { toast } from "react-toastify";

export const createTimeSheetAction = async (payload, setLoading, cb) => {
  try {
    setLoading(true);
    const res = await axios.post(`/TimeSheet/TimeSheetCRUD`, payload);
    cb(res?.data?.autoId, res?.data?.autoName);
    toast.success(res.data?.message || "Successful");
    setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading(false);
  }
};

export const createTimeSheetActionForCalender = async (
  payload,
  setLoading,
  cb
) => {
  try {
    setLoading(true);
    const res = await axios.post(`/TimeSheet/TimeSheetCalender`, payload);
    cb(res?.data?.autoId, res?.data?.autoName);
    toast.success(res.data?.message || "Successful");
    setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading(false);
  }
};

export const getPeopleDeskAllLandingForCalender = async (
  wId,
  busId,
  setter,
  setAllData,
  setLoading,
  pageNo,
  pageSize,
  search
) => {
  setLoading && setLoading(true);

  const Search = search ? `&searchTxt=${search}` : "";
  try {
    const res = await axios.get(
      `/TimeSheet/GetCalenderLanding?IntBusinessUnitId=${busId}&PageNo=${pageNo}&PageSize=${pageSize}&IntWorkplaceId=${wId}${Search}`
    );
    if (res?.data?.data) {
      setter && setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

// search
export const filterData = (keywords, gridData, setRowDto) => {
  const regex = new RegExp(keywords?.toLowerCase());
  const newData = gridData?.filter((item) =>
    regex.test(item?.strEmployeeName?.toLowerCase())
  );
  setRowDto(newData);
};
