import { useEffect } from "react";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";
import { orgIdsForBn } from "utility/orgForBanglaField";

const usePfPolicyAssignFilters = () => {
  const {
    profileData: { orgId, buId, wgId, wId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const departmentDDL = useApiRequest([]);
  const employeeDDL = useApiRequest([]);

  const getDepartmentDDL = () => {
    departmentDDL.action({
      urlKey: "DepartmentIdAll",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,
        accountId: orgId,
      },
      onSuccess: (res) => {
        res.forEach((item) => {
          item.label = orgIdsForBn.includes(orgId)
            ? item.strDepartmentBn
            : item.strDepartment;
          item.value = item.intDepartmentId;
        });
      },
    });
  };

  const getEmployeeDDL = (value='') => {
    employeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
          res[i].employeeCode = item?.employeeCode;
        });
      },
    });
  };

  useEffect(() => {
    getDepartmentDDL();
    // getEmployeeDDL();
  }, [orgId, buId, wgId, wId]);

  return {
    departmentDDL,
    employeeDDL,
    getEmployeeDDL,
  };
};

export default usePfPolicyAssignFilters;
