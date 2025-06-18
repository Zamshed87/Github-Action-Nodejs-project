import { Switch, Tooltip } from "antd";
import { Flex, PButton } from "Components";
import { toast } from "react-toastify";

export const getHeader = (pages,setData, setOpenView, setOpenExtend) => [
  {
    title: "SL",
    render: (_, __, index) =>
      (pages?.current - 1) * pages?.pageSize + index + 1,
    width: 25,
    align: "center",
  },
  {
    title: "Workplace",
    dataIndex: "strWorkPlace",
    sorter: true,
    width: 100,
  },
  {
    title: "Financial Year",
    dataIndex: "financialYear",
    sorter: true,
    width: 100,
  },
  {
    title: "Action",
    dataIndex: "",
    align: "center",
    render: (_, record) => (
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <PButton
          content="View"
          type="primary-outline"
          onClick={() => {
            setOpenView?.({ open: true, data: record });
          }}
        />
        <PButton
          content="Edit"
          type="primary"
          onClick={() => {
            setOpenExtend?.({ extend: true, data: record });
          }}
        />
      </div>
    ),
    width: 140,
  },
];
