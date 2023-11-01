// import { Workbook } from "exceljs";
// import * as fs from "file-saver";
// import { alignmentExcelFunc } from "./excelStyle";
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
      new Cell(String(index + 1), "center", "text").getCell(),
      new Cell(item?.EmployeeName || "N/A", "left", "text").getCell(),
      new Cell(item?.EmployeeCode || "N/A", "left", "text").getCell(),
      new Cell(item?.strEmploymentType || "N/A", "left", "text").getCell(),
      new Cell(item?.DepartmentName || "N/A", "center", "text").getCell(),
      new Cell(item?.DesignationName || "N/A", "center", "text").getCell(),
      new Cell(item?.SupervisorName || "N/A", "center", "text").getCell(),
      // new Cell(item?.Phone || "N/A", "center", "text").getCell(),
      // new Cell(item?.Email || "N/A", "center", "text").getCell(),
      new Cell(moment(item?.dteContactFromDate).format('ll') || "N/A", "center", "text").getCell(),
      new Cell(moment(item?.dteContactToDate).format('ll') || "N/A", "center", "text").getCell(),
      new Cell(moment(item?.dteJoiningDate).format('ll') || "N/A", "center", "text").getCell(),
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
  tableHeaderArr
) => {
  const excel = {
    name:  `${comapanyNameHeader} ${moment().format('ll')}`,
    sheets: [
      {
        // name: `Salary Report-${monthYear}`,
        name:  `${comapanyNameHeader} ${moment().format('ll')}`,
        gridLine: false,
        rows: [
          ["_blank*2"],
          [
            {
              text: businessUnit,
              fontSize: 18,
              bold: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: buAddress,
              fontSize: 15,
              bold: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: `${comapanyNameHeader}-${moment().format('LL')}`,
              fontSize: 15,
              bold: true,
              cellRange: "A1:F1",
              merge: true,
              alignment: "center",
            },
          ],
                  
          ["_blank*2"],

          [
            {
              text: "SL",
              fontSize: 8.5,
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
              text: "Employee Code",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Employment Type",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Department",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Designation",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Supervisor",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
          
            // {
            //   text: "Phone",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            // },
            // {
            //   text: "Email",
            //   fontSize: 9,
            //   bold: true,
            //   border: "all 000000 thin",
            // },
           
            {
              text: "Contract From Date",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
           
            {
              text: "Contract to Date",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
           
            {
              text: "Joining Date",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
           
          ],
          ...getTableDataForExcel(rowDto),
          ["_blank*2"],
          [
            {
              text: `System Generated Report ${moment().format('ll')}`,
              fontSize: 12,
              bold: true,
              cellRange: "A1:F1",
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
  // worksheet.mergeCells("A1:S1");
  // worksheet.getCell("A1").alignment = { horizontal: "left" };

  // // excel heading name
  // let title = worksheet.addRow([comapanyNameHeader]);
  // title.font = { size: 16, bold: true };
  // worksheet.mergeCells("A2:S2");
  // worksheet.getCell("A2").alignment = { horizontal: "left" };

  // // form Date
  // let companyLocation;
  // if (fromDate) {
  //   companyLocation = worksheet.addRow([
  //     `From Date : ${fromDate}, To Date : ${toDate}`,
  //   ]);
  //   companyLocation.font = { size: 14, bold: true };
  //   worksheet.mergeCells("A3:S3");
  //   worksheet.getCell("A3").alignment = { horizontal: "lefts" };
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
  //     alignmentExcelFunc([], [], moneyProcessId, worksheet, index);
  //     cell.border = {
  //       top: { style: "thin", color: { argb: "00000000" } },
  //       left: { style: "thin", color: { argb: "00000000" } },
  //       bottom: { style: "thin", color: { argb: "00000000" } },
  //       right: { style: "thin", color: { argb: "00000000" } },
  //     };
  //   });
  // });

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
  buAddress,
  tableHeaderArr
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
    tableHeaderArr
  );
};
