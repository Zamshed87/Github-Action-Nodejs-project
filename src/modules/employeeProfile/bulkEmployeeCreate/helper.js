import axios from "axios";
import { toast } from "react-toastify";
import { todayDate } from "../../../utility/todayDate";

export const processBulkUploadEmployeeAction = async (
  data,
  setter,
  setLoading,
  intUrlId,
  orgId,
  employeeId
) => {
  setLoading && setLoading(true);
  try {
    console.log(data);
    let modifiedData = data.map((item) => ({
      intEmpBulkUploadId: 0,
      intAccountId: orgId,
      intUrlId: intUrlId,
      intIdentitySlid: item["INDENTITY SL"] || "",
      strBusinessUnit: item["Business Unit"] || "",
      strWorkplaceGroup: item["Workplace Group"] || "",
      strWorkplace: item["Workplace"] || "",
      strDepartment: item["Department"] || "",
      strDesignation: item["Designation"] || "",
      strHrPosition: "",
      strEmploymentType: item["Employment Type"] || "",
      strEmployeeName: item["Employee Name"] || "",
      strEmployeeCode: item["Employee ID"] + "" || "",
      strCardNumber: item["Card Number"] + "" || "",
      strGender: item["Gender"] || "",
      isSalaryHold: JSON.parse(item["Salary Hold"].toLowerCase()),
      strReligionName: item["Religion Name"] || "",
      dteDateOfBirth: item["Date Of Birth"] || null,
      dteJoiningDate: item["Joining Date"] || null,
      dteInternCloseDate: item["Intern Close Date"] || null,
      dteProbationaryCloseDate: item["Probationary Close Date"] || null,
      dteContactFromDate: item["Contact From Date"] || null,
      dteContactToDate: item["Contact To Date"] || null,
      strSupervisorCode: item["Supervisor"] + "" || "",
      strDottedSupervisorCode: item["Dotted Supervisor"] + "" || "",
      strLineManagerCode: item["Line Manager"] + "" || "",
      strLoginId: item["Login ID"] + "" || "",
      strPassword: item["Password"] + "" || "",
      strEmailAddress: item["Email"]?.text || "",
      strPhoneNumber: item["Phone Number"] || "",
      strDisplayName: item["Display Name"] || "",
      strUserType: item["User Type"] || "",
      strWingName: item["Wing"] || "",
      strSoleDepoName: item["Sole Depot"] || "",
      strRegionName: item["Region"] || "",
      strAreaName: item["Area"] || "",
      strTerritoryName: item["Territory"] || "",
      isProcess: false,
      isActive: true,
      intCreateBy: employeeId,
      dteCreateAt: todayDate(),
    }));
    setter(modifiedData);
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
    toast.warn("Failed to process!");
  }
};

export const saveBulkUploadEmployeeAction = async (
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
