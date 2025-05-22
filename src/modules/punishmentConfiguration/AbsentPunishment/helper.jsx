import { Switch, Tooltip } from "antd";
import axios from "axios";
import { Flex, PButton } from "Components";
import { toast } from "react-toastify";

const updatePolicyStatus = async (policyId, status) => {
  try {
    const response = await axios.post(
      `/AbsentPunishment/ActiveNInactive?policyId=${policyId}&isActive=${status}`
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
export const getHeader = (pages, setData, setOpenView, setOpenExtend) => [
  {
    title: "SL",
    render: (_, __, index) =>
      (pages?.current - 1) * pages?.pageSize + index + 1,
    width: 50,
    align: "center",
  },
  {
    title: "Policy Name",
    dataIndex: "policyName",
    width: 150,
  },
  {
    title: "Workplace",
    dataIndex: "workplaceName",
    width: 150,
  },
  {
    title: "Employment Type",
    dataIndex: "employmentTypeList",
    width: 120,
  },
  {
    title: "Designation",
    dataIndex: "designationList",
    width: 120,
  },
  {
    title: "Status",
    dataIndex: "isActive",
    align: "center",
    width: 40,
    render: (_, rec) => {
      return (
        <Flex justify="center">
          <Tooltip title={rec?.isActive ? "Active" : "Inactive"}>
            <Switch
              size="small"
              checked={rec?.isActive}
              onChange={(checked) => {
                setData((prev) => {
                  const updatedList = [...prev.absentPunishmentList];
                  const recIndex = updatedList.findIndex(
                    (item) => item.policyId === rec.policyId
                  );

                  if (recIndex !== -1) {
                    updatedList[recIndex] = {
                      ...updatedList[recIndex],
                      isActive: checked,
                    };
                  }

                  return {
                    ...prev,
                    absentPunishmentList: updatedList,
                  };
                });
                updatePolicyStatus(rec.policyId, checked);
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
    render: (_, record) => (
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <PButton
          content="View"
          type="primary-outline"
          onClick={() => {
            setOpenView({ open: true, data: record });
          }}
        />
        <PButton
          content="Extend"
          type="primary"
          onClick={() => {
            setOpenExtend({ extend: true, data: record });
          }}
        />
      </div>
    ),
    width: 140,
  },
];
