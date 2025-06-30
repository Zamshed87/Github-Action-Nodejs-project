import moment from "moment";
import { createFile } from "./createFile";
class Cell {
  constructor(label, align, format) {
    this.text = label;
    this.alignment = `${align}:middle`;
    this.format = format;
  }
  getCell() {
    return {
      text: this.text,
      fontSize: 9,
      border: "all 000000 thin",
      alignment: this.alignment || "",
      textFormat: this.format,
    };
  }
}
const getTableDataForExcel = (row) => {
  const data = row?.map((item, index) => {
    return [
      new Cell(
        item?.DeptName?.trim()
          ? `Depertment: ${item?.DeptName}`
          : item?.SL,
        "left",
        "text",
        item?.SalaryGenerateHeaderId === null,
        item?.SalaryGenerateHeaderId === null ? 10 : 9
      ).getCell(),
      new Cell(item?.EmployeeCode, "left", "text").getCell(),
      new Cell(item?.EmployeeName, "left", "text").getCell(),
      new Cell(item?.DesignationName, "left", "text").getCell(),
      // new Cell(item?.strEmployeeCode, "center", "text").getCell(),
      new Cell(item?.GrossSalary, "right", "text").getCell(),
      new Cell(
        item?.SalaryGenerateHeaderId === null ? "" : item?.TotalAllowance || 0,
        "right",
        "text"
      ).getCell(),
      new Cell(
        item?.SalaryGenerateHeaderId === null ? "" : item?.TotalDeduction || 0,
        "right",
        "text"
      ).getCell(),
      new Cell(
        item?.SalaryGenerateHeaderId === null ? "" : item?.NetPay || 0,
        "right",
        "text"
      ).getCell(),
      new Cell(
        item?.SalaryGenerateHeaderId === null ? "" : item?.BankPay || 0,
        "right",
        "text"
      ).getCell(),
      new Cell(
        item?.SalaryGenerateHeaderId === null ? "" : item?.DegitalBankPay || 0,
        "right",
        "text"
      ).getCell(),
      new Cell(
        item?.SalaryGenerateHeaderId === null ? "" : item?.CashPay || 0,
        "right",
        "text"
      ).getCell(),
      new Cell(
        item?.SalaryGenerateHeaderId === null
          ? ""
          : item?.TotalWorkingDays || 0,
        "right",
        "text"
      ).getCell(),
      new Cell(
        item?.SalaryGenerateHeaderId === null ? "" : item?.PayableDays || 0,
        "right",
        "text"
      ).getCell(),
      new Cell(item?.WorkplaceName, "left", "text").getCell(),
      new Cell(item?.WorkplaceGroupName, "left", "text").getCell(),
      new Cell(item?.PayrollGroupName, "left", "money").getCell(),
    ];
  });
  return data;
};

