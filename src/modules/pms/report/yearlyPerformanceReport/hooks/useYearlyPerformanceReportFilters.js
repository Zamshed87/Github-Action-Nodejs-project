import { useEffect } from "react";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const useYearlyPerformanceReportFilters = ({
  orgId,
}) => {
  const [levelOfLeaderShipDDL, getLevelOfLeaderShipDDL, , setLevelOfLeaderShipDDL] = useAxiosGet();

  useEffect(() => {
    getLevelOfLeaderShipDDL(
      `/SaasMasterData/GetAllMasterPosition?accountId=${orgId}`,
      (data) => {
        setLevelOfLeaderShipDDL(data?.map(d => ({value:d.intPositionGroupId,label:d.strPositionGroupName})));
      }
    );
  },[orgId])

  return {
    levelOfLeaderShipDDL,
  };
};

export default useYearlyPerformanceReportFilters;
