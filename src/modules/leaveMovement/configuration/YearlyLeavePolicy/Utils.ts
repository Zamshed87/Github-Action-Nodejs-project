export const generatePayload = (
  values: any,
  tableData: any,
  existingPolicies: any
) => {
  const workplaceList = values?.intWorkplaceList?.map((item: any) => {
    const exists = existingPolicies?.some(
      (em: any) => em.intWorkplace === item.value
    );
    return {
      ...item,
      strWorkplaceName: item?.label,
      id: exists ? 1 : 0,
    };
  });
  const employmentTypeList = values?.intEmploymentTypeList?.map((item: any) => {
    return {
      ...item,
      strEmploymentTypeName: item?.label,
      intEmploymentTypeId: item?.value,
    };
  });
  const genderListDTO = values?.intGender?.map((item: any) => {
    return {
      ...item,
      strGenderName: item?.label,
      intGenderId: item?.value,
    };
  });
  const hrPositionListDTO = values?.hrPositionListDTO?.length
    ? values?.hrPositionListDTO?.map((item: any) => {
        return {
          ...item,
          strHrPositionName: item?.label,
          intHrPositionId: item?.value,
        };
      })
    : [];
  const serviceLengthList =
    tableData?.map((item: any, idx: number) => {
      return {
        intId: 0,
        intSerial: idx + 1,
        intStartServiceLengthInYear: item?.intStartServiceLengthInYear?.value,
        intEndServiceLengthInYear: item?.intEndServiceLengthInYear?.value,
        intLveInDay: +item?.intLveInDay,
        isActive: true,
      };
    }) || [];

  const policyList = existingPolicies?.map((item: any) => item?.intPolicyId);

  const payload = {
    // policyId: params?.id || 0,
    workplaceList: workplaceList,
    employmentTypeList: employmentTypeList,
    genderListDTO: genderListDTO,
    hrPositionListDTO: hrPositionListDTO,
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
    isEarnLveIncludeAbsent: values?.isEarnLveIncludeAbsent || false,
    isEarnLveIncludeLeaveMovement:
      values?.isEarnLveIncludeLeaveMovement || false,
    isEarnLveCountFromConfirmationDate:
      values?.isEarnLveCountFromConfirmationDate || false,
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
    strDisplayName: values?.strDisplayName || null,
    strPolicyName: values?.strPolicyName || null,
    serviceLengthList: values?.isDependOnServiceLength ? serviceLengthList : [],
    intLeaveType: +values?.intLeaveType?.value,
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
    intActiveFromJoiningdayInDay: +values?.intActiveFromJoiningdayInDay || 0,
    intActiveFromConfirmationInDay:
      +values?.intActiveFromConfirmationInDay || 0,
    howMuchMonth: +values?.howMuchMonth?.value || null,
    intCarryForwardMaxInDay: +values?.intCarryForwardMaxInDay || null,
    intCarryForwardMonth: +values?.intCarryForwardMonth?.value || null,
    intConpensatoryLveExpireInDays:
      +values?.intConpensatoryLveExpireInDays || null,
    intDayForOneEarnLve: +values?.intDayForOneEarnLve || null,
    intEarnLveInDay: +values?.intEarnLveInDay || null,
    intMaxForAdvLveInYear: +values?.intMaxForAdvLveInYear || null,
    intExistingPolicyIdList: policyList,
  };
  return payload;
};
