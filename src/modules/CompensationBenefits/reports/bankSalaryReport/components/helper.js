export const getBankWiseSalaryDisburseHeader = (
  pages = { current: 1, pageSize: 25 }
) => [
  {
    title: "SL",
    render: (_, __, index) =>
      (pages?.current - 1) * pages?.pageSize + index + 1,
    width: 20,
    align: "center",
  },
  {
    title: "Bank Details",
    dataIndex: "bankDetails",
    width: 100,
    align: "center",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    width: 100,
    align: "center",
  }
];

export const getDesignationWiseSalaryDisburseHeader = (
  reportType,
  pages = { current: 1, pageSize: 25 }
) => [
  {
    title: "SL",
    render: (_, __, index) =>
      (pages?.current - 1) * pages?.pageSize + index + 1,
    width: 20,
    align: "center",
  },
  {
    title: "Workplace Name",
    dataIndex: "workplaceName",
    width: 100,
    align: "center",
  },
  {
    title: "Bank Name",
    dataIndex: "bankName",
    width: 100,
    align: "center",
  },
  {
    title: reportType ?? "N/A",
    dataIndex: "hrPosDesig",
    width: 100,
    align: "center",
  },
  {
    title: "Manpower",
    dataIndex: "manpower",
    width: 100,
    align: "center",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    width: 100,
    align: "center",
  }
];
