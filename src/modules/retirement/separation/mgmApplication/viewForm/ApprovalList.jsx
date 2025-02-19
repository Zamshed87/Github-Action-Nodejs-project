import React from "react";
import { DataTable } from "Components";
import { approvalListHeader } from "../utils";

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
  return (
    <>
      <div className="mt-3">
        <DataTable
          header={approvalListHeader({
            type,
            approveListData,
            setApproveListData,
            setComment,
            data,
            buttonType,
            demoPopup,
          })}
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
