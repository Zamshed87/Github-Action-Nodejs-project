import axios from "axios";
import { toast } from "react-toastify";

export const updateLoanReschedule = async (data, setLoading, cb) => {
  try {
    setLoading(true);
    const res = await axios.post(`/Employee/LoanReSchedule`, data);
    setLoading(false);
    toast.success(res?.data?.message || "Successful");
    cb();
  } catch (e) {
    setLoading(false);
    toast.warn(e?.response?.data?.message || "Failed, try again");
  }
};
export const getLoanRescheduleFilter = async (tableName,accId,buId,id,statusId,data, setter,setAllData, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/MasterData/PeopleDeskAllLanding?TableName=${tableName}&AccountId=${accId}&BusinessUnitId=${buId}&intId=${id}&intStatusId=${statusId}&FromDate=${data.fromDate}&ToDate=${data.toDate}&LoanTypeId=${data.loanTypeId}&DeptId=${data.depId}&DesigId=${data.desId}&EmpId=${data.empId}&MinimumAmount=${data.minimumAmount}&MaximumAmount=${data.maximumAmount}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};