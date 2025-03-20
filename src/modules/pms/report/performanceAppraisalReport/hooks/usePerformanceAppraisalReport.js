import useAxiosGet from "utility/customHooks/useAxiosGet";

const usePerformanceAppraisalReport = ({ buId, wId, wgId }) => {
  const [reportData, getReportData, loading, setReportData] = useAxiosGet({});

  const fetchPerformanceAppraisalReport = ({
    supervisorId,
    departmentId,
    designationId,
    year,
    levelOfLeadershipId,
    pages,
    search="",
  }) => {
    getReportData(
      `/PMS/PerformanceAppraisalReport?BusinessUnitId=${buId}&WorkplaceId=${wId}&WorkplaceGroupId=${wgId}&SupervisorId=${supervisorId}&DepartmentId=${departmentId}&DesignationId=${designationId}&Year=${year}&LevelOfLeadershipId=${levelOfLeadershipId}&PageNo=${pages?.current}&PageSize=${pages?.pageSize}&SearchText=${search}`,
      (res) => {
        setReportData(res);
      }
    );
  };

  return { reportData, fetchPerformanceAppraisalReport, loading };
};

export default usePerformanceAppraisalReport;
