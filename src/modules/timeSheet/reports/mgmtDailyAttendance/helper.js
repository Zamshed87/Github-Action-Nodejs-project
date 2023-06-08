import axios from "axios";
import { gray600 } from "../../../../utility/customColor";
import { Cell } from "../../../../utility/customExcel/createExcelHelper";

export const getBuDetails = async (buId, setter, setLoading) => {
  try {
    const res = await axios.get(
      `/SaasMasterData/GetBusinessDetailsByBusinessUnitId?businessUnitId=${buId}`
    );
    if (res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
    setter([]);
  }
};

// daily attendance generate landing
export const getDailyAttendanceData = async (
  orgId,
  buId,
  date,
  values,
  setter,
  setAllData,
  setLoading,
  setTableRowDto,
  intDepartmentId,
  srcTxt,
  pages,
  setPages,
  isPaginated = true
) => {
  setLoading && setLoading(true);
  let search = srcTxt ? `&SearchTxt=${srcTxt}` : "";

  try {
    const res = await axios.get(
      `/Employee/DailyAttendanceReport?IntAccountId=${orgId}&AttendanceDate=${date}&IntBusinessUnitId=${buId}&IntWorkplaceGroupId=${
        values?.workplaceGroup?.intWorkplaceGroupId || 0
      }&IntWorkplaceId=${values?.workplace?.intWorkplaceId || 0}&PageNo=${
        pages.current
      }&PageSize=${
        pages.pageSize
      }&IntDepartmentId=${0}&IsPaginated=${isPaginated}${search}`
    );
    if (res?.data) {
      setAllData && setAllData(res?.data);
      setter(res?.data?.employeeAttendanceSummaryVM);
      setTableRowDto(res?.data?.employeeAttendanceSummaryVM);
      setLoading && setLoading(false);
      setPages({
        ...pages,
        current: pages.current,
        pageSize: pages.pageSize,
        total: res?.data?.employeeAttendanceSummaryVM[0]?.totalCount,
      });
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
// UI Table columns
export const dailyAttendenceDtoCol = [
  {
    title: () => <span style={{ color: gray600 }}>SL</span>,
    render: (_, __, index) => index + 1,
    sorter: false,
    filter: false,
    className: "text-center",
  },
  {
    title: "Code",
    dataIndex: "employeeCode",
    sorter: true,
    filter: true,
    width: 100,
    render: (_, record) => record?.employeeCode || "N/A",
  },
  {
    title: "Employee Name",
    dataIndex: "employeeName",
    key: "employeeName",
    sorter: true,
    filter: true,
    render: (_, record) => record?.employeeName || "N/A",
  },
  {
    title: "Department",
    dataIndex: "department",
    sorter: true,
    filter: true,
    render: (_, record) => record?.department || "N/A",
  },
  {
    title: "Designation",
    dataIndex: "designation",
    sorter: true,
    filter: true,
    render: (_, record) => record?.designation || "N/A",
  },
  {
    title: "Employment Type",
    dataIndex: "employmentType",
    sorter: true,
    filter: true,
    render: (_, record) => record?.employmentType || "N/A",
  },
  {
    title: "Calendar Name",
    dataIndex: "calendarName",
    // sorter: true,
    filter: true,
    // render: (_, record) => record?.employmentType || "N/A",
  },
  {
    title: () => <span style={{ color: gray600 }}>In Time</span>,
    dataIndex: "inTime",
    render: (_, record) => record?.inTime || "N/A",
  },
  {
    title: () => <span style={{ color: gray600 }}>Out Time</span>,
    dataIndex: "outTime",
    render: (_, record) => record?.outTime || "N/A",
  },
  {
    title: () => <span style={{ color: gray600 }}>Duration</span>,
    dataIndex: "dutyHours",
    render: (_, record) => record?.dutyHours || "N/A",
  },
  {
    title: () => <span style={{ color: gray600 }}>Status</span>,
    dataIndex: "actualStatus",
    render: (_, record) => record?.actualStatus || "N/A",
    filter: true,
  },
  {
    title: () => <span style={{ color: gray600 }}>Manual Status</span>,
    dataIndex: "manualStatus",
    render: (_, record) => record?.manualStatus || "N/A",
    filter: true,
  },
  {
    title: () => <span style={{ color: gray600 }}>Address</span>,
    dataIndex: "location",
    render: (_, record) => record?.location || "N/A",
  },
  {
    title: () => <span style={{ color: gray600 }}>Remarks</span>,
    dataIndex: "remarks",
    render: (_, record) => record?.remarks || "N/A",
  },
];

// excel columns
export const column = {
  sl: "SL",
  employeeCode: "Code",
  employeeName: "Employee Name",
  department: "Department",
  designation: "Designation",
  employmentType: "Employment Type",
  calendarName: "Calendar Name",
  inTime: "In Time",
  outTime: "Out Time",
  dutyHours: "Duration",
  actualStatus: "Status",
  manualStatus: "Manual Status",
  location: "Address",
  remarks: "Remarks",
};

export const subHeaderColumn = {
  totalEmployee: "Total Employee",
  presentCount: "Present",
  absentCount: "Absent",
  lateCount: "Late",
  leaveCount: "Leave",
  movementCount: "Movement",
  weekendCount: "Weekend",
  holidayCount: "Holiday",
  manualPresentCount: "Manual Present",
};

// for excel
export const getTableDataDailyAttendance = (row, keys, summary) => {
  const data = row?.map((item, index) => {
    return keys?.map((key) => {
      return new Cell(item[key], "center", "text").getCell();
    });
  });
  // return [...summaryData, ...data];
  return data;
};

export const getTableDataSummaryHeadData = (item) => {
  return [
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
};
