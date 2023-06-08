// /emp/MasterData/PeopleDeskAllLanding?TableName=PayrollGroup&AccountId=1&BusinessUnitId=18&intId=0

import axios from "axios";
import { toast } from "react-toastify";

export const getPayrollGroupAllLanding = async (tableName, orgId, buId, id, setter,setAllData, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(`/Employee/PeopleDeskAllLanding?TableName=${tableName}&AccountId=${orgId}&BusinessUnitId=${buId}&intId=${id}`);
    setAllData(res?.data);
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
