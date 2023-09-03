import axios from "axios";
import { toast } from "react-toastify";

// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = allData?.filter((item) =>
      regex.test(item?.strPayrollGroup?.toLowerCase())
    );
    setRowDto(newDta);
  } catch (e) {
    setRowDto([]);
  }
};

export const getSalaryGenerateRequestReport = async (
  buId,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/emp/PayrollManagement/GetSalaryGenerateRequestReport?BusinessUnitId=${buId}`
    );
    if (res?.data) {
      setAllData && setAllData(res?.data);
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const createSalaryGenerateRequest = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/emp/PayrollManagement/SalaryGenerateRequest`,
      payload
    );
    cb();
    toast.success(res.data?.message || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong!");
    setLoading && setLoading(false);
  }
};
