import { Tooltip } from "antd";
import { ImAttachment } from "react-icons/im"; // or any icon you already use
import DeleteIcon from "common/DeleteIcon/DeleteIcon";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";

export const detailsHeader = ({ removeData, action = true, dispatch }) => [
  {
    title: "SL",
    render: (_, __, index) => index + 1,
    align: "center",
    width: 60,
  },
  {
    title: "Transaction Mode",
    dataIndex: "transactionMode",           // 'bank' | 'mfs'
    render: (value) => (value ? value.toUpperCase() : "-"),
  },
  {
    title: "Bank / MFS Name",
    dataIndex: "bankMfsName",
    render: (v) => v ?? "-",
  },
  {
    title: "Branch Name / MFS Number",
    dataIndex: "branchOrMfsNumber",
    render: (v) => v ?? "-",
  },
  {
    title: "Challan / Transaction Date",
    dataIndex: "transactionDate",
    render: (v) => v ?? "-",
  },
  {
    title: "Challan / Transaction Number",
    dataIndex: "transactionNumber",
    render: (v) => v ?? "-",
  },
  {
    title: "TDS Amount",
    dataIndex: "tdsAmount",
    align: "right",
    render: (v) =>
      v || v === 0 ? Number(v).toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "-",
  },
  {
    title: "Comments",
    dataIndex: "comments",
    render: (v) => v ?? "-",
    ellipsis: true,
  },
  {
    title: "Attachment",
    dataIndex: "attachmentUrlId",           // backend ID or URL
    align: "center",
    render: (attachmentUrlId, row) =>
      attachmentUrlId ? (
        <Tooltip title="Download">
          <ImAttachment
            style={{ cursor: "pointer", color: "#0072e5" }}
            onClick={() =>
              dispatch(getDownlloadFileView_Action(attachmentUrlId))
            }
          />
        </Tooltip>
      ) : (
        "-"
      ),
  },
  ...(action
    ? [
        {
          title: "Action",
          align: "center",
          width: 80,
          render: (_, __, index) => <DeleteIcon onClick={() => removeData?.(index)} />,
        },
      ]
    : []),
];
