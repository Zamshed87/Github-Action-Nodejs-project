import { Switch, Tooltip } from "antd";
import axios from "axios";
import { Flex, TableButton } from "Components";
import { toast } from "react-toastify";

export const getCommonHeader = ({
  pages,
  setData,
  setOpenEdit,
  permission,
  investmentType = true, // true = Investment Type, false = Investment Organization
}) => {
  const config = investmentType
    ? {
        title: "Investment Type",
        nameKey: "investmentName",
        idKey: "investmentTypeId",
        recordId: "typeId",
        endpoint: "/InvestmentType/ActiveOrDeleteById",
      }
    : {
        title: "Investment To Organization",
        nameKey: "organizationName",
        idKey: "InvestmentOrganizationId",
        recordId: "typeId",
        endpoint: "/InvestmentOrganization/ActiveOrDeleteById",
      };

  const updateStatus = async (id, status) => {
    try {
      const response = await axios.delete(
        `${config.endpoint}?${config.idKey}=${id}&Active=${status}`
      );
      toast.success(
        response?.data?.message?.[0] || "Status updated successfully"
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message?.[0] || "Failed to update status"
      );
    }
  };

  return [
    {
      title: "SL",
      render: (_, __, index) =>
        (pages?.current - 1) * pages?.pageSize + index + 1,
      width: 25,
      align: "center",
    },
    {
      title: config.title,
      dataIndex: config.nameKey,
      sorter: true,
      width: 100,
    },
    {
      title: "Comments",
      dataIndex: "remark",
      render: (_, rec) => rec.remark ?? "-",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (_, rec) => (
        <Flex justify="center">
          <Tooltip title={rec?.isActive === "Active" ? "Active" : "Inactive"}>
            <Switch
              size="small"
              checked={rec?.isActive === "Active"}
              onChange={(checked) => {
                setData((prev) => {
                  const updatedList = [...prev.data];
                  const recIndex = updatedList.findIndex(
                    (item) => item[config.recordId] === rec[config.recordId]
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
                updateStatus(rec[config.recordId], checked);
              }}
            />
          </Tooltip>
        </Flex>
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      align: "center",
      render: (_, record) => (
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
      ),
      width: 140,
    },
  ];
};
