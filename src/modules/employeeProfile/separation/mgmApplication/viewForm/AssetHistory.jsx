import React from "react";
import { DataTable } from "Components";
import { Tag } from "antd";
import moment from "moment";

const AssetHistory = ({ assetHistory, loading }) => {
  const header = [
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
  return (
    <div className="mt-3">
      <DataTable
        header={header}
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
