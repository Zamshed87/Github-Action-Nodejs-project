import axios from "axios";
import { toast } from "react-toastify";
import { todayDate } from "../../../utility/todayDate";

export const processBulkUploadEmployeeAction = async (
  data,
  setter,
  setLoading,
  orgId,
  employeeId
) => {
  setLoading && setLoading(true);
  try {
    const modifiedData = data.map((item) => ({
      strEmployeeCode: item["Employee Code"] || "",
      employeeName: item["Employee Name"] || "",
      strDesignation: item["Designation"] || "",
      strDepartment: item["Department"] || "",
      isTakeHomePay: item["Take Home Pay"],
      numGrossSalary: item["Gross Salary"] || "",
      numTaxAmount: item["Tax Amount"] || 0,
      intAccountId: orgId,
      isActive: true,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
    }));
    setter(modifiedData);
    setLoading && setLoading(false);
  } catch (error) {
    setLoading && setLoading(false);
    toast.warn("Failed to process!");
  }
};

export const saveBulkUploadEmployeeAction = async (
  setLoading,
  data,
  callback
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Employee/SaveTaxBulkUpload`, data);
    callback();
    setLoading && setLoading(true);
    toast.success(res?.data?.message || "Successful");
  } catch (error) {
    setLoading && setLoading(false);
    toast.warn(error?.response?.data?.message || "Failed, try again");
  }
};
