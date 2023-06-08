import { toast } from "react-toastify";
import axios from "axios";

export const createTimeSheetAction = async (payload, setLoading, cb) => {
  try {
    setLoading(true);
    const res = await axios.post(
      `/TimeSheet/TimeSheetCRUD`,
      payload
    );
    cb(res?.data?.autoId, res?.data?.autoName);
    toast.success(res.data?.message || "Successful");
    setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading(false);
  }
};
// search
export const filterData = (keywords, gridData, setRowDto) => {
  const regex = new RegExp(keywords?.toLowerCase());
  let newData = gridData?.filter((item) =>
    regex.test(item?.strEmployeeName?.toLowerCase())
  );
  setRowDto(newData);
};
