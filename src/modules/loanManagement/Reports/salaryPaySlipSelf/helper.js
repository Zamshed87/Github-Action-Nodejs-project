import axios from "axios";
import { toast } from "react-toastify";

export const salaryDetailsPayslipPrint = async (
  empId,
  monthId,
  yearId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/emp/PayrollReport/GetPayslip?EmployeeId=${empId}&MonthId=${monthId}&YearId=${yearId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getSalaryDetailsAction = async (
  buId,
  year,
  month,
  workplaceGroupId,
  departmentId,
  designationId,
  empId,
  setLoading,
  setter,
  setAllData,
  cb
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/Employee/MonthlySalaryReportView?BusinessUnitId=${buId}&Year=${year}&Month=${month}&WorkplaceGroupId=${workplaceGroupId}&DepartmentId=${departmentId}&DesignationId=${designationId}&EmployeeId=${empId}`
    );
    setLoading(false);
    setter(res?.data);
    setAllData(res?.data);
    cb && cb()
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
