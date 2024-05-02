import PBadge from "Components/Badge";
import { Tag } from "antd";
import FormikInput from "common/FormikInput";
import moment from "moment";

const approvalListHeader = ({
  type,
  approveListData,
  setApproveListData,
  setComment,
  data,
  buttonType,
  demoPopup,
}) =>
  [
    {
      title: "SL",
      render: (value, row, index) => index + 1,
      align: "center",
      width: 20,
    },
    {
      title: "Approve Dept.",
      dataIndex: "strStatusTitle",
      sorter: true,
      render: (_, record) =>
        record?.strStatusTitle === "Approve By Supervisor"
          ? "Supervisor"
          : record?.strStatusTitle === "Approve By User Group"
          ? `User Group (${record?.strUserGroup})`
          : "Line Manager",
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (_, record) =>
        // Write condition to check status
        record?.status === "Pending" ? (
          <PBadge type="warning" text={record?.status} />
        ) : record?.status === "Rejected" ? (
          <PBadge type="danger" text={record?.status} />
        ) : (
          <PBadge type="success" text={record?.status} />
        ),
      width: "50px",
    },
    {
      title: "Comments",
      dataIndex: "comment",
      render: (_, record, index) =>
        type === "approval" && record?.status === "Pending" ? (
          <div>
            <FormikInput
              placeholder="Comments"
              classes="input-sm"
              name="comment"
              type="text"
              value={record?.comment}
              onChange={(e) => {
                rowDtoHandler(
                  "comment",
                  e.target.value,
                  index,
                  approveListData,
                  setApproveListData
                );
                setComment(e.target.value);
              }}
              disabled={
                data?.application?.intCurrentStage === record?.intPipelineRowId
                  ? false
                  : true
              }
            />
          </div>
        ) : (
          record?.comment || "N/A"
        ),
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => {
        return (
          <div className="d-flex justify-content-center">
            {record?.status === "Approved" || buttonType === "approve" ? (
              <button
                type="button"
                onClick={() => demoPopup("approve", "Approve", data)}
                className="btn btn-green"
                disabled={
                  data?.application?.intCurrentStage ===
                  record?.intPipelineRowId
                    ? false
                    : true
                }
              >
                Approve
              </button>
            ) : (
              <button
                type="button"
                onClick={() => demoPopup("reject", "Reject", data)}
                className="btn btn-cancel"
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  borderColor: "#dc3545",
                }}
                disabled={
                  data?.application?.intCurrentStage ===
                  record?.intPipelineRowId
                    ? false
                    : true
                }
              >
                Reject
              </button>
            )}
          </div>
        );
      },
      isHidden: type === "view" || type === "dueAmount",
    },
  ].filter((item) => !item.isHidden);

const rowDtoHandler = (name, value, sl, rowDto, setRowDto) => {
  const data = [...rowDto];
  const _sl = data[sl];
  _sl[name] = value;
  setRowDto(data);
};

const employmentHeader = [
  {
    title: "SL",
    render: (value, row, index) => index + 1,
    align: "center",
    width: 20,
  },
  {
    title: "Workplace",
    dataIndex: "workPlace",
  },
  {
    title: "Employee Name",
    dataIndex: "name",
    sorter: true,
  },
  {
    title: "Code",
    dataIndex: "code",
    width: "40px",
  },
  {
    title: "Department",
    dataIndex: "department",
  },
  {
    title: "Designation",
    dataIndex: "designation",
  },
  {
    title: "HR Position",
    dataIndex: "hrPosition",
  },
  {
    title: "Employment Type",
    dataIndex: "employmentType",
  },
  {
    title: "Effective Date",
    dataIndex: "effectiveDate",
    render: (data, record) =>
      record?.effectiveDate
        ? moment(record?.effectiveDate).format("DD-MM-YYYY")
        : "N/A",
  },
  {
    title: "Salary",
    dataIndex: "salaryAmount",
  },
];

const assetHeader = [
  {
    title: "SL",
    render: (value, row, index) => index + 1,
    align: "center",
    width: 20,
  },
  {
    title: "Item Name",
    dataIndex: "itemName",
    sorter: true,
  },
  {
    title: "Item Qty",
    dataIndex: "itemQuantity",
  },
  {
    title: "UOM",
    dataIndex: "itemUom",
  },
  {
    title: "Assign Date",
    dataIndex: "assignDate",
    render: (data, record) => moment(record?.assignDate).format("DD-MM-YYYY"),
  },
  {
    title: "Status",
    dataIndex: "active",
    align: "center",
    render: (_, rec) => {
      return (
        <div className="d-flex justify-content-center align-items-center">
          {rec?.active ? (
            <Tag color="green">{"Active"}</Tag>
          ) : (
            <Tag color="red">{"Inactive"}</Tag>
          )}
        </div>
      );
    },
  },
];

const statusDDL = [
  { value: 0, label: "All" },
  { value: 1, label: "Pending" },
  { value: 2, label: "Approved" },
  { value: 3, label: "Rejected" },
  { value: 4, label: "Released" },
];

const calculateTotalAmounts = (deductionDataset, duesDataset) => {
  let totalDuesAmount = 0;
  let totalDeductionAmount = 0;

  const combinedDataset = [...deductionDataset, ...duesDataset];

  combinedDataset.forEach((item) => {
    item?.isAddition === 0
      ? (totalDeductionAmount += item?.numAmount)
      : (totalDuesAmount += item?.numAmount);
  });

  return { totalDuesAmount, totalDeductionAmount };
};

export {
  approvalListHeader,
  assetHeader,
  calculateTotalAmounts,
  employmentHeader,
  statusDDL
};

