import axios from "axios";
import { Cell } from "../../../../utility/customExcel/createExcelHelper";
import AvatarComponent from "../../../../common/AvatarComponent";

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
  buId,
  date,
  setter,
  setLoading,
  srcTxt,
  pageNo,
  pageSize,
  forExcel = false,
  wgId,
  setPages,
  wId
) => {
  setLoading && setLoading(true);

  try {
    const res = await axios.get(
      `/Employee/GetDateWiseAttendanceReport?IntBusinessUnitId=${buId}&IntWorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}&attendanceDate=${date}&IsXls=${forExcel}&PageNo=${pageNo}&PageSize=${pageSize}&searchTxt=${srcTxt}`
    );

    if (res?.data) {
      setter(res?.data);
      setPages({
        current: res?.data?.currentPage,
        pageSize: res?.data?.pageSize,
        total: res?.data?.totalCount,
      });
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
// UI Table columns
export const dailyAttendenceDtoCol = (page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
      width: 30,
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      sort: false,
      filter: false,
      width: 80,
      render: (record) => record?.employeeCode || "N/A",
    },
    {
      title: "Employee",
      dataIndex: "employeeName",
      sort: false,
      filter: false,
      render: (item) => (
        <div className="d-flex align-items-center justify-content-start">
          <div className="emp-avatar">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={item?.employeeName}
            />
          </div>
          <div className="ml-2">
            <span>{item?.employeeName}</span>
          </div>
        </div>
      ),
      fieldType: "string",
    },
    {
      title: "Department",
      dataIndex: "department",
      sort: false,
      filter: false,
      render: (record) => record?.department || "N/A",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      sort: false,
      filter: false,
      render: (record) => record?.designation || "N/A",
    },
    {
      title: "Employment Type",
      dataIndex: "employmentType",
      sort: false,
      filter: false,
      render: (record) => record?.employmentType || "N/A",
    },
    {
      title: "Calendar Name",
      dataIndex: "calendarName",
      sort: false,
      filter: false,
      // render: (_, record) => record?.employmentType || "N/A",
    },
    {
      title: "In Time",
      dataIndex: "inTime",
      render: (record) => record?.inTime || "N/A",
      sort: false,
      filter: false,
    },
    {
      title: "Out Time",
      dataIndex: "outTime",
      render: (record) => record?.outTime || "N/A",
      sort: false,
      filter: false,
    },
    {
      title: "Duration",
      dataIndex: "dutyHours",
      render: (record) => record?.dutyHours || "N/A",
      sort: false,
      filter: false,
    },
    {
      title: "Status",
      dataIndex: "actualStatus",
      render: (record) => record?.actualStatus || "N/A",
      sort: false,
      filter: false,
    },
    {
      title: "Manual Status",
      dataIndex: "manualStatus",
      render: (record) => record?.manualStatus || "N/A",
      sort: false,
      filter: false,
    },
    {
      title: "Address",
      dataIndex: "location",
      render: (record) => record?.location || "N/A",
      sort: false,
      filter: false,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      render: (record) => record?.remarks || "N/A",
      sort: false,
      filter: false,
    },
  ];
};

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
