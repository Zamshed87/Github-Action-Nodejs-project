import { getRowTotal } from "../../../../../utility/getRowTotal";
import { numberWithCommas } from "../../../../../utility/numberWithCommas";

const modifyObjFunc = (row, property) => {
  return row.reduce(
    (a, v) => ({ ...a, [v]: numberWithCommas(property[`${v}`].toString()) }),
    {}
  );
};

const dynamicTableHeadCellFunc = (arr, rowDto) => {
  return arr.map((cell) => getRowTotal(rowDto, `${cell}`));
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
export const salaryDetailsExcelColumn2 = {
  sl: "SL",
  strEmployeeCode: "Employee ID",
  strEmployeeName: "Employee Name",
  strDesignation: "Designation",
  PIN: "PIN",
  dteJoiningDate: "Joining Date",
  intPresent: "Present",
  ApprovedLeave: "Approved Leave",
  intAbsent: "Absent",

  // intPayableDays: "Total Days",
  // intPresent: "Working Days",
  // numOverTimeHour: "OT Hour",
  // numOverTimeAmount: "OT Rate",
  // numGrossSalary: "Gross Salary",
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
export const getSingleSumOfRow = (item, headArr) => {
  let sum = 0;
  headArr?.forEach((cell) => {
    sum += item[cell] || 0;
  });
  return sum;
};
// const totalSumInHead = (headArr, rowDto) => {
//   let sum = 0;
//   rowDto?.forEach((item) => {
//     sum += getSingleSumOfRow(item, headArr);
//   });
//   return sum;
// };
const salaryDetailsExcelWorkSheet = (
  cellArr,
  textCellArr,
  worksheet,
  rowIndex
) => {
  textCellArr.forEach((cell) => {
    worksheet.getCell(`${cell}${6 + rowIndex}`).alignment = {
      horizontal: "left",
      wrapText: true,
    };
  });
  cellArr.forEach((cell) => {
    worksheet.getCell(`${cell}${6 + rowIndex}`).alignment = {
      horizontal: "right",
      wrapText: true,
    };
  });
};
const salaryDetailsExcelWorkSheetTotal = (
  worksheet,
  excelTableData,
  rowDto,
  amountCellArr,
  tableHeaderArr
) => {
  let total = worksheet.addRow([
    " ",
    "Total",
    getRowTotal(rowDto, "numGrossSalary"),
    getRowTotal(rowDto, "numTotalAllowance"),
    getRowTotal(rowDto, "numTotalDeduction"),
    getRowTotal(rowDto, "netPay"),
    getRowTotal(rowDto, "bankPay"),
    getRowTotal(rowDto, "degitalBankPay"),
    getRowTotal(rowDto, "cashPay"),
    " ",
    " ",
    " ",
    ...dynamicTableHeadCellFunc(tableHeaderArr, rowDto),
    getRowTotal(rowDto, "numOverTimeAmount"),
    getRowTotal(rowDto, "numTaxAmount"),
    getRowTotal(rowDto, "numLoanAmount"),
    getRowTotal(rowDto, "numPFAmount"),
  ]);
  total.eachCell((cell) => {
    cell.alignment = { horizontal: "right" };
    cell.font = { bold: true };
    cell.border = {
      top: { style: "thin", color: { argb: "00000000" } },
      left: { style: "thin", color: { argb: "00000000" } },
      bottom: { style: "thin", color: { argb: "00000000" } },
      right: { style: "thin", color: { argb: "00000000" } },
    };
  });

  amountCellArr.forEach((cell) => {
    worksheet.getCell(`${cell}${excelTableData?.length + 6}`).alignment = {
      horizontal: "right",
    };
  });

  return worksheet;
};

// column alignment
export const alignmentExcelFunc = (
  cellArr,
  textCellArr,
  filterIndex,
  worksheet,
  rowIndex
) => {
  switch (filterIndex) {
    default:
      return salaryDetailsExcelWorkSheet(
        cellArr,
        textCellArr,
        worksheet,
        rowIndex
      );
  }
};

// total row
export const totalRowWorkSheet = (
  worksheet,
  excelTableData,
  rowDto,
  filterIndex,
  amountCellArr,
  tableHeaderArr
) => {
  switch (filterIndex) {
    default:
      return salaryDetailsExcelWorkSheetTotal(
        worksheet,
        excelTableData,
        rowDto,
        amountCellArr,
        tableHeaderArr
      );
  }
};
