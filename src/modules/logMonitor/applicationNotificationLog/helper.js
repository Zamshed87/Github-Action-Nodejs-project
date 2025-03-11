import { PButton } from "Components";

export const getHeader = (pages) => [
  {
    title: "SL",
    render: (text, record, index) => (pages?.current - 1) * pages?.pageSize + index + 1,
    width: 25,
    align: "center",
  },
  {
    title: "Employee Code",
    dataIndex: "employeeCode",
    width: 80,
    sorter: true,
  },
  {
    title: "Employee ID",
    dataIndex: "employeeId",
    width: 70,
    sorter: true,
  },
  {
    title: "Employee Name",
    dataIndex: "employeeName",
    width: 120,
    sorter: true,
  },
  {
    title: "Notification Category",
    dataIndex: "notificationCategory",
    width: 100,
    sorter: true,
  },
  {
    title: "Mail",
    dataIndex: "isMail",
    width: 50,
    align: "center",
    render: (value) => (value ? "✔️" : "❌"),
  },
  {
    title: "Push",
    dataIndex: "isPush",
    width: 50,
    align: "center",
    render: (value) => (value ? "✔️" : "❌"),
  },
  {
    title: "Real-time",
    dataIndex: "isRealTime",
    width: 70,
    align: "center",
    render: (value) => (value ? "✔️" : "❌"),
  },
  {
    title: "SMS",
    dataIndex: "isSms",
    width: 50,
    align: "center",
    render: (value) => (value ? "✔️" : "❌"),
  },
  {
    title: "Action",
    dataIndex: "",
    align: "center",
    render: (_, rec) => <PButton content="Details" />,
  },
];
