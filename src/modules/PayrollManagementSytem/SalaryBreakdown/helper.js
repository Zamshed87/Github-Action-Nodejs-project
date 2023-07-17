import axios from "axios";
import { toast } from "react-toastify";
import { payrollGroupElementList } from "./calculation";

// based on calculation
export const basedOnBasicPercentage = (basicElement, payrollElement) => {
  let percentage = 0;
  percentage = (basicElement * payrollElement) / 100;
  return percentage;
};

export const reverseBasedOnBasicPercentage = (basicElement, payrollElement) => {
  let percentage = 0;
  percentage = (payrollElement * 100) / basicElement;
  return percentage;
};

// all ddl
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

export const getPayrollElementDDL = async (accId, setter) => {
  try {
    const res = await axios.get(
      `/Payroll/GetAllSalaryElementByAccountIdDDL?accountId=${accId}`
    );
    if (res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

// breakdown element
export const getAllAppliedSalaryBreakdownElement = async (
  autoId,
  setter,
  accId
) => {
  try {
    const res = await axios.get(
      `/Payroll/GetAllAppliedSalaryBreakdownElement?SalaryBreakdownHeaderId=${autoId}`
    );
    if (res?.data) {
      payrollGroupElementList(accId, autoId, setter);
    }
  } catch (error) {}
};

// create/edit
export const salaryBreakdownCreateNApply = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/Payroll/SalaryBreakdownCreateNApply`,
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

// landing
export const getAllAppliedSalaryBreakdownList = async (
  accId,
  buId,
  workplaceGroupId,
  workplaceId,
  departmentId,
  designationId,
  employeeTypeId,
  employeeId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Payroll/GetAllSalaryBreakdownLanding?accountId=${accId}&businessUnitId=${buId}&workplaceGroupId=${workplaceGroupId}&workplaceId=${workplaceId}&departmentId=${departmentId}&designationId=${designationId}&employmentTypeId=${employeeTypeId}&EmployeeId=${employeeId}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
