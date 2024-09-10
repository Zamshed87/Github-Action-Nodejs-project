import Chips from "common/Chips";
import { Cell } from "utility/customExcel/createExcelHelper";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { dateFormatter } from "utility/dateFormatter";

export const createJobCardExcelHandler = ({
  BuDetails,
  buName,
  rowDto,
  empInfo,
  empActivity,
}) => {
  const excelDataHeader = {
    attendanceDate: "Attendance Date",
    inTime: "In-Time",
    outTime: "Out-Time",
    lateMin: "Late Min",
    startTime: "Start Time",
    breakStartTime: "Break Start",
    breakEndTime: "Break End",
    endTime: "End Time",
    earlyOut: "Early Out",
    totalWorkingHour: "Total Working Hours",
    overTime: "Over Time",
    calenderName: "Calendar Name",
    attendanceStatus: "Attendance Status",
    remarks: "Remarks",
  };
  createCommonExcelFile({
    titleWithDate: `Job Card Report `,
    fromDate: "",
    toDate: "",
    buAddress: BuDetails?.strBusinessUnitAddress,
    businessUnit: buName,
    tableHeader: excelDataHeader,
    getTableData: () => {
      const data = rowDto?.map((item) => {
        return Object.keys(excelDataHeader)?.map((key) => {
          const cellValue = item[key];
          const formattedValue =
            typeof cellValue === "string" &&
            cellValue !== "" &&
            !isNaN(cellValue)
              ? parseFloat(cellValue)
              : cellValue;
          return new Cell(
            formattedValue || "-",
            "center",
            typeof formattedValue === "number" ? "amount" : "text"
          ).getCell();
        });
      });
      return data;
    },
    tableFooter: [],
    extraInfo: {},
    tableHeadFontSize: 10,
    widthList: {
      A: 20,
      B: 12,
      C: 12,
      D: 12,
      E: 12,
      F: 12,
      G: 12,
      H: 12,
      I: 12,
      J: 12,
      K: 15,
      L: 25,
      M: 15,
      N: 25,
    },
    commonCellRange: "A1:N1",
    CellAlignment: "left",
    getSubTableData: () => {
      const generateSubHeadData = (obj) => {
        return [
          new Cell(obj?.employeeName || 0, "center", "text", true).getCell(),
          new Cell(obj?.workplaceGroup || 0, "center", "text").getCell(),
          new Cell(obj?.workplaceName || 0, "center", "text").getCell(),
          new Cell(obj?.joiningDate || 0, "center", "text").getCell(),
          new Cell(obj?.designation || 0, "center", "text").getCell(),
          new Cell(obj?.department || 0, "center", "text").getCell(),
          new Cell(obj?.section || 0, "center", "text").getCell(),
          new Cell(obj?.totalPresent || 0, "center", "text").getCell(),
          new Cell(obj?.totalLate || 0, "center", "text").getCell(),
          new Cell(obj?.totalLeave || 0, "center", "text").getCell(),
          new Cell(obj?.totalMovement || 0, "center", "text").getCell(),
          new Cell(obj?.totalOffday || 0, "center", "text").getCell(),
          new Cell(obj?.totalAbsent || 0, "center", "text").getCell(),
          new Cell(obj?.totalOvertime || 0, "center", "text").getCell(),
        ];
      };
      return generateSubHeadData({
        employeeName: `${empInfo?.[0]?.EmployeeName} - ${empInfo?.[0]?.EmployeeCode}`,
        workplaceGroup: empInfo?.[0]?.WorkplaceGroupName || "-",
        workplaceName: empInfo?.[0]?.WorkplaceName || "-",
        joiningDate: dateFormatter(empInfo?.[0]?.JoiningDate) || "-",
        designation: empInfo?.[0]?.DesignationName || "-",
        department: empInfo?.[0]?.DepartmentName || "-",
        section: empInfo?.[0]?.SectionName || "-",
        totalPresent: `${empActivity?.totalPresent || 0} Days`,
        totalLate: `${empActivity?.totalLate || 0} Days`,
        totalLeave: `${empActivity?.totalLeave || 0} Days`,
        totalMovement: `${empActivity?.totalMovement || 0} Days`,
        totalOffday: `${empActivity?.totalOffday || 0} Days`,
        totalAbsent: `${empActivity?.totalAbsent || 0} Days`,
        totalOvertime: `${empActivity?.totalOvertime || 0}`,
      });
    },
    subHeaderColumn: {
      employeeName: "Employee & Code",
      workplaceGroup: "Workplace Group",
      workplaceName: "Workplace Name",
      joiningDate: "Joining Date",
      designation: "Designation",
      department: "Department",
      section: "Section",
      totalPresent: "Total Present",
      totalLate: "Total Late",
      totalLeave: "Total Leave",
      totalMovement: "Total Movement",
      totalOffday: "Total Off day",
      totalAbsent: "Total Absent",
      totalOvertime: "Total Over Time",
    },
  });
};
const dateFormatterForInputUpdate = (date) => {
  return date.toISOString().split("T")[0]; // Example: '2024-04-26'
};

