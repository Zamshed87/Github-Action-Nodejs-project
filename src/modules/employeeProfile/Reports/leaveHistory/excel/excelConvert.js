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
      new Cell(item?.employee || "N/A", "left", "text").getCell(),
      new Cell(item?.employeeCode || "N/A", "left", "text").getCell(),
      new Cell(item?.department || "N/A", "center", "text").getCell(),
      new Cell(item?.designation || "N/A", "center", "text").getCell(),
      // eslint-disable-next-line
      new Cell(
        `${item?.clTaken || 0}/${item?.clBalance || 0}` || "N/A",
        "center",
        "text"
      ).getCell(),
      // eslint-disable-next-line
      new Cell(
        `${item?.slTaken || 0}/${item?.slBalance || 0}` || "N/A",
        "center",
        "text"
      ).getCell(),
      // eslint-disable-next-line
      new Cell(
        `${item?.elTaken || 0}/${item?.elBalance || 0}` || "N/A",
        "center",
        "text"
      ).getCell(),
      // eslint-disable-next-line
      new Cell(
        `${item?.lwpTaken || 0}/${item?.lwpBalance || 0}` || "N/A",
        "center",
        "text"
      ).getCell(),
      // eslint-disable-next-line
      new Cell(
        `${item?.mlTaken || 0}/${item?.mlBalance || 0}` || "N/A",
        "center",
        "text"
      ).getCell(),
    ];
  });
  return data;
};
const createExcelFile = (
  comapanyNameHeader,
  businessUnit,
  rowDto,
  buAddress
) => {
  const excel = {
    name: `${comapanyNameHeader} Report ${moment().format("ll")}`,
    sheets: [
      {
        // name: `Salary Report-${monthYear}`,
        name: `${comapanyNameHeader} Report ${moment().format("ll")}`,
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
              text: `${comapanyNameHeader}-${moment().format("LL")}`,
              fontSize: 15,
              bold: true,
              cellRange: "A1:J1",
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
              text: "Employee ID",
              fontSize: 9,
              // cellRange: "A1:B1",
              // merge: true,
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
              text: "CL",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "SL",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "EL",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "LWP",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "ML",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
          ],
          ...getTableDataForExcel(rowDto),
          ["_blank*2"],
          [
            {
              text: `System Generated Report ${moment().format("ll")}`,
              fontSize: 12,
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

// const getTableData = (row, keys, totalKey) => {
//   const data = row?.map((item, index) => {
//     return keys?.map((key) => item[key]);
//   });
//   return data;
// };

export const generateExcelAction = (title, businessUnit, rowDto, buAddress) => {
  // const tableDataInfo = getTableData(data, Object.keys(column));

  createExcelFile(title, businessUnit, rowDto, buAddress);
};
