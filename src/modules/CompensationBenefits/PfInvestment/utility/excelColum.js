import { dateFormatter } from "../../../../utility/dateFormatter";
import { getRowTotal } from "../../../../utility/getRowTotal";
import { numberWithCommas } from "../../../../utility/numberWithCommas";

// PF Investment header data
export const pfInvestmentHeader = {
  sl: " ",
  strInvestmentReffNo: "Investment Reff. No.",
  strBankName: "Bank",
  dteInvestmentDate: "Investment Date",
  numInvestmentAmount: "Investment Amount",
  dteMatureDate: "Mature Date",
};
export const pfInvestmentHeaderData = (arr) => {
  let newArr = [];
  newArr = arr.map((itm) => {
    return {
      sl: " ",
      strInvestmentReffNo: itm?.strInvestmentReffNo || " ",
      strBankName: itm?.strBankName || " ",
      dteInvestmentDate: dateFormatter(itm?.dteInvestmentDate) || " ",
      numInvestmentAmount: numberWithCommas(itm?.numInvestmentAmount) || " ",
      dteMatureDate: dateFormatter(itm?.dteMatureDate) || " ",
    };
  });

  return newArr;
};

// all salary report
export const allPFInvestmentExcelColumn = {
  sl: "SL",
  intEmployeeId: "Employee Id",
  strEmployeeName: "Employee Name",
  strEmploymentType: "Employment Type",
  strDesignation: "Designation",
  strDepartment: "Department",
  strServiceLength: "Service Length",
  numEmployeeContribution: "PF Employee Contribution",
  numEmployerContribution: "PF Employer Contribution",
  numInterestRate: "Interest Rate %",
  numInterestAmount: "Interest Amount Of Employee",
  numTotalAmount: "Total Amount Of Employer",
  numGrandTotalAmount: "Grand Total",
};
export const allPFInvestmentExcelData = (arr) => {
  let newArr = [];
  newArr = arr.map((itm, index) => {
    return {
      sl: index + 1,
      intEmployeeId: itm?.intEmployeeId || " ",
      strEmployeeName: itm?.strEmployeeName || " ",
      strEmploymentType: itm?.strEmploymentType || " ",
      strDesignation: itm?.strDesignation || " ",
      strDepartment: itm?.strDepartment || " ",
      strServiceLength: itm?.strServiceLength || " ",
      numEmployeeContribution:
        numberWithCommas(itm?.numEmployeeContribution) || " ",
      numEmployerContribution:
        numberWithCommas(itm?.numEmployerContribution) || " ",
      numInterestRate: itm?.numInterestRate || " ",
      numInterestAmount: numberWithCommas(itm?.numInterestAmount) || " ",
      numTotalAmount: numberWithCommas(itm?.numTotalAmount) || " ",
      numGrandTotalAmount: numberWithCommas(itm?.numGrandTotalAmount) || " ",
    };
  });

  return newArr;
};

const allPFExcelWorkSheet = (worksheet, rowIndex) => {
  worksheet.getCell(`E${6 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
};
const allSalaryExcelWorkSheet = (worksheet, rowIndex) => {
  worksheet.getCell(`H${9 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
  worksheet.getCell(`I${9 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
  worksheet.getCell(`J${9 + rowIndex}`).alignment = {
    horizontal: "center",
    wrapText: true,
  };
  worksheet.getCell(`K${9 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
  worksheet.getCell(`L${9 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
  worksheet.getCell(`M${9 + rowIndex}`).alignment = {
    horizontal: "right",
    wrapText: true,
  };
};
const allSalaryExcelWorkSheetTotal = (worksheet, excelTableData, rowDto) => {
  let total = worksheet.addRow([
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    "Total",
    getRowTotal(rowDto, "numEmployeeContribution"),
    getRowTotal(rowDto, "numEmployerContribution"),
    " ",
    getRowTotal(rowDto, "numInterestAmount"),
    getRowTotal(rowDto, "numTotalAmount"),
    getRowTotal(rowDto, "numGrandTotalAmount"),
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
  worksheet.getCell(`G${excelTableData?.length + 9}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`H${excelTableData?.length + 9}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`I${excelTableData?.length + 9}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`K${excelTableData?.length + 9}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`L${excelTableData?.length + 9}`).alignment = {
    horizontal: "right",
  };
  worksheet.getCell(`M${excelTableData?.length + 9}`).alignment = {
    horizontal: "right",
  };

  return worksheet;
};

// column alignment
export const alignmentExcelFunc = (filterIndex, worksheet, rowIndex) => {
  switch (filterIndex) {
    default:
      return allSalaryExcelWorkSheet(worksheet, rowIndex);
  }
};
export const alignmentPFExcelFunc = (worksheet, rowIndex) => {
  return allPFExcelWorkSheet(worksheet, rowIndex);
};

// total row
export const totalRowWorkSheet = (
  worksheet,
  excelTableData,
  rowDto,
  filterIndex
) => {
  switch (filterIndex) {
    default:
      return allSalaryExcelWorkSheetTotal(worksheet, excelTableData, rowDto);
  }
};
