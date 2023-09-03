import moment from "moment";
import { createFile } from "./createFile";


const createExcelFile = (
  comapanyNameHeader,
  tableHeader,
  tableData,
  fromDate,
  toDate,
  businessUnit,
  moneyProcessId,
  rowDto,
  tableHeaderArr,
  monthYear,
  buAddress
) => {
  let tempObj = [];
  let tempObj2 = [];
  let tempMainRowData = [];
//  table header
  tableHeader.forEach((item) => {
    tempObj.push({
      text: item,
      fontSize: 8.5,
      bold: true,
      border: "all 000000 thin",
    });
  });
  // each row Data
  tableData.forEach((rowData) => {
    rowData.forEach((item) => {
      tempObj2.push({
        text: item,
        fontSize: 8.5,
        border: "all 000000 thin",
      });
    });

    tempMainRowData.push([...tempObj2]);
    tempObj2 = [];
  });
  // for total
 
 
  const excel = {
    name: `${comapanyNameHeader}-${moment().format('ll')}`,
    sheets: [
      {
        name: `${comapanyNameHeader}-${moment().format('ll')}`,
        gridLine: false,
        rows: [
          ["_blank*2"],
          [
            {
              text: businessUnit,
              fontSize: 18,
              bold: true,
              cellRange: "A1:G1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: buAddress,
              fontSize: 15,
              bold: true,
              cellRange: "A1:G1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text:`${comapanyNameHeader}-${moment().format('ll')}`,
              fontSize: 15,
              bold: true,
              cellRange: "A1:G1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          ["_blank*2"],
          [...tempObj],
          ...tempMainRowData,
         
         
          ["_blank*2"],
          [
            {
              text: `System Generated Report-${moment().format('ll')}`,
              fontSize: 15,
              bold: true,
              cellRange: "A1:G1",
              merge: true,
              alignment: "center:middle",
            },
          ],
         
        ],
      },
    ],
  };
  createFile(excel);
  // let workbook = new Workbook();
  // let worksheet = workbook.addWorksheet(comapanyNameHeader);

  // // busisness Unit
  // let businessUnitName = worksheet.addRow([businessUnit]);
  // businessUnitName.font = { size: 20, bold: true };
  // worksheet.mergeCells("A1:F1");
  // worksheet.getCell("A1").alignment = { horizontal: "center" };
  // let businessUnitAddress = worksheet.addRow([buAddress]);
  // businessUnitAddress.font = { size: 20, bold: true };
  // worksheet.mergeCells("A2:F2");
  // worksheet.getCell("A2").alignment = { horizontal: "center" };

  // // excel heading name
  // let title = worksheet.addRow([comapanyNameHeader + "-" + monthYear]);
  // title.font = { size: 16, bold: true };
  // worksheet.mergeCells("A3:F3");
  // worksheet.getCell("A3").alignment = { horizontal: "center" };

  // // form Date
  // let companyLocation;
  // if (fromDate) {
  //   companyLocation = worksheet.addRow([
  //     `From Date : ${fromDate}, To Date : ${toDate}`,
  //   ]);
  //   companyLocation.font = { size: 14, bold: true };
  //   worksheet.mergeCells("A3:S3");
  //   worksheet.getCell("A3").alignment = { horizontal: "left" };
  // }

  // // empty cell
  // worksheet.getCell("A4").alignment = { horizontal: "center", wrapText: true };

  // // table header
  // let _tableHeader = worksheet.addRow(tableHeader);
  // _tableHeader.font = { bold: true };
  // _tableHeader.eachCell((cell) => {
  //   cell.alignment = { horizontal: "center" };
  //   cell.border = {
  //     top: { style: "thin", color: { argb: "00000000" } },
  //     left: { style: "thin", color: { argb: "00000000" } },
  //     bottom: { style: "thin", color: { argb: "00000000" } },
  //     right: { style: "thin", color: { argb: "00000000" } },
  //   };
  // });

  // // table row
  // const _tableData = worksheet.addRows(tableData);
  // _tableData.forEach((row, index) => {
  //   row.eachCell((cell) => {
  //     cell.alignment = { horizontal: "left" };
  //     alignmentExcelFunc(
  //       ["D", "E", "F", "G", "H", "I", "J"],
  //       ["A", "B", "C", "K", "L", "M"],
  //       moneyProcessId,
  //       worksheet,
  //       index
  //     );
  //     cell.border = {
  //       top: { style: "thin", color: { argb: "00000000" } },
  //       left: { style: "thin", color: { argb: "00000000" } },
  //       bottom: { style: "thin", color: { argb: "00000000" } },
  //       right: { style: "thin", color: { argb: "00000000" } },
  //     };
  //   });
  // });

  // worksheet.addRow([]);
  // worksheet.addRow([]);
  // let systemGen = worksheet.addRow([
  //   "",
  //   "",
  //   "",
  //   `System Generated Report-${moment().format("ll")}`,
  // ]);
  // systemGen.font = { size: 12, bold: true };
  // worksheet.columns.forEach((column) => {
  //   let maxLength = 0;
  //   column["eachCell"]({ includeEmpty: true }, function (cell) {
  //     maxLength = Math.max(
  //       maxLength,
  //       0,
  //       cell.value ? cell.value.toString().length : 0
  //     );
  //   });
  //   column.width = maxLength + 2;
  // });

  // worksheet.getColumn("A").width = 6;

  // workbook.xlsx.writeBuffer().then((data) => {
  //   let blob = new Blob([data], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });
  //   fs.saveAs(blob, `${comapanyNameHeader}.xlsx`);
  // });
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
  tableHeaderArr,
  monthYear,
  buAddress
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
    tableHeaderArr,
    monthYear,
    buAddress
  );
};
