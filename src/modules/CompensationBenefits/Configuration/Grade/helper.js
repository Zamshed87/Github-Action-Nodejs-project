// /emp/MasterData/PeopleDeskAllLanding?TableName=PayrollGroup&AccountId=1&BusinessUnitId=18&intId=0

import axios from "axios";
import { toast } from "react-toastify";

export const getPayrollGradeAllLanding = async (tableName,buId, setter,setAllData, setLoading) => {
  setLoading(true);
  ///emp/MasterData/PeopleDeskAllLanding?TableName=PayscaleGrade&BusinessUnitId=18
  try {
    const res = await axios.get(`/MasterData/PeopleDeskAllLanding?TableName=${tableName}&BusinessUnitId=${buId}`);
    setAllData(res?.data);
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
