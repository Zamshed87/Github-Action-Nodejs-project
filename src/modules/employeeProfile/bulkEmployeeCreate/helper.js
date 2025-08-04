import axios from "axios";
import { toast } from "react-toastify";
import { dateFormatterForInput } from "utility/dateFormatter";
import { todayDate } from "../../../utility/todayDate";

export const processBulkUploadEmployeeAction = async (
  data,
  setter,
  setLoading,
  intUrlId,
  orgId,
  employeeId,
  setRowData,
  setErrorRowOpen
) => {
  setLoading && setLoading(true);
  try {
    const modifiedData = data.map((item) => ({
      intEmpBulkUploadId: 0,
      intAccountId: orgId,
      intUrlId: intUrlId,
      intIdentitySlid: item["INDENTITY SL"] || 0,
      strBusinessUnit: item["Business Unit"] || "",
      strWorkplaceGroup: item["Workplace Group"] || "",
      strWorkplace: item["Workplace"] || "",
      strDepartment: item["Department"] || "",
      strEmpDivision: item["Employee Division"] || "",
      strDesignation: item["Designation"] || "",
      strHrPosition: item["HR Position"] || "",
      strEmploymentType: item["Employment Type"] || "",
      strEmployeeName: item["Employee Name"] || "",
      strEmployeeCode: item["Employee Code"] + "" || "",
      strCardNumber: item["Card Number"] + "" || "",
      strGender: item["Gender"] || "",
      isSalaryHold: item["Salary Hold"]
        ? JSON.parse(item["Salary Hold"]?.toLowerCase())
        : false,
      strReligionName: item["Religion Name"] || "",
      dteDateOfBirth: item["DateOfBirth"]
        ? dateFormatterForInput(item["DateOfBirth"])
        : null,
      dteJoiningDate: item["Joining Date"]
        ? dateFormatterForInput(item["Joining Date"])
        : null,
      dteConfirmationDate: item["Confirmation Date"] || null,
      dteInternCloseDate: item["InternCloseDate"] || null,
      ProbationaryEndInDays: item["Probation Period"] || null,
      dteProbationaryCloseDate: item["ProbationaryCloseDate"] || null,
      dteContactFromDate: item["Contact From Date"] || null,
      dteContactToDate: item["Contact To Date"] || null,
      strSupervisorCode: item["Supervisor"] + "" || "",
      strDottedSupervisorCode: item["Dotted Supervisor"] + "" || "",
      strLineManagerCode: item["Line Manager"] + "" || "",
      strLoginId: item["Login ID"] + "" || "",
      strPassword: item["Password"] + "" || "",
      strEmailAddress: item["Email"]?.text || "",
      strPhoneNumber: item["Phone Number"]
        ? String(item["Phone Number"]).trim().charAt(0) !== "0"
          ? "0" + String(item["Phone Number"]).trim()
          : String(item["Phone Number"]).trim()
        : "-",
      strDisplayName: item["Display Name"] || "",
      strReferenceId: item["Machine ID"] ? item["Machine ID"] + "" : null,
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
      strSection: item["Section"] || "",
      strSalaryType: item["Salary Type"] || "Daily",
      intOtTypeName:
        item["OT Type"] === 2
          ? "With Salary"
          : item["OT Type"] === 3
          ? "Without Salary/Additional OT"
          : "Not Applicable",
      intOtTypeId: +item["OT Type"],
      intOTFixedHour: +item?.["OT Fixed Hour"] || 0,
      strJobLocation: item["Job Location"] || "",
      strJobTerritory: item["Job Territory"] || "",
      strPayScaleGrade: item["Pay Scale Grade"] || "",
    }));
    const errorData = [];
    const cleanData = [];
    modifiedData.forEach((item) => {
      if (
        !Boolean(item?.strBusinessUnit) ||
        !Boolean(item?.strWorkplace) ||
        !Boolean(item?.strWorkplaceGroup) ||
        !Boolean(item?.strWorkplaceGroup) ||
        !Boolean(item?.strDepartment) ||
        !Boolean(item?.strDesignation) ||
        !Boolean(item?.strHrPosition) ||
        !Boolean(item?.strEmployeeName) ||
        !Boolean(item?.strEmploymentType) ||
        !Boolean(item?.strEmployeeCode) ||
        !Boolean(item?.strReferenceId) ||
        !Boolean(item?.strGender) ||
        !Boolean(item?.strSalaryType) ||
        !Boolean(item?.strReligionName) ||
        !Boolean(item?.dteDateOfBirth) ||
        !Boolean(item?.dteJoiningDate) ||
        !Boolean(item?.dteConfirmationDate) ||
        !Boolean(item?.strSupervisorCode) ||
        !Boolean(item?.strDottedSupervisorCode) ||
        !Boolean(item?.strLineManagerCode) ||
        !Boolean(item?.strUserType) ||
        !Boolean(item?.strBusinessUnit) ||
        item?.strWorkplace == "undefined" ||
        item?.strWorkplaceGroup == "undefined" ||
        item?.strWorkplaceGroup == "undefined" ||
        item?.strDepartment == "undefined" ||
        item?.strDesignation == "undefined" ||
        item?.strHrPosition == "undefined" ||
        item?.strEmployeeName == "undefined" ||
        item?.strEmploymentType == "undefined" ||
        item?.strEmployeeCode == "undefined" ||
        item?.strReferenceId == "undefined" ||
        item?.strGender == "undefined" ||
        item?.strSalaryType == "undefined" ||
        item?.strReligionName == "undefined" ||
        item?.dteDateOfBirth == "undefined" ||
        item?.dteJoiningDate == "undefined" ||
        item?.dteConfirmationDate == "undefined" ||
        item?.strSupervisorCode == "undefined" ||
        item?.strDottedSupervisorCode == "undefined" ||
        item?.strLineManagerCode == "undefined" ||
        item?.strUserType == "undefined"
      ) {
        errorData.push(item);
      } else {
        cleanData.push({
          ...item,
        });
      }
    });
    console.log({ errorData });
    setter(orgId === 6 ? cleanData : modifiedData);
    setRowData(orgId === 6 ? errorData : []);
    setErrorRowOpen(orgId === 6 && errorData?.length > 0 ? true : false);
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
    console.log("res", res);
  } catch (error) {
    setLoading(false);
    setErrorData(error?.response?.data?.listData);
    setOpen(true);
    console.log("error", error?.response);
    toast.error(error?.response?.data?.message || "Failed to process!");
  }
};
