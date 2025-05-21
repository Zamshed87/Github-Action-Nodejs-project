import { Switch, Tooltip } from "antd";
import axios from "axios";
import { Flex, TableButton } from "Components";
import { toast } from "react-toastify";

const updateStatus = async (id, status) => {
  try {
    const response = await axios.delete(
      `/InvestmentOrganization/ActiveOrDeleteById?InvestmentOrganizationId=${id}&Active=${status}`
    );
    toast.success(response?.data?.message?.[0] || "Status updated successfully");
  } catch (error) {
    toast.error(error?.response?.data?.message?.[0] || "Failed to update status");
  }
};
export const getHeader = (pages, setData, setOpenEdit, permission) => [
  {
    title: "SL",
    render: (_, __, index) =>
      (pages?.current - 1) * pages?.pageSize + index + 1,
    width: 25,
    align: "center",
  },
  {
    title: "Investment Type",
    dataIndex: "organizationName",
    sorter: true,
    width: 100,
  },
  {
    title: "Comments",
    dataIndex: "remark",
    render: (_, rec) => {
      return rec.remark ?? "-";
    },
    width: 120,
  },
  {
    title: "Status",
    dataIndex: "isActive",
    render: (_, rec) => {
      return (
        <Flex justify="center">
          <Tooltip title={rec?.isActive === "Active" ? "Active" : "Inactive"}>
            <Switch
              size="small"
              checked={rec?.isActive === "Active"}
              onChange={(checked) => {
                setData((prev) => {
                  const updatedList = [...prev.data];
                  const recIndex = updatedList.findIndex(
                    (item) => item.typeId === rec.typeId
                  );

                  if (recIndex !== -1) {
                    updatedList[recIndex] = {
                      ...updatedList[recIndex],
                      isActive: checked ? "Active" : "Inactive",
                    };
                  }

                  return {
                    ...prev,
                    data: updatedList,
                  };
                });
                updateStatus(rec.typeId, checked);
              }}
            />
          </Tooltip>
        </Flex>
      );
    },
  },
  {
    title: "Action",
    dataIndex: "",
    align: "center",
    render: (_, record) => {
      return (
        <TableButton
          buttonsList={[
            {
              type: "edit",
              onClick: (e) => {
                if (!permission?.isEdit) {
                  return toast.warn("You don't have permission");
                  e.stopPropagation();
                }
                setOpenEdit({
                  open: true,
                  data: record,
                });
              },
            },
          ]}
        />
      );
    },
    width: 140,
  },
];
