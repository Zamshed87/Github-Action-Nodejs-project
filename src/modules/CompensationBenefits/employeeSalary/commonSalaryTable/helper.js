import axios from "axios";

export const getGenerateSalaryLandingAndFilter = async (buId, monthId, yearId, workGroupId, depId, desId, supId, empTypId, empId, setter,setAllData, setLoading) => {
  setLoading && setLoading(true);

  try {
    const res = await axios.get(
      `emp/PayrollReport/GetSalaryDetailsReport?ReportType=Details%20Report&MonthId=${monthId}&YearId=${yearId}&BusinessUnitId=${buId}&WorkplaceGroupId=${workGroupId}&DepartentId=${depId}&DesignationId=${desId}&SupervisorId=${supId}&EmploymentTypeId=${empTypId}&EmployeeId=${empId}`
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
