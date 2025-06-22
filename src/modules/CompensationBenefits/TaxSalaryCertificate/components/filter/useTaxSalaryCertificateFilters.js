import { useEffect } from "react";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";

const useTaxSalaryCertificateFilters = () => {
  const {
    profileData: { orgId, buId, wgId, wId, employeeId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const workplaceDDL = useApiRequest([]);
  const fiscalYearDDL = useApiRequest({});

  const getWorkplaceDDL = () => {
    workplaceDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        intId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };

  useEffect(() => {
    getWorkplaceDDL();
    fiscalYearDDL.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "fiscalYearDDL",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
      },
    });
  }, [orgId, buId, wgId, wId]);

  return {
    workplaceDDL,
    fiscalYearDDL
  };
};

export default useTaxSalaryCertificateFilters;
