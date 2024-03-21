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
      new Cell(item?.workplaceGroupName || "N/A", "left", "text").getCell(),
      new Cell(item?.workplaceName || "N/A", "left", "text").getCell(),
      new Cell(item?.departmentName || "N/A", "center", "text").getCell(),
      new Cell(item?.sectionName || "N/A", "left", "text").getCell(),
      new Cell(item?.employeeCode || "N/A", "left", "text").getCell(),
      new Cell(item?.employeeName || "N/A", "left", "text").getCell(),
      new Cell(item?.designationName || "N/A", "center", "text").getCell(),
      new Cell(item?.employmentType || "N/A", "center", "text").getCell(),
      new Cell(item?.rawDuration || 0, "center", "text").getCell(),
      new Cell(item?.reason || "N/A", "left", "text").getCell(),
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
              cellRange: "A1:E1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: buAddress,
              fontSize: 15,
              bold: true,
              cellRange: "A1:E1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: `${comapanyNameHeader}`,
              fontSize: 15,
              bold: true,
              cellRange: "A1:E1",
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
              text: "Workplace Group",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Workplace",
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
              text: "Section",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Employee Id",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Employee Name",
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
              text: "Employment Type",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },

            {
              text: "Duration (Day)",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Reason",
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
              cellRange: "A1:E1",
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
  createExcelFile(title, fromDate, toDate, businessUnit, rowDto, buAddress);
};
