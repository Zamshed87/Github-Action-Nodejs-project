import Chips from "../../../../common/Chips";
import { dateFormatter } from "../../../../utility/dateFormatter";

export const attendanceProcessLandingColumn = () => {
  return [
    {
      title: "SL",
      dataIndex: "SL",
      key: "SL",
      width: "50px",
      render: (_, record, index) => index + 1,
      className: "text-center",
    },
    {
      title: "Process Code",
      dataIndex: "intHeaderRequestId",
      key: "intHeaderRequestId",
      className: "text-center",
    },
    {
      title: "From Date",
      dataIndex: "dteFromDate",
      key: "dteFromDate",
      render: (_, record, index) => dateFormatter(record.dteFromDate),
      className: "text-center",
    },
    {
      title: "To Date",
      dataIndex: "dteToDate",
      key: "dteToDate",
      render: (_, record, index) => dateFormatter(record.dteToDate),
      className: "text-center",
    },
    {
      title: "Total Employee",
      dataIndex: "intTotalEmployee",
      key: "intTotalEmployee",
      width: "20%",
      className: "text-center",
      render: (_, record, index) => {
        return record?.isAll ? (
          <span>All</span>
        ) : (
          <span>{record.intTotalEmployee}</span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "20%",
      className: "text-center",
      render: (_, record, index) => (
        <div>
          {record.status ? (
            <Chips label="Complete" classess="success" />
          ) : (
            <Chips label="Pending" classess="warning" />
          )}
        </div>
      ),
    },
  ];
};
export const empListColum = [
  {
    title: "SL",
    dataIndex: "SL",
    key: "SL",
    width: "50px",
    render: (_, record, index) => index + 1,
    className: "text-center",
  },
  {
    title: "Employee ID",
    dataIndex: "intEmployeeId",
    key: "intEmployeeId",
    className: "text-center",
  },
  {
    title: "Employee Name",
    dataIndex: "strEmployeeName",
    key: "strEmployeeName",
    className: "text-left",
  },
  {
    title: "Designation",
    dataIndex: "strDesignation",
    key: "strDesignation",
    className: "text-left",
  },
  {
    title: "Department",
    dataIndex: "strDepartment",
    key: "strDepartment",
    className: "text-left",
  },
];
