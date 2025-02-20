import React from "react";
import { Flex, DataTable } from "Components";
import { Col, Row, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { getSerial } from "Utils";

const PerformanceAppraisalTable = ({ data, setStakeholderField }) => {
  const deleteHandler = (idx) => {
    const updatedData = data.filter((item) => item.idx !== idx);
    setStakeholderField(updatedData);
  };

  const header = [
    {
      title: "SL",
      render: (_, rec, index) =>
        getSerial({
          currentPage: 1,
          pageSize: 1000,
          index,
        }),
      fixed: "left",
      align: "center",
    },
    { title: "Stakeholder Type", dataIndex: "stakeholderTypeName" },
    { title: "Stakeholder", dataIndex: "stakeholderName" },
    { title: "Score Weight", dataIndex: "scoreWeight" },
    {
      title: "Action",
      render: (_, rec) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title="Delete">
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => deleteHandler(rec.idx)}
            />
          </Tooltip>
        </Flex>
      ),
      align: "center",
      width: 40,
    },
  ];

  return (
    <div className="mb-3 mt-2">
      <DataTable bordered data={data || []} loading={false} header={header} />
    </div>
  );
};

export default PerformanceAppraisalTable;
