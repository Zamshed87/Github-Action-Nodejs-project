import { InfoOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { PButton } from "Components";
import axios from "axios";
import AttendanceStatus from "common/AttendanceStatus";
import { getEmployeeLeaveBalanceAndHistory } from "common/HOCLeave/helperAPI";
import { toast } from "react-toastify";
import demoUserIcon from "../../../assets/images/userIcon.svg";

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
      render: (_, record) => <AttendanceStatus status={record?.AttStatus} />,
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
  setAnchorEl,
  setOpen,
  setLeaveBalanceData,
  buId,
  wgId,
  getAttendanceLog
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
                <Tooltip title="Attendance Report">
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
                </Tooltip>
              </h4>
            </div>
          </div>
        );
      },
      width: 150,
      fixed: "left",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      filterKey: "designationList",
      filterSearch: true,
      filter: true,
    },
    {
      title: "Department",
      dataIndex: "departmant",
      filterKey: "departmentList",
      filterSearch: true,
      filter: true,
    },
    {
      title: "Section",
      dataIndex: "sectionName",
      filterKey: "sectionList",
      filterSearch: true,
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
          <div className="d-flex align-items-center">
            <AttendanceStatus status={item?.status} />
            {item?.inTime && (
              <div>
                <Tooltip title="Attendance Log">
                  <InfoOutlined
                    style={{ fontSize: "16px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      getAttendanceLog(item?.employeeId);
                    }}
                  />
                </Tooltip>
              </div>
            )}
          </div>
        );
      },
      width: 50,
    },
    {
      title: "Leave Balance",
      render: (_, record) => {
        return (
          <div>
            <PButton
              content="Leave Balance"
              type="primary"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
                setEmpData(record);
                getEmployeeLeaveBalanceAndHistory(
                  record?.employeeId,
                  "LeaveBalance",
                  setLeaveBalanceData,
                  setLoading,
                  "",
                  currYear(),
                  buId,
                  wgId
                );
              }}
            />
          </div>
        );
      },
      dataIndex: "",
    },
  ];
};

export const attendanceLogColumns = () => {
  return [
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      width: 120,
    },
    {
      title: "Employee Code",
      dataIndex: "strEmployeeCode",
      width: 100,
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      width: 100,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      width: 100,
    },
    {
      title: "Time Record",
      dataIndex: "attendanceTimeRecord",
      width: 200,
    },
  ];
};
