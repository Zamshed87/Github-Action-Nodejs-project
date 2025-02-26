export const evaluationAssesmentTableColumn = () => {
  return [
    {
      title: () => <span>SL</span>,
      render: (_, __, index) => index + 1,
      sorter: false,
      className: "text-center",
      width: "50px",
      filter: false,
    },
    {
      title: "Name",
      dataIndex: "employeeName",
      sorter: true,
    },
    {
      title: () => <span>Assessment Status</span>,
      dataIndex: "assesmentStatus",
      render: (data, record, idx) => (data ? "Given" : "Pending"),
      sorter: true,
    },
  ];
};

