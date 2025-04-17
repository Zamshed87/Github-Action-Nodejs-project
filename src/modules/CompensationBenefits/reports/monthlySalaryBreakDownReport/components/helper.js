export const getHeader = (header, pages = { current: 1, pageSize: 25 }) => {
  const baseColumns = [
    {
      title: "SL",
      render: (_, __, index) =>
        (pages?.current - 1) * pages?.pageSize + index + 1,
      width: 60,
      align: "center",
      fixed: "left",
    },
    {
      title: "Department",
      dataIndex: "department",
      width: 160,
      align: "center",
    },
    {
      title: "Manpower",
      dataIndex: "manpower",
      width: 100,
      align: "center",
    },
    {
      title: "Man Hour",
      dataIndex: "manHour",
      width: 100,
      align: "center",
    },
    {
      title: "Gross Salary",
      dataIndex: "grossSalary",
      width: 100,
      align: "center",
    },
    {
      title: "Overtime",
      dataIndex: "overtime",
      width: 100,
      align: "center",
    },
  ];

  const dynamicAllowanceColumns = {
    title: "Allocation",
    children: [
      ...(header?.deductionDetail ?? [])?.map((data) => ({
        title: data?.title,
        align: "center",
        width: 100,
        render: () => {
          return data?.amount ?? "-";
        },
      })),
      {
        title: "Total Earning",
        width: 100,
        align: "center",
        render: () => {
          return header?.allowanceTotal ?? "-";
        },
      },
    ],
  };
  const dynamicDeductionColumns = {
    title: "Deduction",
    children: [
      ...(header?.deductionDetail ?? [])?.map((data) => ({
        title: data?.title,
        align: "center",
        width: 100,
        render: () => {
          return data?.amount ?? "-";
        },
      })),
      {
        title: "Total Deduction",
        width: 100,
        align: "center",
        render: () => {
          return header?.deductionTotal ?? "-";
        },
      },
    ],
  };

  return [
    ...baseColumns,
    dynamicAllowanceColumns,
    dynamicDeductionColumns,
    {
      title: "Netpay Amount",
      dataIndex: "netpayAmount",
      width: 120,
      align: "center",
    },
  ];
};
