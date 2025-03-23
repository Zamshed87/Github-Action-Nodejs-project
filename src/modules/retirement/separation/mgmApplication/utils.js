import PBadge from "Components/Badge";
import { Tag } from "antd";
import FormikInput from "common/FormikInput";
import moment from "moment";
import { formatMoney } from "utility/formatMoney";

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
      dataIndex: "strApproverDepartment",
      sorter: true,
      // render: (_, record) =>
      //   record?.strStatusTitle === "Approve By Supervisor"
      //     ? "Supervisor"
      //     : record?.strStatusTitle === "Approve By User Group"
      //     ? `User Group (${record?.strUserGroup})`
      //     : "Line Manager",
    },
    {
      title: "Status",
      dataIndex: "strApproverStatus",
      align: "center",
      render: (_, record) =>
        // Write condition to check status
        record?.strApproverStatus === "Pending" ? (
          <PBadge type="warning" text={record?.strApproverStatus} />
        ) : record?.strApproverStatus === "Rejected" || record?.strApproverStatus === "Reject By Admin" ? (
          <PBadge type="danger" text={record?.strApproverStatus} />
        ) : record?.strApproverStatus === "Approved By Admin" ? (
          <PBadge type="info" text={record?.strApproverStatus} />
        ) : (
          <PBadge type="success" text={record?.strApproverStatus} />
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
      isHidden: type === "view" || type === "dueAmount" || type === "dueView",
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
    title: "Promotion Type",
    dataIndex: "promotionTypeName",
    width: 50,
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
    width: 55,
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
    width: 50,
    render: (data, record) =>
      record?.salaryAmount && formatMoney(record?.salaryAmount),
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
    title: "Asset Name",
    dataIndex: "itemName",
    sorter: true,
  },
  {
    title: "UOM",
    dataIndex: "itemUom",
  },
  {
    title: "Assign Date",
    dataIndex: "assignDate",
    render: (data, record) =>
      record?.assignDate && moment(record?.assignDate).format("DD-MM-YYYY"),
  },
  {
    title: "Unassign Date",
    dataIndex: "unassignDate",
    render: (data, record) =>
      record?.unassignDate && moment(record?.unassignDate).format("DD-MM-YYYY"),
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
  { value: "", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Approved", label: "Approved" },
  { value: "Withdrawn", label: "Withdrawn" },
  { value: "Clearance", label: "Clearance" },
  { value: "Clearance Running", label: "Clearance Running" },
  { value: "Clearance Completed", label: "Clearance Completed" },
  { value: "Final Settlement Completed", label: "Final Settlement Completed" },
  { value: "Released", label: "Released" },
  { value: "Rejected", label: "Rejected" },
];

const calculateTotalAmounts = (deductionDataset, duesDataset) => {
  let totalDuesAmount = 0;
  let totalDeductionAmount = 0;

  const combinedDataset = [...deductionDataset, ...duesDataset];

  combinedDataset.forEach((item) => {
    item?.isAddition === 0
      ? (totalDeductionAmount += +item?.numAmount || 0)
      : (totalDuesAmount += +item?.numAmount || 0);
  });

  return { totalDuesAmount, totalDeductionAmount };
};

const dueAmountSaveHandler = (
  separationId,
  empId,
  empBasicInfo,
  totalDuesAmount,
  totalDeductionAmount,
  duesRowDto,
  deductionRowDto,
  saveDueAmount,
  intEmployeeId,
  orgId,
  buId,
  cb
) => {
  const mergeData = [...duesRowDto, ...deductionRowDto];
  const payload = {
    header: {
      intFinalSettlementId: empBasicInfo?.intFinalSettlementId || 0,
      intEmployeeId: empId,
      intSeparationId: +separationId,
      numTotalAmount: totalDuesAmount - totalDeductionAmount,
      intAccountId: orgId,
      intBusinessUnitId: buId,
      strRemarksForHr: "",
      intActionBy: intEmployeeId,
    },
    row: mergeData?.map((item) => ({
      intFinalSettlementRowId: 0,
      strAdditionTypeName: item?.strAdditionTypeName,
      strRemarks: item?.strRemarks || "",
      numAmount: +item?.numAmount || 0,
      isAddition: item?.isAddition,
    })),
  };
  saveDueAmount(
    `/SaasMasterData/SaveFinalSettlementApprovedDueData`,
    payload,
    cb,
    true
  );
};

export {
  approvalListHeader,
  assetHeader,
  calculateTotalAmounts,
  dueAmountSaveHandler,
  employmentHeader,
  statusDDL
};

