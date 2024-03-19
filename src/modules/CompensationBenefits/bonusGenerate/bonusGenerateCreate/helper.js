import { toast } from "react-toastify";
import { dateFormatterForInput } from "../../../../utility/dateFormatter";
import { createBonusGenerateRequest } from "../helper";

export const getEmployeeListForBonusGenerateOrRegenerate = (
  orgId,
  employeeList,
  getEmployeeList,
  setEmployeeList,
  setRowDto,
  values,
  isEdit,
  location,
  buId,
  wgId,
  wing = 0,
  soleDepo = 0,
  region = 0,
  area = 0,
  territory = 0
) => {
  // DDL
  let wingParams = wing ? `&WingId=${wing}` : "";
  let soleDepoParams = soleDepo ? `&SoleDepoId=${soleDepo}` : "";
  let regionParams = region ? `&RegionId=${region}` : "";
  let areaParams = area ? `&AreaId=${area}` : "";
  let territoryParams = territory ? `&TerritoryId=${territory}` : "";

  let wgIdList = 0;
  wgIdList = values?.workplace?.map((item) => item?.value).join(",");

  getEmployeeList(
    `/Employee/EligbleEmployeeForBonusGenerateLanding?StrPartName=${
      values?.bonusSystemType?.value === 1
        ? "EligbleEmployeeListForBonusGenerate"
        : "EligbleEmployeeListForArearBonusGenerate"
    }&IntAccountId=${orgId}&IntBusinessUnitId=${buId}&IntBonusHeaderId=${
      isEdit ? location?.state?.bonusObj?.intBonusHeaderId : 0
    }&IntBonusId=${values?.bonusName?.value}&DteEffectedDate=${
      values?.effectiveDate
    }&IntCreatedBy=0&WorkplaceGroupId=${wgId}${wingParams}${soleDepoParams}${regionParams}${areaParams}${territoryParams}&workplaceListId=${wgIdList}`,
    (res) => {
      const modifiedEmployeeList = [];

      res.forEach((item) => {
        modifiedEmployeeList.push({
          ...item,
          isChecked: false,
          strDepartmentSection: item?.strDepartmentSection || "",
        });
      });

      if (isEdit) {
        setEmployeeList((prev) => [...prev, ...modifiedEmployeeList]);
        setRowDto((prev) => [...prev, ...modifiedEmployeeList]);
      } else {
        setEmployeeList(modifiedEmployeeList);
        setRowDto(modifiedEmployeeList);
      }
    }
  );
};

export const getBonusInformationOnRegenerate = (
  setIsEdit,
  location,
  getBonusInformation,
  values,
  setValues,
  setEmployeeList,
  setRowDto,
  setSingleData
) => {
  setIsEdit(true);
  const data = location?.state?.bonusObj;

  const payloadForHeader = {
    strPartName: "ExistingBonusGenerateHeader",
    intBonusHeaderId: data?.intBonusHeaderId,
    intAccountId: data?.intAccountId,
    intBusinessUnitId: data?.intBusinessUnitId,
    intBonusId: data?.intBonusId,
    intPayrollGroupId: 0,
    intWorkplaceGroupId: 0,
    intWorkplaceId: 0,
    intReligionId: 0,
    dteEffectedDate: data?.dteEffectedDateTime,
    intCreatedBy: 0,
  };
  const payloadForRow = {
    ...payloadForHeader,
    strPartName: "ExistingBonusGenerateRow",
  };
  getBonusInformation(`/Employee/BonusAllLanding`, payloadForHeader, (res) => {
    setSingleData(res[0]);
    setValues({
      ...values,
      bonusSystemType: res[0]?.isArrearBonus
        ? { value: 2, label: "Arrear Bonus Generator" }
        : { value: 1, label: "Bonus Generator" },
      bonusName: {
        value: res[0]?.intBonusId,
        label: res[0]?.strBonusName,
      },
      businessUnit: {
        value: data?.intBusinessUnitId,
        label: data?.strBusinessUnit,
      },
      wing: {
        value: res?.[0]?.intWingId,
        label: res?.[0]?.WingName,
      },
      soleDepo: {
        value: res?.[0]?.intSoleDepoId,
        label: res?.[0]?.SoleDepoName,
      },
      region: {
        value: res?.[0]?.intRegionId,
        label: res?.[0]?.RegionName,
      },
      area: {
        value: res?.[0]?.intAreaId,
        label: res?.[0]?.AreaName,
      },
      territory: {
        value: res?.[0]?.intTerritoryId,
        label: res?.[0]?.TerritoryName,
      },

      effectiveDate: dateFormatterForInput(data?.dteEffectedDateTime),
    });
  });
  getBonusInformation(
    `/Employee/BonusAllLanding`,
    payloadForRow,
    (response) => {
      const modifiedEmployeeList = response.map((item) => ({
        ...item,
        isChecked: true,
        strEmploymentType: item?.strEmploymentTypeName || "",
        strDesignation: item?.strDesignationName || "",
        strPayrollGroup: item?.strPayrollGroupName || "",
        strDepartment: item?.strDepartment || item?.strDepartmentName || "",
        strDepartmentSection: item?.strDepartmentSection || "",
        strWorkplaceGroup: item?.strWorkPlaceGroupName || "",
        strWorkplace: item?.strWorkPlaceName || "",
      }));
      setEmployeeList(modifiedEmployeeList);
      setRowDto(modifiedEmployeeList);
    }
  );
};

