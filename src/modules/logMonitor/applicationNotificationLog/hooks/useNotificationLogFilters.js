import { useEffect } from "react";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";

const useNotificationLogFilters = ({ form }) => {
  const {
    profileData: { orgId, buId, wgId, wId, employeeId },
    businessUnitDDL,
    workplaceDDL,
  } = useSelector((store) => store?.auth, shallowEqual);

  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);

  const getWorkplaceGroupDDL = () => {
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
  const getWorkplaceDDL = () => {
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
    getWorkplaceGroupDDL();
    getWorkplaceDDL();
  }, [orgId, buId, wgId, wId]);

  return {
    businessUnitDDL: businessUnitDDL?.map((bu) => ({
      label: bu.BusinessUnitName,
      value: bu.BusinessUnitId,
    })),
    workplaceGroupDDL: workplaceGroup.data,
    getWorkplaceGroupDDL,
    workplaceDDL: [{ label: "All", value: workplace?.data?.map((w) => w?.intWorkplaceId)?.join(",")}, ...workplace.data],
    getWorkplaceDDL,
  };
};

export default useNotificationLogFilters;
