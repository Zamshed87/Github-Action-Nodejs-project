import { numberWithCommas } from "../../../../utility/numberWithCommas";
import { getRowTotal } from "../../../../utility/getRowTotal";

export const salaryAdviceExcelColumn = {
  sl: "SL",
  Reason: "Reason",
  BankAccountNumber: "Sender Acc Number",
  strRoutingNumber: "Receiving Bank Routing",
  strAccountNo: "Bank Acc No",
  AccType: "Acc Type",
  numNetPayable: "Amount",
  strEmployeeCode: "Receiver ID",
  strAccountName: "Receiver Name",
  AdviceType: "Advice Type",
};

export const salaryAdviceExcelData = (tableRow) => {
  let newArr = [];
  newArr = tableRow.map((itm, index) => {
    return {
      sl: index + 1,
      Reason: itm?.Reason || " ",
      BankAccountNumber: itm?.BankAccountNumber || " ",
      strRoutingNumber: itm?.strRoutingNumber || " ",
      strAccountNo: itm?.strAccountNo || " ",
      AccType: itm?.AccType || " ",
      numNetPayable: numberWithCommas(itm?.numNetPayable) || " ",
      strEmployeeCode: itm?.strEmployeeCode || " ",
      strAccountName: itm?.strAccountName || " ",
      AdviceType: itm?.AdviceType || " ",
    };
  });

  return newArr;
};

const salaryAdviceExcelWorkSheet = (
  amountArr,
  textCellArr,
  worksheet,
  rowIndex
) => {
  textCellArr.forEach((cell) => {
    worksheet.getCell(`${cell}${14 + rowIndex}`).alignment = {
      horizontal: "left",
      wrapText: true,
    };
  });
  amountArr.forEach((cell) => {
    worksheet.getCell(`${cell}${14 + rowIndex}`).alignment = {
      horizontal: "right",
      wrapText: true,
    };
  });
};

const salaryAdviceExcelWorkSheetTotal = (
  worksheet,
  excelTableData,
  rowDto,
  amountCellArr
) => {
  let total = worksheet.addRow([
    " ",
    " ",
    " ",
    " ",
    " ",
    "Total",
    getRowTotal(rowDto, "numNetPayable"),
    " ",
    " ",
    " ",
  ]);
  total.eachCell((cell) => {
    cell.alignment = { horizontal: "right" };
    cell.font = { bold: true };
    // cell.border = {
    //   top: { style: "thin", color: { argb: "00000000" } },
    //   left: { style: "thin", color: { argb: "00000000" } },
    //   bottom: { style: "thin", color: { argb: "00000000" } },
    //   right: { style: "thin", color: { argb: "00000000" } },
    // };
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
  amountArr,
  textCellArr,
  filterIndex,
  worksheet,
  rowIndex
) => {
  switch (filterIndex) {
    default:
      return salaryAdviceExcelWorkSheet(
        amountArr,
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
  amountCellArr
) => {
  switch (filterIndex) {
    default:
      return salaryAdviceExcelWorkSheetTotal(
        worksheet,
        excelTableData,
        rowDto,
        amountCellArr
      );
  }
};
