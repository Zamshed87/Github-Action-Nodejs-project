import { PButton } from "Components";

export const detailsHeader = (setDetailList, absentCalculationType, action=true) => {
    const eachDay = absentCalculationType == 1;
    return [
      {
        title: "SL",
        render: (value, row, index) => index + 1,
        align: "center",
      },
      ...(eachDay
        ? [
            {
              title: "Each Day Count By",
              dataIndex: "eachDayCountBy",
            },
          ]
        : []),
      ...(!eachDay
        ? [
            {
              title: "Day Range",
              dataIndex: "dayRange",
              render: (val) => {
                console.log(val);
                if (val) {
                  const [from, to] = val
                    .split("-")
                    .map((v) => parseInt(v.trim(), 10));
                  return `${from} to ${to} day${to > 1 ? "s" : ""}`;
                }
                return "";
              },
            },
          ]
        : []),
      ...(eachDay
        ? [
            {
              title: "Consecutive Day",
              dataIndex: "consecutiveDay",
              render: (val) => (val ? "Yes" : "No"),
            },
          ]
        : []),
      {
        title: "Amount Deduction Type",
        dataIndex: "amountDeductionTypeName",
        render: (val) => val ?? "-",
      },
      {
        title: "% of Amount",
        dataIndex: "amountDeductionAmountOrPercentage",
        render: (val) => `${val}%`,
      },
      ...(action
        ? [
            {
              title: "Action",
              render: (_, row, index) => (
                <PButton
                  type="danger"
                  content="Remove"
                  onClick={() => {
                    setDetailList((prev) => prev.filter((_, i) => i !== index));
                  }}
                />
              ),
            },
          ]
        : []),
    ];
  };