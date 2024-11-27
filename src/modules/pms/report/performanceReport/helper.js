import { gray600 } from "../../../../utility/customColor";

export const individualPerformanceTableColumn = ({ values }) => {
  return [
    {
      title: "Sl",
      dataIndex: "sl",
    },
    {
      title: "Enroll",
      dataIndex: "enroll",
    },
    {
      title: () => <span style={{ color: gray600 }}>Employee Name</span>,
      dataIndex: "employeeName",
    },
    {
      title: "Department",
      dataIndex: "department",
    },
    {
      title: "Designation",
      dataIndex: "designation",
    },
    {
      title: "(0 - 40)% ⇵",
      render: (_, record, index) => (
        <span style={{ color: gray600 }}>
          {record?.progress <= 40 && record?.progress > 0
            ? record?.progress
            : "-"}
        </span>
      ),
    },
    {
      title: "(41-60)% ⇵",
      render: (_, record, index) => (
        <span style={{ color: gray600 }}>
          {record?.progress >= 41 && record?.progress <= 60
            ? record?.progress
            : "-"}
        </span>
      ),
    },
    {
      title: "(61-80)% ⇵",
      render: (_, record, index) => (
        <span style={{ color: gray600 }}>
          {record?.progress >= 61 && record?.progress<=80 ? record?.progress : "-"}
        </span>
      ),
    },
    {
      title: "<80% ⇵",
      render: (_, record, index) => (
        <span style={{ color: gray600 }}>
          {record?.progress >= 81 ? record?.progress : "-"}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "a",
    },
  ];
};

export const sbuPerformanceTableColumn = ({ values }) => {
  return [
    {
      title: "Sl",
      dataIndex: "sl",
    },
    {
      title: "Code",
      dataIndex: "code",
    },
    {
      title: "SBU",
      dataIndex: "code",
    },
    {
      title: "(0 - 40)% ⇵",
      render: (_, record, index) => (
        <span style={{ color: gray600 }}>
          {record?.progress <= 40 && record?.progress > 0
            ? record?.progress
            : "-"}
        </span>
      ),
    },
    {
      title: "(41-60)% ⇵",
      render: (_, record, index) => (
        <span style={{ color: gray600 }}>
          {record?.progress >= 41 && record?.progress <= 60
            ? record?.progress
            : "-"}
        </span>
      ),
    },
    {
      title: "(61-80)% ⇵",
      render: (_, record, index) => (
        <span style={{ color: gray600 }}>
          {record?.progress >= 61 && record?.progress<=80 ? record?.progress : "-"}
        </span>
      ),
    },
    {
      title: "<80% ⇵",
      render: (_, record, index) => (
        <span style={{ color: gray600 }}>
          {record?.progress >= 81 ? record?.progress : "-"}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "a",
    },
  ];
};

export const departmentPerformanceTableColumn = ({ values }) => {
  return [
    {
      title: "Sl",
      dataIndex: "sl",
    },
    {
      title: "SBU",
      dataIndex: "employeeId",
    },
    {
      title: "Department",
      dataIndex: "departmentName",
    },
    {
      title: "(0 - 40)% ⇵",
      render: (_, record, index) => (
        <span style={{ color: gray600 }}>
          {record?.progress <= 40 && record?.progress > 0
            ? record?.progress
            : "-"}
        </span>
      ),
    },
    {
      title: "(41-60)% ⇵",
      render: (_, record, index) => (
        <span style={{ color: gray600 }}>
          {record?.progress >= 41 && record?.progress <= 60
            ? record?.progress
            : "-"}
        </span>
      ),
    },
    {
      title: "(61-80)% ⇵",
      render: (_, record, index) => (
        <span style={{ color: gray600 }}>
          {record?.progress >= 61 && record?.progress<=80 ? record?.progress : "-"}
        </span>
      ),
    },
    {
      title: "<80% ⇵",
      render: (_, record, index) => (
        <span style={{ color: gray600 }}>
          {record?.progress >= 81 ? record?.progress : "-"}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "a",
    },
  ];
};
