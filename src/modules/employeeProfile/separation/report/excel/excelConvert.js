import moment from "moment";
import { dateFormatter } from "utility/dateFormatter";
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
      new Cell(item?.strWorkplaceGroupName || "N/A", "left", "text").getCell(),
      new Cell(item?.strWorkplaceName || "N/A", "left", "text").getCell(),
      new Cell(item?.strDepartment || "N/A", "center", "text").getCell(),
      new Cell(item?.strSectionName || "N/A", "center", "text").getCell(),
      new Cell(item?.strEmployeeCode || "N/A", "left", "text").getCell(),
      new Cell(item?.strEmployeeName || "N/A", "left", "text").getCell(),
      new Cell(item?.strDesignation || "N/A", "center", "text").getCell(),
      new Cell(
        item?.strSeparationTypeName || "N/A",
        "center",
        "text"
      ).getCell(),
      new Cell(
        dateFormatter(item?.dteJoiningDate) || "N/A",
        "center",
        "text"
      ).getCell(),
      new Cell(
        dateFormatter(item?.dteSeparationDate) || "N/A",
        "center",
        "text"
      ).getCell(),
      new Cell(item?.serviceLength || "N/A", "center", "text").getCell(),
      new Cell(
        dateFormatter(item?.dteCreatedAt) || "N/A",
        "center",
        "text"
      ).getCell(),
      new Cell(item?.intAdjustedAmount || 0, "center", "text").getCell(),
      new Cell(item?.approvalStatus || "N/A", "center", "text").getCell(),
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
    name: `${comapanyNameHeader} ${moment().format("ll")}`,
    sheets: [
      {
        // name: `Salary Report-${monthYear}`,
        name: ` ${moment().format("ll")}`,
        gridLine: false,
        rows: [
          ["_blank*2"],
          [
            {
              text: comapanyNameHeader,
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
              text: `Separation Report for the month of ${moment().format(
                "LL"
              )}`,
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
              // cellRange: "A1:B1",
              // merge: true,
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
              text: "Separetion Date",
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
