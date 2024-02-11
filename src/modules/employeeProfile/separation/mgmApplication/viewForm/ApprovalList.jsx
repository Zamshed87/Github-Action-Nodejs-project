import React from "react";
import { DataTable } from "Components";
import PBadge from "Components/Badge";
import FormikInput from "common/FormikInput";

const ApprovalList = ({
  approveListData,
  setApproveListData,
  loading,
  type,
  demoPopup,
  data,
  buttonType,
  setComment,
}) => {
  // Table Header
  const header = [
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
      render: (data, record) =>
        record?.strStatusTitle === "Approve By Supervisor"
          ? "Supervisor"
          : record?.strStatusTitle === "Approve By User Group"
          ? "User Group"
          : "Line Manager",
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (data, record) =>
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
        type === "approval" ? (
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
              disabled={record?.strStatusTitle !== data?.currentStage}
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
      render: (data, record) => {
        return (
          <div className="d-flex justify-content-center">
            {buttonType === "approve" ? (
              <button
                type="button"
                onClick={() =>
                  demoPopup("approve", "Approve", data)
                }
                className="btn btn-green"
              >
                Approve
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  demoPopup("reject", "Reject", data)
                }
                className="btn btn-cancel"
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  borderColor: "#dc3545",
                }}
              >
                Reject
              </button>
            )}
          </div>
        );
      },
      isHidden: type === "view",
    },
  ].filter((item) => !item.isHidden);

  return (
    <>
      <div className="mt-3">
        <DataTable
          header={header}
          bordered
          data={approveListData || []}
          loading={loading}
          scroll={{ x: 700 }}
          onChange={(pagination, filters, sorter, extra) => {
            if (extra.action === "sort") return;
          }}
        />
      </div>
    </>
  );
};

export default ApprovalList;

const rowDtoHandler = (name, value, sl, rowDto, setRowDto) => {
  const data = [...rowDto];
  const _sl = data[sl];
  _sl[name] = value;
  setRowDto(data);
};