const createExcelFile = (
  comapanyNameHeader,
  tableHeader,
  tableData,
  fromDate,
  toDate,
  businessUnit,
  moneyProcessId,
  rowDto,
  buAddress,
  totalSalary,
  totalAllowance,
  totalDeduction,
  totalNetPay,
  totalBankPay,
  totalDBPay,
  totalCashPay,
  intMonth,
  totalWorkingDays,
  totalAttendence
) => {
  const excel = {
    name: `${comapanyNameHeader}-${intMonth}`,
    sheets: [
      {
        // name: `Salary Report-${monthYear}`,
        name: `${comapanyNameHeader}-${intMonth}`,
        gridLine: false,
        rows: [
          ["_blank*2"],
          [
            {
              text: businessUnit,
              fontSize: 18,
              bold: true,
              cellRange: "A1:J1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: buAddress,
              fontSize: 15,
              bold: true,
              cellRange: "A1:J1",
              merge: true,
              alignment: "center:middle",
            },
          ],

          [
            {
              text: `${comapanyNameHeader}-${intMonth}`,
              fontSize: 15,
              bold: true,
              cellRange: "A1:J1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          ["_blank*2"],

          [
            {
              text: "SL",
              fontSize: 8.5,
              bold: true,
              border: "all 000000 thin",
              width: 200,
            },
            {
              text: "Employee Id",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Employee Name",
              fontSize: 9,
              // cellRange: "A1:B1",
              // merge: true,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Designation",
              fontSize: 9,
              // cellRange: "A1:B1",
              // merge: true,
              bold: true,
              border: "all 000000 thin",
            },

            {
              text: "Salary",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Total Allowance",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
              alignment: "center",
            },
            {
              text: "Total Deduction",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
              alignment: "center",
            },
            {
              text: "Net Pay",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Bank Pay",
              fontSize: 8.5,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Digital Bank Pay",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
              alignment: "center",
            },
            {
              text: "Cash Pay",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Total Working Days",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Total Attendance",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Workplace Name",
              fontSize: 8.5,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Workplace Group",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
              alignment: "center",
            },
            {
              text: "Payroll Group",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
              alignment: "center",
            },
          ],
          ...getTableDataForExcel(rowDto),
          [
            {
              text: "",
              fontSize: 8.8,
              bold: true,
              border: "all 000000 thin",
              alignment: "left:middle",
            },
            {
              text: "",
              fontSize: 8.8,
              bold: true,
              border: "all 000000 thin",
              alignment: "left:middle",
            },
            {
              text: "",
              fontSize: 8.8,
              bold: true,
              border: "all 000000 thin",
              alignment: "left:middle",
            },
            // {
            //   text: "",
            //   fontSize: 8.8,
            //   border: "all 000000 thin",
            // },
            {
              text: "Total",
              fontSize: 9,
              border: "all 000000 thin",
            },
            {
              text: totalSalary || 0,
              fontSize: 9,
              bold: true,
              textFormat: "money",
              border: "all 000000 thin",
              alignment: "right:middle",
            },
            {
              text: totalAllowance || 0,
              fontSize: 9,
              bold: true,
              textFormat: "money",
              border: "all 000000 thin",
              alignment: "right:middle",
            },
            {
              text: totalDeduction || 0,
              fontSize: 9,
              bold: true,
              textFormat: "money",
              border: "all 000000 thin",
              alignment: "right:middle",
            },
            {
              text: totalNetPay || 0,
              fontSize: 9,
              bold: true,
              textFormat: "money",
              border: "all 000000 thin",
              alignment: "right:middle",
            },
            {
              text: totalBankPay || 0,
              fontSize: 9,
              bold: true,
              textFormat: "money",
              border: "all 000000 thin",
              alignment: "right:middle",
            },
            {
              text: totalDBPay || 0,
              fontSize: 9,
              bold: true,
              textFormat: "money",
              border: "all 000000 thin",
              alignment: "right:middle",
            },
            {
              text: totalCashPay || 0,
              fontSize: 9,
              bold: true,
              textFormat: "money",
              border: "all 000000 thin",
              alignment: "right:middle",
            },
            {
              text: totalWorkingDays,
              fontSize: 9,
              bold: true,
              textFormat: "money",
              border: "all 000000 thin",
              alignment: "right:middle",
            },
            {
              text: totalAttendence,
              fontSize: 9,
              bold: true,
              textFormat: "money",
              border: "all 000000 thin",
              alignment: "right:middle",
            },
            {
              text: "",
              fontSize: 7,
              border: "all 000000 thin",
            },
            {
              text: "",
              fontSize: 7,
              border: "all 000000 thin",
            },
            {
              text: "",
              fontSize: 7,
              border: "all 000000 thin",
            },
            {
              // text: totalBS,
              fontSize: 9,
              bold: true,
              textFormat: "money",
              border: "all 000000 thin",
              alignment: "right:middle",
            },
            {
              // text: totalHR,
              fontSize: 9,
              bold: true,
              textFormat: "money",
              border: "all 000000 thin",
              alignment: "right:middle",
            },
            {
              // text: totalMA,
              fontSize: 9,
              bold: true,
              textFormat: "money",
              border: "all 000000 thin",
              alignment: "right:middle",
            },
          ],
          ["_blank*2"],
          [
            {
              text: `System Generated Report-${moment().format("ll")}`,
              fontSize: 15,
              bold: true,
              cellRange: "A1:J1",
              merge: true,
              alignment: "center:middle",
            },
          ],
        ],
      },
    ],
  };
  createFile(excel);
};

const getTableData = (row, keys, totalKey) => {
  const data = row?.map((item, index) => {
    return keys?.map((key) => item[key]);
  });
  return data;
};

export const generateExcelAction = (
  title,
  fromDate,
  toDate,
  column,
  data,
  businessUnit,
  moneyProcessId,
  rowDto,
  buAddress,
  totalSalary,
  totalAllowance,
  totalDeduction,
  totalNetPay,
  totalBankPay,
  totalDBPay,
  totalCashPay,
  intMonth,
  totalWorkingDays,
  totalAttendence
) => {
  const tableDataInfo = getTableData(data, Object.keys(column));
  createExcelFile(
    title,
    Object.values(column),
    tableDataInfo,
    fromDate,
    toDate,
    businessUnit,
    moneyProcessId,
    rowDto,
    buAddress,
    totalSalary,
    totalAllowance,
    totalDeduction,
    totalNetPay,
    totalBankPay,
    totalDBPay,
    totalCashPay,
    intMonth,
    totalWorkingDays,
    totalAttendence
  );
};
