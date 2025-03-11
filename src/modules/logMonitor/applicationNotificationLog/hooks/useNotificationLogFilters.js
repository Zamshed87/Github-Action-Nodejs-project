import { useEffect } from "react";
import { useApiRequest } from "Hooks";
import { debounce } from "lodash";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { orgIdsForBn } from "utility/orgForBanglaField";
import { shallowEqual, useSelector } from "react-redux";

const useNotificationLogFilters = () => {
  const {
      profileData: { orgId, buId, wgId, wId, employeeId},
    } = useSelector((store) => store?.auth, shallowEqual);
  const supervisorDDL = useApiRequest([]);
  const departmentDDL = useApiRequest([]);
  const designationDDL = useApiRequest([]);
  const [fiscalYearDDL, getFiscalYearDDL] = useAxiosGet();
  const [levelOfLeadershipDDL, getLevelOfLeadershipDDL, , setLevelOfLeadershipDDL] = useAxiosGet();

  const getSuperVisors = debounce((value) => {
    if (value?.length < 2) return supervisorDDL.reset();
    supervisorDDL.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmployeeBasicInfoForEmpMgmt",
        AccountId: orgId,
        BusinessUnitId: buId,
        intId: employeeId,
        workplaceGroupId: wgId,
        strWorkplaceIdList: wId,
        searchTxt: value || "",
      },
      onSuccess: (res) => {
        res.forEach((item) => {
          item.label = item.EmployeeOnlyName;
          item.value = item.EmployeeId;
        });
      },
    });
  }, 500);

  const getDepartments = () => {
    departmentDDL.action({
      urlKey: "DepartmentIdAll",
      method: "GET",
      params: { businessUnitId: buId, workplaceGroupId: wgId, workplaceId: wId, accountId: orgId },
      onSuccess: (res) => {
        res.forEach((item) => {
          item.label = orgIdsForBn.includes(orgId) ? item.strDepartmentBn : item.strDepartment;
          item.value = item.intDepartmentId;
        });
      },
    });
  };

  const getDesignations = () => {
    designationDDL.action({
      urlKey: "DesignationIdAll",
      method: "GET",
      params: { accountId: orgId, businessUnitId: buId, workplaceGroupId: wgId, workplaceId: wId },
      onSuccess: (res) => {
        res.forEach((item) => {
          item.label = orgIdsForBn.includes(orgId) ? item.designationBn : item.designationName;
          item.value = item.designationId;
        });
      },
    });
  };

  useEffect(() => {
    getDepartments();
    getDesignations();
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`);

      getLevelOfLeadershipDDL(
        `/SaasMasterData/GetAllMasterPosition?accountId=${orgId}`,
        (data) => {
          setLevelOfLeadershipDDL(data.map((d) => ({ value: d.intPositionGroupId, label: d.strPositionGroupName })));
        }
      );
  }, [orgId, buId, wgId, wId]);

  return {
    supervisorDDL,
    getSuperVisors,
    departmentDDL,
    designationDDL,
    yearDDL: fiscalYearDDL,
    levelOfLeadershipDDL,
  };
};

export default useNotificationLogFilters;
