import { gray600 } from "../../../../../../utility/customColor";

export const roleWiseJDLandingTable = () => {
  return [
    {
      title: () => <div style={{ color: gray600 }}>Sl</div>,
      render: (_, record, index) => <>{record?.sl || "N/A"}</>,
      className: "text-center",
      width: "30px",
    },
    {
      title: () => <div style={{ color: gray600 }}>Role ID</div>,
      render: (_, record) => <>{record?.strEmpRoleCode || "N/A"}</>,
      className: "text-center",
      width: "70px",
    },
    {
      title: () => (
        <div style={{ color: gray600 }}>
          Key Responsibilities and Accountabilities
        </div>
      ),
      render: (_, record) => <>{record?.strResponsibilities || "N/A"}</>,
      width: "300px",
    },
    {
      title: "Frequency",
      dataIndex: "strFrequency",
      render: (_, record) => <>{record?.strFrequency || "N/A"}</>,
      filter: true,
    },
    {
      title: () => (
        <div style={{ color: gray600 }}>Time Allocations 1(self) Minutes</div>
      ),
      render: (_, record) => <>{record?.numTimeAllocationSelf || "N/A"}</>,
    },
    {
      title: () => (
        <div style={{ color: gray600 }}>
          Time Allocations 2(Same role holder)
        </div>
      ),
      render: (_, record) => (
        <>{record?.numTimeAllocationSameRoleHolder || "N/A"}</>
      ),
    },
    {
      title: () => <div style={{ color: gray600 }}>Time Allocations 2(LM)</div>,
      render: (_, record) => <>{record?.numTimeAllocationLm || "N/A"}</>,
    },
    {
      title: () => (
        <div style={{ color: gray600 }}>Importance(% of time spent)</div>
      ),
      render: (_, record) => <>{record?.numImportance || "N/A"}</>,
    },
    {
      title: () => <div style={{ color: gray600 }}>KSAOs</div>,
      render: (_, record) => <>{record?.strKsaos || "N/A"}</>,
    },
    {
      title: () => (
        <div style={{ color: gray600 }}>Importance of Task-Rating(1-5)</div>
      ),
      render: (_, record) => <>{record?.numImportanceOfTaskRating || "N/A"}</>,
    },
    {
      title: () => <div style={{ color: gray600 }}>Total Time</div>,
      render: (_, record) => <>{record?.numTotalTime || "N/A"}</>,
    },
    {
      title: () => <div style={{ color: gray600 }}>Dimension</div>,
      render: (_, record) => <>{record?.strDimension || "N/A"}</>,
    },
  ];
};
