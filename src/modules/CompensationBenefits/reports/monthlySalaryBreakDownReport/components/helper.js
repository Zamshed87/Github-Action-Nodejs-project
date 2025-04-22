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

  const allowanceChildren = [
    ...(header?.allowanceDetail ?? []).map((data) => ({
      title: data?.title,
      align: "center",
      width: 100,
      render: () => data?.amount ?? "-",
    })),
  ];

  if (header?.allowanceDetail?.length) {
    allowanceChildren.push({
      title: "Total Earning",
      width: 100,
      align: "center",
      render: () => header?.allowanceTotal ?? "-",
    });
  }

  const deductionChildren = [
    ...(header?.deductionDetail ?? []).map((data) => ({
      title: data?.title,
      align: "center",
      width: 100,
      render: () => data?.amount ?? "-",
    })),
  ];

  if (header?.deductionDetail?.length) {
    deductionChildren.push({
      title: "Total Deduction",
      width: 100,
      align: "center",
      render: () => header?.deductionTotal ?? "-",
    });
  }

  const dynamicColumns = [
    ...(allowanceChildren.length
      ? [{ title: "Allocation", children: allowanceChildren }]
      : []),
    ...(deductionChildren.length
      ? [{ title: "Deduction", children: deductionChildren }]
      : []),
  ];

  return [
    ...baseColumns,
    ...dynamicColumns,
    {
      title: "Netpay Amount",
      dataIndex: "netpayAmount",
      width: 120,
      align: "center",
    },
  ];
};
