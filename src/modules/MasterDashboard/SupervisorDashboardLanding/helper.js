import axios from "axios";
import { toast } from "react-toastify";
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
