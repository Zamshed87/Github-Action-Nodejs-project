import axios from "axios";
import { toast } from "react-toastify";

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

export const getYearlyPolicyLanding = async (apiUrl, setter, cb = {}) => {
  try {
    const res = await axios.get(apiUrl);
    // setter?.(res?.data);
    let i = 1;
    // console.log({ res });
    if (res?.data?.data) {
      const groupedData = res?.data?.data.reduce((acc, item) => {
        const { strWorkplaceName, ...rest } = item;
        if (!acc[strWorkplaceName]) {
          acc[strWorkplaceName] = [];
        }
        acc[strWorkplaceName].push(rest);
        return acc;
      }, {});
      setter?.(groupedData);
      console.log({ groupedData });
      // let tempArr = res?.data?.data?.map((item, idx) => {
      //   if (item?.strWorkplaceName.trim()) {
      //     return {
      //       ...item,
      //       strWorkplaceName: item?.strWorkplaceName,
      //       sl: null,
      //     };
      //   } else {
      //     return {
      //       ...item,
      //       sl: i++,
      //     };
      //   }
      // });
      // console.log(tempArr);

      // setter(tempArr);
    }
    console.log(1);
    cb && cb();
  } catch (error) {
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

  setExistingPolicies(existingData);
  // return existingData
};
