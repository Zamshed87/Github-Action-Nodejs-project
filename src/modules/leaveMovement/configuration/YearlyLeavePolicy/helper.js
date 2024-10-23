import axios from "axios";
import { toast } from "react-toastify";
import { getMonthName } from "../../../../utility/monthUtility";

export const getYearlyPolicyPopUpDDL = async (
  apiUrl,
  value,
  label,
  setter,
  cb
) => {
  try {
    const res = await axios.get(apiUrl);
    const newDDL = res?.data?.map((itm) => ({
      ...itm,
      value: itm[value],
      label: itm[label],
    }));
    setter?.([...newDDL]);
    cb && cb(newDDL);
  } catch (error) {
    console.log(error?.message);
  }
};

export const getYearlyPolicyLanding = async (
  apiUrl,
  setter,
  setPages,
  setLoading,
  cb = {}
) => {
  setLoading?.(true);
  try {
    const res = await axios.get(apiUrl);

    if (res?.data?.data) {
      setPages((prev) => {
        return {
          ...prev,
          totalCount: res?.data?.totalCount,
        };
      });
      const groupedData = res?.data?.data.reduce((acc, item) => {
        const { strWorkplaceName, strWorkplaceGroupName, ...rest } = item;
        const key = `${strWorkplaceName}_[${strWorkplaceGroupName}]`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(rest);
        return acc;
      }, {});

      setter?.(groupedData);
    }

    cb && cb();
    setLoading?.(false);
  } catch (error) {
    setLoading?.(false);

    toast.error(error?.response?.data?.message);
  }
};

export const removerPolicy = (
  payload,
  existingPolicies,
  setExistingPolicies,
  values
) => {
  const filterArr = existingPolicies.filter((itm, idx) => idx !== payload);
  setExistingPolicies(filterArr);
  const temp = values?.intWorkplaceList?.filter(
    (item) => item?.value !== existingPolicies[payload]?.intWorkplace
  );
  values.intWorkplaceList = temp;
};
export const isPolicyExist = (values, allPolicies, setExistingPolicies) => {
  if (
    !values?.intLeaveType?.value ||
    !values?.intYear?.value ||
    values?.intGender?.length === 0 ||
    values?.intEmploymentTypeList?.length === 0 ||
    values?.intWorkplaceList?.length === 0
  ) {
    return;
  }

  const existingData = [];

  allPolicies?.forEach((policy, idx) => {
    if (
      policy.intLeaveType === values?.intLeaveType?.value &&
      policy.intYear === values?.intYear?.value
    ) {
      const isGenderExist = values?.intGender?.some(
        (itm) => itm.value === policy.intGenderId
      );
      const isEmploymentTypeExist = values?.intEmploymentTypeList?.some(
        (itm) => itm.value === policy.intEmploymentId
      );
      const isWorkplaceExist = values?.intWorkplaceList?.some(
        (itm) => itm.value === policy.intWorkplace
      );
      const isHR = values?.hrPositionListDTO?.some(
        (itm) => itm.value === policy.intHrPositionId
      );
      if (values?.hrPositionListDTO?.length > 0) {
        if (
          isGenderExist &&
          isEmploymentTypeExist &&
          isWorkplaceExist &&
          isHR
        ) {
          existingData?.push(policy);
        }
      } else {
        if (isGenderExist && isEmploymentTypeExist && isWorkplaceExist) {
          existingData?.push(policy);
        }
      }
    }
  });
  const seenPolicies = new Set();

  setExistingPolicies((prev) => {
    return existingData?.filter((obj) => {
      if (!seenPolicies.has(obj.intPolicyId)) {
        seenPolicies.add(obj.intPolicyId);
        return true;
      }
      return false;
    });
  });
  // return existingData
};

