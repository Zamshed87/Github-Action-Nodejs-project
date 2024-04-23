import axios from "axios";
import AvatarComponent from "../../../../common/AvatarComponent";
import { Cell } from "../../../../utility/customExcel/createExcelHelper";
import { convertTo12HourFormat } from "../../../../utility/timeFormatter";

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
export const dailyAttendenceDtoCol = (page, paginationSize, headerList) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
      // width: 30,
      fixed: "left",
    },
    {
      title: "Work. Group/Location",
      dataIndex: "workplaceGroup",
      sort: false,
      filter: false,
      width: 200,
      fixed: "left",

      render: (record) => record?.workplaceGroup || "N/A",
    },
    {
      title: "Workplace/Concern",
      dataIndex: "workplace",
      sort: false,
      filter: false,
      fixed: "left",
      width: 200,
      render: (record) => record?.workplace || "N/A",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      sort: false,
      filter: false,
      width: 80,
      fixed: "left",
      render: (record) => record?.employeeCode || "N/A",
    },
    {
      title: "Employee",
      dataIndex: "employeeName",
      sort: false,
      filter: false,
      fixed: "left",

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
      title: "Designation",
      dataIndex: "designation",
      sort: false,
      filter: true,
      filterDropDownList: headerList[`designationList`],

      render: (record) => record?.designation || "N/A",
    },
    {
      title: "Department",
      dataIndex: "department",
      sort: false,
      filter: true,
      filterDropDownList: headerList[`departmentList`],
      render: (record) => record?.department || "N/A",
    },
    {
      title: "Section",
      dataIndex: "section",
      sort: true,
      fieldType: "string",
      filterDropDownList: headerList[`sectionList`],
      filter: true,
      render: (record) => record?.section || "N/A",
    },
    {
      title: "HR Position",
      dataIndex: "hrPosition",
      sort: true,
      fieldType: "string",
      filterDropDownList: headerList[`hrPositionList`],
      filter: true,
      render: (record) => record?.hrPosition || "N/A",
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
      dataIndex: "calender",
      sort: false,
      filter: true,
      filterDropDownList: headerList[`calenderList`],

      // render: (_, record) => record?.employmentType || "N/A",
    },
    {
      title: "In Time",
      dataIndex: "inTime",
      render: (record) => (
        <span>
          {record?.inTime ? convertTo12HourFormat(record?.inTime) : "N/A"}
        </span>
      ),
      sort: false,
      filter: false,
      width: 80,
    },
    {
      title: "Out Time",
      dataIndex: "outTime",
      render: (record) => (
        <span>
          {record?.outTime ? convertTo12HourFormat(record?.outTime) : "N/A"}
        </span>
      ),

      sort: false,
      filter: false,
      width: 80,
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
      filterDropDownList: headerList[`actualStatusList`],
      sort: false,
      filter: true,
    },
    {
      title: "Manual Status",
      dataIndex: "manualStatus",
      render: (record) => record?.manualStatus || "N/A",
      sort: false,
      filterDropDownList: headerList[`manualStatusList`],

      filter: true,
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
  workplaceGroup: "Workplace Group",
  workplace: "Workplace",
  employeeCode: "Employee Id",
  employeeName: "Employee Name",
  designation: "Designation",
  department: "Department",
  section: "Section",
  employmentType: "Employment Type",
  calendar: "Calendar Name",
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
