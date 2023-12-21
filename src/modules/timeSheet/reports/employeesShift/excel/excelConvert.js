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
      new Cell(
        `${moment(item?.dteAttendanceDate).format("LL")} - ${moment(
          item?.dteAttendanceDate
        ).format("dddd")} ` || "N/A",
        "left",
        "text"
      ).getCell(),
      new Cell(item?.strCalendarName || "N/A", "center", "text").getCell(),
      new Cell(item?.dteStartTime || "N/A", "center", "text").getCell(),
      new Cell(item?.dteLastStartTime || "N/A", "center", "text").getCell(),
      new Cell(item?.dteEndTime || 0, "center", "text").getCell(),
      new Cell(item?.duration || 0, "center", "text").getCell(),
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
  buAddress,
  employeeInformation
) => {
  const excel = {
    name: `${comapanyNameHeader} ${moment().format("ll")}`,
    sheets: [
      {
        // name: `Salary Report-${monthYear}`,
        name: `${comapanyNameHeader} ${moment(fromDate).format(
          "LL"
        )} to ${moment(toDate).format("LL")}`,
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
              text: `${comapanyNameHeader}-${moment(fromDate).format(
                "LL"
              )} to ${moment(toDate).format("LL")}`,
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
              text: "",
              fontSize: 8.5,

              bold: true,
            },
            {
              text: "Employee",
              fontSize: 8.5,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Workplace Group",
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
              text: "Employment Type",
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
          ],

          [
            {
              text: "",
              fontSize: 8.5,

              bold: true,
            },
            {
              text: employeeInformation?.[0]?.EmployeeName,
              fontSize: 8.5,
              border: "all 000000 thin",
            },
            {
              text: employeeInformation?.[0]?.EmploymentTypeName,
              fontSize: 9,
              border: "all 000000 thin",
            },
            {
              text: employeeInformation?.[0]?.DesignationName,
              fontSize: 9,
              border: "all 000000 thin",
            },
            {
              text: employeeInformation?.[0]?.DepartmentName,
              fontSize: 9,
              border: "all 000000 thin",
            },
            {
              text: employeeInformation?.[0]?.SectionName,
              fontSize: 9,
              border: "all 000000 thin",
            },
            {
              text: employeeInformation?.[0]?.EmploymentTypeName,
              fontSize: 9,
              border: "all 000000 thin",
            },
            {
              text: employeeInformation?.[0]?.SupervisorName,
              fontSize: 9,
              border: "all 000000 thin",
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
              text: "Attendance Date",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },

            {
              text: "Calendar Name",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Start Time",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Extended Start Time",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },

            {
              text: "End Time",
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
  buAddress,
  employeeInformation
) => {
  createExcelFile(
    title,
    fromDate,
    toDate,
    businessUnit,
    rowDto,
    buAddress,
    employeeInformation
  );
};
