import axios from "axios";
import { gray600 } from "../../../../utility/customColor";
import { dateFormatter } from "./../../../../utility/dateFormatter";

// daily attendance generate landing
export const getDailyAttendanceData = async (
  orgId,
  values,
  setter,
  setAllData,
  setLoading,
  setTableRowDto,
  srcText,
  pages,
  setPages,
  isPaginated = true
) => {
  let search = srcText ? `&SearchTxt=${srcText}` : "";
  setLoading && setLoading(true);
  try {
    const res = await axios.get(
      `/TimeSheetReport/TimeManagementDynamicPIVOTReport?ReportType=InvalidInOutAttendanceData&AccountId=${orgId}&DteFromDate=${
        values?.date
      }&DteToDate=${values?.toDate}&WorkplaceGroupId=${
        values?.workplaceGroup?.value || 0
      }&WorkplaceId=${values?.workplace?.value || 0}&PageNo=${
        pages?.current
      }&PageSize=${pages?.pageSize}&IsPaginated=${isPaginated}${search}`
    );
    if (res?.data) {
      setAllData && setAllData(res?.data);
      setter(res?.data);
      setTableRowDto(res?.data);
      setPages({
        ...pages,
        current: pages.current,
        pageSize: pages.pageSize,
        total: res?.data[0]?.totalCount,
      });
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const dailyAttendenceDtoCol = [
  {
    title: () => <span style={{ color: gray600 }}>SL</span>,
    render: (_, __, index) => index + 1,
    sorter: false,
    filter: false,
    className: "text-center",
  },
  {
    title: "Employee Id",
    dataIndex: "EmployeeId",
    sorter: true,
    filter: true,
    width: 100,
    render: (_, record) => record?.EmployeeId || "N/A",
  },
  {
    title: "Employee Name",
    dataIndex: "EmployeeName",
    key: "EmployeeName",
    sorter: true,
    filter: true,
    render: (_, record) => record?.EmployeeName || "N/A",
  },
  {
    title: "Department",
    dataIndex: "Department",
    sorter: true,
    filter: true,
    render: (_, record) => record?.Department || "N/A",
  },
  {
    title: "Designation",
    dataIndex: "Designation",
    sorter: true,
    filter: true,
    render: (_, record) => record?.Designation || "N/A",
  },
  {
    title: "Date",
    sorter: false,
    filter: false,
    render: (_, record) => dateFormatter(record?.AttendanceDate) || "N/A",
  },
  {
    title: () => <span style={{ color: gray600 }}>Attendance Time</span>,
    dataIndex: "AttendanceTime",
    render: (_, record) => record?.AttendanceTime || "N/A",
  },
  {
    title: "Attendance Source",
    dataIndex: "AttendanceSource",
    sorter: true,
    filter: true,
    render: (_, record) => record?.AttendanceSource || "N/A",
  },
];
