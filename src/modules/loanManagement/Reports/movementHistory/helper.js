import axios from "axios";
import { toast } from "react-toastify";

export const getMovementHistory = async (buId, workplaceGroupId, deptId, desId, movementId, EmpId, fromDate, toDate, status, setter, setLoading, setAllData) => {
  try {
    setLoading && setLoading(true)
    const res = await axios.get(
      `/Employee/AllEmployeeMovementReport?BusinessUnitId=${buId}&WorkplaceGroupId=${workplaceGroupId}&DeptId=${deptId}&DesigId=${desId}&MovementTypeId=${movementId}&EmployeeId=${EmpId}&FromDate=${fromDate}&ToDate=${toDate}&applicationStatus=${status}`
    );
    setLoading && setLoading(false)
    setter(res?.data);
    setAllData && setAllData(res?.data)
  } catch (error) {
    setLoading && setLoading(false)
    toast.error(error?.response?.data?.message);
  }
};
