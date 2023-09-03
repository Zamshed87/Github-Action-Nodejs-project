import axios from "axios";
import { toast } from "react-toastify";

export const getPayrollFrequencyAllLanding = async (tableName,buId, setter, setLoading) => {
  setLoading(true);
  ///emp/MasterData/PeopleDeskAllLanding?TableName=PayscaleGrade&BusinessUnitId=18
  try {
    const res = await axios.get(`/Employee/PeopleDeskAllLanding?TableName=${tableName}&BusinessUnitId=${buId}`);
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
