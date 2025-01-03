import { isDevServer } from "App";
import axios from "axios";
import { toast } from "react-toastify";

export const processBulkUploadIncrementAction = async (
  data,
  setter,
  setLoading,
  buId,
  orgId,
  employeeId,
  setErrorData,
  setOpen
) => {
  try {
    setLoading(true);
    const modifiedData = data.slice(1).map((item) => {
      const {
        "Employee Name": empName,
        "Employee Code": empCode,
        "Gross Salary": gross,
        "Mismatch Amount": misMatch,
        ...fields
      } = item;

      const elements = Object.keys(fields)
        .filter((key) => key !== "Gross Salary" && key !== "Mismatch Amount")
        .map((key) => {
          if (fields[key]?.result !== undefined) {
            return {
              name: key,
              numAmount: fields[key].result,
            };
          }
          return null; // To filter out undefined cases.
        })
        .filter(Boolean); // Remove null values.

      return {
        empName: empName || "N/A",
        empCode: empCode || "N/A",
        gross: gross,
        misMatch: misMatch?.result || 0,
        elements,
      };
    });
    const errorData = [
      {
        empName: "B",
        empCode: "A",
        gross: 2000,
        misMatch: 212,
        elements: [
          {
            name: "Basic",
            numAmount: 1000,
          },
          {
            name: "House",
            numAmount: 600,
          },
          {
            name: "Medical",
            numAmount: 200,
          },
          {
            name: "Conveyance",
            numAmount: 200,
          },
        ],
      },
    ];
    const cleanData = [];

    modifiedData.forEach((item) => {
      if (Boolean(item.misMatch)) {
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
