import { numberWithCommas } from "../../../../../utility/numberWithCommas";
import { getRowTotal } from "./../../../../../utility/getRowTotal";

// all salary report
export const allSalaryExcelColumn = {
  SL: "SL",
  EmployeeId: "Employee Id",
  EmployeeName: "Employee Name",
  DesignationName: "Designation",
  GrossSalary: "Salary",
  TotalAllowance: "Total Allowance",
  TotalDeduction: "Total Deduction",
  NetPay: "Net Pay",
  BankPay: "Bank Pay",
  DegitalBankPay: "Digital Bank Pay",
  CashPay: "Cash Pay",
  TotalWorkingDays: "Total Working Days",
  PayableDays: "Total Attendance",
  WorkplaceName: "Workplace Name",
  WorkplaceGroupName: "Workplace Group",
  PayrollGroupName: "Payroll Group",
};
export const allSalaryExcelData = (arr) => {
  let newArr = [];
  newArr = arr.map((item, index) => {
    return {
      SL: item?.SL,
      EmployeeId: item?.EmployeeId,
      EmployeeName: item?.EmployeeName,
      DesignationName: numberWithCommas(item?.DesignationName),
      GrossSalary: numberWithCommas(item?.GrossSalary),
      TotalAllowance: numberWithCommas(item?.TotalAllowance),
      TotalDeduction: numberWithCommas(item?.TotalDeduction),
      NetPay: numberWithCommas(item?.NetPay),
      BankPay: numberWithCommas(item?.BankPay),
      DegitalBankPay: numberWithCommas(item?.DegitalBankPay),
      CashPay: numberWithCommas(item?.CashPay),
      TotalWorkingDays: item?.TotalWorkingDays,
      PayableDays: item?.PayableDays,
      WorkplaceName: item?.WorkplaceName,
      WorkplaceGroupName: item?.WorkplaceGroupName,
      PayrollGroupName: item?.PayrollGroupName,
    };
  });

  return newArr;
};
const allSalaryExcelWorkSheet = (worksheet, rowIndex) => {
  worksheet.getCell(`D${6 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
  worksheet.getCell(`E${6 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
  worksheet.getCell(`F${6 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
  worksheet.getCell(`G${6 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
  worksheet.getCell(`H${6 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
  worksheet.getCell(`I${6 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
  worksheet.getCell(`J${6 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
};
const allSalaryExcelWorkSheetTotal = (worksheet, excelTableData, rowDto) => {
  let total = worksheet.addRow([
    " ",
    " ",
    " ",
    "Total",
    getRowTotal(rowDto, "GrossSalary"),
    getRowTotal(rowDto, "TotalAllowance"),
    getRowTotal(rowDto, "TotalDeduction"),
    getRowTotal(rowDto, "NetPay"),
    getRowTotal(rowDto, "BankPay"),
    getRowTotal(rowDto, "DegitalBankPay"),
    getRowTotal(rowDto, "CashPay"),
    getRowTotal(rowDto, "TotalWorkingDays"),
    getRowTotal(rowDto, "PayableDays"),
    " ",
    " ",
    " ",
  ]);
  total.eachCell((cell) => {
    cell.alignment = { horizontal: "left" };
    cell.font = { bold: true };
    cell.border = {
      top: { style: "thin", color: { argb: "00000000" } },
      left: { style: "thin", color: { argb: "00000000" } },
      bottom: { style: "thin", color: { argb: "00000000" } },
      right: { style: "thin", color: { argb: "00000000" } },
    };
  });

  worksheet.getCell(`C${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`D${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`E${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`F${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`G${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`H${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`I${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`J${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };

  return worksheet;
};

// bank salary report
export const bankSalaryExcelColumn = {
  SL: "SL",
  AccountName: "Account Name",
  EmployeeId: "Employee Id",
  FinancialInstitution: "Bank Name",
  BankBranchName: "Branch Name",
  AccountNo: "Account No",
  RoutingNumber: "Routing No",
  NetPay: "Net Pay",
  BankPay: "Bank Pay",
  CashPay: "Cash Pay",
  WorkplaceName: "Workplace Name",
  WorkplaceGroupName: "Workplace Group",
  PayrollGroupName: "Payroll Group",
};
export const bankSalaryExcelData = (arr) => {
  return arr.map((itm, index) => {
    return {
      SL: itm?.SL,
      AccountName: itm?.AccountName || " ",
      EmployeeId: itm?.EmployeeId || " ",
      FinancialInstitution: itm?.FinancialInstitution || " ",
      BankBranchName: itm?.BankBranchName || " ",
      AccountNo: itm?.AccountNo || " ",
      RoutingNumber: itm?.RoutingNumber || " ",
      NetPay: numberWithCommas(itm?.NetPay) || " ",
      BankPay: numberWithCommas(itm?.BankPay) || " ",
      CashPay: numberWithCommas(itm?.CashPay) || " ",
      WorkplaceName: itm?.WorkplaceName || " ",
      WorkplaceGroupName: itm?.WorkplaceGroupName || " ",
      PayrollGroupName: itm?.PayrollGroupName || " ",
    };
  });
};
const bankSalaryExcelWorkSheet = (worksheet, rowIndex) => {
  worksheet.getCell(`G${6 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
  worksheet.getCell(`H${6 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
  worksheet.getCell(`I${6 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
  worksheet.getCell(`J${6 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
};
const bankSalaryExcelWorkSheetTotal = (worksheet, excelTableData, rowDto) => {
  let total = worksheet.addRow([
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    "Total",
    getRowTotal(rowDto, "NetPay"),
    getRowTotal(rowDto, "BankPay"),
    getRowTotal(rowDto, "CashPay"),
    " ",
    " ",
    " ",
  ]);
  total.eachCell((cell) => {
    cell.alignment = { horizontal: "left" };
    cell.font = { bold: true };
    cell.border = {
      top: { style: "thin", color: { argb: "00000000" } },
      left: { style: "thin", color: { argb: "00000000" } },
      bottom: { style: "thin", color: { argb: "00000000" } },
      right: { style: "thin", color: { argb: "00000000" } },
    };
  });
  worksheet.getCell(`G${excelTableData?.length + 6}`).alignment = {
    horizontal: "left",
  };
  worksheet.getCell(`H${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`I${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`J${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };

  return worksheet;
};

// digital banking salary report
export const digitalBankingSalaryExcelColumn = {
  SL: "SL",
  EmployeeName: "Employee Name",
  EmployeeId: "Employee Id",
  FinancialInstitution: "Gatway",
  AccountNo: "Mobile No",
  DegitalBankPay: "Net Payable",
  WorkplaceName: "Workplace Name",
  WorkplaceGroupName: "Workplace Group",
  PayrollGroupName: "Payroll Group",
};
export const digitalBankingSalaryExcelData = (arr) => {
  return arr.map((itm, index) => {
    return {
      SL: itm?.SL,
      EmployeeName: itm?.EmployeeName || " ",
      EmployeeId: itm?.EmployeeId || " ",
      FinancialInstitution: itm?.FinancialInstitution || " ",
      AccountNo: itm?.AccountNo || " ",
      DegitalBankPay: numberWithCommas(itm?.DegitalBankPay) || " ",
      WorkplaceName: itm?.WorkplaceName || " ",
      WorkplaceGroupName: itm?.WorkplaceGroupName || " ",
      PayrollGroupName: itm?.PayrollGroupName || " ",
    };
  });
};
const digitalBankingSalaryExcelWorkSheet = (worksheet, rowIndex) => {
  worksheet.getCell(`F${6 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
};
const digitalBankingSalaryExcelWorkSheetTotal = (
  worksheet,
  excelTableData,
  rowDto
) => {
  let total = worksheet.addRow([
    " ",
    " ",
    " ",
    " ",
    "Total",
    getRowTotal(rowDto, "degitalBankPay"),
    " ",
    " ",
    " ",
  ]);
  total.eachCell((cell) => {
    cell.alignment = { horizontal: "left" };
    cell.font = { bold: true };
    cell.border = {
      top: { style: "thin", color: { argb: "00000000" } },
      left: { style: "thin", color: { argb: "00000000" } },
      bottom: { style: "thin", color: { argb: "00000000" } },
      right: { style: "thin", color: { argb: "00000000" } },
    };
  });
  worksheet.getCell(`E${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`F${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };

  return worksheet;
};

// cash salary report
export const cashSalaryExcelColumn = {
  SL: "SL",
  EmployeeName: "Employee Name",
  EmployeeId: "Employee Id",
  CashPay: "Net Payable",
  WorkplaceName: "Workplace Name",
  WorkplaceGroupName: "Workplace Group",
  PayrollGroupName: "Payroll Group",
};
export const cashSalaryExcelData = (arr) => {
  return arr.map((itm, index) => {
    return {
      SL: itm?.SL,
      EmployeeName: itm?.EmployeeName || " ",
      EmployeeId: itm?.EmployeeId || " ",
      CashPay: numberWithCommas(itm?.CashPay) || " ",
      WorkplaceName: itm?.WorkplaceName || " ",
      WorkplaceGroupName: itm?.WorkplaceGroupName || " ",
      PayrollGroupName: itm?.PayrollGroupName || " ",
    };
  });
};
const cashSalaryExcelWorkSheet = (worksheet, rowIndex) => {
  worksheet.getCell(`D${6 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
};
const cashSalaryExcelWorkSheetTotal = (worksheet, excelTableData, rowDto) => {
  let total = worksheet.addRow([
    " ",
    " ",
    "Total",
    getRowTotal(rowDto, "cashPay"),
    " ",
    " ",
    " ",
  ]);
  total.eachCell((cell) => {
    cell.alignment = { horizontal: "left" };
    cell.font = { bold: true };
    cell.border = {
      top: { style: "thin", color: { argb: "00000000" } },
      left: { style: "thin", color: { argb: "00000000" } },
      bottom: { style: "thin", color: { argb: "00000000" } },
      right: { style: "thin", color: { argb: "00000000" } },
    };
  });
  worksheet.getCell(`C${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`D${excelTableData?.length + 6}`).alignment = {
    horizontal: "right",
  };

  return worksheet;
};

// column alignment
export const alignmentExcelFunc = (filterIndex, worksheet, rowIndex) => {
  switch (filterIndex) {
    case 1:
      return bankSalaryExcelWorkSheet(worksheet, rowIndex);

    case 2:
      return digitalBankingSalaryExcelWorkSheet(worksheet, rowIndex);

    case 3:
      return cashSalaryExcelWorkSheet(worksheet, rowIndex);

    default:
      return allSalaryExcelWorkSheet(worksheet, rowIndex);
  }
};

// total row
export const totalRowWorkSheet = (
  worksheet,
  excelTableData,
  rowDto,
  filterIndex
) => {
  switch (filterIndex) {
    case 1:
      return bankSalaryExcelWorkSheetTotal(worksheet, excelTableData, rowDto);

    case 2:
      return digitalBankingSalaryExcelWorkSheetTotal(
        worksheet,
        excelTableData,
        rowDto
      );

    case 3:
      return cashSalaryExcelWorkSheetTotal(worksheet, excelTableData, rowDto);

    default:
      return allSalaryExcelWorkSheetTotal(worksheet, excelTableData, rowDto);
  }
};
