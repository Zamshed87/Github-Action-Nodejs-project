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
    const modifiedData = data.map((item) => ({
      intIncrementId: 0,
      intEmployeeId: item["Employee Id"],
      strEmployeeName: item["Employee Name"],
      strDesignation: item["Designation"],
      intAccountId: orgId,
      intBusinessUnitId: buId,
      strIncrementDependOn: item["Depend On"] || "",
      numIncrementAmountBasedOnAmount: +item["Fixed Amount"] || 0,
      numIncrementPercentageBasedOnBasic:
        +item["Percentage Based On Basic"] || 0,
      numIncrementPercentBasedOnGross: +item["Percentage Based On Gross"] || 0,
      numIncrementPercentageOrAmount: +item["Increment percentage/Amount"] || 0, // item["Increment percentage"],
      dteEffectiveDate: item["Effective Date"],
      isActive: true,
      intCreatedBy: employeeId,
    }));
    setter(modifiedData);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
    isDevServer && console.log({ error });
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};

export const saveBulkUploadIncrementAction = async (
  setLoading,
  data,
  callback
) => {
  const modifiedData = data.map((item) => ({
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
    intEmployeeId: 0, // item?.intEmployeeId,
    strEmployeeCode: `${item?.intEmployeeId}`,
    strEmployeeName: item?.strEmployeeName,
    strDesignation: item?.strDesignation,
    intAccountId: item?.intAccountId,
    intBusinessUnitId: item?.intBusinessUnitId,
    strIncrementDependOn: item?.strIncrementDependOn,
    numIncrementPercentageOrAmount: item?.numIncrementPercentageOrAmount || 0,
    dteEffectiveDate: item?.dteEffectiveDate,
    isActive: true,
    intCreatedBy: item?.intCreatedBy,
    intWorkplaceGroupId: wgId,
    numIncrementAmountBasedOnAmount:
      +item?.numIncrementAmountBasedOnAmount || 0,
    numIncrementPercentageBasedOnBasic:
      +item?.numIncrementPercentageBasedOnBasic || 0,
    numIncrementPercentBasedOnGross:
      +item?.numIncrementPercentBasedOnGross || 0,
  }));
  const payload = {
    isPromotion: false,
    incrementList: modifiedData,
    transferPromotionObj: null,
  };
  try {
    setLoading(true);
    const res = await axios.post(
      `/Employee/CreateEmployeeIncrementForBulkUpload`,
      payload
    );
    callback();
    toast.success(res?.data?.message || "Successful");
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};
