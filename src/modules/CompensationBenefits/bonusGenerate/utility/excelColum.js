import { dateFormatter } from "../../../../utility/dateFormatter";
import { getRowTotal } from "../../../../utility/getRowTotal";
import { numberWithCommas } from "../../../../utility/numberWithCommas";

// all salary report
export const allBonusExcelColumn = {
  sl: "SL",
  strEmployeeName: "Employee Name",
  intEmployeeId: "Employee Id",
  strDesignationName: "Designation",
  strEmploymentTypeName: "Employment Type",
  strServiceLength: "Service Length",
  numSalary: "Salary",
  numBasic: "Basic",
  numBonusAmount: "Bonus Amount",
  dteJoiningDate: "Joining Date",
  strWorkplaceName: "Workplace Name",
  strWorkplaceGroupName: "Workplace Group",
};
export const allBonusExcelData = (arr) => {
  let newArr = [];
  newArr = arr.map((itm, index) => {
    return {
      sl: index + 1,
      strEmployeeName: itm?.strEmployeeName || " ",
      intEmployeeId: itm?.intEmployeeId || " ",
      strDesignationName: itm?.strDesignationName || " ",
      strEmploymentTypeName: itm?.strEmploymentTypeName || " ",
      strServiceLength: itm?.strServiceLength || " ",
      numSalary: numberWithCommas(itm?.numSalary) || " ",
      numBasic: numberWithCommas(itm?.numBasic) || " ",
      numBonusAmount: numberWithCommas(itm?.numBonusAmount) || " ",
      dteJoiningDate: dateFormatter(itm?.dteJoiningDate) || " ",
      strWorkplaceName: itm?.strWorkPlaceName || " ",
      strWorkplaceGroupName: itm?.strWorkPlaceGroupName || " ",
    };
  });

  return newArr;
};

const allSalaryExcelWorkSheet = (worksheet, rowIndex) => {
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
};
const allSalaryExcelWorkSheetTotal = (worksheet, excelTableData, rowDto) => {
  let total = worksheet.addRow([
    " ",
    " ",
    " ",
    " ",
    " ",
    "Total",
    getRowTotal(rowDto, "numSalary"),
    getRowTotal(rowDto, "numBasic"),
    getRowTotal(rowDto, "numBonusAmount"),
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

  return worksheet;
};

// column alignment
export const alignmentExcelFunc = (filterIndex, worksheet, rowIndex) => {
  switch (filterIndex) {
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
    default:
      return allSalaryExcelWorkSheetTotal(worksheet, excelTableData, rowDto);
  }
};
