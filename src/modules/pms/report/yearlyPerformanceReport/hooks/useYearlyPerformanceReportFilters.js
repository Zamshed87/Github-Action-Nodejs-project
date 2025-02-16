import { useApiRequest } from "Hooks";
import { debounce } from "lodash";
import { useEffect } from "react";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { orgIdsForBn } from "utility/orgForBanglaField";

const useYearlyPerformanceReportFilters = ({
  orgId,
  buId,
  wgId,
  wId,
  employeeId,
}) => {
  const supervisorDDL = useApiRequest([]);
  const departmentDDL = useApiRequest([]);
  const designationDDL = useApiRequest([]);
  const [fiscalYearDDL, getFiscalYearDDL] = useAxiosGet();

  const getSuperVisors = debounce((value) => {
    if (value?.length < 2) return supervisorDDL?.reset();
    supervisorDDL?.action({
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
        res.forEach((item, i) => {
          res[i].label = item?.EmployeeOnlyName;
          res[i].value = item?.EmployeeId;
        });
      },
    });
  }, 500);
  const getDepartments = () => {
    departmentDDL?.action({
      urlKey: "DepartmentIdAll",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,

        accountId: orgId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = orgIdsForBn.includes(orgId)
            ? item?.strDepartmentBn
            : item?.strDepartment;
          res[i].value = item?.intDepartmentId;
        });
      },
    });
  };

  const getDesignations = () => {
    designationDDL?.action({
      urlKey: "DesignationIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
        workplaceId: wId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = orgIdsForBn.includes(orgId)
            ? item?.designationBn
            : item?.designationName;
          res[i].value = item?.designationId;
        });
      },
    });
  };
  useEffect(() => {
    getDepartments();
    getDesignations();
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`);
  }, []);

  return {
    supervisorDDL,
    getSuperVisors,
    departmentDDL,
    designationDDL,
    yearDDL: fiscalYearDDL,
  };
};

export default useYearlyPerformanceReportFilters;
