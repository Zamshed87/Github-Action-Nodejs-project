import DeleteIcon from "common/DeleteIcon/DeleteIcon";
import { PButton } from "Components";
import moment from "moment";

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
      render: (date) => {
        return date ? moment(date).format("YYYY-MM-DD") : "-";
      }
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
            align: "center",
            render: (_, row, index) => (
              <DeleteIcon
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
