import { Tooltip } from "antd";
import Chips from "common/Chips";
import { Flex } from "Components";
import moment from "moment";
import { TbEdit } from "react-icons/tb";
import { GiTakeMyMoney } from "react-icons/gi";
import { FaEye } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

export const getHeader = (pages, history, inActivatePfInvestment) => [
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
    width: 100,
  },
  {
    title: "Organization Investment Name",
    dataIndex: "orgInvestmentName",
    width: 140,
  },
  {
    title: "Investment Date",
    dataIndex: "investmentDate",
    render: (date) => moment(date).format("YYYY-MM-DD"),
    width: 100,
  },
  {
    title: "Investment Amount",
    dataIndex: "investmentAmount",
    render: (amount) => amount?.toLocaleString(),
    width: 100,
  },
  {
    title: "Expected ROI (%)",
    dataIndex: "expectedROI",
    width: 100,
  },
  {
    title: "Duration (Months)",
    dataIndex: "investmentDuration",
    width: 80,
  },
  {
    title: "Maturity Date",
    dataIndex: "maturityDate",
    render: (date) => moment(date).format("YYYY-MM-DD"),
    width: 100,
  },
  {
    title: "Status",
    dataIndex: "strStatus",
    align: "center",
    width: 80,
    render: (_, rec) => {
      const getChipClass = (status) => {
        switch (status) {
          case "Inactive":
            return "default";
          case "Not Started":
            return "warning";
          case "Running":
            return "primary";
          case "Matured":
            return "success";
          case "Profit Shared":
            return "info";
          default:
            return "default";
        }
      };

      return (
        <Flex align="center" gap={8} justify="center">
          <Chips label={rec?.status} classess={getChipClass(rec?.status)} />
        </Flex>
      );
    },
  },
  {
    title: "Action",
    align: "center",
    width: 130,
    render: (_, record) => {
      const status = record?.status;

      const showEdit = status === "Not Started";
      const showCollection = ["Running", "Matured"].includes(status);
      const showInactive = status == "Not Started" || status !== "InActive" && !showCollection; 

      const iconBtnStyle = {
        backgroundColor: "var(--primary-color)",
        border: "none",
        borderRadius: "50%",
        width: "32px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "#fff",
        padding: 0,
      };

      return (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Tooltip title="View">
            <button
              style={iconBtnStyle}
              onClick={() => {
                history.push(
                  `/BenefitsManagement/providentFund/pfInvestment/view`,
                  {
                    state: {
                      data: record,
                    },
                  }
                );
              }}
            >
              <FaEye size={16} />
            </button>
          </Tooltip>

          {showEdit && (
            <Tooltip title="Edit">
              <button
                style={iconBtnStyle}
                onClick={() =>
                  history.push(
                    `/BenefitsManagement/providentFund/pfInvestment/edit`,
                    {
                      state: {
                        data: record,
                      },
                    }
                  )
                }
              >
                <TbEdit size={16} />
              </button>
            </Tooltip>
          )}

          {showCollection && (
            <Tooltip title="Collection">
              <button
                style={iconBtnStyle}
                onClick={() => {
                  history.push(
                    `/BenefitsManagement/providentFund/pfInvestment/collection`,
                    {
                      state: {
                        data: record,
                      },
                    }
                  );
                }}
              >
                <GiTakeMyMoney size={16} />
              </button>
            </Tooltip>
          )}

          {showInactive && (
            <Tooltip title="Mark as Inactive">
              <button
                style={iconBtnStyle}
                onClick={() => {
                  inActivatePfInvestment(
                    record?.investmentHeaderId,
                  );
                }}
              >
                <RxCrossCircled size={16} />
              </button>
            </Tooltip>
          )}
        </div>
      );
    },
  },
];
