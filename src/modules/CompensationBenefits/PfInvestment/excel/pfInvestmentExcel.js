import { Workbook } from "exceljs";
import * as fs from "file-saver";
import {
  alignmentExcelFunc,
  alignmentPFExcelFunc,
  totalRowWorkSheet,
} from "../utility/excelColum";

const createExcelFile = (
  comapanyNameHeader,
  tableHeader,
  tableData,
  fromDate,
  toDate,
  businessUnit,
  moneyProcessId,
  rowDto,
  rowHeader,
  tablePFDataInfo
) => {
  let workbook = new Workbook();
  let worksheet = workbook.addWorksheet(comapanyNameHeader);

  // busisness Unit
  let businessUnitName = worksheet.addRow([businessUnit]);
  businessUnitName.font = { size: 20, bold: true };
  worksheet.mergeCells("A1:S1");
  worksheet.getCell("A1").alignment = { horizontal: "left" };

  // excel heading name
  let title = worksheet.addRow([comapanyNameHeader]);
  title.font = { size: 16, bold: true };
  worksheet.mergeCells("A2:S2");
  worksheet.getCell("A2").alignment = { horizontal: "left" };

  // form Date
  let companyLocation;
  if (fromDate) {
    companyLocation = worksheet.addRow([
      `From Date : ${fromDate}, To Date : ${toDate}`,
    ]);
    companyLocation.font = { size: 14, bold: true };
    worksheet.mergeCells("A3:S3");
    worksheet.getCell("A3").alignment = { horizontal: "left" };
  }

  // empty cell
  worksheet.getCell("A4").alignment = { horizontal: "center", wrapText: true };

  // header data of PF Investment
  let _pfInvestmentHeader = worksheet.addRow(rowHeader);
  _pfInvestmentHeader.font = { bold: true };
  _pfInvestmentHeader.eachCell((cell) => {
    cell.alignment = { horizontal: "center" };
    cell.border = {
      top: { style: "thin", color: { argb: "00000000" } },
      left: { style: "thin", color: { argb: "00000000" } },
      bottom: { style: "thin", color: { argb: "00000000" } },
      right: { style: "thin", color: { argb: "00000000" } },
    };
  });

  // table row
  const _tablePFData = worksheet.addRows(tablePFDataInfo);
  _tablePFData.forEach((row, index) => {
    row.eachCell((cell) => {
      cell.alignment = { horizontal: "left" };
      alignmentPFExcelFunc(worksheet, index);
      cell.border = {
        top: { style: "thin", color: { argb: "00000000" } },
        left: { style: "thin", color: { argb: "00000000" } },
        bottom: { style: "thin", color: { argb: "00000000" } },
        right: { style: "thin", color: { argb: "00000000" } },
      };
    });
  });

  // empty cell
  worksheet.getCell("A7").alignment = { horizontal: "center", wrapText: true };

  // table header
  let _tableHeader = worksheet.addRow(tableHeader);
  _tableHeader.font = { bold: true };
  _tableHeader.eachCell((cell) => {
    cell.alignment = { horizontal: "center" };
    cell.border = {
      top: { style: "thin", color: { argb: "00000000" } },
      left: { style: "thin", color: { argb: "00000000" } },
      bottom: { style: "thin", color: { argb: "00000000" } },
      right: { style: "thin", color: { argb: "00000000" } },
    };
  });

  // table row
  const _tableData = worksheet.addRows(tableData);
  _tableData.forEach((row, index) => {
    row.eachCell((cell) => {
      cell.alignment = { horizontal: "left" };
      alignmentExcelFunc(moneyProcessId, worksheet, index);
      cell.border = {
        top: { style: "thin", color: { argb: "00000000" } },
        left: { style: "thin", color: { argb: "00000000" } },
        bottom: { style: "thin", color: { argb: "00000000" } },
        right: { style: "thin", color: { argb: "00000000" } },
      };
    });
  });

  totalRowWorkSheet(worksheet, _tableData, rowDto, moneyProcessId);

  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column["eachCell"]({ includeEmpty: true }, function (cell) {
      maxLength = Math.max(
        maxLength,
        0,
        cell.value ? cell.value.toString().length : 0
      );
    });
    column.width = maxLength + 2;
  });

  worksheet.getColumn("A").width = 6;

  worksheet.getCell(`A5`).border = {
    top: { style: "thin", color: { argb: "transparent" } },
    left: { style: "thin", color: { argb: "transparent" } },
    bottom: { style: "thin", color: { argb: "transparent" } },
    right: { style: "thin", color: { argb: "transparent" } },
  };

  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fs.saveAs(blob, `${comapanyNameHeader}.xlsx`);
  });
};

const getTableData = (row, keys, totalKey) => {
  const data = row?.map((item, index) => {
    return keys?.map((key) => item[key]);
  });
  return data;
};

export const generatePFInvestmentAction = (
  title,
  fromDate,
  toDate,
  column,
  data,
  businessUnit,
  moneyProcessId,
  rowDto,
  rowHeader,
  pfHeaderData
) => {
  const tableDataInfo = getTableData(data, Object.keys(column));
  const tablePFDataInfo = getTableData(pfHeaderData, Object.keys(rowHeader));
  createExcelFile(
    title,
    Object.values(column),
    tableDataInfo,
    fromDate,
    toDate,
    businessUnit,
    moneyProcessId,
    rowDto,
    Object.values(rowHeader),
    tablePFDataInfo
  );
};
