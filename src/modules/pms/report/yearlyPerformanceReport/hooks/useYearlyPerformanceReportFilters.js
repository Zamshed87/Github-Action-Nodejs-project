import { useEffect } from "react";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const useYearlyPerformanceReportFilters = ({
  orgId,
}) => {
  const [levelOfLeaderShipDDL, getLevelOfLeaderShipDDL] = useAxiosGet();

  useEffect(() => {
    getLevelOfLeaderShipDDL(
      `/SaasMasterData/GetAllMasterPosition?accountId=${orgId}`
    );
  },[orgId])

  return {
    levelOfLeaderShipDDL,
  };
};

export default useYearlyPerformanceReportFilters;
