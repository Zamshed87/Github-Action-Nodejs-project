import React from "react";
import { DataTable } from "Components";
import PBadge from "Components/Badge";

const ApprovalList = ({ approveListData, loading }) => {
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
      render: (data, record) => record?.comment || "N/A",
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
