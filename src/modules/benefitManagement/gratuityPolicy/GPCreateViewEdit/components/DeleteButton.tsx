import { DeleteOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { Flex } from "Components";
import React from "react";

const DeleteButton = ({
  data,
  setData,
  rec,
}: {
  data: any;
  setData: any;
  rec: any;
}) => {
  return (
    <Flex justify="center">
      <Tooltip placement="bottom" title="Delete">
        <DeleteOutlined
          style={{
            color: "red",
            fontSize: "14px",
            cursor: "pointer",
            margin: "0 5px",
          }}
          onClick={() => {
            const filterData = data.filter((item: any) => item.idx !== rec.idx);
            setData(filterData);
          }}
        />
      </Tooltip>
    </Flex>
  );
};

export default DeleteButton;
