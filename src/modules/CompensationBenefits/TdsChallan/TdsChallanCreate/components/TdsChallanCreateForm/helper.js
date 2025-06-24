import { Tooltip } from "antd";
import { ImAttachment } from "react-icons/im"; // or any icon you already use
import DeleteIcon from "common/DeleteIcon/DeleteIcon";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import moment from "moment";

export const detailsHeader = ({
  removeData,
  action = true,
  dispatch,
  setLoading,
}) => [
  {
    title: "SL",
    render: (_, __, index) => index + 1,
    align: "center",
    width: 60,
  },
  {
    title: "Transaction Mode",
    dataIndex: "strTransactionMode", // 'bank' | 'mfs'
    render: (value) => (value ? value.toUpperCase() : "-"),
  },
  {
    title: "Bank / MFS Name",
    dataIndex: "strBankWallet",
    render: (v) => v ?? "-",
  },
  {
    title: "Branch Name / MFS Number",
    dataIndex: "strBranchName",
    render: (v) => v ?? "-",
  },
  {
    title: "Challan Date",
    dataIndex: "dteChallanDate",
    render: (v, rec) => {
      return rec?.intId ? moment(v)?.format('YYYY-MM-DD') : v;
    },
  },
  {
    title: "Challan Number",
    dataIndex: "strChallanNumber",
    render: (v) => v ?? "-",
  },
  {
    title: "TDS Amount",
    dataIndex: "numChallanAmount",
    align: "right",
    render: (v) =>
      v || v === 0
        ? Number(v).toLocaleString("en-BD", { minimumFractionDigits: 2 })
        : "-",
  },
  {
    title: "Comments",
    dataIndex: "strComment",
    render: (v) => v ?? "-",
    ellipsis: true,
  },
  {
    title: "Attachment",
    dataIndex: "intDocumentId", // backend ID or URL
    align: "center",
    render: (IntDocumentId) =>
      IntDocumentId ? (
        <Tooltip title="View Attachment">
          <ImAttachment
            style={{ cursor: "pointer", color: "#0072e5" }}
            onClick={() =>
              dispatch(
                getDownlloadFileView_Action(
                  IntDocumentId,
                  false,
                  () => {},
                  setLoading
                )
              )
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
          render: (_, __, index) => (
            <DeleteIcon onClick={() => removeData?.(index)} />
          ),
        },
      ]
    : []),
];
