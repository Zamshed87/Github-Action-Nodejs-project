export const getHeader = (
  reportType,
  headers = [],
  pages = { current: 1, pageSize: 25 }
) => {
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
      title: "Workplace Name",
      dataIndex: "workplace",
      width: 150,
      align: "center",
    },
    {
      title: "Department",
      dataIndex: "department",
      width: 120,
      align: "center",
    },
    {
      title: "Section",
      dataIndex: "section",
      width: 120,
      align: "center",
    },
    {
      title: reportType ?? "Designation",
      dataIndex: "hrPosDesig",
      width: 120,
      align: "center",
    },
  ];

  const dynamicMonthlyColumns = headers.map((month) => ({
    title: month.title,
    children: [
      ...month.details.map((detail) => ({
        title: detail,
        align: "center",
        width: 120,
        render: (_, record) => {
          const monthData = record.monthlyData?.find(
            (m) => m.title === month.title
          );
          const detailItem = monthData?.details?.find(
            (d) => d.title === detail
          );
          return detailItem?.amount ?? "-";
        },
      })),
      {
        title: "Total Pay",
        align: "center",
        width: 120,
        render: (_, record) => {
          const monthData = record.monthlyData?.find(
            (m) => m.title === month.title
          );
          return monthData?.totalAmount ?? "-";
        },
      },
    ],
  }));

  return [
    ...baseColumns,
    ...dynamicMonthlyColumns,
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      width: 120,
      align: "center",
    },
  ];
};
