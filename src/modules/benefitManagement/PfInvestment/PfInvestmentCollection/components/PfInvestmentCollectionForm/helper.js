import { PButton } from "Components";

export const detailsHeader = ({
  removeData,
  action = true,
}) => {
  return [
    {
      title: "SL",
      render: (value, row, index) => index + 1,
      align: "center",
    },
    {
      title: "Collection Date",
      dataIndex: "collectionDate",
    },
    {
      title: "Collection Amount",
      dataIndex: "collectionAmount",
    },
    {
      title: "Interest Amount",
      dataIndex: "interestAmount",
    },
    {
      title: "Principal Amount",
      dataIndex: "principalAmount",
    },
    {
      title: "Comment",
      dataIndex: "remark",
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
                  removeData?.(index);
                }}
              />
            ),
          },
        ]
      : []),
  ];
};
