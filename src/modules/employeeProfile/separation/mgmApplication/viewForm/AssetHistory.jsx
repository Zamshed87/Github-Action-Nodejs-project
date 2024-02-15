import React from "react";
import { DataTable } from "Components";
import { assetHeader } from "../utils";

const AssetHistory = ({ assetHistory, loading }) => {
  return (
    <div className="mt-3">
      <DataTable
        header={assetHeader}
        bordered
        data={assetHistory || []}
        loading={loading}
        scroll={{ x: 700 }}
        onChange={(pagination, filters, sorter, extra) => {
          if (extra.action === "sort") return;
        }}
      />
    </div>
  );
};

export default AssetHistory;