export const custom26to25LandingDataHandler = (selectedDate, cb) => {
  try {
    const selectedDateObj = new Date(selectedDate);
    const selectedMonth = selectedDateObj.getMonth();
    const selectedYear = selectedDateObj.getFullYear();

    // Calculate the previous month and year
    const previousMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const previousYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;

    // Set the dates for the custom range
    const previousMonthStartDate = new Date(previousYear, previousMonth, 27);
    const currentMonthEndDate = new Date(selectedYear, selectedMonth, 26);

    cb(
      dateFormatterForInputUpdate(previousMonthStartDate),
      dateFormatterForInputUpdate(currentMonthEndDate)
    );
  } catch (error) {
    console.error("Error in custom26to25LandingDataHandler", error);
  }
};

export const JobCardTableHeadColumn = (page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => (page - 1) * paginationSize + index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
    },
    {
      title: "Attendance Date",
      dataIndex: "attendanceDate",
    },
    {
      title: "In-Time",
      dataIndex: "inTime",
    },
    {
      title: "Out-Time",
      dataIndex: "outTime",
    },
    {
      title: "Late Min",
      dataIndex: "lateMin",
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
    },
    {
      title: "Break Start",
      dataIndex: "breakStartTime",
    },
    {
      title: "Break End",
      dataIndex: "breakEndTime",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
    },
    {
      title: "Early Out",
      dataIndex: "earlyOut",
    },
    {
      title: "Total Working Hours",
      dataIndex: "totalWorkingHour",
    },
    {
      title: "Over Time",
      dataIndex: "overTime",
    },
    {
      title: "Calendar Name",
      dataIndex: "calenderName",
    },
    {
      title: "Attendance Status",
      render: (_, record) => (
        <>
          {record?.AttStatus === "Present" && (
            <Chips label={record?.AttStatus} classess="success" />
          )}
          {record?.AttStatus === "Absent" && (
            <Chips label={record?.AttStatus} classess="danger" />
          )}
          {record?.AttStatus === "Late" && (
            <Chips label={record?.AttStatus} classess="warning" />
          )}
          {record?.AttStatus === "Late Present" && (
            <Chips label={record?.AttStatus} classess="warning" />
          )}
          {record?.AttStatus === "Leave" && (
            <Chips label={record?.AttStatus} classess="indigo" />
          )}
          {record?.AttStatus === "Holiday" && (
            <Chips label={record?.AttStatus} classess="secondary" />
          )}
          {record?.AttStatus === "Offday" && (
            <Chips label={record?.AttStatus} classess="primary" />
          )}
          {record?.AttStatus === "Movement" && (
            <Chips label={record?.AttStatus} classess="movement" />
          )}
          {record?.AttStatus === "Manual Present" && (
            <Chips label={record?.AttStatus} classess="success" />
          )}
          {record?.AttStatus === "Manual Absent" && (
            <Chips label={record?.AttStatus} classess="danger" />
          )}
          {record?.AttStatus === "Manual Leave" && (
            <Chips label={record?.AttStatus} classess="indigo" />
          )}
          {record?.AttStatus === "Manual Late" && (
            <Chips label={record?.AttStatus} classess="warning" />
          )}
          {record?.AttStatus === "Early Out" && (
            <Chips label={record?.AttStatus} classess="info" />
          )}
          {record?.AttStatus === "Halfday Leave" && (
            <Chips label={record?.AttStatus} classess="warning" />
          )}
          {record?.AttStatus === "Not Found" && <p>-</p>}
        </>
      ),
      dataIndex: "AttStatus",
      sorter: true,
      filter: true,
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
      sorter: true,
      filter: true,
      isNumber: true,
    },
  ];
};
