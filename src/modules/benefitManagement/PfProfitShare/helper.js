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
    render: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
    width: 120,
  },
  {
    title: "Total Employee Contribution",
    dataIndex: "totalEmployeeContribution",
    render: (value) => value?.toLocaleString() ?? "-",
    width: 120,
  },
  {
    title: "Total Employer Contribution",
    dataIndex: "totalCompanyContribution",
    render: (value) => value?.toLocaleString() ?? "-",
    width: 120,
  },
  {
    title: "Total Profit Earned",
    dataIndex: "totalProfitEarned",
    render: (value) => value?.toLocaleString() ?? "-",
    width: 100,
  },
  {
    title: "Total PF Balance",
    dataIndex: "totalPFBalance",
    render: (value) => value?.toLocaleString() ?? "-",
    width: 100,
  },
  {
    title: "Total Profit Share Amount",
    dataIndex: "totalProfitShareAmount",
    render: (value) => value?.toLocaleString() ?? "-",
    width: 140,
  },
  {
    title: "Total Profit Share %",
    dataIndex: "totalProfitSharePercentage",
    render: (value) => (value != null ? `${value}%` : "-"),
    width: 100,
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (value) => value ?? "-",
    width: 100,
  },
  {
    title: "Action",
    align: "center",
    width: 140,
    render: (_, record) => (
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <PButton
          disabled
          content="View"
          type="primary-outline"
          onClick={() => setOpenView?.({ open: true, data: record })}
        />
        <PButton disabled content="Edit" type="primary" onClick={() => {}} />
      </div>
    ),
  },
];
