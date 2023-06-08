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
      new Cell(item?.DesignationName || "N/A", "center", "text").getCell(),
      new Cell(item?.DepartmentName || "N/A", "center", "text").getCell(),
      new Cell(item?.SeparationTypeName || "N/A", "center", "text").getCell(),
      new Cell(item?.JoiningDate || "N/A", "center", "text").getCell(),
      new Cell(item?.ServiceLength || "N/A", "center", "text").getCell(),
      new Cell(item?.InsertDate || "N/A", "center", "text").getCell(),
      new Cell(item?.AdjustedAmount || 0, "center", "text").getCell(),
      new Cell(item?.ApprovalStatus || "N/A", "center", "text").getCell(),
    ];
  });
  return data;
};
const createExcelFile = (
  comapanyNameHeader,
  fromDate,
  toDate,
  businessUnit,
  rowDto,
  buAddress
) => {

  const excel = {
    name: `${comapanyNameHeader} ${moment().format('ll')}`,
    sheets: [
      {
        // name: `Salary Report-${monthYear}`,
        name:`${comapanyNameHeader} ${moment().format('ll')}`,
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
              text: `${comapanyNameHeader}-${moment().format('LL')}`,
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
              text: "Separation Type",
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
            {
              text: "Service Length",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Application Date",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Adjusted Amount",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Status",
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

};



export const generateExcelAction = (
  title,
  fromDate,
  toDate,
  businessUnit,
  rowDto,
  buAddress
) => {
  createExcelFile(
    title,
    fromDate,
    toDate,
    businessUnit,
    rowDto,
    buAddress
  );
};
