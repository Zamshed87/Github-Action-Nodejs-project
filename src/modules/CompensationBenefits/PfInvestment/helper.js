import axios from "axios";
import { toast } from "react-toastify";

export const getBankBranchDDL = async (bankId, orgId, districtId, setter) => {
  try {
    const res = await axios.get(
      `/Employee/BankBranchDDL?BankId=${bankId}&AccountID=${orgId}&DistrictId=${districtId}`
    );
    if (res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getEmployeeDataForPF = async (
  accId,
  buId,
  fromYearId,
  toYearId,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/GetEmployeeDataForPFInvestment?accountId=${accId}&businessUnitId=${buId}&fromMonthYear=${fromYearId}&toMonthYear=${toYearId}`
    );
    if (res?.data) {
      setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const savePFInvestment = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/CreatePFInvestment`, payload);
    cb && cb();
    toast.success(res?.data?.message || "Submitted Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
    setLoading && setLoading(false);
  }
};

export const getPFLanding = async (
  accId,
  buId,
  pageNo,
  pageSize,
  search,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);
  let searchTxt = search ? `&searchTxt=${search}` : "";
  try {
    const res = await axios.get(
      `/Employee/GetPFInvestmentLanding?accountId=${accId}&businessUnitId=${buId}&pageNo=${pageNo}&pageSize=${pageSize}${searchTxt}`
    );
    if (res?.data) {
      setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getPFInvestmentViewData = async (
  id,
  setter,
  setAllData,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(`/Employee/GetPFInvestmentById?HeaderId=${id}`);
    if (res?.data) {
      setter && setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getValidPFInvestmentPeriod = async (
  accId,
  buId,
  setter,
  setLoading
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/GetValidPFInvestmentPeriod?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
