import { useEffect } from "react";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const useYearlyPerformanceReportDetails = ({ employeeId, year }) => {
  const [details, getDetails, loading, setDetails] = useAxiosGet({});

  useEffect(() => {
    getDetails(
      `/PMS/YearlyPerformanceReport/Details?EmployeeId=${employeeId}&Year=${year}`,
      (res) => {
        setDetails(res);
      }
    );
  }, [employeeId, year]);

  return { details, loading };
};

export default useYearlyPerformanceReportDetails;
