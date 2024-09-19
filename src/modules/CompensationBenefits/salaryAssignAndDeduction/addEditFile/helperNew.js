import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";
import DefaultInput from "common/DefaultInput";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AvatarComponent from "../../../../common/AvatarComponent";
import { excelFileToArray } from "../../../../utility/excelFileToJSON";
import { numberWithCommas } from "../../../../utility/numberWithCommas";
import { bulkEmpInputHandler } from "./helper";

export const initData = {
  searchString: "",
  isAutoRenew: "",
  fromMonth: "",
  toMonth: "",
  salaryType: "",
  allowanceAndDeduction: "",
  amountDimension: "",
  amount: "",
  bulkFile: "",
};

export const validationSchema = Yup.object().shape({
  fromMonth: Yup.string().required("From month is required"),
  salaryType: Yup.object()
    .shape({
      label: Yup.string().required("Allowance type is required"),
      value: Yup.string().required("Allowance type is required"),
    })
    .typeError("Allowance type is required"),
  allowanceAndDeduction: Yup.object()
    .shape({
      label: Yup.string().required("Allowance and deduction type is required"),
      value: Yup.string().required("Allowance and deduction type is required"),
    })
    .typeError("Allowance and deduction type is required"),
  amountDimension: Yup.object()
    .shape({
      label: Yup.string().required("Amount dimension is required"),
      value: Yup.string().required("Amount dimension type is required"),
    })
    .typeError("Amount dimension type is required"),
  amount: Yup.number()
    .min(0, "Amount should be positive number")
    .required("Amount is required"),
});

export const validationSchema2 = Yup.object().shape({
  fromMonth: Yup.string().required("From month is required"),
  salaryType: Yup.object()
    .shape({
      label: Yup.string().required("Allowance type is required"),
      value: Yup.string().required("Allowance type is required"),
    })
    .typeError("Allowance type is required"),
});

export const empListColumn = (page, paginationSize, headerList) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      render: (record) => {
        return (
          <div className="d-flex align-items-center">
            <span className="ml-2">{record?.strEmployeeName}</span>
          </div>
        );
      },
      sort: true,
      filter: false,
      fieldType: "string",
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sort: true,
      filter: false,
      // filterDropDownList: headerList[`strDepartmentList`],
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sort: true,
      filter: false,
      // filterDropDownList: headerList[`strDesignationList`],
      fieldType: "string",
    },
    {
      title: "Workplace",
      dataIndex: "strWorkplaceName",
      sort: true,
      filter: false,
      fieldType: "string",
    },
    // {
    //   title: "",
    //   dataIndex: "",
    //   render: (_, index) => {
    //     return (
    //       <div className="d-flex">
    //         <Tooltip title="Delete" arrow>
    //           <button type="button" className="iconButton">
    //             <DeleteOutlineOutlinedIcon
    //               onClick={(e) => {
    //                 e.stopPropagation();
    //                 deleteHandler(index);
    //               }}
    //             />
    //           </button>
    //         </Tooltip>
    //       </div>
    //     );
    //   },
    // },
  ];
};

export const processDataFromExcelInAllowanceNDeduction = async (
  file,
  setIsBulkAssign,
  setBulkLanding,
  employeeId,
  orgId,
  buId,
  wgId,
  setIsLoadingBulk
) => {
  try {
    const processData = await excelFileToArray(
      file,
      "BulkAddition and Deduction"
    );
    if (processData.length < 1) return toast.warn("No data found!");
    setIsBulkAssign(true);
    processBulkUploadAllowanceNDeduction(
      processData,
      setBulkLanding,
      setIsLoadingBulk,
      orgId,
      employeeId,
      buId,
      wgId
    );
  } catch (error) {
    toast.warn("Failed to process!");
  }
};

