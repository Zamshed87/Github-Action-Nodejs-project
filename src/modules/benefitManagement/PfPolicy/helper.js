import { Switch, Tooltip } from "antd";
import axios from "axios";
import { Flex, TableButton } from "Components";
import { toast } from "react-toastify";

const updatePolicyStatusLocally = (list, policyId, newStatus) => {
  const updatedList = [...list];
  const index = updatedList.findIndex(
    (item) => item.intPfConfigHeaderId === policyId
  );

  if (index !== -1) {
    updatedList[index] = {
      ...updatedList[index],
      strStatus: newStatus,
    };
  }

  return updatedList;
};

const togglePfPolicyStatus = async (id) => {
  const response = await axios.post(
    `/PfPolicy/ActiveInactivePfPolicy?intPfConfigHeaderId=${id}`
  );
  return response?.data;
};

export const getHeader = (
  pages,
  setData,
  setOpenView,
  setOpenExtend,
  history
) => [
  {
    title: "SL",
    render: (_, __, index) =>
      (pages?.current - 1) * pages?.pageSize + index + 1,
    width: 25,
    align: "center",
  },
  {
    title: "Policy Name",
    dataIndex: "strPolicyName",
    sorter: true,
    width: 100,
  },
  {
    title: "Policy Code",
    dataIndex: "strPolicyCode",
    sorter: true,
    width: 80,
  },
  {
    title: "Workplace Group",
    dataIndex: "strWorkPlaceGroup",
    sorter: true,
    width: 120,
  },
  {
    title: "Workplace",
    dataIndex: "strWorkPlace",
    sorter: true,
    width: 100,
  },
  {
    title: "Employment Type",
    dataIndex: "strEmploymentTypeName",
    render: (_, rec) => {
      return rec?.isForAllEmploymentType
        ? "All"
        : rec?.employmentTypes?.map((item) => item.label).join(", ");
    },
    sorter: true,
    width: 120,
  },
  {
    title: "PF Eligibility Depend on",
    dataIndex: "strPfEligibilityDependOn",
    sorter: true,
    width: 150,
  },
  {
    width:50,
    align:'center',
    title: "Status",
    dataIndex: "isActive",
    render: (_, rec) => {
      const isActive = rec?.strStatus === "Active";
      return (
        <Flex justify="center">
          <Tooltip title={isActive ? "Active" : "Inactive"}>
            <Switch
              size="small"
              checked={isActive}
              onChange={async (checked) => {
                const prevStatus = rec.strStatus;
                const newStatus = checked ? "Active" : "Inactive";

                // Optimistically update UI
                setData((prev) => ({
                  ...prev,
                  data: updatePolicyStatusLocally(
                    prev.data,
                    rec.intPfConfigHeaderId,
                    newStatus
                  ),
                }));

                // API request and rollback on error
                try {
                  const result = await togglePfPolicyStatus(
                    rec.intPfConfigHeaderId
                  );
                  toast.success(
                    result?.message || "Status updated successfully"
                  );
                } catch (error) {
                  console.log("pf policy failed");
                  setData((prev) => ({
                    ...prev,
                    data: updatePolicyStatusLocally(
                      prev.data,
                      rec.intPfConfigHeaderId,
                      prevStatus
                    ),
                  }));
                  toast.error(
                    error?.response?.data?.message || "Failed to update status"
                  );
                }
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
        <TableButton
          buttonsList={[
            {
              type: "view",
              onClick: () => {
                setOpenView?.({ open: true, data: record });
              },
            },
            {
              type: "extend",
              onClick: () => {
                setOpenExtend?.({ extend: true, data: record });
              },
            },
            record?.intPFAssignType === 2 && {
              type: "assign",
              onClick: () => {
                history.push(
                  `/BenefitsManagement/providentFund/pfPolicy/assign`,
                  {
                    ...record,
                  }
                );
              },
            },
          ]}
        />
      </div>
    ),
    width: 140,
  },
];
