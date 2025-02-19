export const getHeader = (length,totalKPIScoreByScale) => [
  {
    title: "Objective Type",
    dataIndex: "objectiveType",
    width: 80,
    align: "center",
  },
  {
    title: "Objective",
    dataIndex: "objective",
    width: 100,
    align: "center",
  },
  {
    title: "Key Performance Indicator (KPI)",
    dataIndex: "keyPerformanceIndicator",
    width: 100,
    align: "center",
  },
  {
    title: "SRF Timeline",
    dataIndex: "srfTimeline",
    width: 80,
    align: "center",
  },
  {
    title: "Weight",
    dataIndex: "weight",
    width: 50,
    align: "center",
  },
  {
    title: "Target",
    dataIndex: "target",
    width: 50,
    align: "center",
  },
  {
    title: "Self Achievement",
    dataIndex: "selfAchivement",
    width: 50,
    align: "center",
  },
  {
    title: "Supervisor Achievement",
    dataIndex: "supervisorAchivement",
    width: 50,
    align: "center",
  },
  {
    title: "Avg. KPI Score",
    dataIndex: "avgKPIScore",
    width: 50,
    align: "center",
  },
  {
    title: "Total KPI Score by Scale",
    onCell: (_, index) => {
      if (index === 0) {
        return { rowSpan: length };
      }
      // These two are merged into above cell
    //   if (index === length - 1) {
    //     return { rowSpan: 0 };
    //   }
      return { rowSpan: 0 };
    },
    render:(_,index) => {
        return totalKPIScoreByScale ?? ""
    },
    width: 70,
    align: "center",
  },
];

export const getFooter = (kpiTotal) => [
  {
    objectiveType: "Total",
    objective: "",
    keyPerformanceIndicator: "",
    srfTimeline: "",
    weight: kpiTotal?.weight,
    target: kpiTotal?.target,
    selfAchivement: kpiTotal?.selfAchivement,
    supervisorAchivement: kpiTotal?.supervisorAchivement,
    avgKPIScore: kpiTotal?.avgKPIScore,
    total: "lsfj",
  },
];
