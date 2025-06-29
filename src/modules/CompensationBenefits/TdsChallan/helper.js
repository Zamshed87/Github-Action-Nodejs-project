import { PButton } from "Components";

export const getHeader = (pages, history) => [
  {
    title: "SL",
    render: (_, __, index) =>
      (pages?.current - 1) * pages?.pageSize + index + 1,
    width: 25,
    align: "center",
  },
  {
    title: "Workplace",
    dataIndex: "strWorkplace",
    sorter: true,
    width: 100,
  },
  {
    title: "Financial Year",
    dataIndex: "strFiscalYear",
    sorter: true,
    width: 100,
  },
  {
    title: "Action",
    dataIndex: "",
    align: "center",
    render: (_, record) => (
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <PButton
          content="View"
          type="primary-outline"
          onClick={() => {
            history.push(
              "/compensationAndBenefits/incometaxmgmt/taxChallan/view",
              { record }
            );
          }}
        />
        <PButton
          content="Edit"
          type="primary"
          onClick={() => {
            history.push(
              "/compensationAndBenefits/incometaxmgmt/taxChallan/edit",
              { record }
            );
          }}
        />
      </div>
    ),
    width: 140,
  },
];
