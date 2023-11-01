import axios from "axios";
import { toast } from "react-toastify";

// weekday ddl 
export const weekdayDDL = [
  {value: 1, label: "Sunday"},
  {value: 2, label: "Monday"},
  {value: 3, label: "Tuesday"},
  {value: 4, label: "Wednesday"},
  {value: 5, label: "Thursday"},
  {value: 6, label: "Friday"},
  {value: 7, label: "Saturday"},
];

// create extraside
export const createExtraSide = async (payload, setLoading, cb) => {
  try {
    setLoading(true);
    const res = await axios.post(`/Employee/CreateExtraSideDuty`, payload);
    // cb(res?.data?.autoId, res?.data?.autoName);
    setLoading(false);
    cb && cb();
    toast.success(res.data?.message || "Successful");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading(false);
  }
};
export const extraSideLandingView = async (tableName, buId,date,intId,accId, setter, setLoading) => {
  try {
    setLoading(true);
    // /emp/MasterData/PeopleDeskAllLanding?TableName=ExtraSideDutyList&BusinessUnitId=0
    const res = await axios.get(`/Employee/PeopleDeskAllLanding?TableName=${tableName}&BusinessUnitId=${buId}&intId=${intId}&FromDate=${date?.fromDate}&ToDate=${date?.toDate}`);
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading(false);
  }
};