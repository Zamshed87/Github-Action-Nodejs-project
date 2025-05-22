import { Switch, Tooltip } from "antd";
import axios from "axios";
import { Flex, PButton } from "Components";
import { toast } from "react-toastify";

/**
 * 🔁 Update the isActive status for a policy in the list
 */
const updateListStatus = (list, policyId, newStatus) => {
  const updatedList = [...list];
  const index = updatedList.findIndex(item => item.policyId === policyId);

  if (index !== -1) {
    updatedList[index] = {
      ...updatedList[index],
      isActive: newStatus,
    };
  }

  return updatedList;
};

/**
 * 📡 API call to update the active status
 */
const updatePolicyStatus = async (policyId, status) => {
  const response = await axios.post(
    `/AbsentPunishment/ActiveNInactive?policyId=${policyId}&isActive=${status}`
  );
  return response?.data;
};

/**
 * 📋 Table headers
 */
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
    render: (_, rec) => (
      <Flex justify="center">
        <Tooltip title={rec?.isActive ? "Active" : "Inactive"}>
          <Switch
            size="small"
            checked={rec?.isActive}
            onChange={async (checked) => {
              // 🔄 Optimistically update UI
              setData(prev => ({
                ...prev,
                absentPunishmentList: updateListStatus(
                  prev.absentPunishmentList,
                  rec.policyId,
                  checked
                ),
              }));

              // 📡 Backend update with rollback on failure
              try {
                const result = await updatePolicyStatus(rec.policyId, checked);
                toast.success(result?.message?.[0] || "Status updated successfully");
              } catch (error) {
                // 🔁 Revert UI change if API fails
                setData(prev => ({
                  ...prev,
                  absentPunishmentList: updateListStatus(
                    prev.absentPunishmentList,
                    rec.policyId,
                    !checked
                  ),
                }));
                toast.error(
                  error?.response?.data?.message?.[0] || "Failed to update status"
                );
              }
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
    width: 140,
    render: (_, record) => (
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <PButton
          content="View"
          type="primary-outline"
          onClick={() => setOpenView({ open: true, data: record })}
        />
        <PButton
          content="Extend"
          type="primary"
          onClick={() => setOpenExtend({ extend: true, data: record })}
        />
      </div>
    ),
  },
];
