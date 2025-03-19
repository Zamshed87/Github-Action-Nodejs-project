import { PButton } from "Components";

export const getHeader = (pages, setModal, reportData) => {
  const kpiChildren = [
    {
      title: "Total Target",
      dataIndex: "kpiTotalTarget",
      sorter: true,
      width: 50,
      align: "center",
    },
  ];
  const barChildren = [];
  if (reportData != null && reportData.kpiScoreHeaders != null) {
    reportData.kpiScoreHeaders.forEach((item, index) => {
      kpiChildren.push({
        title: item,
        dataIndex: "kpiScore." + index,
        sorter: true,
        width: 50,
        align: "center",
      });
    });
  }
  if (reportData != null && reportData.barScoreHeaders != null) {
    reportData.barScoreHeaders.forEach((item, index) => {
      barChildren.push({
        title: item,
        dataIndex: "barScore." + index,
        sorter: true,
        width: 50,
        align: "center",
      });
    });
  }
  kpiChildren.push({
    title: "Stakeholder Type Based Total KPI Score by Scale",
    dataIndex: "avgKPIScore",
    sorter: true,
    width: 50,
    align: "center",
  });
  barChildren.push({
    title: "Stakeholder Type Based Total BAR Score by Scale",
    dataIndex: "avgBARScore",
    sorter: true,
    width: 50,
    align: "center",
  });
  return [
    {
      title: "SL",
      render: (text, record, index) =>
        (pages?.current - 1) * pages?.pageSize + index + 1,
      width: 20,
      align: "center",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      width: 60,
      sorter: true,
      align: "center",
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: true,
      width: 60,
      align: "center",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      sorter: true,
      width: 70,
      align: "center",
    },
    {
      title: "Supervisor",
      dataIndex: "supervisor",
      sorter: true,
      width: 60,
      align: "center",
    },
    {
      title: "Weight",
      dataIndex: "kpiWeight",
      sorter: true,
      width: 60,
      align: "center",
    },
    {
      title: "Key Performance Indicator (KPI)",
      children: kpiChildren,
    },
    {
      title: "Behaviorally Anchored Rating (BAR)",
      children: barChildren,
    },
    {
      title: "Total KPI Score by Scale",
      dataIndex: "totalKPIScoreByScale",
      sorter: true,
      width: 50,
      align: "center",
    },
    {
      title: "Total BAR Score by Scale",
      dataIndex: "totalBARScoreByScale",
      sorter: true,
      width: 50,
      align: "center",
    },
    {
      title: "Total Performance Score (Out of 100)",
      dataIndex: "totalPerformanceScore",
      sorter: true,
      width: 50,
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "",
      width: "42px",
      align: "center",
      render: (_, rec) => {
        return (
          <PButton
            content="Details"
            color="primary"
            type="primary-outline"
            onClick={() => {
              setModal({ open: true, data: rec });
            }}
          />
        );
      },
    },
  ];
};
