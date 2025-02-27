import useAxiosGet from "utility/customHooks/useAxiosGet";

const useBarAssessmentLanding = ({ buId, wId, wgId }) => {
  const [data, getData, loading, setData] = useAxiosGet({});

  const getBarAssessmentLanding = ({
    year,
    assessmentPeriod,
    assessmentTime,
    pages,
    search = "",
  }) => {
    getData(
      `/PMS/BARAssessmentLanding?BusinessUnitId=${buId}&WorkplaceId=${wId}&WorkplaceGroupId=${wgId}&Year=${year}&AssesmentPeriod=${assessmentPeriod}&AssesmentTime=${assessmentTime}&PageNo=${pages?.current}&PageSize=${pages?.pageSize}&SearchText=${search}`,
      (res) => {
        setData(res);
      }
    );
  };

  return { data, getBarAssessmentLanding, loading };
};

export default useBarAssessmentLanding;
