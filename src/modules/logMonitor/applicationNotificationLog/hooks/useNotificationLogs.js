import useAxiosGet from "utility/customHooks/useAxiosGet";

const useNotificationLogs = ({ buId, wId, wgId }) => {
  const [reportData, getReportData, loading, setReportData] = useAxiosGet({});

  const fetchNotificationLogs = ({
    supervisorId,
    departmentId,
    designationId,
    year,
    pages,
    search="",
  }) => {
    getReportData(
      `/PMS/KPITargetMismatchReport?BusinessUnitId=${buId}&WorkplaceId=${wId}&WorkplaceGroupId=${wgId}&SupervisorId=${supervisorId}&DepartmentId=${departmentId}&DesignationId=${designationId}&Year=${year}&PageNo=${pages?.current}&PageSize=${pages?.pageSize}&SearchText=${search}`,
      (res) => {
        setReportData(res);
      }
    );
  };

  return { reportData, fetchNotificationLogs, loading };
};

export default useNotificationLogs;
