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
      new Cell(item?.employeeName || "N/A", "left", "text").getCell(),
      new Cell(item?.employeeCode || "N/A", "center", "text").getCell(),
      new Cell(item?.department || "N/A", "center", "text").getCell(),
      new Cell(item?.designation || "N/A", "center", "text").getCell(),
      new Cell(item?.employmentType || "N/A", "center", "text").getCell(),
      new Cell(item?.calendarName || "N/A", "center", "text").getCell(),
      new Cell(item?.inTime || "N/A", "center", "text").getCell(),
      new Cell(item?.outTime || "N/A", "center", "text").getCell(),
      new Cell(item?.dutyHours || "N/A", "center", "text").getCell(),
      new Cell(item?.actualStatus || "N/A", "center", "text").getCell(),
      new Cell(item?.manualStatus || "N/A", "center", "text").getCell(),
      new Cell(item?.location || "N/A", "center", "text").getCell(),
      new Cell(item?.remarks || "N/A", "center", "text").getCell(),
    ];
  });
  return data;
};
const getTableDataSummary = (allData) => {
  const data = allData?.map((item, index) => {
    return [
      new Cell("", "", ""),
      new Cell(item?.totalEmployee || 0, "center", "text").getCell(),
      new Cell(item?.presentCount || 0, "center", "text").getCell(),
      new Cell(item?.absentCount || 0, "center", "text").getCell(),
      new Cell(item?.lateCount || 0, "center", "text").getCell(),
      new Cell(item?.leaveCount || 0, "center", "text").getCell(),
      new Cell(item?.movementCount || 0, "center", "text").getCell(),
      new Cell(item?.weekendCount || 0, "center", "text").getCell(),
      new Cell(item?.holidayCount || 0, "center", "text").getCell(),
      new Cell(item?.manualPresentCount || 0, "center", "text").getCell(),
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
  allData,
  date,
  buAddress
) => {
  const excel = {
    name: `${comapanyNameHeader} ${moment().format("ll")}`,
    sheets: [
      {
        name: `${comapanyNameHeader} ${moment().format("ll")}`,
        gridLine: false,
        rows: [
          ["_blank*2"],

          [
            {
              text: businessUnit,
              fontSize: 18,
              bold: true,
              cellRange: "A1:N1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: buAddress,
              fontSize: 15,
              bold: true,
              cellRange: "A1:N1",
              merge: true,
              alignment: "center:middle",
            },
          ],
          [
            {
              text: `${comapanyNameHeader}-${moment(date).format("LL")}`,
              fontSize: 15,
              bold: true,
              cellRange: "A1:N1",
              merge: true,
              alignment: "center",
            },
          ],
          ["_blank"],
          [
            {
              text: allData?.workplaceGroup
                ? `Workplace Group-${allData?.workplaceGroup}`
                : "",
              fontSize: 9,
              bold: true,
              cellRange: "A1:C1",
              merge: true,
              alignment: "left",
            },
          ],
          [
            {
              text: allData?.workplace ? `Workplace-${allData?.workplace}` : "",
              fontSize: 9,
              bold: true,
              cellRange: "A1:C1",
              merge: true,
              alignment: "left",
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
              text: "Total Employee",
              fontSize: 8.5,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Present",
              fontSize: 9,
              // cellRange: "A1:B1",
              // merge: true,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Absent",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Late",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Leave",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Movement",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Weeked",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Holiday",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Manual Present",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
          ],
          ...getTableDataSummary([
            {
              totalEmployee: allData?.totalEmployee,
              presentCount: allData?.presentCount,
              absentCount: allData?.absentCount,
              lateCount: allData?.lateCount,
              leaveCount: allData?.leaveCount,
              movementCount: allData?.movementCount,
              weekendCount: allData?.weekendCount,
              holidayCount: allData?.holidayCount,
              manualPresentCount: allData?.manualPresentCount,
            },
          ]),
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
              text: "Calendar Name",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "In Time",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Out Time",
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
            {
              text: "Status",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Manual Status",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
            },
            {
              text: "Address",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
              alignment: "center",
            },
            {
              text: "Remarks",
              fontSize: 9,
              bold: true,
              border: "all 000000 thin",
              alignment: "center",
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

// const getTableData = (row, keys, totalKey) => {
//   const data = row?.map((item, index) => {
//     return keys?.map((key) => item[key]);
//   });
//   return data;
// };

export const generateExcelAction = (
  title,
  fromDate,
  toDate,
  businessUnit,
  rowDto,
  allData,
  date,
  buAddress
) => {
  // const tableDataInfo = getTableData(data, Object.keys(column));
  createExcelFile(
    title,
    fromDate,
    toDate,
    businessUnit,
    rowDto,
    allData,
    date,
    buAddress
  );
};
