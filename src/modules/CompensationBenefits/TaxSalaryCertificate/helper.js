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
    dataIndex: "strWorkPlace",
    sorter: true,
    width: 100,
  },
  {
    title: "Financial Year",
    dataIndex: "financialYear",
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
          content="Preview"
          type="primary-outline"
          onClick={() => {
            history.push(
              "/compensationAndBenefits/incometaxmgmt/taxChallan/view"
            );
          }}
        />
      </div>
    ),
    width: 140,
  },
];