export const onGenerateOrReGenerateBonus = (
  rowDto,
  location,
  values,
  isEdit,
  orgId,
  buId,
  employeeId,
  resetForm,
  setIsEdit,
  setEmployeeList,
  setRowDto,
  setLoading,
  initialValues,
  history,
  wgId
) => {
  const employeeNotSelected = rowDto?.every((item) => !item?.isChecked);

  if (employeeNotSelected) {
    return toast.warn("Please select employee for generate bonus!");
  }

  const bonusObj = location?.state?.bonusObj;

  let selectedEmployeeForBonus = [];

  rowDto.forEach((item) => {
    if (item?.isChecked) {
      selectedEmployeeForBonus.push({
        intRowId: item?.intRowId || 0,
        intBonusHeaderId: item?.intBonusHeaderId || 0,
        intEmployeeId: item?.intEmployeeId,
        strEmployeeCode: item?.strEmployeeCode,
        strEmployeeName: item?.strEmployeeName,
        intEmploymentTypeId: item?.intEmploymentTypeId,
        strEmploymentTypeName:
          item?.strEmploymentType || item?.strEmploymentTypeName,
        intDesignationId: item?.intDesignationId,
        strDesignationName: item?.strDesignation || item?.strDesignationName,
        intReligionId: item?.intReligionId,
        strReligionName: item?.strReligion || item?.strReligionName,
        intWorkPlaceGroupId: item?.intWorkplaceGroupId,
        strWorkPlaceGroupName:
          item?.strWorkplaceGroup || item?.strWorkPlaceGroupName,
        intWorkPlaceId: item?.intWorkplaceId,
        strWorkPlaceName: item?.strWorkplace || item?.strWorkPlaceName,
        intPayrollGroupId: item?.intPayrollGroupId,
        strPayrollGroupName:
          item?.strPayrollGroup || item?.strWorkPlaceGroupName,
        dteJoiningDate: item?.dteJoiningDate,
        strServiceLength: "",
        numSalary: 0,
        numBasic: 0,
        numBonusAmount: 0,
        intCreatedBy: employeeId,
      });
    }
  });

  const payload = {
    strPartName:
      values?.bonusSystemType?.value === 1
        ? "BonusGenerateProcess"
        : "ArrearBonusGenerateProcess",
    intBonusHeaderId: isEdit ? bonusObj?.intBonusHeaderId : 0,
    intAccountId: orgId,
    intBusinessUnitId: buId,
    workplaceGroupId: wgId,
    wingId: values?.wing?.value || 0,
    soleDepoId: values?.soleDepo?.value || 0,
    regionId: values?.region?.value || 0,
    areaId: values?.area?.value || 0,
    territoryId: values?.territory?.value || 0,
    intBonusId: values?.bonusName?.value,
    strBonusName: values?.bonusName?.label,
    numBonusAmount: 0,
    isArrearBonus: values?.bonusSystemType?.value === 2,
    intArrearBonusReferenceId: !isEdit
      ? 0
      : bonusObj?.intArrearBonusReferenceId,
    dteEffectedDateTime: values?.effectiveDate,
    intCreatedBy: employeeId,
    bonusGenerateRowVM: selectedEmployeeForBonus,
  };

  const callback = () => {
    resetForm(initialValues);
    setIsEdit(false);
    setEmployeeList([]);
    setRowDto([]);
    isEdit && history.goBack();
  };

  createBonusGenerateRequest(payload, setLoading, callback);
};

export const getEditDDLs = ({
  singleData,
  getPeopleDeskWithoutAllDDL,
  orgId,
  buId,
  wgId,
  setWingDDL,
  setSoleDepoDDL,
  setRegionDDL,
  setAreaDDL,
  setTerritoryDDL,
}) => {
  getPeopleDeskWithoutAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WingDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&ParentTerritoryId=0`,
    "WingId",
    "WingName",
    setWingDDL
  );
  getPeopleDeskWithoutAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=SoleDepoDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&ParentTerritoryId=${
      singleData?.intWingId || 0
    }`,
    "SoleDepoId",
    "SoleDepoName",
    setSoleDepoDDL
  );
  getPeopleDeskWithoutAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=RegionDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&ParentTerritoryId=${
      singleData?.intSoleDepoId || 0
    }`,
    "RegionId",
    "RegionName",
    setRegionDDL
  );
  getPeopleDeskWithoutAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=AreaDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&ParentTerritoryId=${
      singleData?.intRegionId || 0
    }`,
    "AreaId",
    "AreaName",
    setAreaDDL
  );
  getPeopleDeskWithoutAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=TerritoryDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&ParentTerritoryId=${
      singleData?.aintAreaId || 0
    }`,
    "TerritoryId",
    "TerritoryName",
    setTerritoryDDL
  );
};
