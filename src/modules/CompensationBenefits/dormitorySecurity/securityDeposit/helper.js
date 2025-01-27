import { toast } from "react-toastify";
import { excelFileToArray } from "utility/excelFileToJSON";
const processBulkUploadSecurityDeposit = (
  processData,

  orgId,
  employeeId,
  buId,
  wgId,
  setLoading,
  setLanding
) => {
  setLoading && setLoading(true);
  try {
    let modifiedData = processData.map((item) => {
      return {
        ...item,
        intSalaryAdditionAndDeductionId: 0,
        intAccountId: orgId,
        intBusinessUnitId: buId,
        intWorkplaceGroupId: wgId,
        employeeCode: item?.["Employee Code"] || 0,
        employeeName: item?.["Employee Name"] || "",
        depositeMoney: item?.["Deposits Money"] || 0,
        remarks: item?.["Comments"] || "",
      };
    });
    setLanding?.(modifiedData);
    setLoading?.(false);
  } catch (error) {
    setLanding([]);
    setLoading?.(false);
    toast.warn("Failed to process!");
  }
};
export const processDataFromExcelSecurityDeposit = async (
  file,
  employeeId,
  orgId,
  buId,
  wgId,
  setLoading,
  setLanding
) => {
  try {
    const processData = await excelFileToArray(file, "SecurityDeposit");
    if (processData.length < 1) return toast.warn("No data found!");
    processBulkUploadSecurityDeposit(
      processData,
      orgId,
      employeeId,
      buId,
      wgId,
      setLoading,
      setLanding
    );
  } catch (error) {
    toast.warn("Failed to process!");
  }
};
