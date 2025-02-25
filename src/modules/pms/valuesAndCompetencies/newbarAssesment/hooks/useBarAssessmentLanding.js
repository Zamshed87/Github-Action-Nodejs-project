import useAxiosGet from "utility/customHooks/useAxiosGet";

const useBarAssessmentLanding = ({ buId, wId, wgId }) => {
  const [data, getData, loading, setData] = useAxiosGet({});

  const getBarAssessmentLanding = ({
    supervisorId,
    departmentId,
    designationId,
    year,
    pages,
    search="",
  }) => {
    getData(
      `/PMS/KPITargetMismatchReport?BusinessUnitId=${buId}&WorkplaceId=${wId}&WorkplaceGroupId=${wgId}&SupervisorId=${supervisorId}&DepartmentId=${departmentId}&DesignationId=${designationId}&Year=${year}&PageNo=${pages?.current}&PageSize=${pages?.pageSize}&SearchText=${search}`,
      (res) => {
        setData(res);
      }
    );
  };

  return { data, getBarAssessmentLanding, loading };
};

export default useBarAssessmentLanding;
