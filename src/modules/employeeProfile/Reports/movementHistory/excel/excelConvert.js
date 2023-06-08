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
      new Cell(item?.DepartmentName || "N/A", "center", "text").getCell(),
      new Cell(item?.DesignationName || "N/A", "center", "text").getCell(),
      new Cell(item?.EmploymentTypeName || "N/A", "center", "text").getCell(),
      new Cell(item?.Duration || 0, "center", "text").getCell(),
     
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
    name: `${comapanyNameHeader} Report ${moment().format('ll')}`,
    sheets: [
      {
        // name: `Salary Report-${monthYear}`,
        name:`${comapanyNameHeader} Report ${moment().format('ll')}`,
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
              text: `${comapanyNameHeader}-${moment().format('LL')}`,
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
              text: "Employee Name",
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
              text: "Employment Type",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
           
            {
              text: "Duration",
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
  createExcelFile(
    title,
    fromDate,
    toDate,
    businessUnit,
    rowDto,
    buAddress
  );
};
