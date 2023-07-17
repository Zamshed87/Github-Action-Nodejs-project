import axios from "axios";
import { toast } from "react-toastify";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter(
      (item) =>
        regex.test(item?.strLeaveType?.toLowerCase()) ||
        regex.test(item?.strLeaveTypeCode?.toLowerCase())
    );
    setRowDto(newDta);
  } catch {
    setRowDto([]);
  }
};

export const createLeaveType = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/SaasMasterData/SaveLveLeaveType`, payload);
    cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const getLeaveTypeById = async (setter, id, setLoading) => {
  setLoading && setLoading(true);

  // let status = statusId ? `&intStatusId=${statusId}` : "";
  try {
    const res = await axios.get(`/SaasMasterData/GetLveLeaveTypeById?id=${id}
`);
    if (res?.data) {
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
