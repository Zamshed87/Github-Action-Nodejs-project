import axios from "axios";
import Remarks from "modules/employeeProfile/employeeOverview/components/others/Remarks";
import { toast } from "react-toastify";
import { dateFormatterForInput } from "utility/dateFormatter";
import { todayDate } from "utility/todayDate";

/* export const getAllTransferAndPromotionLanding = async (
  orgId,
  buId,
  landingType,
  setter,
  setAllData,
  setLoading,
  fromDate,
  toDate,
) => {
  setLoading && setLoading(true);
  const filterDate = `dteFromDate=${fromDate}&dteToDate=${toDate}`
  try {
    const res = await axios.get(
      `/Employee/GetAllEmpTransferNpromotion?accountId=${orgId}&businessUnitId=${buId}&landingType=${landingType}&${filterDate}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setAllData && setAllData(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
}; */

export const addEditTransferAndPromotion = async (payload, cb, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/Employee/SaveEmpTransferNpromotion`,
      payload
    );
    setLoading && setLoading(false);
    cb && cb();
    toast.success(res?.data?.message || "Submitted Successfully");
  } catch (error) {
    setLoading && setLoading(false);
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

export const getTransferAndPromotionHistoryById = async (
  orgId,
  employeeId,
  setter,
  setLoading,
  buId,
  wgId
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/GetEmpTransferNpromotionHistoryByEmployeeId?businessUnitId=${buId}&employeeId=${employeeId}&workplaceGroupId=${wgId}`
    );
    if (res?.data) {
      setter && setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const deleteTransferAndPromotionHistoryById = async (
  id,
  employeeId,
  history
) => {
  try {
    const res = await axios.put(
      `/Employee/DeleteEmpTransferNpromotion?id=${id}&actionBy=${employeeId}`
    );
    toast.success(res?.data?.message || "Deleted Successfully");
    history.push("/profile/transferandpromotion/transferandpromotion");
  } catch (error) {
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};

export const releaseEmpTransferNPromotion = async (
  values,
  singleData,
  orgId,
  employeeId,
  setLoading,
  cb
) => {
  try {
    setLoading(true);
    const res = await axios.put(
      `/Employee/ReleaseEmpTransferNpromotion?accountId=${orgId}&employeeId=${
        singleData?.intEmployeeId
      }&substitutionEmployeeId=${
        values?.substituteEmployee?.value || 0
      }&transferNPromotionId=${
        singleData?.intTransferNpromotionId || 0
      }&ReleaseDate=${values?.releaseDate}&actionBy=${employeeId}`
    );

    setLoading(false);
    cb && cb();
    toast.success(res?.data?.message);
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message);
  }
};

export const saveBulkUploadTnP = async (
  setLoading,
  setOpen,
  setErrorData,
  data,
  callback
) => {
  setLoading(true);
  try {
    const res = await axios.post(`/Employee/SaveEmployeeBulkUpload`, data);
    callback();
    setLoading(false);
    toast.success(res?.data?.message || "Successful");
  } catch (error) {
    setLoading(false);
    setErrorData(error?.response?.data?.listData);
    setOpen(true);
    error?.response?.data?.listData?.length < 0 &&
      toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};

export const processBulkUploadTnP = async (
  data,
  setter,
  setLoading,
  intUrlId,
  orgId,
  employeeId
) => {
  setLoading && setLoading(true);
  try {
    const modifiedData = data.map((item) => ({
      intEmpBulkUploadId: 0,
      intAccountId: orgId,
      intUrlId: intUrlId,
      employeeName: item["Employee Name *"] || "",
      type: item["Type"] || "",
      effDate: item["Effective Date * (YYYY-MM-DD)"] || "",
      bUnit: item["To BusinessUnit"] || "",
      wGroup: item["To Workplace Group "] || "", // hdhdh
      workplace: item["To Workplace  "] || "",
      empType: item["To Employment Type"] || "",
      strHrPosition: item["To HR Position"] || "",
      department: item["To Department"] || "",
      section: item["To Section"] || "",
      designation: item["To Designation"] + "" || "",
      superVision: item["To Supervisor"] + "" || "",
      dottedSupervision: item["To Dotted Supervisor"] + "" || "",
      lineManager: item["To Line Manager"] + "" || "",
      remarks: item["Remarks"] + "" || "",
    }));

    setter(modifiedData);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
    toast.warn("Failed to process!");
  }
};
