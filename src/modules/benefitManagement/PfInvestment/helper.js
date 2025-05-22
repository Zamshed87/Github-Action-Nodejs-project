import { Switch, Tooltip } from "antd";
import axios from "axios";
import { Flex, PButton } from "Components";
import moment from "moment";
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
    title: "Investment Name",
    dataIndex: "investmentName",
    width: 150,
  },
  {
    title: "Organization Investment Name",
    dataIndex: "orgInvestmentName",
    width: 180,
  },
  {
    title: "Investment Date",
    dataIndex: "investmentDate",
    render: (date) => moment(date).format("YYYY-MM-DD"),
    width: 140,
  },
  {
    title: "Investment Amount",
    dataIndex: "investmentAmount",
    render: (amount) => amount?.toLocaleString(),
    width: 140,
  },
  {
    title: "Expected ROI (%)",
    dataIndex: "expectedROI",
    width: 120,
  },
  {
    title: "Duration (Years)",
    dataIndex: "investmentDuration",
    width: 120,
  },
  {
    title: "Maturity Date",
    dataIndex: "maturityDate",
    render: (date) => moment(date).format("YYYY-MM-DD"),
    width: 140,
  },
  {
    title: "Status",
    dataIndex: "isActive",
    width: 50,
    align: "center",
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
