
export const getHeader = (pages) => [
  {
    title: "SL",
    render: (text, record, index) => (pages?.current - 1) * pages?.pageSize + index + 1,
    width: 25,
    align: "center",
  },
  {
    title: "Employee Code",
    dataIndex: "EmployeeCode",
    width: 80,
    sorter: true,
  },
  {
    title: "Employee ID",
    dataIndex: "EmployeeId",
    width: 70,
    sorter: true,
  },
  {
    title: "Employee Name",
    dataIndex: "EmployeeName",
    width: 120,
    sorter: true,
  },
  {
    title: "Notification Category",
    dataIndex: "NotificationCategory",
    width: 100,
    sorter: true,
  },
  {
    title: "Mail",
    dataIndex: "IsMail",
    width: 50,
    align: "center",
    render: (value) => (value ? "✔️" : "❌"),
  },
  {
    title: "Push",
    dataIndex: "IsPush",
    width: 50,
    align: "center",
    render: (value) => (value ? "✔️" : "❌"),
  },
  {
    title: "Real-time",
    dataIndex: "IsRealTime",
    width: 70,
    align: "center",
    render: (value) => (value ? "✔️" : "❌"),
  },
  {
    title: "SMS",
    dataIndex: "IsSms",
    width: 50,
    align: "center",
    render: (value) => (value ? "✔️" : "❌"),
  }
];
