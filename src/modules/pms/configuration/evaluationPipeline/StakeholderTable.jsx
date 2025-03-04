import React from "react";
import { Flex, DataTable } from "Components";
import { Col, Row, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { getTotalWeight } from "./helper";
import { getSerial } from "Utils";

const StakeholderTable = ({ data, setStakeholderField, type }) => {
  const deleteHandler = (idx) => {
    const updatedData = data.filter((item) => item.idx !== idx);
    setStakeholderField(updatedData);
  };

  const header = [
    {
      title: "Sequence Order",
      render: (_, rec, index) =>
        getSerial({
          currentPage: 1,
          pageSize: 1000,
          index,
        }),
      fixed: "left",
      align: "left",
    },
    { title: "Stakeholder Type", dataIndex: "stakeholderTypeName" },
    { title: "Stakeholder", dataIndex: "stakeholderName" },
    { title: "Score Weight", dataIndex: "scoreWeight" },
  ];

  // Conditionally add "Action" column
  if (type !== "view") {
    header.push({
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
    });
  }

  return (
    <div className="mb-3 mt-2">
      <div className="">
        <Row justify="" align="right">
          <Col>
            <h1>Total Score Weight: {getTotalWeight(data)} </h1>
          </Col>{" "}
          {getTotalWeight(data) !== 100 && (
            <Col>
              <h1 style={{ color: "red" }}>(Total Score Weight must be 100)</h1>
            </Col>
          )}
        </Row>
      </div>
      <DataTable bordered data={data || []} loading={false} header={header} />
    </div>
  );
};

export default StakeholderTable;
