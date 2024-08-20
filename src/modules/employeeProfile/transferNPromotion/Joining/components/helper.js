import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";

export const joiningDisabledDate = (current) => {
  const startOfPreviousMonth = moment().subtract(1, "month").startOf("month");
  return current && current < startOfPreviousMonth;
};

export const setInitialData = (res, setInitData) => {
  return setInitData({
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
    role:
      res?.empTransferNpromotionUserRoleVMList?.length > 0
        ? res?.empTransferNpromotionUserRoleVMList?.map((item) => {
            return {
              ...item,
              label: item?.strUserRoleName,
              value: item?.intUserRoleId,
            };
          })
        : [],
    remarks: res?.strRemarks,
    isRoleExtension:
      res?.empTransferNpromotionRoleExtensionVMList?.length > 0 ? true : false,
  });
};

export const createPayload = (values, data, employeeId, rowDto) => {
  const tnpInfo = {
    intTransferNpromotionId: data?.intTransferNpromotionId,
    intEmployeeId: data?.intEmployeeId,
    strEmployeeName: data?.strEmployeeName,
    strTransferNpromotionType: values?.type?.value,
    intTransferOrpromotedFrom: data?.intTransferOrpromotedFrom,
    intAccountId: data?.intAccountId,
    accountName: data?.accountName,
    intBusinessUnitId: data?.intBusinessUnitId,
    businessUnitName: data?.businessUnitName,
    intWorkplaceGroupId: values?.workplaceGroup?.value,
    workplaceGroupName: values?.workplaceGroup?.label,
    intWorkplaceId: values?.workplace?.value,
    workplaceName: values?.workplace?.label,
    intDepartmentId: values?.department?.value,
    departmentName: values?.department?.label,
    intDesignationId: values?.designation?.value,
    designationName: values?.designation?.label,
    intSupervisorId: values?.supervisor?.value,
    supervisorName: values?.supervisor?.label,
    intLineManagerId: values?.lineManager?.value,
    lineManagerName: values?.lineManager?.label,
    intDottedSupervisorId: values?.dottedSuperVisor?.value,
    dottedSupervisorName: values?.dottedSuperVisor?.label,
    dteEffectiveDate: moment(values?.effectiveDate).format("YYYY-MM-DD"),
    dteReleaseDate: data?.dteReleaseDate,
    intAttachementId: data?.intAttachementId,
    strRemarks: values?.remarks || "",
    strStatus: data?.strStatus || "",
    isJoined: true,
    isReject: data?.isReject,
    dteRejectDateTime: data?.dteRejectDateTime,
    intRejectedBy: data?.intRejectedBy,
    dteCreatedAt: data?.dteCreatedAt,
    intCreatedBy: data?.intCreatedBy,
    dteUpdatedAt: todayDate(),
    intUpdatedBy: employeeId,
    isActive: data?.isActive,
    intBusinessUnitIdFrom: data?.intBusinessUnitIdFrom,
    businessUnitNameFrom: data?.businessUnitNameFrom,
    intWorkplaceGroupIdFrom: data?.intWorkplaceGroupIdFrom,
    workplaceGroupNameFrom: data?.workplaceGroupNameFrom,
    intWorkplaceIdFrom: data?.intWorkplaceIdFrom,
    workplaceNameFrom: data?.workplaceNameFrom,
    intDepartmentIdFrom: data?.intDepartmentIdFrom,
    departmentNameFrom: data?.departmentNameFrom,
    intDesignationIdFrom: data?.intDesignationIdFrom,
    designationNameFrom: data?.designationNameFrom,
    intSupervisorIdFrom: data?.intSupervisorIdFrom,
    supervisorNameFrom: data?.supervisorNameFrom,
    intLineManagerIdFrom: data?.intLineManagerIdFrom,
    lineManagerNameFrom: data?.lineManagerNameFrom,
    intDottedSupervisorIdFrom: data?.intDottedSupervisorIdFrom,
    dottedSupervisorNameFrom: data?.dottedSupervisorNameFrom,
    intSectionId: values?.section?.value,
    strSectionName: values?.section?.label,
    sectionIdFrom: data?.sectionIdFrom,
    sectionNameFrom: data?.sectionNameFrom,
    employmentTypeId: values?.employmentType?.value,
    hrPositionId: values?.hrPosition?.value,
    empTransferNpromotionUserRoleVMList: values?.role,
    empTransferNpromotionRoleExtensionVMList: rowDto,
  };

  const calanderAssign = {
    employeeList: `${data?.intEmployeeId}`,
    generateStartDate: moment(values?.generateDate).format("YYYY-MM-DD"),
    intCreatedBy: employeeId,
    runningCalendarId:
      values?.calenderType?.value === 2
        ? values?.startingCalender?.value
        : values?.calender?.value || 0,
    nextChangeDate: values?.nextChangeDate
      ? moment(values?.nextChangeDate).format("YYYY-MM-DD")
      : null,
    calendarType: values?.calenderType?.label,
    rosterGroupId:
      values?.calenderType?.value === 2 ? values?.calender?.value : 0,
    generateEndDate: null,
    isAutoGenerate: true,
  };
  const holidayAssign = {
    employeeList: `${data?.intEmployeeId}`,
    holidayGroupId: values?.holiday?.value,
    holidayGroupName: values?.holiday?.label,
    effectiveDate: moment(values?.joiningDate).format("YYYY-MM-DD"),
    accountId: data?.intAccountId,
    businessUnitId: data?.intBusinessUnitId,
    workplaceGroupId: values?.workplaceGroup?.value,
    isActive: true,
    actionBy: employeeId,
  };

  const offdayAssign = {
    employeeList: `${data?.intEmployeeId}`,
    effectiveDate: moment(values?.joiningDate).format("YYYY-MM-DD"),
    isSaturday: values?.offday?.find((i) => i.value === 2) ? true : false,
    isSunday: values?.offday?.find((i) => i.value === 3) ? true : false,
    isMonday: values?.offday?.find((i) => i.value === 4) ? true : false,
    isTuesday: values?.offday?.find((i) => i.value === 5) ? true : false,
    isWednesday: values?.offday?.find((i) => i.value === 6) ? true : false,
    isThursday: values?.offday?.find((i) => i.value === 7) ? true : false,
    isFriday: values?.offday?.find((i) => i.value === 1) ? true : false,
    accountId: data?.intAccountId,
    businessUnitId: data?.intBusinessUnitId,
    workplaceGroupId: values?.workplaceGroup?.value,
    isActive: true,
    actionBy: employeeId,
  };
  const payrollAsign = {};
  const payload = {
    ...tnpInfo,
    calanderAssign,
    holidayAssign,
    offdayAssign,
    payrollAsign,
  };
  return payload;
};

export const saveJoining = async (payload, setLoading, cb) => {
  try {
    setLoading(true);
    const res = await axios.put(
      `/Employee/JoiningAcknowledgeEmpTransferNpromotion`,
      payload
    );
    setLoading(false);
    cb && cb();
    toast.success(res?.data?.message, { toastId: 1 });
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message, { toastId: 1 });
  }
};
