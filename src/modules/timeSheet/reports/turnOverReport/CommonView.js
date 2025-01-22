import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { turnOverView } from "modules/timeSheet/helper";
import {
  newHiredColumns,
  separatedColumns,
  transferInColumns,
  TransferOutColumns,
} from "./utils";

const CommonView = ({ period, wId, type }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    turnOverView(setData, setLoading, wId, period, type);
  }, []);

  return (
    <div>
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        {`${type.replace(/([a-z])([A-Z])/g, "$1 $2")} Employees for ${period}`}
      </h3>
      <Table
        bordered
        dataSource={data || []}
        columns={
          type === "NewHired"
            ? newHiredColumns
            : type === "Separated"
            ? separatedColumns
            : type === "TransferIn"
            ? transferInColumns
            : type === "TransferOut"
            ? TransferOutColumns
            : []
        }
        pagination={false}
        rowKey={(record, index) => index}
        loading={loading}
      />
    </div>
  );
};

export default CommonView;
