import axios from "axios";
import AvatarComponent from "common/AvatarComponent";
import { getChipStyle } from "modules/timeSheet/employeeAssign/shiftManagement/helper";
import { gray600 } from "utility/customColor";
import { Cell } from "utility/customExcel/createExcelHelper";
import { fromToDateList } from "../helper";

// daily attendance generate landing
export const getJoineeAttendanceData = async (
  orgId,
  buId,
  fromdate,
  todate,
  setter,
  setLoading,
  srcTxt,
  pageNo,
  pageSize,
  forExcel = false,
  wgId,
  setPages,
  wId,
  values
) => {
  setLoading && setLoading(true);

  try {
    const res = await axios.get(
      `/TimeSheetReport/TimeManagementDynamicPIVOTReport?ReportType=new_joinee_in_out_attendance_report_for_all_employee&AccountId=${orgId}&DteFromDate=${fromdate}&DteToDate=${todate}&EmployeeId=0&WorkplaceGroupId=${wgId}&WorkplaceId=${wId}&PageNo=${pageNo}&PageSize=${pageSize}&IsPaginated=true&intYearId=${values?.yearId}&intMonthId=${values?.monthId}`
    );

    if (res?.data) {
      setter(res?.data);
      setPages({
        current: pageNo,
        pageSize: pageSize,
        total: res?.data[0]?.totalCount,
      });
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};
// UI Table columns
export const joineeAttendanceReportColumns = (
  fromDate,
  toDate,
  page,
  paginationSize
) => {
  const dateList = fromToDateList(fromDate, toDate);
  return [
    {
      title: () => <span style={{ color: gray600, minWidth: "25px" }}>SL</span>,
      render: (_, __, index) => (page - 1) * paginationSize + index + 1,
      sorter: false,
      filter: false,
      className: "text-center",
      width: 40,
      fixed: "left",
    },
    {
      title: () => <span style={{ color: gray600 }}>Employee ID</span>,
      dataIndex: "EmployeeCode",
      sorter: true,
      filter: true,
      fixed: "left",
      width: 120,
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.strEmployeeName}
            />
            <span className="ml-2">{record?.strEmployeeName}</span>
          </div>
        );
      },
      sorter: true,
      filter: true,
      fixed: "left",
      width: 200,
    },
    {
      title: "Work. Group/Location",
      dataIndex: "strWorkplaceGroup",
      sorter: true,
      filter: false,
      width: 180,
    },
    {
      title: "Workplace/Concern",
      dataIndex: "strWorkplace",
      sorter: true,
      // filter: true,
      width: 180,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sorter: true,
      // filter: true,
      width: 180,
    },
    {
      title: "Section",
      dataIndex: "strSectionName",
      sorter: true,
      // filter: true,
      width: 180,
    },

    {
      title: "Designation",
      dataIndex: "strDesignation",
      sorter: true,
      filter: true,
      width: 180,
    },

    ...(dateList?.length > 0 &&
      dateList.map((item) => ({
        title: () => <span style={{ color: gray600 }}>{item?.level}</span>,
        render: (_, record) =>
          record?.[item?.date] ? (
            <span style={getChipStyle(record?.[item?.date])}>
              {record?.[item?.date]}
            </span>
          ) : (
            "-"
          ),
        width: 150,
        className: "text-center",
      }))),
  ];
};
// for excel
export const getTableDataMonthlyAttendance = (row, keys, totalKey) => {
  const data = row?.map((item, index) => {
    return keys?.map((key) => {
      return new Cell(
        item[key] || item[key] == 0 ? item[key] : "-",
        "center",
        "text"
      ).getCell();
    });
  });
  return data;
};

// excel columns
export const column = (fromDate, toDate) => {
  const dateList = fromToDateList(fromDate, toDate);
  let tempObj = {};
  dateList?.length > 0 &&
    dateList.forEach((item) => {
      tempObj = {
        ...tempObj,
        [item?.date]: item?.level,
      };
    });
  return {
    sl: "SL",
    strWorkplaceGroup: "Workplace Group",
    strWorkplace: "Workplace",
    EmployeeCode: "Code",
    strEmployeeName: "Employee Name",
    strDesignation: "Designation",

    strDepartment: "Department",
    strSectionName: "Section",
    ...tempObj,
  };
};
