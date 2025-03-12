import { InfoCircleOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import { failColor } from "utility/customColor";
import notConfiguredImage from "../../../assets/images/not-configured.png";

const renderBoolean = (value) => (value ? "✔️" : <img style={{width:"25px"}} src={notConfiguredImage} alt="not configured"/>);

const renderWithPopover = (value) => {
  if (!value) return "-"; // Show dash if null or empty
  if (value.length > 50) {
    return (
      <span>
        {value.substring(0, 50)}...{" "}
        <Popover content={value} trigger="click">
          <InfoCircleOutlined style={{ color: failColor, cursor: "pointer" }} />
        </Popover>
      </span>
    );
  }
  return value; // Show full text if ≤ 50 characters
};

export const getHeader = (pages) => [
  {
    title: "SL",
    render: (text, record, index) => (pages?.current - 1) * pages?.pageSize + index + 1,
    width: 25,
    align: "center",
  },
  {
    title: "Notification Category",
    dataIndex: "NotificationCategory",
    width: 100,
    sorter: true,
  },
  {
    title: "Employee Name",
    dataIndex: "EmployeeName",
    width: 120,
    render: (_, record) => `${record?.EmployeeName} [${record?.EmployeeCode}]`,
    sorter: true,
  },
  {
    title: "Mail",
    dataIndex: "IsMail",
    width: 50,
    align: "center",
    render: renderBoolean,
  },
  {
    title: "Push",
    dataIndex: "IsPush",
    width: 50,
    align: "center",
    render: renderBoolean,
  },
  {
    title: "Real-time",
    dataIndex: "IsRealTime",
    width: 70,
    align: "center",
    render: renderBoolean,
  },
  {
    title: "SMS",
    dataIndex: "IsSms",
    width: 50,
    align: "center",
    render: renderBoolean,
  },
  {
    title: "Mail Status",
    dataIndex: "MailNotifyStatus",
    width: 120,
    align: "center",
    render: renderWithPopover,
  },
  {
    title: "Push Status",
    dataIndex: "PushNotifyStatus",
    width: 120,
    align: "center",
    render: renderWithPopover,
  },
  {
    title: "Real-time Status",
    dataIndex: "RealTimeNotifyStatus",
    width: 120,
    align: "center",
    render: renderWithPopover,
  },
  {
    title: "SMS Status",
    dataIndex: "SmsNotifyStatus",
    width: 120,
    align: "center",
    render: renderWithPopover,
  },
];
