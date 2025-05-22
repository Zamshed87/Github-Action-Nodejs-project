import { Switch, Tooltip } from "antd";
import axios from "axios";
import { Flex, PButton } from "Components";
import { toast } from "react-toastify";
const updatePolicyStatus = async (id) => {
  try {
    const response = await axios.post(
      `/PfPolicy/ActiveInactivePfPolicy?intPfConfigHeaderId=${id}`
    );
    toast.success(
      response?.data?.message || "Status updated successfully"
    );
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Failed to update status"
    );
  }
};
export const getHeader = (pages,setData, setOpenView) => [
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
    render: (_,rec) => {
      return rec?.isForAllEmploymentType ? "All" : rec?.employmentTypes?.map((item) => item.label).join(", ");
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
    title: "Status",
    dataIndex: "isActive",
    render: (_, rec) => {
      return (
        <Flex justify="center">
          <Tooltip title={rec?.strStatus === "Active" ? "Active" : "Inactive"}>
            <Switch
              size="small"
              checked={rec?.strStatus === "Active"}
              onChange={(checked) => {
                setData((prev) => {
                  const updatedList = [...prev.data];
                  const recIndex = updatedList.findIndex(
                    (item) => item.intPfConfigHeaderId === rec.intPfConfigHeaderId
                  );

                  if (recIndex !== -1) {
                    updatedList[recIndex] = {
                      ...updatedList[recIndex],
                      strStatus: checked ? "Active" : "Inactive",
                    };
                  }

                  return {
                    ...prev,
                    data: updatedList,
                  };
                });
                updatePolicyStatus(rec.intPfConfigHeaderId);
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
            setOpenView?.({ open: true, data: record });
          }}
        />
        <PButton
          content="Extend"
          type="primary"
          onClick={() => {
          }}
        />
      </div>
    ),
    width: 140,
  },
];
