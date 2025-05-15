import { PButton } from "Components";

export const detailsHeader = (setDetailList) => [
  {
    title: "SL",
    render: (value, row, index) => index + 1,
    align: "center",
  },
  {
    title: "Each Day Count By",
    dataIndex: "eachDayCountBy",
  },
  {
    title: "Day Range",
    dataIndex: "dayRange",
    render: (val) => {
      if (val) {
        const [from, to] = val.split("-").map((v) => parseInt(v.trim(), 10));
        return `${from} to ${to} day${to > 1 ? "s" : ""}`;
      }
      return "";
    }
  },  
  {
    title: "Consecutive Day",
    dataIndex: "consecutiveDay",
    render: (val) => (val ? "Yes" : "No"),
  },
  {
    title: "Amount Deduction Type",
    dataIndex: "amountDeductionType",
  },
  {
    title: "% of Amount",
    dataIndex: "amountDeductionAmountOrPercentage",
    render: (val) => (`${val}%`),
  },
  {
    title: "Action",
    render: (_, row, index) => (
      <PButton
        type="danger"
        content="Delete"
        onClick={() => {
          setDetailList((prev) => prev.filter((_, i) => i !== index));
        }}
      />
    ),
  },
];
