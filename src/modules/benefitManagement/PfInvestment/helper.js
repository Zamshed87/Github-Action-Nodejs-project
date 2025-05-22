import Chips from "common/Chips";
import { Flex, PButton } from "Components";
import moment from "moment";

export const getHeader = (pages, setData, setOpenView) => [
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
      const showInactive = status !== "InActive";
  
      return (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PButton
            content="View"
            type="primary-outline"
            onClick={() => {
              setOpenView?.({ open: true, data: record });
            }}
          />
  
          {showEdit && (
            <>
              <div style={{ height: "10px", width: "2px", backgroundColor: "black" }} />
              <PButton
                content="Edit"
                type="primary-outline"
                onClick={() => {}}
              />
            </>
          )}
  
          {showCollection && (
            <>
              <div style={{ height: "10px", width: "2px", backgroundColor: "black" }} />
              <PButton
                content="Collection"
                type="primary-outline"
                onClick={() => {}}
              />
            </>
          )}
  
          {showInactive && (
            <>
              <div style={{ height: "10px", width: "2px", backgroundColor: "black" }} />
              <PButton
                content="Inactive"
                type="primary-outline"
                onClick={() => {}}
              />
            </>
          )}
        </div>
      );
    },
  }  
];
