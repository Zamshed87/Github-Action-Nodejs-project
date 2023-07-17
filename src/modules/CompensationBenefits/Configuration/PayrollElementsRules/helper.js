import axios from "axios";
import { toast } from "react-toastify";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try{
  const regex = new RegExp(keywords?.toLowerCase());
  let newDta = allData?.filter((item) =>
    regex.test(item?.PayrollElementName?.toLowerCase())
  );
  setRowDto(newDta);
  }catch{
    setRowDto([]);
  }
};

export const createPayrollElements = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/SaasMasterData/CRUDPayrollManagement`,
      payload
    );
    cb && cb();
    toast.success(res.data?.message || " Create Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};
