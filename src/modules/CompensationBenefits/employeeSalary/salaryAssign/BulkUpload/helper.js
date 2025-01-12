import { isDevServer } from "App";
import axios from "axios";
import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";

export const createMovementApplication = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/LeaveMovement/CRUDMovementApplication`,
      payload
    );
    cb && cb();
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const getAllMovementApplicatonListData = async (
  payload,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/LeaveMovement/GetAllMovementApplicatonListForApprove`,
      payload
    );
    if (res?.data) {
      setAllData && setAllData(res?.data);
      setter(res?.data);
    }
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
  }
};

export const movementApproveReject = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/LeaveMovement/MovementApprove`, payload);
    cb && cb();
    toast.success(res?.data?.Result?.Message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const createMovementApprovedApplication = async (
  payload,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/LeaveMovement/ApproveMovementDelete`,
      payload
    );
    cb && cb();
    toast.success(res?.data?.Result?.Message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const getMovementApplicationFilterEmpManagement = async (
  tableName,
  accId,
  buId,
  data,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/MasterData/PeopleDeskAllLanding?TableName=${tableName}&AccountId=${accId}&BusinessUnitId=${buId}&intId=${data?.empId}&FromDate=${data?.fromDate}&ToDate=${data?.toDate}&EmpId=${data?.empId}&MovementTypeId=${data?.movementTypeId}&ApplicationDate=${data?.applicationDate}&StatusId=${data?.statusId}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const processBulkUploadSalaryAction = async (
  data,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const salaryBulkData = data
      ?.slice(1) // Start the loop from index 1
      ?.filter((item) => item["Employee Code"]) // Only include items with an Employee Code
      .map((item, index) => ({
        rowNo: index + 1 || 0,
        employeeCode: String(item["Employee Code"]) || "", // Convert to string
        employeeName: item["Employee Name"] || "",
        payrollGroup: item["Payroll Group"] || "",
        grossSalary: item["Gross Salary"]?.result || 0,
        bankPay: item["Bank"] || 0,
        cashPay: item["Cash"] || 0,
        digitalPay: item["Digital"] || 0,
        routingNo: String(item["Routing No"]) || "",
        swiftCode: item["Swift Code"] || "",
        accountNo: String(item["Account No"]) || "",
        accountName: item["Account Name"] || "",
        isSalaryInserted: false,
        isBankDetailsInserted: false,
        exMessage: "",
      }));

    setter(salaryBulkData);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};

export const processNewBulkUploadSalaryAction = async (
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
    console.log({ data });
    const modifiedData = data.slice(2).map((item, index) => {
      const {
        "Employee Name": empName,
        "Employee Code": employeeCode,
        "Gross Salary": gross,
        "Mismatch Amount": misMatch,
        // "Effective Date": effectiveDate,
        "Payment Method": pm,
        "Payment Mismatch": pmm,
        "Bank Pay": bank,
        "Cash Pay": cash,
        "Digital Pay": digital,
        ...fields
      } = item;
      const salaryElements = Object.keys(fields)
        // .filter((key) => key !== "Gross Salary" && key !== "Mismatch Amount")
        .map((key) => {
          if (fields[key]?.result !== undefined || !isNaN(fields[key])) {
            // console.log(keyValuePairs);
            return {
              elementName: key,
              amount: fields[key].result || fields[key],
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
        gross: gross?.result || gross || 0,
        // effectiveDate: effectiveDate || todayDate(),
        payrollGroupId: values?.pg?.value || payrollInfo[7],
        misMatch: misMatch?.result || 0,
        actionBy: employeeId,
        salaryElements,
        pm: pm || "N/A",
        bank: bank || 0,
        cash: cash || 0,
        digital: digital || 0,
        pmm: pmm?.result || 0,
      };
    });
    const errorData = [];
    const cleanData = [];
    console.log({ modifiedData });
    modifiedData.forEach((item) => {
      if (
        Boolean(item.misMatch) ||
        item.empName === "N/A" ||
        item.employeeCode === "N/A" ||
        Boolean(item?.pmm)
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
export const saveBulkUploadSalaryAction = async (
  setLoading,
  data,
  cb,
  accId,
  buId,
  empId,
  setErrorData,
  wgId,
  setData
) => {
  try {
    // const hasNullValues = (array) =>
    //   array.some((obj) => Object.values(obj).includes(""));

    setLoading(true);
    const res = await axios.post(`/Payroll/SalaryAssignBulkUpload`, {
      salaryObj: data,
      accountId: accId,
      businessunitId: buId,
      actionBy: empId,
      workplaceGroupId: wgId,
    });

    setErrorData(res?.data?.Result);
    console.log("res", res);
    setData(res?.data);

    setLoading(false);
    toast.success(res?.data?.message || "Saved Successfully");
    cb && cb();
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};
