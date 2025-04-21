import { useEffect, useState } from "react";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";
import { getEnumData } from "common/api/commonApi";

const useBankSalaryReportFilters = () => {
  const {
    profileData: { orgId, buId, wgId, wId },
  } = useSelector((store) => store?.auth, shallowEqual);
  const workplaceGroupDDL = useApiRequest([]);
  const [reportType, setReportType] = useState([]);
  const [loadingReportType, setLoadingReportType] = useState(false);
  const getWorkplaceGroups = () => {
    workplaceGroupDDL?.action({
      urlKey: "WorkplaceGroupIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
  };

  useEffect(() => {
    getWorkplaceGroups();
    getEnumData("HRPositionDesignation", setReportType, setLoadingReportType);
  }, [orgId, buId, wgId, wId]);

  return {
    workplaceGroupDDL,
    reportTypeDDL: { data: reportType, loading: loadingReportType },
  };
};

export default useBankSalaryReportFilters;
