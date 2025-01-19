import { isDevServer } from "App";
import axios from "axios";
import { roundToDecimals } from "modules/CompensationBenefits/employeeSalary/salaryAssign/salaryAssignCal";
import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";

export const processBulkUploadIncrementAction = async (
  data,
  setter,
  setLoading,
  elementInfo,
  payrollInfo,
  values,
  setErrorData,
  setOpen,
  employeeId
) => {
  try {
    setLoading(true);
    const keyValuePairs = {};

    for (const item of elementInfo) {
      if (typeof item === "string" && item.includes(" : ")) {
        const [key, value] = item.split(" : ").map((str) => str.trim());
        keyValuePairs[key] = value; // Add to the object
      }
    }
    const modifiedData = data.slice(2).map((item, index) => {
      const {
        "Employee Name": empName,
        "Employee Code": employeeCode,
        "Gross Salary": gross,
        "Mismatch Amount": misMatch,
        "Effective Date": effectiveDate,
        ...fields
      } = item;
      const payrollElements = Object.keys(fields)
        // .filter((key) => key !== "Gross Salary" && key !== "Mismatch Amount")
        .map((key) => {
          if (fields[key]?.result !== undefined || !isNaN(fields[key])) {
            // console.log(keyValuePairs);
            return {
              elementName: key,
              amount: roundToDecimals(fields[key]?.result) || fields[key],
              elementId: keyValuePairs[key],
            };
          }
          return {
            elementName: key,
            amount: 0,
            elementId: keyValuePairs[key],
          };
        })
        .filter(Boolean); // Remove null values.

      return {
        slNo: index + 1,
        empName: empName || "N/A",
        employeeCode: `${employeeCode}` || "N/A",
        gross: gross,
        effectiveDate: effectiveDate || todayDate(),
        payrollGroupId: values?.pg?.value || payrollInfo[7],
        misMatch: misMatch?.result || 0,
        actionBy: employeeId,
        payrollElements,
      };
    });
    const errorData = [];
    const cleanData = [];
    modifiedData.forEach((item) => {
      if (
        Boolean(item.misMatch) ||
        item.empName === "N/A" ||
        item.employeeCode === "N/A"
      ) {
        errorData.push(item);
      } else {
        cleanData.push(item);
      }
    });
    setter(cleanData);
    setErrorData(errorData);
    errorData?.length > 0 && setOpen(true);
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
