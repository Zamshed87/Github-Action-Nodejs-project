import { InfoOutlined } from "@mui/icons-material";
import { getSerial } from "Utils";
import axios from "axios";
import { toast } from "react-toastify";
import demoUserIcon from "../../../assets/images/userIcon.svg";
import Chips from "../../../common/Chips";

export const attendanceDetailsReport = async (
  empId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/Employee/GetAttendanceDetailsReport?TypeId=0&EmployeeId=${empId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

// export const empAttenColumns = () => {
//   return [
//     {
//       title: "SL",
//       render: (text, record, index) => index + 1,
//       sorter: false,
//       filter: false,
//       className: "text-center",
//     },
//     {
//       title: "Attendance Date",
//       dataIndex: "AttendanceDateWithName",
//     },
//     {
//       title: "In-Time",
//       dataIndex: "InTime",
//       render: (_, record) => (
//         <div>{record?.InTime || record?.CalendarInTime}</div>
//       ),
//     },
//     {
//       title: "Out-Time",
//       dataIndex: "OutTime",
//       render: (_, record) => (
//         <div>{record?.OutTime || record?.CalendarOutTime}</div>
//       ),
//     },
//     {
//       title: "Calendar Name",
//       dataIndex: "CalendarName",
//     },
//   ];
// };

export const empAttenColumns = () => {
  return [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
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
      title: "Total Working Hour",
      dataIndex: "WorkingHours",
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
    },
  ];
};

export const supervisorLandingColumn = (
  pages,
  setEmpData,
  getAttendanceData,
  setLoading,
  currYear,
  currMonth,
  setEmpDetails,
  empData,
  setAnchorEl
) => {
  return [
    {
      title: "SL",
      render: (_, rec, index) =>
        getSerial({
          currentPage: pages?.current,
          pageSize: pages?.pageSize,
          index,
        }),
      width: 15,
      align: "center",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      render: (_, rec) => {
        return (
          <div
            className="d-flex justify-content-left align-items-center"
            style={{ cursor: "pointer" }}
          >
            <div>
              <img src={demoUserIcon} alt="" width="24px" />
            </div>
            <div className="ml-2">
              <h4
                style={{
                  fontWeight: 400,
                  fontSize: "12px",
                  color: "#344054",
                  lineHeight: "18px",
                }}
              >
                {rec?.employeeName}{" "}
                <span style={{ color: "#667085", fontSize: "12px" }}>
                  [{rec?.employeeCode}]
                </span>
                <InfoOutlined
                  style={{ cursor: "pointer", width: "18px" }}
                  className="ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEmpData(null);
                    getAttendanceData(
                      rec?.employeeId,
                      setLoading,
                      `${currYear()}-${currMonth()}`
                    );
                    setEmpDetails(rec);
                    !empData && setAnchorEl(true);
                  }}
                />
              </h4>
            </div>
          </div>
        );
      },
      fieldType: "string",
      sorter: true,
      filter: true,
      width:"200px"
    },
    {
      title: "Designation",
      dataIndex: "designation",
      // filterDropDownList: headerList[`strDepartmentList`],
      fieldType: "string",
      sorter: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "departmant",
      sorter: true,
      filter: true,
    },
    {
      title: "Section",
      dataIndex: "sectionName",
      sorter: true,
      filter: true,
    },
    {
      title: "In Time",
      dataIndex: "inTime",
    },
    {
      title: "Out Time",
      dataIndex: "outTime",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, item) => {
        return (
          <>
            {item?.status === "Present" && (
              <Chips label={item?.status} classess="success" />
            )}
            {item?.status === "Late" && (
              <Chips label={item?.status} classess="warning" />
            )}
            {item?.status === "Absent" && (
              <Chips label={item?.status} classess="danger" />
            )}
            {item?.status === "Movement" && (
              <span
                style={{
                  color: "#9F1AB1",
                  background: "#FBE8FF",
                  borderRadius: "99px",
                  padding: "1px 8px",
                  fontWeight: 600,
                }}
              >
                Movement
              </span>
            )}
            {item?.status === "Leave" && (
              <span
                style={{
                  color: "#6927DA",
                  background: "#ECE9FE",
                  borderRadius: "99px",
                  padding: "1px 8px",
                  fontWeight: 600,
                }}
              >
                Leave
              </span>
            )}
          </>
        );
      },
      filter: true,
    },
  ];
};