const processBulkUploadAllowanceNDeduction = (
  processData,
  setBulkLanding,
  setIsLoadingBulk,
  orgId,
  employeeId,
  buId,
  wgId
) => {
  setIsLoadingBulk && setIsLoadingBulk(true);
  try {
    let modifiedData = processData.map((item) => {
      let isBool = null;
      if (typeof item?.IsAddition === "string") {
        isBool =
          item?.IsAddition?.trim()?.toLowerCase() === "true"
            ? true
            : item?.IsAddition?.trim()?.toLowerCase() === "false"
            ? false
            : null;
      } else {
        isBool = Boolean(item?.IsAddition);
      }
      let obj = { attendenceStatusRequired: false, maxAmountRequired: false };
      if (item?.["Allowance Duration"].toLowerCase() === "perday") {
        if (!item?.["Allowance Attendence Status"]) {
          obj = {
            ...obj,
            attendenceStatusRequired: true,
          };
        }
        if (!item?.["Max Amount"]) {
          obj = {
            ...obj,
            maxAmountRequired: true,
          };
        }
      }
      return {
        ...item,
        ...obj,
        intSalaryAdditionAndDeductionId: 0,
        intAccountId: orgId,
        intBusinessUnitId: buId,
        intWorkplaceGroupId: wgId,
        employeeCode: item?.["Employee Code"] || 0,
        isAutoRenew: item?.IsAutoRenew,
        intYear: item?.["From Year"] || 0,
        intMonth: getMonthId(item?.["From Month"]) || 0,
        strMonth: item?.["From Month"] || "",
        // isAddition:
        //   item?.IsAddition?.trim()?.toLowerCase() === "true" ? true : false,
        isAddition: isBool,
        strAdditionNDeduction: item?.["AllowanceOrDeduction Type"] || "",
        strDuration: item?.["Allowance Duration"] || "",
        maxAmount: item?.["Max Amount"] || 0,
        attendenceStatus: item?.["Allowance Attendence Status"] || "",
        intAmountWillBeId: 3,
        strAmountWillBe: item?.["Depend On"] || "",
        numAmount: item?.["Amount/Percentage"] || 0,
        isActive: true,
        isReject: true,
        intActionBy: employeeId,
        intToYear: item?.["To Year"],
        intToMonth: getMonthId(item?.["To Month"]) || 0,
        strToMonth: item?.["To Month"] || "",
      };
    });
    setBulkLanding?.(modifiedData);
    setIsLoadingBulk?.(false);
  } catch (error) {
    setBulkLanding([]);
    setIsLoadingBulk?.(false);
    toast.warn("Failed to process!");
  }
};

function getMonthId(monthName) {
  const monthMap = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };
  const regex = new RegExp(`^${monthName?.trim()}$`, "i");
  for (const [name, id] of Object.entries(monthMap)) {
    if (regex.test(name)) {
      return id;
    }
  }
  return null;
}