export const getYearlyPolicyById = async (
  id,
  setter,
  workplaceDDL,
  setTableData,
  allPolicies,
  setExistingPolicies,
  setLoading,
  cb = {}
) => {
  try {
    setLoading?.(true);

    const res = await axios.get(
      `/SaasMasterData/GetLeavePolicyById?policyId=${id}`
    );

    if (res?.data) {
      const newState1 = workplaceDDL?.filter((obj1) =>
        res?.data?.workplaceList?.some(
          (obj2) => obj2?.intWorkplaceId == obj1?.intWorkplaceId
        )
      );
      setTableData(
        res?.data?.serviceLengthList?.map((itm) => {
          return {
            ...itm,
            intStartServiceLengthInYear: {
              value: itm?.intStartServiceLengthInYear,
              label: itm?.intStartServiceLengthInYear,
            },
            showLveIndays:
              itm?.intLeaveDependOn === 1
                ? dependsOnDDL[0]
                : itm?.intLeaveDependOn === 2
                ? dependsOnDDL[1]
                : { value: 3, label: "Calculation" },

            intEndServiceLengthInYear: {
              value: itm?.intEndServiceLengthInYear,
              label:
                itm?.intEndServiceLengthInYear === 100
                  ? "Above"
                  : itm?.intEndServiceLengthInYear,
            },
          };
        })
      );
      const temp = {
        ...res?.data,
        intWorkplaceList: newState1,
        bu: {
          value: res?.data?.intBusinessUnitId,
          label: res?.data?.strBusinessUnitName,
        },
        wg: {
          value: res?.data?.intWorkplaceGroupId,
          label: res?.data?.strWorkplaceGroupName,
        },
        IntMaxEncashableLveInDay: res?.data?.intMaxEncashableLveInDay,
        intGender: res?.data?.genderListDto?.map((itm) => {
          return {
            ...itm,
            value: itm?.intGenderId,
            label: itm?.strGenderName,
          };
        }),
        intEmploymentTypeList: res?.data?.employmentTypeList?.map((itm) => {
          return {
            ...itm,
            value: itm?.intEmploymentTypeId,
            label: itm?.strEmploymentTypeName,
          };
        }),
        intCarryForwardMonth: res?.data?.intCarryForwardMonth && {
          value: res?.data?.intCarryForwardMonth,
          label: getMonthName(res?.data?.intCarryForwardMonth),
        },
        intCarryForwarExpiryMonth: res?.data?.intCarryForwarExpiryMonth,
        intYear: res?.data?.intYear && {
          value: res?.data?.intYear,
          label: res?.data?.intYear,
        },
        hrPositionListDTO: res?.data?.hrPositionListDto?.map((itm) => {
          return {
            ...itm,
            value: itm?.intHrPositionId,
            label: itm?.strHrPositionName,
          };
        }),
        inPreviousLveTypeEnd: res?.data?.inPreviousLveTypeEnd
          ?.intLeaveTypeId && {
          ...res?.data?.inPreviousLveTypeEnd,
          value: res?.data?.inPreviousLveTypeEnd?.intLeaveTypeId,
          label: res?.data?.inPreviousLveTypeEnd?.strLeaveType,
        },
        intLeaveDependOn:
          res?.data?.intLeaveDependOn === 1
            ? dependsOnDDL[0]
            : res?.data?.intLeaveDependOn === 2
            ? dependsOnDDL[1]
            : { value: 3, label: "Calculation" },
        intLwpbasedOn:
          res?.data?.intLwpbasedOn > 0 ? res?.data?.intLwpbasedOn : undefined,
        intHalfdayPreviousLveTypeEnd: res?.data?.intHalfdayPreviousLveTypeEnd
          ?.intLeaveTypeId && {
          ...res?.data?.intHalfdayPreviousLveTypeEnd,
          value: res?.data?.intHalfdayPreviousLveTypeEnd?.intLeaveTypeId,
          label: res?.data?.intHalfdayPreviousLveTypeEnd?.strLeaveType,
        },
        intLeaveType: res?.data?.intLeaveType?.intLeaveTypeId && {
          ...res?.data?.intLeaveType,
          value: res?.data?.intLeaveType?.intLeaveTypeId,
          label: res?.data?.intLeaveType?.strLeaveType,
        },
      };
      // setExistingPolicies?.(
      const dummy = [];

      res?.data?.intExistingPolicyIdList?.forEach((itm) => {
        const a = allPolicies?.find((it) => it.intPolicyId === itm);
        if (a?.intPolicyId) {
          dummy.push(a);
        }
      });
      setExistingPolicies((prev) => [...dummy]);
      // );
      setter?.(temp);
    }

    cb && cb();
    setLoading(false);
  } catch (error) {
    setLoading?.(false);

    toast.error(error?.response?.data?.message);
  }
};
export const initData = {
  intWorkplaceList: [],
  intYear: "",
  intEmploymentTypeList: "",
  intLeaveType: "",
  intGender: "",
  days: "",
  strDisplayName: "",
  strPolicyName: "",
  isDependOnServiceLength: false,
  intStartServiceLengthInYear: "",
  intEndServiceLengthInYear: "",
  intLveInDay: "",
  intAllocatedLveInDay: "",
  isMinuteBased: false,
  isIncludeOffday: false,
  isIncludeHoliday: false,
  isLveBalanceApplyForSelfService: false,
  isLveBalanceShowForSelfService: false,
  isProdataBasis: false,
  inPreviousLveTypeEnd: false,
  intMaxLveDaySelf: "",
  intMaxLveApplicationSelfInYear: "",
  intMaxLveApplicationSelfInMonth: "",
  isHalfDayLeave: false,
  intHalfdayMaxInMonth: "",
  intHalfdayMaxInYear: "",
  intHalfdayPreviousLveTypeEnd: "",
  isEncashable: false,
  intMaxEncashableLveInDay: "",
  intEncashableMonth: "",
  isCompensatoryLve: false,
  intConpensatoryLveExpireInDays: "",
  isEarnLeave: false,
  intDayForOneEarnLve: "",
  isEarnLveIncludeHoliday: false,
  isEarnLveIncludeOffday: false,
  intEarnLveInDay: "",
  isCarryForward: false,
  intCarryForwardMaxInDay: "",
  intCarryForwardMonth: "",
  intCarryForwarExpiryMonth: "",
  intCarryForwarExpiryDay: "",
  isAutoRenewable: false,
  intActiveFromJoiningdayInDay: "",
  intActiveFromConfirmationInDay: "",
  isApplicableBeforeAndAfterHoliday: false,
  isApplicableBeforeAndAfterOffday: false,
  isMonthWiseExpired: false,
  howMuchMonth: "",
  bu: "",
  wg: "",
  isGenerate: false,
  isAdvanceLeave: false,
  intMaxForAdvLveInYear: "",
  hrPositionListDTO: "",
};

