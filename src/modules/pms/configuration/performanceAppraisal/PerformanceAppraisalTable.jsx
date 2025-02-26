import React from "react";
import { Flex, DataTable } from "Components";
import { Col, Row, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { getSerial } from "Utils";

const PerformanceAppraisalTable = ({
  data,
  setData,
  landingApi,
  landingApiCall,
}) => {
  const deleteHandler = (idx) => {
    const updatedData = data.filter((item) => item.idx !== idx);
    setData(updatedData);
  };
  console.log(landingApi, "landingApi");
  const header = [
    {
      title: "SL",
      render: (_, rec, index) =>
        getSerial({
          currentPage: landingApi?.pageNo,
          pageSize: landingApi?.pageSize,
          index,
        }),
      fixed: "left",
      align: "center",
    },
    { title: "Mark Start", dataIndex: "markStart" },
    { title: "Mark End", dataIndex: "markEnd" },
    { title: "Grade Name", dataIndex: "gradeName" },
    { title: "Cola %", dataIndex: "cola" },
    { title: "Appraisal (%)", dataIndex: "appraisal" },
    { title: "comment", dataIndex: "comment" },
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
      <DataTable
        bordered
        data={data || []}
        loading={false}
        header={header}
        pagination={{
          pageSize: landingApi?.pageSize,
          total: landingApi?.totalCount,
        }}
        // filterData={landingApi?.data?.filters}
        onChange={(pagination, filters) => {
          landingApiCall(pagination);
        }}
      />
    </div>
  );
};

export default PerformanceAppraisalTable;
