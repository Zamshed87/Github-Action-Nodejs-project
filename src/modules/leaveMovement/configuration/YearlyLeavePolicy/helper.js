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
  } catch (error) {}
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
        const { strWorkplaceName, ...rest } = item;
        if (!acc[strWorkplaceName]) {
          acc[strWorkplaceName] = [];
        }
        acc[strWorkplaceName].push(rest);
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
        (itm) => itm.Id === policy.intEmploymentId
      );
      const isWorkplaceExist = values?.intWorkplaceList?.some(
        (itm) => itm.value === policy.intWorkplace
      );
      if (isGenderExist && isEmploymentTypeExist && isWorkplaceExist) {
        existingData?.push(policy);
      }
    }
  });

  setExistingPolicies((prev) => [...prev, ...existingData]);
  // return existingData
};

export const getYearlyPolicyById = async (
  id,
  setter,
  workplaceDDL,
  setTableData,
  allPolicies,
  setExistingPolicies,
  cb = {}
) => {
  // setLoading?.(true);
  try {
    const res = await axios.get(
      `/SaasMasterData/GetLeavePolicyById?policyId=${id}`
    );

    console.log({ allPolicies });

    console.log(res?.data);
    // setWorkplaceDDL(
    //   res?.data?.workplaceList?.map((itm) => {
    //     return {
    //       ...itm,
    //       value: itm?.intWorkplaceId,
    //       label: itm?.strWorkplaceName,
    //     };
    //   })
    // );
    setTableData(
      res?.data?.serviceLengthList?.map((itm) => {
        return {
          ...itm,
          intStartServiceLengthInYear: {
            value: itm?.intStartServiceLengthInYear,
            label: itm?.intStartServiceLengthInYear,
          },
          intEndServiceLengthInYear: {
            value: itm?.intEndServiceLengthInYear,
            label: itm?.intEndServiceLengthInYear,
          },
        };
      })
    );
    if (res?.data) {
      const newState1 = workplaceDDL.filter((obj1) =>
        res?.data?.workplaceList?.some(
          (obj2) => obj2?.intWorkplaceId == obj1?.intWorkplaceId
        )
      );

      const temp = {
        ...res?.data,
        intWorkplaceList: newState1,

        intGender: res?.data?.genderListDTO?.map((itm) => {
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
        intCarryForwardMonth: {
          value: res?.data?.intCarryForwardMonth,
          label: getMonthName(res?.data?.intCarryForwardMonth),
        },
        intCarryForwarExpiryMonth: {
          value: res?.data?.intCarryForwarExpiryMonth,
          label: getMonthName(res?.data?.intCarryForwarExpiryMonth),
        },
        intYear: {
          value: res?.data?.intYear,
          label: res?.data?.intYear,
        },
        hrPositionListDTO: res?.data?.hrPositionListDTO?.map((itm) => {
          return {
            ...itm,
            value: itm?.intHrPositionId,
            label: itm?.strHrPositionName,
          };
        }),
        inPreviousLveTypeEnd: {
          ...res?.data?.inPreviousLveTypeEnd,
          value: res?.data?.inPreviousLveTypeEnd?.intLeaveTypeId,
          label: res?.data?.inPreviousLveTypeEnd?.strLeaveType,
        },
        intHalfdayPreviousLveTypeEnd: {
          ...res?.data?.intHalfdayPreviousLveTypeEnd,
          value: res?.data?.intHalfdayPreviousLveTypeEnd?.intLeaveTypeId,
          label: res?.data?.intHalfdayPreviousLveTypeEnd?.strLeaveType,
        },
        intLeaveType: {
          ...res?.data?.intLeaveType,
          value: res?.data?.intLeaveType?.intLeaveTypeId,
          label: res?.data?.intLeaveType?.strLeaveType,
        },
      };

      setExistingPolicies?.(
        allPolicies?.filter((itm) =>
          res?.data?.intExistingPolicyIdList?.includes(itm?.intPolicyId)
        )
      );
      setter?.(temp);
    }

    cb && cb();
    // setLoading?.(false);
  } catch (error) {
    // setLoading?.(false);

    toast.error(error?.response?.data?.message);
  }
};
