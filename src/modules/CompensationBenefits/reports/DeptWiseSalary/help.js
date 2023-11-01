import axios from "axios";

export const getDepartmentWiseSalary = async (
  busId,
  year,
  month,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/emp/TimeSheetReport/MonthlySalaryDepartmentWiseReportView?BusinessUnitId=${busId}&Year=${year}&Month=${month}&WorkplaceGroupId=0&DepartmentId=0&DesignationId=0`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
