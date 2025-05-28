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
    render: (value) =>
      value ? new Date(value).toLocaleDateString() : "-",
    width: 120,
  },
  {
    title: "Employee Contribution",
    dataIndex: "employeeContribution",
    render: (value) => value?.toLocaleString() ?? "-",
    width: 120,
  },
  {
    title: "Company Contribution",
    dataIndex: "companyContribution",
    render: (value) => value?.toLocaleString() ?? "-",
    width: 120,
  },
  {
    title: "Employee Profit",
    dataIndex: "employeeProfit",
    render: (value) => value?.toLocaleString() ?? "-",
    width: 100,
  },
  {
    title: "Company Profit",
    dataIndex: "companyProfit",
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
    title: "Profit Share %",
    dataIndex: "profitPercentage",
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
          content="View"
          type="primary-outline"
          onClick={() => setOpenView?.({ open: true, data: record })}
        />
        <PButton
          content="Edit"
          type="primary"
          onClick={() => {}}
        />
      </div>
    ),
  },
];
