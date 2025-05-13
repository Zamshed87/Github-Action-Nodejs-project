import { useEffect } from "react";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";

const useConfigSelectionHook = (form) => {
  const {
    profileData: { orgId, buId, wgId, wId, employeeId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const workplaceDDL = useApiRequest([]);
  const employmentTypeDDL = useApiRequest([]);
  const empDesignationDDL = useApiRequest([]);

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
  const getEmploymentTypeDDL = () => {
    const { workplaceGroup, workplace } = form?.getFieldsValue(true) || {};

    employmentTypeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmploymentType",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: workplace?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.EmploymentType;
          res[i].value = item?.Id;
        });
      },
    });
  };
  const getEmployeeDesignation = () => {
    const { workplace } = form.getFieldsValue(true);
    empDesignationDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDesignation",
        AccountId: orgId,
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: workplace?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.DesignationName;
          res[i].value = item?.DesignationId;
        });
      },
    });
  };
  useEffect(() => {
    getWorkplaceDDL();
  }, [orgId, buId, wgId, wId]);

  return {
    workplaceDDL,
    getWorkplaceDDL,
    employmentTypeDDL,
    getEmploymentTypeDDL,
    empDesignationDDL,
    getEmployeeDesignation,
  };
};

export default useConfigSelectionHook;
