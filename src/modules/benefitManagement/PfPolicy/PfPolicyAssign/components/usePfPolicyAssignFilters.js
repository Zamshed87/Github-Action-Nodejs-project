import { useEffect } from "react";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";

const usePfPolicyAssignFilters = ({form}) => {
  const {
    profileData: { orgId, buId, wgId, wId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const employeeDDL = useApiRequest([]);
  const employmentTypeDDL = useApiRequest([]);

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
    const getEmploymentTypeDDL = () => {
    employmentTypeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmploymentType",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: wId,
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

  useEffect(() => {
    getEmploymentTypeDDL();
  }, [orgId, buId, wgId, wId]);

  return {
    employeeDDL,
    getEmployeeDDL,
    employmentTypeDDL,
    getEmploymentTypeDDL,
  };
};

export default usePfPolicyAssignFilters;
