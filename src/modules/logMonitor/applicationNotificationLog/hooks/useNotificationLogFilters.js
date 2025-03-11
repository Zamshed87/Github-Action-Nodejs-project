import { useEffect } from "react";
import { useApiRequest } from "Hooks";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";

const useNotificationLogFilters = ({ form }) => {
  const {
    profileData: { orgId, buId, wgId, wId, employeeId },
  } = useSelector((store) => store?.auth, shallowEqual);
  const workplaceGroup = useApiRequest([]);
  const workplace = useApiRequest([]);

  const [
    levelOfLeadershipDDL,
    getLevelOfLeadershipDDL,
    ,
    setLevelOfLeadershipDDL,
  ] = useAxiosGet();

  const getWorkplaceGroup = () => {
    workplaceGroup?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "WorkplaceGroup",
        BusinessUnitId: buId,
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
        WorkplaceGroupId: workplaceGroup?.value,
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
    getLevelOfLeadershipDDL(
      `/SaasMasterData/GetAllMasterPosition?accountId=${orgId}`,
      (data) => {
        setLevelOfLeadershipDDL(
          data.map((d) => ({
            value: d.intPositionGroupId,
            label: d.strPositionGroupName,
          }))
        );
      }
    );
  }, [orgId, buId, wgId, wId]);

  return {
    workplaceGroup,
    workplace,
    getWorkplace,
    levelOfLeadershipDDL,
  };
};

export default useNotificationLogFilters;
