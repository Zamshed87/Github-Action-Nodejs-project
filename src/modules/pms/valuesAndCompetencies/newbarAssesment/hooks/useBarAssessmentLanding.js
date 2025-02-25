import useAxiosGet from "utility/customHooks/useAxiosGet";

const useBarAssessmentLanding = ({ buId, wId, wgId }) => {
  const [data, getData, loading, setData] = useAxiosGet({});

  const getBarAssessmentLanding = ({
    year,
    pages,
    search="",
  }) => {
    getData(
      `/pms/performanceAssessment/BARAssessment?BusinessUnitId=${buId}&WorkplaceId=${wId}&WorkplaceGroupId=${wgId}&Year=${year}&PageNo=${pages?.current}&PageSize=${pages?.pageSize}&SearchText=${search}`,
      (res) => {
        setData(res);
      }
    );
  };

  return { data, getBarAssessmentLanding, loading };
};

export default useBarAssessmentLanding;
