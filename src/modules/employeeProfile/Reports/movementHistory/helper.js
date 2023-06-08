import axios from "axios";
import { toast } from "react-toastify";

export const getBuDetails = async (buId, setter, setLoading) => {
  try {
    const res = await axios.get(
      `/SaasMasterData/GetBusinessDetailsByBusinessUnitId?businessUnitId=${buId}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
  }
};
export const getMovementHistory = async (
  buId,
  orgId,
  wgId,
  deptId,
  desId,
  movementId,
  EmpId,
  fromDate,
  toDate,
  status,
  setter,
  setLoading,
  setAllData
) => {
  try {
    setLoading && setLoading(true);
    const res = await axios.get(
      `/Employee/AllEmployeeMovementReport?BusinessUnitId=${buId}&AccountId=${orgId}&WorkplaceGroupId=${wgId}&DeptId=${deptId}&DesigId=${desId}&MovementTypeId=${movementId}&EmployeeId=${EmpId}&FromDate=${fromDate}&ToDate=${toDate}&applicationStatus=${status}`
    );
    setLoading && setLoading(false);
    setter(res?.data);
    setAllData && setAllData(res?.data);
  } catch (error) {
    setLoading && setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};
