import { useEffect } from "react";
import { useApiRequest } from "Hooks";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";

const useNotificationLogFilters = ({ form }) => {
  const {
    profileData: { orgId, buId, wgId, wId, employeeId },
    businessUnitDDL
  } = useSelector((store) => store?.auth, shallowEqual);
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);

  const getWorkplaceGroup = () => {
    const { businessUnit } = form.getFieldsValue(true);
    workplaceGroup?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "WorkplaceGroup",
        BusinessUnitId: businessUnit?.value || buId,
        WorkplaceGroupId: wgId,
        intId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
  };
  const getWorkplace = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    workplace?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value || wgId,
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
    getWorkplaceGroup();
    getWorkplace();
  }, [orgId, buId, wgId, wId]);

  return {
    businessUnitDDL,
    workplaceGroup,
    getWorkplaceGroup,
    workplace,
    getWorkplace,
  };
};

export default useNotificationLogFilters;
