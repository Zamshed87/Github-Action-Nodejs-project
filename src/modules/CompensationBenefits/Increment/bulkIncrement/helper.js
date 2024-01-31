import { isDevServer } from "App";
import axios from "axios";
import { toast } from "react-toastify";

export const processBulkUploadIncrementAction = async (
  data,
  setter,
  setLoading,
  buId,
  orgId,
  employeeId
) => {
  try {
    setLoading(true);
    let modifiedData = data.map((item) => ({
      intIncrementId: 0,
      intEmployeeId: item["Employee Id"],
      strEmployeeName: item["Employee Name"],
      strDesignation: item["Designation"],
      intAccountId: orgId,
      intBusinessUnitId: buId,
      strIncrementDependOn: item["Depend On"],
      numIncrementPercentageOrAmount: item["Increment percentage"],
      dteEffectiveDate: item["Effective Date"],
      isActive: true,
      intCreatedBy: employeeId,
    }));
    console.log({modifiedData, data})
    setter(modifiedData);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
    isDevServer && console.log({error})
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};

export const saveBulkUploadIncrementAction = async (
  setLoading,
  data,
  callback
) => {
  let modifiedData = data.map((item) => ({
    intIncrementId: item?.intIncrementId,
    intEmployeeId: item?.intEmployeeId,
    strEmployeeName: item?.strEmployeeName,
    strDesignation: item?.strDesignation,
    intAccountId: item?.intAccountId,
    intBusinessUnitId: item?.intBusinessUnitId,
    strIncrementDependOn: item?.strIncrementDependOn,
    numIncrementPercentageOrAmount: item?.numIncrementPercentageOrAmount,
    dteEffectiveDate: item?.dteEffectiveDate,
    isActive: true,
    intCreatedBy: item?.intCreatedBy,
  }));
  const payload = {
    isPromotion: false,
    incrementList: modifiedData,
    transferPromotionObj: null,
  };
  try {
    setLoading(true);
    const res = await axios.post(`/Employee/CreateEmployeeIncrement`, payload);
    callback();
    setLoading(false);
    toast.success(res?.data?.message || "Successful");
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};
export const saveBulkUploadIncrementActionUpdate = async ({
  setLoading,
  data,
  wgId,
  callback,
}) => {
  const modifiedData = data.map((item) => ({
    intIncrementId: item?.intIncrementId,
    intEmployeeId: item?.intEmployeeId,
    strEmployeeCode: `${item?.intEmployeeId}`,
    strEmployeeName: item?.strEmployeeName,
    strDesignation: item?.strDesignation,
    intAccountId: item?.intAccountId,
    intBusinessUnitId: item?.intBusinessUnitId,
    strIncrementDependOn: item?.strIncrementDependOn,
    numIncrementPercentageOrAmount: item?.numIncrementPercentageOrAmount,
    dteEffectiveDate: item?.dteEffectiveDate,
    isActive: true,
    intCreatedBy: item?.intCreatedBy,
    intWorkplaceGroupId: wgId,

    // numOldGrossAmount: 0,
    // numCurrentGrossAmount: 0,
    // intEmploymentTypeId: 0,
    // strEmploymentType: "",
    // intDesignationId: 0,
    // intDepartmentId: 0,
    // strDepartment: "",
    // strStatus: "",
    // isPromotion: true,
    // intTransferNpromotionReferenceId: 0,
    // numIncrementAmount: 0,
  }));
  const payload = {
    isPromotion: false,
    incrementList: modifiedData,
    transferPromotionObj: null,
  };
  console.log({payload})
  try {
    setLoading(true);
    const res = await axios.post(`/Employee/CreateEmployeeIncrementForBulkUpload`, payload);
    callback();
    toast.success(res?.data?.message || "Successful");
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};
