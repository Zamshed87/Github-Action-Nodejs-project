import { PButton } from "Components";

export const getHeader = (pages) => [
  {
    title: "SL",
    render: (_, __, index) =>
      (pages?.current - 1) * pages?.pageSize + index + 1,
    width: 60,
    align: "center",
    fixed: "left",
  },
  {
    title: "Employee Code",
    dataIndex: "strEmployeeCode",
    width: 120,
  },
  {
    title: "Employee Name",
    dataIndex: "strEmployee",
    width: 180,
  },
  {
    title: "Designation",
    dataIndex: "strDesignation",
    width: 150,
  },
  {
    title: "Department",
    dataIndex: "strDepartment",
    width: 150,
  },
  {
    title: "Section",
    dataIndex: "strSection",
    render: (text, record) => record?.strSection || "N/A",
    width: 150,
  },
  {
    title: "Joining Date",
    dataIndex: "dteJoiningDate",
    render: (text) => (text ? new Date(text).toLocaleDateString() : "N/A"),
    width: 130,
  },
  {
    title: "TIN",
    dataIndex: "strTIN",
    width: 120,
  },
  {
    title: "Assessment Month Count",
    dataIndex: "intAssessmentMonth",
    width: 120,
  },
  {
    title: "Total Gross Salary & Allowance",
    dataIndex: "numGrossAmount",
    width: 130,
  },
  {
    title: "TDS on Salary",
    dataIndex: "numTaxAmount",
    width: 130,
  },
  {
    title: "Net Payment",
    dataIndex: "numNetPayment",
    width: 130,
  },
  {
    title: "Action",
    align: "center",
    fixed: "right",
    render: (_, record) => (
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <PButton content="Preview" type="primary-outline" onClick={() => {}} />
      </div>
    ),
    width: 140,
  },
];
