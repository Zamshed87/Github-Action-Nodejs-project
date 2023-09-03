import axios from "axios";
import { toast } from "react-toastify";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter(
      (item) =>
        regex.test(item?.strName?.toLowerCase()) ||
        regex.test(item?.strDisplayName?.toLowerCase())
    );
    setRowDto(newDta);
  } catch {
    setRowDto([]);
  }
};

export const createDashboardComponent = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/SaasMasterData/DashboardComponent`, payload);
    cb && cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const getComponentById = async ({ id, setter }) => {
  try {
    const res = await axios.get(
      `/SaasMasterData/DashboardComponentById?id=${id}`
    );
    if (res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
