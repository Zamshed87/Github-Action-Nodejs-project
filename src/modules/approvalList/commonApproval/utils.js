export const columnsLeave = [
    {
      title: "Employee Name",
      dataIndex: ["applicationInformation", "employeeName"],
      key: "employeeName",
    },
    {
      title: "Designation",
      dataIndex: ["applicationInformation", "designation"],
      key: "designation",
    },
    {
      title: "Department",
      dataIndex: ["applicationInformation", "department"],
      key: "department",
    },
    {
      title: "Application Date",
      dataIndex: ["applicationInformation", "applicationDate"],
      key: "applicationDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "From Date",
      dataIndex: ["applicationInformation", "fromDate"],
      key: "fromDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "To Date",
      dataIndex: ["applicationInformation", "toDate"],
      key: "toDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: ["applicationInformation", "status"],
      key: "status",
    },
  ];