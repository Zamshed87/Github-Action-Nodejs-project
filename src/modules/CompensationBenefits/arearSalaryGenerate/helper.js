import axios from "axios";
import { toast } from "react-toastify";
import { dateFormatterForInput } from "../../../utility/dateFormatter";
export const getBuDetails = async (buId, setter, setLoading) => {
  try {
    const res = await axios.get(
      `/SaasMasterData/GetBusinessDetailsByBusinessUnitId?businessUnitId=${buId}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
  }
};
export const getEmployeeDDL = async (
  partName,
  accId,
  businessUnit,
  fromDate,
  toDate,
  setter,
  setAllData
) => {
  try {
    const res = await axios.get(
      `/Payroll/ArearSalarySelectQueryAll?partName=${partName}&intAccountId=${accId}&intBusinessUnitId=${businessUnit}&dteEffectiveFrom=${fromDate}&dteEffectiveTo=${toDate}`
    );
    const modifyData = res?.data?.map((itm) => {
      return {
        ...itm,
        isArrearSalaryGenerate: false,
      };
    });
    setter(modifyData);
    setAllData && setAllData(modifyData);
  } catch (error) {}
};

export const getAllSalaryPolicyDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/Payroll/GetAllSalaryPolicy?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res?.data) {
      const modifyData = res.data?.map((itm) => {
        return {
          ...itm,
          value: itm?.intPolicyId,
          label: itm?.strPolicyName,
        };
      });
      setter(modifyData);
    }
  } catch (error) {}
};

// arrear salary generate request
export const createArearSalaryGenerateRequest = async (
  payload,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Payroll/ArearSalaryCRUD`, payload);
    cb();
    toast.success(res.data[0]?.returnMessage || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(
      error?.response?.data[0]?.returnMessage || "Something went wrong!"
    );
    setLoading && setLoading(false);
  }
};

// arrear salary generate landing
export const getArearSalaryGenerateRequestLanding = async (
  orgId,
  buId,
  setter,
  setAllData,
  setLoading,
  values
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Payroll/ArearSalarySelectQueryAll?partName=ArearSalaryGenerateRequestLanding&intAccountId=${orgId}&intBusinessUnitId=${buId}&dteEffectiveFrom=${values?.filterFromDate}&dteEffectiveTo=${values?.filterToDate}`
    );
    if (res?.data) {
      setAllData && setAllData(res?.data);
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

// arrear salary generate landing by id in salary process
export const getArearSalaryGenerateRequestById = async (
  intAccountId,
  intBusinessUnitId,
  intSalaryGenerateRequestId,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Payroll/ArearSalarySelectQueryAll?partName=GeneratedSalaryReportHeaderLanding&intAccountId=${intAccountId}&intBusinessUnitId=${intBusinessUnitId}&intArearSalaryGenerateRequestId=${intSalaryGenerateRequestId}&intBankOrWalletType=0`
    );
    if (res?.data) {
      setAllData && setAllData(res?.data);
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

// get salary generate list data for approval
export const getAllSalaryGenerateListDataForApproval = async (
  payload,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/ArearSalaryGenerateRequestLanding`,
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

// arrear salary generate request
export const createArearSalaryGenerateApproveRequest = async (
  payload,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Payroll/ArearSalaryCRUD`, payload);
    cb();
    toast.success(res.data?.[0].returnMessage || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(
      error?.response?.data?.[0].returnMessage || "Something went wrong!"
    );
    setLoading && setLoading(false);
  }
};

// arrear salary generate approve and reject
export const salaryGenerateApproveReject = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/ArearSalaryGenerateRequestApproval`,
      payload
    );
    cb && cb();
    toast.success(res?.data || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data || "Something went wrong");
    setLoading && setLoading(false);
  }
};

// header info
export const getArrearSalaryGenerateRequestHeaderId = async (
  partName,
  id,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);

  try {
    const res = await axios.get(
      `/Payroll/ArearSalarySelectQueryAll?partName=${partName}&intArearSalaryGenerateRequestId=${id}`
    );
    if (res?.data) {
      let modifyObj = {
        ...res?.data[0],
        businessUnit: {
          value: res?.data[0]?.intBusinessUnitId,
          label: res?.data[0]?.strBusinessUnit,
        },
        fromDate: dateFormatterForInput(res?.data[0]?.dteSalaryGenerateFrom),
        toDate: dateFormatterForInput(res?.data[0]?.dteSalaryGenerateTo),
        payrollPolicy: {
          value: res?.data[0]?.intSalaryPolicyId,
          label: res?.data[0]?.strSalaryPolicyName,
        },
        description: res?.data[0]?.strSalaryPolicyName,
        percentOfGross: res?.data[0]?.numPercentOfGross,
      };
      setter(modifyObj);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

// row info
export const getEmployeeListByRequestId = async (
  partName,
  id,
  setter,
  setAllData,
  isMarge,
  accId,
  buId,
  fromDate,
  toDate
) => {
  try {
    const res = await axios.get(
      `/Payroll/ArearSalarySelectQueryAll?partName=${partName}&intArearSalaryGenerateRequestId=${id}`
    );
    const modifyData = res?.data?.map((itm) => {
      return {
        ...itm,
        isArrearSalaryGenerate:
          itm?.intArearSalaryGenerateRequestRowId > 0 ? true : false,
      };
    });
    if (isMarge) {
      try {
        const secondRes = await axios.get(
          `/Payroll/ArearSalarySelectQueryAll?partName=EligibleEmployeeListForArearSalaryGenerate&intAccountId=${accId}&intBusinessUnitId=${buId}&dteEffectiveFrom=${fromDate}&dteEffectiveTo=${toDate}`
        );

        if (secondRes?.data) {
          const modifyNewRowData = secondRes?.data?.map((itm) => {
            return {
              ...itm,
              isArrearSalaryGenerate: false,
            };
          });
          setAllData && setAllData([...modifyData, ...modifyNewRowData]);
          setter([...modifyData, ...modifyNewRowData]);
        }
      } catch (error) {}
    } else {
      setter(modifyData);
      setAllData && setAllData(modifyData);
    }
  } catch (error) {}
};
