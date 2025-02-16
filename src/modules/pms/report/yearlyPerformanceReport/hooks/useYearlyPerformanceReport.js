import useAxiosGet from "utility/customHooks/useAxiosGet";

const useYearlyPerformanceReport = ({ buId, wId, wgId }) => {
  const [reportData, getReportData, loading, setReportData] = useAxiosGet({});

  const fetchYearlyPerformanceReport = ({
    supervisorId,
    departmentId,
    designationId,
    year,
    pages,
    search="",
  }) => {
    getReportData(
      `/PMS/YearlyPerformanceReport?BusinessUnitId=${buId}&WorkplaceId=${wId}&WorkplaceGroupId=${wgId}&SupervisorId=${supervisorId}&DepartmentId=${departmentId}&DesignationId=${designationId}&Year=${year}&PageNo=${pages?.current}&PageSize=${pages?.pageSize}&SearchText=${search}`,
      (res) => {
        setReportData(res);
      }
    );
  };

  return { reportData, fetchYearlyPerformanceReport, loading };
};

export default useYearlyPerformanceReport;
