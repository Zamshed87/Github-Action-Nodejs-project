import moment from "moment";

export const joiningDisabledDate = (current) => {
  const startOfPreviousMonth = moment().subtract(1, "month").startOf("month");
  return current && current < startOfPreviousMonth;
};

export const setInitialData = (res, setInitData) => {
  setInitData({
    tnpId: res?.intTransferNpromotionId,
    employee: {
      label: res?.strEmployeeName,
      value: res?.intEmployeeId,
    },
    type: {
      label: res?.strTransferNpromotionType,
      value: res?.strTransferNpromotionType,
    },
    effectiveDate: moment(res?.dteEffectiveDate),
    businessUnit: {
      label: res?.businessUnitName,
      value: res?.intBusinessUnitId,
    },
    workplaceGroup: {
      label: res?.workplaceGroupName,
      value: res?.intWorkplaceGroupId,
    },
    workplace: {
      label: res?.workplaceName,
      value: res?.intWorkplaceId,
    },
    employmentType: {
      label: res?.employmentTypeName,
      value: res?.employmentTypeId,
    },
    hrPosition: {
      label: res?.hrPositionName,
      value: res?.hrPositionId,
    },
    department: {
      label: res?.departmentName,
      value: res?.intDepartmentId,
    },
    designation: {
      label: res?.designationName,
      value: res?.intDesignationId,
    },
    section: {
      label: res?.strSectionName,
      value: res?.intSectionId,
    },
    supervisor: {
      label: res?.supervisorName,
      value: res?.intSupervisorId,
    },
    dottedSuperVisor: {
      label: res?.dottedSupervisorName,
      value: res?.intDottedSupervisorId,
    },
    lineManager: {
      label: res?.lineManagerName,
      value: res?.intLineManagerId,
    },
    role: res?.empTransferNpromotionUserRoleVMList?.map((item) => {
      return {
        ...item,
        label: item?.strUserRoleName,
        value: item?.intUserRoleId,
      };
    }),
    remarks: res?.strRemarks,
    isRoleExtension:
      res?.empTransferNpromotionRoleExtensionVMList?.length > 0 ? true : false,
  });
};

export const createPayload = (values) => {
  const tnpInfo = {
    intTransferNpromotionId: values?.tnpId || 0,
    intEmployeeId: values?.employee?.value,
    strEmployeeName: values?.employee?.label,
    strTransferNpromotionType: values?.type?.value,
    intTransferOrpromotedFrom: 0,
    intAccountId: 0,
    accountName: "string",
    intBusinessUnitId: 0,
    businessUnitName: "string",
    intWorkplaceGroupId: 0,
    workplaceGroupName: "string",
    intWorkplaceId: 0,
    workplaceName: "string",
    intDepartmentId: 0,
    departmentName: "string",
    intDesignationId: 0,
    designationName: "string",
    intSupervisorId: 0,
    supervisorName: "string",
    intLineManagerId: 0,
    lineManagerName: "string",
    intDottedSupervisorId: 0,
    dottedSupervisorName: "string",
    dteEffectiveDate: "2024-08-17T08:57:59.901Z",
    dteReleaseDate: "2024-08-17T08:57:59.901Z",
    intAttachementId: 0,
    strRemarks: "string",
    strStatus: "string",
    isJoined: true,
    isReject: true,
    dteRejectDateTime: "2024-08-17T08:57:59.901Z",
    intRejectedBy: 0,
    dteCreatedAt: "2024-08-17T08:57:59.901Z",
    intCreatedBy: 0,
    dteUpdatedAt: "2024-08-17T08:57:59.901Z",
    intUpdatedBy: 0,
    isActive: true,
    intBusinessUnitIdFrom: 0,
    businessUnitNameFrom: "string",
    intWorkplaceGroupIdFrom: 0,
    workplaceGroupNameFrom: "string",
    intWorkplaceIdFrom: 0,
    workplaceNameFrom: "string",
    intDepartmentIdFrom: 0,
    departmentNameFrom: "string",
    intDesignationIdFrom: 0,
    designationNameFrom: "string",
    intSupervisorIdFrom: 0,
    supervisorNameFrom: "string",
    intLineManagerIdFrom: 0,
    lineManagerNameFrom: "string",
    intDottedSupervisorIdFrom: 0,
    dottedSupervisorNameFrom: "string",
    intSectionId: 0,
    strSectionName: "string",
    sectionIdFrom: 0,
    sectionNameFrom: "string",
    employmentTypeId: 0,
    hrPositionId: 0,
  };
  const payload = {
    ...tnpInfo,
  };
  console.log(payload);
};
