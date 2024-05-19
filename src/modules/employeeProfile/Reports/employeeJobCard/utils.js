import Chips from "common/Chips";
import { Cell } from "utility/customExcel/createExcelHelper";
import { createCommonExcelFile } from "utility/customExcel/generateExcelAction";
import { dateFormatter, dateFormatterForInput } from "utility/dateFormatter";

export const createJobCardExcelHandler = ({
  BuDetails,
  buName,
  rowDto,
  empInfo,
}) => {
  const excelDataHeader = {
    AttendanceDateWithName: "Attendance Date",
    InTime: "In-Time",
    OutTime: "Out-Time",
    LateMin: "Late Min",
    StartTime: "Start Time",
    breakStartTime: "Break Start",
    breakEndTime: "Break End",
    EndTime: "End Time",
    EarlyOut: "Early Out",
    WorkingHours: "Total Working Hours",
    numOverTime: "Over Time",
    CalendarName: "Calendar Name",
    AttStatus: "Attendance Status",
    Remarks: "Remarks",
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
          new Cell(obj?.totalPresent || 0, "center", "text").getCell(),
          new Cell(obj?.totalLate || 0, "center", "text").getCell(),
          new Cell(obj?.totalLeave || 0, "center", "text").getCell(),
          new Cell(obj?.totalMovement || 0, "center", "text").getCell(),
          new Cell(obj?.totalOffday || 0, "center", "text").getCell(),
          new Cell(obj?.totalAbsent || 0, "center", "text").getCell(),
        ];
      };
      return generateSubHeadData({
        employeeName: `${empInfo?.[0]?.EmployeeName} - ${empInfo?.[0]?.EmployeeCode}`,
        workplaceGroup: empInfo?.[0]?.WorkplaceGroupName || "-",
        workplaceName: empInfo?.[0]?.WorkplaceName || "-",
        joiningDate: dateFormatter(empInfo?.[0]?.JoiningDate) || "-",
        designation: empInfo?.[0]?.DesignationName || "-",
        department: empInfo?.[0]?.DepartmentName || "-",
        totalPresent: `${rowDto?.[0]?.totalPresent || 0} Days`,
        totalLate: `${rowDto?.[0]?.totalLate || 0} Days`,
        totalLeave: `${rowDto?.[0]?.totalLeave || 0} Days`,
        totalMovement: `${rowDto?.[0]?.totalMovement || 0} Days`,
        totalOffday: `${rowDto?.[0]?.totalOffday || 0} Days`,
        totalAbsent: `${rowDto?.[0]?.totalAbsent || 0} Days`,
      });
    },
    subHeaderColumn: {
      employeeName: "Employee & Code",
      workplaceGroup: "Workplace Group",
      workplaceName: "Workplace Name",
      joiningDate: "Joining Date",
      designation: "Designation",
      department: "Department",
      totalPresent: "Total Present",
      totalLate: "Total Late",
      totalLeave: "Total Leave",
      totalMovement: "Total Movement",
      totalOffday: "Total Off day",
      totalAbsent: "Total Absent",
    },
  });
};

export const custom26to25LandingDataHandler = (cb) => {
  try {
    const currentDate = new Date();
    // Get the current month and year
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Set the dates
    const previousMonthDate = new Date(previousYear, previousMonth, 26);
    const currentMonthDate = new Date(currentYear, currentMonth, 25);

    cb(
      dateFormatterForInput(previousMonthDate),
      dateFormatterForInput(currentMonthDate)
    );
  } catch (error) {}
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
      dataIndex: "AttendanceDateWithName",
    },
    {
      title: "In-Time",
      dataIndex: "InTime",
    },
    {
      title: "Out-Time",
      dataIndex: "OutTime",
    },
    {
      title: "Late Min",
      dataIndex: "LateMin",
    },
    {
      title: "Start Time",
      dataIndex: "StartTime",
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
      dataIndex: "EndTime",
    },
    {
      title: "Early Out",
      dataIndex: "EarlyOut",
    },
    {
      title: "Total Working Hours",
      dataIndex: "WorkingHours",
    },
    {
      title: "Over Time",
      dataIndex: "numOverTime",
    },
    {
      title: "Calendar Name",
      dataIndex: "CalendarName",
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
