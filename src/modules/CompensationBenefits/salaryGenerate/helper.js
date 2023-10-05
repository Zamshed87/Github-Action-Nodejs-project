import axios from "axios";
import { toast } from "react-toastify";
import {
  dateFormatter,
  dateFormatterForInput,
} from "../../../utility/dateFormatter";
import { currentMonth } from "../../../utility/monthUtility";
import { numberWithCommas } from "../../../utility/numberWithCommas";
import { createCommonExcelFile } from "../../../utility/customExcel/generateExcelAction";
import { Cell } from "../../../utility/customExcel/createExcelHelper";
import { withDecimal } from "../../../utility/numberToWord";

// salary generate request
export const createSalaryGenerateRequest = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(`/Payroll/SalaryCRUD`, payload);
    cb && cb();
    toast.success(res.data?.[0].returnMessage || "Successfully");
    setLoading && setLoading(false);
  } catch (error) {
    toast.warn(
      error?.response?.data?.[0].returnMessage || "Something went wrong!"
    );
    setLoading && setLoading(false);
  }
};

// salary generate landing
const currentYear = new Date().getFullYear();
export const getSalaryGenerateRequestLanding = async (
  partName,
  orgId,
  buId,
  wgId,
  wId,
  monthId,
  yearId,
  fromDate,
  toDate,
  setter,
  setAllData,
  setLoading,
  wing = 0,
  soleDepo = 0,
  region = 0,
  area = 0,
  territory = 0
) => {
  setLoading && setLoading(true);

  let fromDateParams = fromDate ? `&GenerateFromDate=${fromDate}` : "";
  let toDateParams = toDate ? `&GenerateToDate=${toDate}` : "";

  // DDL
  let wingParams = wing ? `&WingId=${wing}` : "";
  let soleDepoParams = soleDepo ? `&SoleDepoId=${soleDepo}` : "";
  let regionParams = region ? `&RegionId=${region}` : "";
  let areaParams = area ? `&AreaId=${area}` : "";
  let territoryParams = territory ? `&TerritoryId=${territory}` : "";

  try {
    const res = await axios.get(
      `/Payroll/SalarySelectQueryAll?partName=${partName}&intBusinessUnitId=${buId}&intMonthId=${
        monthId || +currentMonth()
      }&intYearId=${
        yearId || currentYear
      }&intWorkplaceGroupId=${wgId}&intWorkplaceId=${wId || 0}&intBankOrWalletType=0${fromDateParams}${toDateParams}${wingParams}${soleDepoParams}${regionParams}${areaParams}${territoryParams}`
    );
    if (res?.data) {
      const modifyRowData = res?.data?.map((itm) => {
        return {
          ...itm,
          isSalaryGenerate: false,
        };
      });
      setAllData && setAllData(modifyRowData);
      setter && setter(modifyRowData);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

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

// salary generate landing by id in salary process
export const getSalaryGenerateRequestById = async (
  intAccountId,
  intBusinessUnitId,
  intMonth,
  intYear,
  intSalaryGenerateRequestId,
  setter,
  setAllData,
  setLoading,
  wgId
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/Payroll/SalarySelectQueryAll?partName=GeneratedSalaryReportHeaderLandingGroupByDepartment&intAccountId=${intAccountId}&intBusinessUnitId=${intBusinessUnitId}&intMonthId=${intMonth}&intYearId=${intYear}&intSalaryGenerateRequestId=${intSalaryGenerateRequestId}&intBankOrWalletType=0&intWorkplaceGroupId=${wgId}`
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
  cb,
  setFilterLanding
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/SalaryGenerateRequestLanding`,
      payload
    );
    if (res?.data) {
      setAllData && setAllData(res?.data);
      setter(res?.data);
      setFilterLanding?.(res?.data?.listData);
    }
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    setter([]);
    setLoading && setLoading(false);
  }
};

// salary generate approve and reject
export const salaryGenerateApproveReject = async (payload, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/SalaryGenerateRequestApproval`,
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

// get salary generate landing by id
export const getSalaryGenerateRequestLandingById = async (
  partName,
  orgId,
  buId,
  wgId,
  requestId,
  isMarge,
  monthId,
  yearId,
  fromDate,
  toDate,
  setter,
  setAllData,
  setLoading,
  wing = 0,
  soleDepo = 0,
  region = 0,
  area = 0,
  territory = 0
) => {
  setLoading && setLoading(true);

  let salaryRequestIdParams = requestId
    ? `&intSalaryGenerateRequestId=${requestId}`
    : "";

  let fromDateParams = fromDate ? `&GenerateFromDate=${fromDate}` : "";
  let toDateParams = toDate ? `&GenerateToDate=${toDate}` : "";

  // DDL
  let wingParams = wing ? `&WingId=${wing}` : "";
  let soleDepoParams = soleDepo ? `&SoleDepoId=${soleDepo}` : "";
  let regionParams = region ? `&RegionId=${region}` : "";
  let areaParams = area ? `&AreaId=${area}` : "";
  let territoryParams = territory ? `&TerritoryId=${territory}` : "";

  try {
    const res = await axios.get(
      `/Payroll/SalarySelectQueryAll?partName=${partName}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}${salaryRequestIdParams}${fromDateParams}${toDateParams}${wingParams}${soleDepoParams}${regionParams}${areaParams}${territoryParams}`
    );
    if (res?.data) {
      const modifyRowData = res?.data?.map((itm) => {
        return {
          ...itm,
          isSalaryGenerate:
            itm?.intSalaryGenerateRequestRowId > 0 ? true : false,
        };
      });

      // new employee load
      if (isMarge) {
        setLoading && setLoading(true);
        try {
          setLoading && setLoading(false);
          const secondRes = await axios.get(
            `/Payroll/SalarySelectQueryAll?partName=EmployeeListForSalaryGenerateRequest&intBusinessUnitId=${buId}&intMonthId=${monthId}&intYearId=${yearId}&intBankOrWalletType=0&intWorkplaceGroupId=${wgId}${fromDateParams}${toDateParams}${wingParams}${soleDepoParams}${regionParams}${areaParams}${territoryParams}`
          );

          if (secondRes?.data) {
            const modifyNewRowData = secondRes?.data?.map((itm) => {
              return {
                ...itm,
                isSalaryGenerate: false,
              };
            });
            setAllData && setAllData([...modifyRowData, ...modifyNewRowData]);
            setter([...modifyRowData, ...modifyNewRowData]);
            setLoading && setLoading(false);
          }
        } catch (error) {
          setLoading && setLoading(false);
        }
      } else {
        setAllData && setAllData(modifyRowData);
        setter(modifyRowData);
      }
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

// header info
export const getSalaryGenerateRequestHeaderId = async (
  partName,
  id,
  setter,
  setLoading,
  wgId,
  buId
) => {
  setLoading && setLoading(true);

  let idParams = id ? `&intSalaryGenerateRequestId=${id}` : "";

  try {
    const res = await axios.get(
      `/Payroll/SalarySelectQueryAll?partName=${partName}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}${idParams}`
    );
    if (res?.data) {
      // month default
      let initYear = res?.data[0]?.intYear; // 2022
      let initMonth = res?.data[0]?.intMonth; // 6
      let modifyMonthResult = initMonth <= 9 ? `0${initMonth}` : `${initMonth}`;

      let modifyObj = {
        ...res?.data[0],
        businessUnit: {
          value: res?.data[0]?.intBusinessUnitId,
          label: res?.data[0]?.strBusinessUnit,
        },
        payrollGroup: {
          value: res?.data[0]?.intPayrollGroupId,
          label: res?.data[0]?.strPayrollGroup,
        },
        description: res?.data[0]?.strDescription,
        monthYear: `${initYear}-${modifyMonthResult}`,
        monthId: res?.data[0]?.intMonth,
        yearId: res?.data[0]?.intYear,
        salaryTpe: {
          value: res?.data[0]?.strSalaryType,
          label: res?.data[0]?.strSalaryTypeLabel,
        },
        wing: {
          value: res?.data[0]?.intWingId,
          label: res?.data[0]?.wingName,
        },
        soleDepo: {
          value: res?.data[0]?.intSoleDepoId,
          label: res?.data[0]?.soleDepoName,
        },
        region: {
          value: res?.data[0]?.intRegionId,
          label: res?.data[0]?.regionName,
        },
        area: {
          value: res?.data[0]?.intAreaId,
          label: res?.data[0]?.areaName,
        },
        territory: {
          value: res?.data[0]?.intTerritoryId,
          label: res?.data[0]?.territoryName,
        },
        fromDate: dateFormatterForInput(res?.data[0]?.dteSalaryGenerateFrom),
        toDate: dateFormatterForInput(res?.data[0]?.dteSalaryGenerateTo),
      };
      setter(modifyObj);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

// row id
export const getSalaryGenerateRequestRowId = async (
  partName,
  id,
  setter,
  setAllData,
  setLoading,
  wgId,
  buId
) => {
  setLoading && setLoading(true);

  let idParams = id ? `&intSalaryGenerateRequestId=${id}` : "";

  try {
    const res = await axios.get(
      `/Payroll/SalarySelectQueryAll?partName=${partName}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}${idParams}`
    );
    if (res?.data) {
      const modifyRowData = res?.data?.map((itm) => {
        return {
          ...itm,
          isSalaryGenerate:
            itm?.intSalaryGenerateRequestRowId > 0 ? true : false,
        };
      });
      setter(modifyRowData);
      setAllData && setAllData(modifyRowData);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const salaryDetailsExcelColumn = {
  sl: "SL",
  strEmployeeName: "Employee Name",
  // intEmployeeId: "Employee Id",
  numGrossSalary: "Salary",
  numTotalAllowance: "Total Allowance",
  numTotalDeduction: "Total Deduction",
  netPay: "Net Pay",
  bankPay: "Bank Pay",
  degitalBankPay: "Digital Bank Pay",
  cashPay: "Cash Pay",
  strWorkplaceName: "Workplace Name",
  strWorkplaceGroupName: "Workplace Group",
  strPayrollGroupName: "Payroll Group",
};

const modifyObjFunc = (row, property) => {
  return row.reduce(
    (a, v) => ({ ...a, [v]: numberWithCommas(property[`${v}`].toString()) }),
    {}
  );
};

export const salaryDetailsExcelData = (tableHeader, tableRow) => {
  let newArr = [];
  newArr = tableRow.map((itm, index) => {
    return {
      sl: index + 1,
      strEmployeeName: itm?.strEmployeeName || " ",
      // intEmployeeId: itm?.strEmployeeCode || " ",
      numGrossSalary: numberWithCommas(itm?.numGrossSalary) || " ",
      numTotalAllowance: numberWithCommas(itm?.numTotalAllowance) || " ",
      numTotalDeduction: numberWithCommas(itm?.numTotalDeduction) || " ",
      netPay: numberWithCommas(itm?.netPay) || " ",
      bankPay: numberWithCommas(itm?.bankPay) || " ",
      degitalBankPay: numberWithCommas(itm?.degitalBankPay) || " ",
      cashPay: numberWithCommas(itm?.cashPay) || " ",
      strWorkplaceName: itm?.strWorkplaceName || " ",
      strWorkplaceGroupName: itm?.strWorkplaceGroupName || " ",
      strPayrollGroupName: itm?.strPayrollGroupName || " ",
      ...modifyObjFunc(tableHeader, itm),
      numOverTimeAmount: numberWithCommas(itm?.numOverTimeAmount) || " ",
      numTaxAmount: numberWithCommas(itm?.numTaxAmount) || " ",
      numLoanAmount: numberWithCommas(itm?.numLoanAmount) || " ",
      numPFAmount: numberWithCommas(itm?.numPFAmount) || " ",
    };
  });

  return newArr;
};

export const getEditDDLs = ({
  singleData,
  getPeopleDeskWithoutAllDDL,
  orgId,
  buId,
  wgId,
  setWingDDL,
  setSoleDepoDDL,
  setRegionDDL,
  setAreaDDL,
  setTerritoryDDL,
}) => {
  getPeopleDeskWithoutAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WingDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&ParentTerritoryId=0`,
    "WingId",
    "WingName",
    setWingDDL
  );
  getPeopleDeskWithoutAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=SoleDepoDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&ParentTerritoryId=${
      singleData?.wing?.value || 0
    }`,
    "SoleDepoId",
    "SoleDepoName",
    setSoleDepoDDL
  );
  getPeopleDeskWithoutAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=RegionDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&ParentTerritoryId=${
      singleData?.soleDepo?.value || 0
    }`,
    "RegionId",
    "RegionName",
    setRegionDDL
  );
  getPeopleDeskWithoutAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=AreaDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&ParentTerritoryId=${
      singleData?.region?.value || 0
    }`,
    "AreaId",
    "AreaName",
    setAreaDDL
  );
  getPeopleDeskWithoutAllDDL(
    `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=TerritoryDDL&BusinessUnitId=${buId}&WorkplaceGroupId=${wgId}&ParentTerritoryId=${
      singleData?.area?.value || 0
    }`,
    "TerritoryId",
    "TerritoryName",
    setTerritoryDDL
  );
};

const dynamicTableCellFunc = (arr) => {
  return arr.reduce((a, v) => ({ ...a, [v]: v }), {});
};
export const salaryDetailsExcelHeaderListObj = (
  tableColumn,
  tableAllowanceHead,
  tableDeductionHead
) => {
  return {
    sl: "SL",
    strEmployeeCode: "Employee ID",
    strEmployeeName: "Employee Name",
    strDesignation: "Designation",
    PIN: "PIN",
    dteJoiningDate: "Joining Date",
    intPresent: "Present",
    ApprovedLeave: "Approved Leave",
    intAbsent: "Absent",
    ...dynamicTableCellFunc(tableColumn),
    numGrossSalary: "Gross Salary",
    numArearSalary: "Arrear Salary",
    ...dynamicTableCellFunc(tableAllowanceHead),
    totalSalary: "Total Salary",
    numPFAmount: "PF",
    numTaxAmount: "Tax",
    ...dynamicTableCellFunc(tableDeductionHead),
    netPay: "Net Salary",
    numPFCompany: "PF (Com.)",
    numGratuity: "Gratuity",
    TotalPfNGratuity: "Total PF & Gratuity",
    totalCostNSalary: "Total Cost at Salary",
  };
};
export const createSalaryDetailsReportExcelHandeler = ({
  monthYear,
  buAddress,
  businessUnit,
  data,
  tableColumn,
  tableAllowanceHead,
  tableDeductionHead,
}) => {
  const tableHeader = salaryDetailsExcelHeaderListObj(
    tableColumn,
    tableAllowanceHead,
    tableDeductionHead
  );
  createCommonExcelFile({
    titleWithDate: `Salary Details Report ${monthYear}`,
    fromDate: "",
    toDate: "",
    buAddress,
    businessUnit,
    tableHeader,
    getTableData: () =>
      getTableDataForExcel(
        data,
        tableColumn,
        tableAllowanceHead,
        tableDeductionHead
      ),
    tableFooter: generateFooterData(
      data,
      tableColumn,
      tableAllowanceHead,
      tableDeductionHead
    ),
    tableHeadFontSize: "10",
    widthList,
    commonCellRange: "A1:K1",
    CellAlignment: "right",
    extraInfo: {
      text: `In Word: ${withDecimal(
        colSumForDetailsReport(data, "TotalCostOfSalary")
      )} Taka Only`,
      fontSize: 13,
      bold: true,
      cellRange: "A1:J1",
      merge: true,
      alignment: "left:middle",
    },
  });
};
const widthList = {
  A: 25,
  B: 20,
  C: 30,
  D: 30,
};
const getTableDataForExcel = (
  row,
  tableHeaderArr,
  tableAllowanceHead,
  tableDeductionHead
) => {
  const data = row?.map((item, index) => {
    return [
      new Cell(
        item?.DeptName?.trim()
          ? item?.DeptName === "Sub-Total:"
            ? "Sub-Total:"
            : `Depertment: ${item?.DeptName}`
          : item?.sl,
        "left",
        "text",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        !item?.DeptName?.trim() ? item?.strEmployeeCode : " ",
        "center",
        "text",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        !item?.DeptName?.trim() ? item?.strEmployeeName : " ",
        "left",
        "text",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        !item?.DeptName?.trim() ? item?.strDesignation : " ",
        "left",
        "text",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        !item?.DeptName?.trim() ? item?.PIN : " ",
        "center",
        "amount",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        !item?.DeptName?.trim() ? dateFormatter(item?.dteJoiningDate) : " ",
        "center",
        "text",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        !item?.DeptName?.trim() ? item?.intPresent : " ",
        "center",
        "amount",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        !item?.DeptName?.trim() ? item?.ApprovedLeave : " ",
        "right",
        "amount",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        !item?.DeptName?.trim() ? item?.intAbsent : " ",
        "right",
        "amount",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      ...dynamicTableHeadCellFunc(tableHeaderArr, item),
      new Cell(
        item?.DeptName?.trim()
          ? item?.DeptName === "Sub-Total:"
            ? `${numberWithCommas(item?.numGrossSalary)}`
            : ""
          : item?.numGrossSalary,
        "right",
        "amount",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        item?.DeptName?.trim()
          ? item?.DeptName === "Sub-Total:"
            ? `${numberWithCommas(item?.numArearSalary)}`
            : ""
          : item?.numArearSalary,
        "right",
        "amount",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      ...dynamicTableHeadCellFunc(tableAllowanceHead, item),
      new Cell(
        item?.DeptName?.trim()
          ? item?.DeptName === "Sub-Total:"
            ? `${numberWithCommas(item?.TotalSalary)}`
            : ""
          : item?.TotalSalary,
        "right",
        "amount",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        item?.DeptName?.trim()
          ? item?.DeptName === "Sub-Total:"
            ? `${numberWithCommas(item?.numPFAmount)}`
            : ""
          : item?.numPFAmount,
        "right",
        "amount",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        item?.DeptName?.trim()
          ? item?.DeptName === "Sub-Total:"
            ? `${numberWithCommas(item?.numTaxAmount)}`
            : ""
          : item?.numTaxAmount,
        "right",
        "amount",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      ...dynamicTableHeadCellFunc(tableDeductionHead, item),
      new Cell(
        item?.DeptName?.trim()
          ? item?.DeptName === "Sub-Total:"
            ? `${numberWithCommas(item?.NetSalary)}`
            : ""
          : item?.NetSalary,
        "right",
        "amount",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        item?.DeptName?.trim()
          ? item?.DeptName === "Sub-Total:"
            ? `${numberWithCommas(item?.numPFCompany)}`
            : ""
          : item?.numPFCompany,
        "right",
        "amount",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        item?.DeptName?.trim()
          ? item?.DeptName === "Sub-Total:"
            ? `${numberWithCommas(item?.numGratuity)}`
            : ""
          : item?.numGratuity,
        "right",
        "amount",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        item?.DeptName?.trim()
          ? item?.DeptName === "Sub-Total:"
            ? `${numberWithCommas(item?.TotalPfNGratuity)}`
            : ""
          : item?.TotalPfNGratuity,
        "right",
        "amount",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
      new Cell(
        item?.DeptName?.trim()
          ? item?.DeptName === "Sub-Total:"
            ? `${numberWithCommas(item?.TotalCostOfSalary)}`
            : " "
          : item?.TotalCostOfSalary,
        "right",
        "amount",
        item?.DeptName?.trim() ? true : false,
        item?.DeptName?.trim() ? 10 : 9
      ).getCell(),
    ];
  });
  return data;
};

const generateFooterData = (
  rowDto,
  tableHeaderArr,
  tableAllowanceHead,
  tableDeductionHead
) => {
  return [
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    "Grand Total",
    ...dynamicTableHeadCellFunc2(tableHeaderArr, rowDto),
    numberWithCommas(
      colSumForDetailsReport(rowDto, "numGrossSalary").toFixed(2)
    ),
    numberWithCommas(
      colSumForDetailsReport(rowDto, "numArearSalary").toFixed(2)
    ),
    ...dynamicTableHeadCellFunc2(tableAllowanceHead, rowDto),
    numberWithCommas(colSumForDetailsReport(rowDto, "TotalSalary").toFixed(2)),
    numberWithCommas(colSumForDetailsReport(rowDto, "numPFAmount").toFixed(2)),
    numberWithCommas(colSumForDetailsReport(rowDto, "numTaxAmount").toFixed(2)),
    ...dynamicTableHeadCellFunc2(tableDeductionHead, rowDto),
    numberWithCommas(colSumForDetailsReport(rowDto, "NetSalary").toFixed(2)),
    numberWithCommas(colSumForDetailsReport(rowDto, "numPFCompany").toFixed(2)),
    numberWithCommas(colSumForDetailsReport(rowDto, "numGratuity").toFixed(2)),
    numberWithCommas(
      colSumForDetailsReport(rowDto, "TotalPfNGratuity").toFixed(2)
    ),
    numberWithCommas(
      colSumForDetailsReport(rowDto, "TotalCostOfSalary").toFixed(2)
    ),
  ];
};

const dynamicTableHeadCellFunc = (tableHeaderArr, item) => {
  const data = tableHeaderArr?.map((head) => {
    return new Cell(
      item?.DeptName?.trim()
        ? item?.DeptName === "Sub-Total:"
          ? `${numberWithCommas(item?.[head])}`
          : ""
        : item?.[head],
      "right",
      "amount",
      item?.DeptName?.trim() ? true : false,
      item?.DeptName?.trim() ? 10 : 9
    ).getCell();
  });
  return data;
};
const dynamicTableHeadCellFunc2 = (arr, rowDto) => {
  return arr?.map((cell) =>
    numberWithCommas(colSumForDetailsReport(rowDto, `${cell}`).toFixed(2))
  );
};

export const colSumForDetailsReport = (arr, property) => {
  return arr.reduce((sum, item) => {
    if (item?.DeptName?.trim() === "") {
      return sum + item[property];
    } else {
      return sum;
    }
  }, 0);
};