export const bulkLandingTbCol = (
  page,
  paginationSize,
  setBulkLanding,
  bulkLandingRowDto
) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "",
      render: (text, record, index) => {
        return (
          <div className="d-flex align-items-center">
            {record?.afterApiResponse &&
              (record?.message ? (
                <CancelOutlinedIcon
                  sx={{
                    color: "red",
                  }}
                />
              ) : (
                <CheckCircleOutlineIcon
                  sx={{
                    color: "green",
                  }}
                />
              ))}
          </div>
        );
      },
      hidden: bulkLandingRowDto[0]?.afterApiResponse ? false : true,
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      className: "text-start",
    },
    {
      title: "Employee",
      dataIndex: "Employee Name",
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.["Employee Name"]}
            />
            <span className="ml-2">{record?.["Employee Name"]}</span>
          </div>
        );
      },
      filter: true,
    },

    {
      title: "From Month",
      sorter: false,
      filter: false,
      className: "text-start",
      render: (text, record, index) => `${record?.strMonth} ${record?.intYear}`,
    },
    {
      title: "To Month",
      sorter: false,
      filter: false,
      className: "text-start",
      render: (text, record, index) =>
        record?.strToMonth ? `${record?.strToMonth} ${record?.intToYear}` : "",
    },
    {
      title: "Type",
      sorter: false,
      filter: false,
      className: "text-start",
      render: (text, record, index) =>
        record?.isAddition ? "Addition" : "Deduction",
    },
    {
      title: "Addition/Deduction Name",
      sorter: false,
      filter: false,
      className: "text-start",
      dataIndex: "strAdditionNDeduction",
    },
    {
      title: "Allowance Duration",
      sorter: false,
      filter: false,
      className: "text-start",
      render: (text, record, index) => record?.strDuration || "N/A",
    },
    {
      title: "Max Amount",
      sorter: false,
      filter: false,
      className: "text-right",
      dataIndex: "maxAmount",
      render: (text, record, index) => {
        return (
          <div style={{ width: "100%" }}>
            {record?.maxAmountRequired ? (
              <>
                <div style={{ border: "3px solid red" }}>
                  <DefaultInput
                    style={{ backgroundColor: "red", color: "white" }}
                    classes="input-sm"
                    value={record?.maxAmount}
                    placeholder=""
                    name="maxAmount"
                    type="number"
                    className="form-control"
                    onChange={(e) => {
                      bulkEmpInputHandler(
                        e.target.value,
                        "maxAmount",
                        index,
                        setBulkLanding,
                        bulkLandingRowDto
                      );
                    }}
                  />
                </div>
              </>
            ) : (
              numberWithCommas(record?.maxAmount)
            )}
          </div>
        );
      },
    },
    {
      title: "Allowance Attendence Status",
      sorter: false,
      filter: false,
      className: "text-start",
      dataIndex: "attendenceStatus",
      render: (text, record, index) => {
        return (
          <div style={{ width: "100%" }}>
            {record?.attendenceStatusRequired ? (
              <>
                <div style={{ border: "3px solid red" }}>
                  <DefaultInput
                    style={{ backgroundColor: "red", color: "white" }}
                    classes="input-sm"
                    value={record?.attendenceStatus}
                    placeholder=""
                    name="attendenceStatus"
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      bulkEmpInputHandler(
                        e.target.value,
                        "attendenceStatus",
                        index,
                        setBulkLanding,
                        bulkLandingRowDto
                      );
                    }}
                  />
                </div>
              </>
            ) : (
              numberWithCommas(record?.attendenceStatus)
            )}
          </div>
        );
      },
    },
    {
      title: "Amount Dimension",
      sorter: false,
      filter: false,
      className: "text-start",
      dataIndex: "strAmountWillBe",
    },
    {
      title: "Amount",
      sorter: false,
      filter: false,
      className: "text-right",
      dataIndex: "numAmount",
      render: (text, record, index) => numberWithCommas(record?.numAmount),
    },
    {
      title: "Alert",
      className: "text-start",
      dataIndex: "message",
      hidden: bulkLandingRowDto[0]?.afterApiResponse ? false : true,
    },
  ].filter((i) => !i?.hidden);
};
export const assignedBulkTbleCol = (page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Emp Id",
      dataIndex: "employeeCode",
      className: "text-start",
    },
    {
      title: "Employee",
      dataIndex: "Employee Name",
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.employeeName}
            />
            <span className="ml-2">{record?.employeeName}</span>
          </div>
        );
      },
    },

    {
      title: "From Month",
      sorter: false,
      filter: false,
      className: "text-start",
      render: (text, record, index) => `${record?.strMonth} ${record?.intYear}`,
    },
    {
      title: "To Month",
      sorter: false,
      filter: false,
      className: "text-start",
      render: (text, record, index) =>
        `${record?.strToMonth} ${record?.intToYear}`,
    },
    {
      title: "Type",
      sorter: false,
      filter: false,
      className: "text-start",
      render: (text, record, index) =>
        record?.isAddition ? "Addition" : "Deduction",
    },
    {
      title: "Addition/Deduction Name",
      sorter: false,
      filter: false,
      className: "text-start",
      dataIndex: "strAdditionNDeduction",
    },
    {
      title: "Amount Dimension",
      sorter: false,
      filter: false,
      className: "text-start",
      dataIndex: "strAmountWillBe",
    },
    {
      title: "Amount",
      sorter: false,
      filter: false,
      className: "text-right",
      dataIndex: "numAmount",
      render: (text, record, index) => numberWithCommas(record?.numAmount),
    },
  ];
};

