import { useEffect, useState } from "react";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";
import { getEnumData } from "common/api/commonApi";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { orgIdsForBn } from "utility/orgForBanglaField";
import { yearDDLAction } from "utility/yearDDL";

const useYearlySalaryReportFilters = (form) => {
  const {
    profileData: { orgId, buId, wgId, wId, employeeId, intAccountId },
  } = useSelector((store) => store?.auth, shallowEqual);

  const workplaceDDL = useApiRequest([]);
  const workplaceGroupDDL = useApiRequest([]);
  const departmentDDL = useApiRequest([]);
  const sectionDDL = useApiRequest([]);
  const hrPositionDDL = useApiRequest([]);
  const designationDDL = useApiRequest([]);
  const [fiscalYearDDL, getFiscalYearDDL, loadingFiscalYear] = useAxiosGet();
  const [yearTypeDDL, setYearType] = useState([]);
  const [loadingYearType, setLoadingYearType] = useState(false);
  const [reportType, setReportType] = useState([]);
  const [loadingReportType, setLoadingReportType] = useState(false);

  const getWorkplaceGroupsDDL = () => {
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

  const getWorkplaceDDL = () => {
    const { workplaceGroup } = form?.getFieldsValue(true) || {};
    workplaceDDL?.action({
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
  const getDepartmentDDL = () => {
    const { workplaceGroup, workplace } = form?.getFieldsValue(true) || {};
    departmentDDL.action({
      urlKey: "DepartmentIdAll",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value || wgId,
        workplaceId: workplace?.value || wId,
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
  const getSectionDDL = () => {
    const { workplaceGroup, workplace, department } =
      form?.getFieldsValue(true) || {};

    sectionDDL?.action({
      urlKey: "SectionIdAll",
      method: "GET",
      params: {
        accountId: intAccountId,
        businessUnitId: buId,
        departmentId: department?.value || 0,
        workplaceGroupId: workplaceGroup?.value || wgId,
        workplaceId: workplace?.value || wId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label =
            orgIdsForBn.includes(orgId) && item?.strSectionNameBn
              ? `${item?.strSectionName} (${item?.strSectionNameBn})`
              : item?.strSectionName;
          res[i].value = item?.intSectionId;
        });
      },
    });
  };

  const getHrPositionDDL = () => {
    const { workplaceGroup, workplace } = form?.getFieldsValue(true) || {};

    hrPositionDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Position",
        BusinessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value || wgId,
        workplaceId: workplace?.value || wId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.PositionName;
          res[i].value = item?.PositionId;
        });
      },
    });
  };
  const getDesignationDDL = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

    designationDDL?.action({
      urlKey: "DesignationIdAll",
      method: "GET",
      params: {
        accountId: intAccountId,
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value || wgId,
        workplaceId: workplace?.value || wId,
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
    getFiscalYearDDL(`/PMS/GetFiscalYearDDL`);
    getWorkplaceGroupsDDL();
    getDepartmentDDL();
    getEnumData("HRPositionDesignation", setReportType, setLoadingReportType);
    getEnumData("YearType", setYearType, setLoadingYearType);
  }, [orgId, buId, wgId, wId]);

  return {
    yearTypeDDL,
    loadingYearType,
    fiscalYearDDL,
    loadingFiscalYear,
    yearDDL: { data: yearDDLAction(2, 10) },
    reportTypeDDL: { data: reportType, loading: loadingReportType },
    workplaceGroupDDL,
    workplaceDDL,
    getWorkplaceDDL,
    departmentDDL,
    getDepartmentDDL,
    sectionDDL,
    getSectionDDL,
    hrPositionDDL,
    getHrPositionDDL,
    designationDDL,
    getDesignationDDL,
  };
};

export default useYearlySalaryReportFilters;
