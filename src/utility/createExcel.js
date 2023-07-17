import { Workbook } from "exceljs";
import * as fs from "file-saver";
import moment from "moment";

// dynamic column for date range
export const fromToDateList = (fromDate, toDate) => {
  fromDate = moment(fromDate, "YYYY-MM-DD");
  toDate = moment(toDate, "YYYY-MM-DD");
  const difference = moment(toDate, "YYYY-MM-DD").diff(fromDate, "days");
  let dateList = [];
  for (let i = 0; i <= difference; i++) {
    const newDate = moment(fromDate).add(i, "days").format("YYYY-MM-DD");
    const dateLevel = moment(newDate, "YYYY-MM-DD").format("DD MMM, YYYY");
    dateList.push({ date: newDate, level: dateLevel });
  }
  return dateList;
};

// genrating data
const getTableData = (row, keys, totalKey) => {
  const data = row?.map((item, index) => {
    return keys?.map((key) => item[key]);
  });
  return data;
};

// excel default heading column
const exelHeading = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "E",
  6: "F",
  7: "G",
  8: "H",
  9: "I",
  10: "J",
  11: "K",
  12: "L",
  13: "M",
  14: "N",
  15: "O",
  16: "P",
  17: "Q",
  18: "R",
  19: "S",
  20: "T",
  21: "U",
  22: "V",
  23: "W",
  24: "X",
  25: "Y",
  26: "Z",
  27: "AA",
  28: "AB",
  29: "AC",
  30: "AD",
  31: "AE",
  32: "AF",
  33: "AG",
  34: "AH",
  35: "AI",
  36: "AJ",
  37: "AK",
  38: "AL",
  39: "AM",
  40: "AN",
  41: "AO",
  42: "AP",
  43: "AQ",
  44: "AR",
  45: "AS",
  46: "AT",
  47: "AU",
  48: "AV",
  49: "AW",
  50: "AX",
};

// use from component
export const generateExcelActionBeta = (
  title, // title as file name
  fromDate, // optional
  toDate, // optional
  column, // table column
  data, // table data
  businessUnit, // bu unit
  businessUnitAddress, // address
  widthList, // col custom width list as object,
  notFullWidth = false // for applying table data width on headers
) => {
  // for modified sl
  const tempData = data?.map((item, idx) => ({
    ...item,
    sl: idx + 1,
  }));
  const endCell = Object.values(column).length; // column end for better design
  const tableDataInfo = getTableData(tempData, Object.keys(column));
  createExcelFile(
    title,
    Object.values(column),
    tableDataInfo,
    fromDate,
    toDate,
    businessUnit,
    businessUnitAddress,
    endCell,
    widthList,
    notFullWidth
  );
};

const createExcelFile = (
  comapanyNameHeader,
  tableHeader,
  tableData,
  fromDate,
  toDate,
  businessUnit,
  businessUnitAddress,
  endCell,
  widthList,
  notFullWidth,
  isHiddenHeader,
  fileName
) => {
  let workbook = new Workbook();
  let worksheet = workbook.addWorksheet(comapanyNameHeader);
  if (!isHiddenHeader) {
    worksheet.getCell("A1").alignment = {
      horizontal: "center",
      wrapText: true,
    };
    let businessUnitName = worksheet.addRow([businessUnit]);
    businessUnitName.font = { size: 20, bold: true };
    notFullWidth
      ? worksheet.mergeCells(`A2:J2`)
      : worksheet.mergeCells(`A2:${exelHeading[endCell]}2`);
    worksheet.getCell("A2").alignment = { horizontal: "center" };

    let companyLocation = worksheet.addRow([businessUnitAddress]);
    companyLocation.font = { size: 14, bold: true };
    notFullWidth
      ? worksheet.mergeCells(`A3:J3`)
      : worksheet.mergeCells(`A3:${exelHeading[endCell]}3`);
    worksheet.getCell("A3").alignment = { horizontal: "center" };

    let title = worksheet.addRow([comapanyNameHeader]);
    title.font = { size: 16, bold: true };
    notFullWidth
      ? worksheet.mergeCells(`A4:J4`)
      : worksheet.mergeCells(`A4:${exelHeading[endCell]}4`);
    worksheet.getCell("A4").alignment = { horizontal: "center" };
    worksheet.getCell("A5").alignment = {
      horizontal: "center",
      wrapText: true,
    };
    worksheet.getCell("A6").alignment = {
      horizontal: "center",
      wrapText: true,
    };

    let skipCell = ["A1", "A2", "A3", "A4", "A5", "A6"];

    worksheet.columns.forEach(function (column, i) {
      var maxLength = 0;
      column["eachCell"]({ includeEmpty: true }, function (cell) {
        if (!skipCell?.includes(cell?._address)) {
          var columnLength = cell.value ? cell.value.toString().length : 4;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        }
      });
      column.width = maxLength < 10 ? 10 : 15;
    });
  }

  let _tableHeader = worksheet.addRow(tableHeader);
  _tableHeader.font = { bold: true };
  _tableHeader.eachCell((cell) => {
    cell.alignment = { horizontal: "center" };
  });

  if (isHiddenHeader) {
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
  }

  const _tableData = worksheet.addRows(tableData);
  _tableData.forEach((row) => {
    row.eachCell((cell, index) => {
      cell.alignment = { horizontal: index === 1 ? "center" : "left" };
    });
  });
  worksheet.getCell(`A${tableData?.length + 8}`).alignment = {
    horizontal: "center",
    wrapText: true,
  };
  worksheet.getCell(`A${tableData?.length + 9}`).alignment = {
    horizontal: "center",
    wrapText: true,
  };

  let footer = worksheet.addRow([
    `System Generated Report ${moment().format("ll")}`,
  ]); // footer default text
  footer.font = { size: 12 };
  notFullWidth
    ? worksheet.mergeCells(
        `A${+tableData?.length + 10}:J${+tableData?.length + 10}`
      )
    : worksheet.mergeCells(
        `A${+tableData?.length + 10}:${exelHeading[endCell]}${
          +tableData?.length + 10
        }`
      );
  worksheet.getCell(`A${+tableData?.length + 10}`).alignment = {
    horizontal: "center",
  };
  if (widthList) {
    Object.keys(widthList).forEach((key) => {
      worksheet.getColumn(key).width = widthList[key];
    });
  }

  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fs.saveAs(blob, `${fileName || comapanyNameHeader}.xlsx`);
  });
};
