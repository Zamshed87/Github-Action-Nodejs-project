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
    ...(header?.allowance ?? []).map((title) => ({
      title,
      align: "center",
      width: 100,
      render: (value, record) => {
        const allowance = record.allowanceDetail?.find(
          (item) => item.title === title
        );
        return allowance?.amount ?? "-";
      },
    })),
  ];

  if (header?.allowance?.length) {
    allowanceChildren.push({
      title: "Total Earning",
      width: 100,
      align: "center",
      render: (value,record) => {
        return record?.allowanceTotal ?? "-"
      },
    });
  }

  const deductionChildren = [
    ...(header?.deduction ?? []).map((title) => ({
      title,
      align: "center",
      width: 100,
      render: (value, record) => {
        const allowance = record.deductionDetail?.find(
          (item) => item.title === title
        );
        return allowance?.amount ?? "-";
      },    })),
  ];

  if (header?.deduction?.length) {
    deductionChildren.push({
      title: "Total Deduction",
      width: 100,
      align: "center",
      render: (value,record) => {
        return record?.deductionTotal ?? "-"
      },
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
