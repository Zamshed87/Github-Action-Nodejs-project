import { PButton } from "Components";

export const getHeader = (pages, setOpenView) => [
  {
    title: "SL",
    render: (_, __, index) =>
      (pages?.current - 1) * pages?.pageSize + index + 1,
    align: "center",
    width: 20,
  },
  {
    title: "Profit Share Date",
    dataIndex: "profitShareDate",
    render: (value) => value ?? "-",

  },
  {
    title: "Total Employee Contribution",
    dataIndex: "totalEmployeeContribution",
    render: (value) => value?.toLocaleString() ?? "-",
  },
  {
    title: "Total Employer Contribution",
    dataIndex: "totalEmployerContribution",
    render: (value) => value?.toLocaleString() ?? "-",
  },
  {
    title: "Total Profit Earned",
    dataIndex: "totalProfitEarned",
    render: (value) => value?.toLocaleString() ?? "-",
  },
  {
    title: "Total PF Balance",
    dataIndex: "totalPfBalance",
    render: (value) => value?.toLocaleString() ?? "-",
  },
  {
    title: "Total Profit Share Amount",
    dataIndex: "totalProfitShareAmount",
    render: (value) => value?.toLocaleString() ?? "-",
  },
  {
    title: "Total Profit Share %",
    dataIndex: "totalProfitSharePercentage",
    render: (value) => (value != null ? `${value}%` : "-"),
  },
  {
    title: "Status",
    dataIndex: "strStatus",
  },
  {
    title: "Action",
    align: "center",
    render: (_, record) => (
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <PButton
          content="View"
          type="primary-outline"
          onClick={() => setOpenView?.({ open: true, data: record })}
        />
        <PButton
          content="Edit"
          type="primary"
          onClick={() =>{} }
        />
      </div>
    ),
  },
];
