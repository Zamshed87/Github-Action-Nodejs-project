import { InfoOutlined } from "@mui/icons-material";
import { PButton } from "Components";
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
      width: 20,
    },
    {
      title: "Attendance Date",
      dataIndex: "AttendanceDateWithName",
    },
    {
      title: "In-Time",
      dataIndex: "InTime",
      width: 50,
    },
    {
      title: "Out-Time",
      dataIndex: "OutTime",
      width: 50,
    },
    {
      title: "Total Working Hour",
      dataIndex: "WorkingHours",
    },
    {
      title: "Overtime Hour",
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
    },
  ];
};

export const supervisorLandingColumn = (
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
      render: (_, rec, index) => index + 1,
      width: 20,
      align: "center",
      fixed: "left",
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
      width: 200,
      fixed: "left",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      filterKey: "designationId",
      // filterDropDownList: headerList[`strDepartmentList`],
      fieldType: "string",
      sorter: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "departmant",
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
    {
      title: "Attendance Log",
      dataIndex: "",
    },
    {
      title: "Leave Balance",
      render: () => {
        return (
          <div>
            <PButton
              content="Leave Balance"
              type="primary"
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </div>
        );
      },
      dataIndex: "",
    },
  ];
};