const updateArData = (ar, response, message) => {
  return ar.map((item) => {
    // Find the corresponding employee in the response array
    const matchedResponse = response.find(
      (r) => r.strEmployeeCode == item.employeeCode
    );

    // If a match is found, update the fields
    if (matchedResponse) {
      return {
        ...item,
        "Employee Code": matchedResponse.strEmployeeCode,
        "Employee Name":
          matchedResponse.strEmployeeName || item?.["Employee Name"],
        intEmployeeBasicInfoId: matchedResponse.intEmployeeBasicInfoId,
        intGenderId: matchedResponse.intGenderId,
        strGender: matchedResponse.strGender,
        intReligionId: matchedResponse.intReligionId,
        strReligion: matchedResponse.strReligion,
        intDepartmentId: matchedResponse.intDepartmentId,
        intSectionId: matchedResponse.intSectionId,
        intDesignationId: matchedResponse.intDesignationId,
        dteDateOfBirth: matchedResponse.dteDateOfBirth,
        dteJoiningDate: matchedResponse.dteJoiningDate,
        dteProbationaryCloseDate: matchedResponse.dteProbationaryCloseDate,
        intSupervisorId: matchedResponse.intSupervisorId,
        intLineManagerId: matchedResponse.intLineManagerId,
        isSalaryHold: matchedResponse.isSalaryHold,
        isActive: matchedResponse.isActive,
        intWorkplaceId: matchedResponse.intWorkplaceId,
        intBusinessUnitId: matchedResponse.intBusinessUnitId,
        intEmploymentTypeId: matchedResponse.intEmploymentTypeId,
        strEmploymentType: matchedResponse.strEmploymentType,
        strReferenceId: matchedResponse.strReferenceId,
        intWorkplaceGroupId: matchedResponse.intWorkplaceGroupId,
        message: message,
        afterApiResponse: true,
      };
    }

    // Return the original item if no match is found
    return { ...item, afterApiResponse: true };
  });
};

export const saveBulkUploadAction = async (
  bulkLandingRowDto,
  setLoading,
  setShowExistModal,
  setAssignedBulkEmp,
  isForceAssign = false,
  isSkipNAssign = false,
  cb,
  setBulkLanding
) => {
  const msgList = [
    "Invalid data list",
    "Sorry, your organization information is not valid please try again",
    "Unmatched employee data for current company",
    "One or more selected additioin and deduction element(s) was not found",
    "One or more selected employee already exists for this month",
    "One or more selected employee already exists for this month or Auto Renew",
  ];
  const error = bulkLandingRowDto?.some(
    (item) => item?.attendenceStatusRequired || item?.maxAmountRequired
  );
  if (error) {
    return toast.warn(
      `Please provide maxAmount and attendenceStatus for items with Allowance Duration 'perday'`
    );
  }
  const bulkSalaryAdditionNDeductions = bulkLandingRowDto?.map((item) => {
    return {
      intSalaryAdditionAndDeductionId:
        item?.intSalaryAdditionAndDeductionId || 0,
      intAccountId: item?.intAccountId,
      intBusinessUnitId: item?.intBusinessUnitId,
      intWorkplaceGroupId: item?.intWorkplaceGroupId,
      employeeCode: `${item?.employeeCode}` || 0,
      isAutoRenew: item?.IsAutoRenew,
      intYear: item?.intYear || 0,
      intMonth: item?.intMonth || 0,
      strMonth: item?.strMonth || "",
      isAddition: item?.isAddition,
      strAdditionNDeduction: item?.["AllowanceOrDeduction Type"] || "",
      intAmountWillBeId: 0,
      strAmountWillBe: item?.strAmountWillBe || item?.strAmountWillBe || "",
      numAmount: item?.numAmount || 0,
      strDuration: item?.strDuration || "",
      maxAmount: +item?.maxAmount || 0,
      attendenceStatus: item?.attendenceStatus || "",
      isActive: true,
      isReject: false,
      intActionBy: item?.intActionBy,
      intToYear: item?.intToYear || null,
      intToMonth: item?.intToMonth || null,
      strToMonth: item?.strToMonth || null,
    };
  });

  const payload = {
    isForceAssign: isForceAssign,
    isSkipNAssign: isSkipNAssign,
    bulkSalaryAdditionNDeductions,
  };

  try {
    setLoading(true);
    const res = await axios.post(
      `/Employee/BulkSalaryAdditionNDeduction`,
      payload
    );
    setLoading(false);
    cb?.();
    toast.success(res?.data?.message || "Bulk Submitted successfully");
  } catch (error) {
    const res = error?.response?.data;

    const isExist = msgList.filter((i) => i === res?.message);
    console.log({ isExist });
    if (res?.message === "Exists" && !isForceAssign && !isSkipNAssign) {
      setLoading?.(false);
      setShowExistModal?.(true);
      setAssignedBulkEmp?.(res?.validationData);
    } else if (isExist?.length > 0) {
      const updatedAr = updateArData(
        bulkLandingRowDto,
        res?.validationData,
        res?.message
      );
      setBulkLanding(updatedAr);
      console.log({ updatedAr });

      setLoading(false);
    } else {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Bulk Submitted failed");
    }
  }
};

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
