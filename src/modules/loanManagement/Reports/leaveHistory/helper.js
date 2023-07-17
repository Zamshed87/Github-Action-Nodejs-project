import axios from "axios";

export const getLeaveHistoryAction = async (
  setAllData,
  buId,
  yearId,
  setLoading,
  setter,
  workplaceGroupId,
  departmentId,
  designationId,
  empId
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/Employee/LeaveBalanceHistoryForAllEmployee?BusinessUnitId=${buId}&yearId=${yearId}&WorkplaceGroupId=${
        workplaceGroupId || 0
      }&DeptId=${departmentId || 0}&DesigId=${designationId || 0}&EmployeeId=${
        empId || 0
      }`
    );
    setLoading(false);
    setter(res?.data);
    setAllData(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
    setAllData([]);
  }
};