export const saveHandler = (
  values,
  cb,
  policyApi,
  tableData,
  existingPolicies,
  params,
  history
) => {
  const {
    bu,
    wg,
    days,
    intWorkplaceList,
    intGender,
    intEmploymentTypeList,
    intEndServiceLengthInYear,
    intStartServiceLengthInYear,

    ...rest
  } = values;
  const serviceLengthList = tableData?.map((item, idx) => {
    return {
      intId: 0,
      intSerial: idx + 1,
      intStartServiceLengthInYear: item?.intStartServiceLengthInYear?.value,
      intEndServiceLengthInYear: item?.intEndServiceLengthInYear?.value,
      intLveInDay: +item?.intLveInDay,
      isActive: true,
    };
  });
  const policyList = existingPolicies?.map((item) => item?.intPolicyId);
  const payload = {
    ...rest,
    isDependOnServiceLength: values?.isDependOnServiceLength || false,
    isMinuteBased: values?.isMinuteBased || false,
    isIncludeHoliday: values?.isIncludeHoliday || false,
    isIncludeOffday: values?.isIncludeOffday || false,
    isLveBalanceShowForSelfService:
      values?.isLveBalanceShowForSelfService || false,
    isLveBalanceApplyForSelfService:
      values?.isLveBalanceApplyForSelfService || false,
    isProdataBasis: values?.isProdataBasis || false,

    isHalfDayLeave: values?.isHalfDayLeave || false,
    isEncashable: values?.isEncashable || false,
    isCompensatoryLve: values?.isCompensatoryLve || false,
    isConpensatoryLveExpire: values?.isConpensatoryLveExpire || false,
    isEarnLeave: values?.isEarnLeave || false,
    isEarnLveIncludeHoliday: values?.isEarnLveIncludeHoliday || false,
    isEarnLveIncludeOffday: values?.isEarnLveIncludeOffday || false,
    isCarryForward: values?.isCarryForward || false,
    isAutoRenewable: values?.isAutoRenewable || false,
    isApplicableBeforeAndAfterHoliday:
      values?.isApplicableBeforeAndAfterHoliday || false,
    isApplicableBeforeAndAfterOffday:
      values?.isApplicableBeforeAndAfterOffday || false,
    isMonthWiseExpired: values?.isMonthWiseExpired || false,
    isAdvanceLeave: values?.isAdvanceLeave || false,
    isActive: values?.isActive || true,
    isGenerate: values?.isGenerate || false,

    policyId: params?.id || 0,
    strDisplayName: values?.strDisplayName || null,
    strPolicyName: values?.strPolicyName || null,
    serviceLengthList: values?.isDependOnServiceLength ? serviceLengthList : [],
    workplaceList: intWorkplaceList?.map((item, index) => {
      const exists = existingPolicies?.some(
        (em) => em.intWorkplace === item.value
      );
      return {
        ...item,
        strWorkplaceName: item?.label,
        id: exists ? 1 : 0,
      };
    }),
    employmentTypeList: intEmploymentTypeList?.map((item) => {
      return {
        ...item,
        strEmploymentTypeName: item?.label,
        intEmploymentTypeId: item?.value,
      };
    }),
    intLeaveType: +values?.intLeaveType?.value,
    genderListDTO: intGender?.map((item) => {
      return {
        ...item,
        strGenderName: item?.label,
        intGenderId: item?.value,
      };
    }),
    intYear: +values?.intYear?.value,
    inPreviousLveTypeEnd: +values?.inPreviousLveTypeEnd?.value || null,
    intMaxLveDaySelf: +values?.intMaxLveDaySelf || null,
    intMaxLveApplicationSelfInMonth:
      +values?.intMaxLveApplicationSelfInMonth || null,
    intMaxLveApplicationSelfInYear:
      +values?.intMaxLveApplicationSelfInYear || null,
    intEncashableMonth: +values?.intEncashableMonth || null,
    intEndServiceLengthInYear: +values?.intEndServiceLengthInYear || null,
    intHalfdayMaxInMonth: +values?.intHalfdayMaxInMonth || null,
    intHalfdayMaxInYear: +values?.intHalfdayMaxInYear || null,
    intHalfdayPreviousLveTypeEnd:
      +values?.intHalfdayPreviousLveTypeEnd?.value || null,
    intMaxEncashableLveInDay: +values?.intMaxEncashableLveInDay || null,
    intAllocatedLveInDay: +values?.intAllocatedLveInDay || null,
    intCarryForwarExpiryMonth:
      +values?.intCarryForwarExpiryMonth?.value || null,
    intCarryForwarExpiryDay: +values?.intCarryForwarExpiryDay || null,
    intActiveFromJoiningdayInDay: +values?.intActiveFromJoiningdayInDay || null,
    intActiveFromConfirmationInDay:
      +values?.intActiveFromConfirmationInDay || null,
    howMuchMonth: +values?.howMuchMonth?.value || null,
    intCarryForwardMaxInDay: +values?.intCarryForwardMaxInDay || null,
    intCarryForwardMonth: +values?.intCarryForwardMonth?.value || null,
    intConpensatoryLveExpireInDays:
      +values?.intConpensatoryLveExpireInDays || null,
    intDayForOneEarnLve: +values?.intDayForOneEarnLve || null,
    intEarnLveInDay: +values?.intEarnLveInDay || null,
    intMaxForAdvLveInYear: +values?.intMaxForAdvLveInYear || null,
    intExistingPolicyIdList: policyList?.length > 0 ? policyList : [],
    hrPositionListDTO:
      values?.hrPositionListDTO?.length > 0
        ? values?.hrPositionListDTO?.map((item) => {
            return {
              ...item,
              strHrPositionName: item?.label,
              intHrPositionId: item?.value,
            };
          })
        : [],
  };
  policyApi?.action({
    method: "POST",
    urlKey: "SaasMasterDataCRUDLeavePolicy",
    payload: payload,
    onSuccess: (data) => {
      toast.success(data?.message || "Submitted successfully", {
        toastId: "savePolicy",
      });
      if (data?.statusCode === 201) {
        history.push({
          pathname: `/administration/timeManagement/leavePolicyAssign`,
          state: { list: data?.intPolicyIdList },
        });
      }
    },
  });
};
export const dependsOnDDL = [
  { value: 1, label: "Standard" },
  { value: 2, label: "Service Length" },
];
export const commonDDL = [
  { value: false, label: "Not Applicable" },
  { value: true, label: "Applicable" },
];
