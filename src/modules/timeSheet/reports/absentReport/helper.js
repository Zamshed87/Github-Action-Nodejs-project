import axios from "axios";
import { dateFormatter } from "utility/dateFormatter";
import AvatarComponent from "../../../../common/AvatarComponent";
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
export const getAbsentData = async (
  buId,
  fromdate,
  setter,
  setLoading,
  srcTxt,
  pageNo,
  pageSize,
  forExcel = false,
  wgId,
  setPages,
  wId,
  todate
) => {
  setLoading && setLoading(true);

  try {
    const res = await axios.get(
      `/TimeSheetReport/GetAbsentReport?IntBusinessUnitId=${buId}&IntWorkplaceGroupId=${wgId}&IntWorkplaceId=${wId}&FromDate=${fromdate}&ToDate=${todate}&IsXls=true&PageNo=${pageNo}&PageSize=${pageSize}`
    );

    if (res?.data) {
      setter(res?.data);
      setPages({
        current: pageNo,
        pageSize: pageSize,
        total: res?.data?.totalCount,
      });
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
// UI Table columns
export const absentDtoCol = (page, paginationSize) => {
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
      title: "Workplace Group",
      dataIndex: "workplaceGroup",
      sort: false,
      filter: false,
      render: (record) => record?.workplaceGroup || "N/A",
    },
    {
      title: "Workplace",
      dataIndex: "workplace",
      sort: false,
      filter: false,
      render: (record) => record?.workplace || "N/A",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      sort: false,
      filter: false,
      width: 100,
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
      title: "Designation",
      dataIndex: "designation",
      sort: false,
      filter: false,
      render: (record) => record?.designation || "N/A",
    },
    {
      title: "Department",
      dataIndex: "department",
      sort: false,
      filter: false,
      render: (record) => record?.department || "N/A",
    },
    {
      title: "Section",
      dataIndex: "section",
      sort: true,
      fieldType: "string",
      filter: false,
      render: (record) => record?.section || "N/A",
    },

    {
      title: "Total Absent",
      dataIndex: "totalAbsent",
      sort: false,
      filter: false,
      //   render: (record) => record?.employmentType || "N/A",
    },
    {
      title: "Last Present Date",
      dataIndex: "lastPresentDate",
      sort: false,
      filter: false,
      render: (_, record) => dateFormatter(record?.lastPresentDate) || "N/A",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      sort: false,
      filter: false,
      width: 120,
      //   render: (_, record) => dateFormatter(record?.lastPresentDate) || "N/A",
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
  totalAbsent: "Total Absent",
  lastPresentDate: "Last Present Date",
  mobileNumber: "Mobile Number",
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
