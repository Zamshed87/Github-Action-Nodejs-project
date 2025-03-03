import { OverlayTrigger, Tooltip } from "react-bootstrap";

export const getHeader = (length, totalKPIScoreByScale, history, data) => {
  let result = [
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
  ];
  if (data != null && data.kpiScoreHeaders != null) {
    data.kpiScoreHeaders.forEach((header, index) => {
      result.push({
        title: header,
        dataIndex: "kpiScore." + index,
        render: (_, record) => {
          return (
            <span>
              <OverlayTrigger
                overlay={
                  <Tooltip
                    id="tooltip-disabled"
                    style={{
                      fontSize: "11px",
                    }}
                  >
                    (KPI) Assessment
                  </Tooltip>
                }
              >
                <span
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    textDecoration: "underline",
                  }}
                  onClick={() => {
                    history?.push({
                      pathname: `/pms/performancePlanning/individualKpiResult`,
                    });
                  }}
                >
                  {record["kpiScore." + index]}
                </span>
              </OverlayTrigger>
            </span>
          );
        },
        width: 50,
        align: "center",
      });
    });
  }
  result = result.concat([
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
      render: (_, index) => {
        return totalKPIScoreByScale ?? "";
      },
      width: 70,
      align: "center",
    },
  ]);
  return result;
};

export const getBarHeader = (length, totalBARScoreByScale, history, data) => {
  let result = [
    {
      title: "Question Group Name",
      dataIndex: "questionGroupName",
      width: 80,
      align: "center",
    },
    {
      title: "Question Name",
      dataIndex: "questionName",
      width: 100,
      align: "center",
    },
    {
      title: "Desired value",
      dataIndex: "desiredValue",
      width: 60,
      align: "center",
    },
  ];
  if (data != null && data.barScoreHeaders != null) {
    data.barScoreHeaders.forEach((header, index) => {
      result.push({
        title: header,
        dataIndex: "barScore." + index,
        render: (_, record) => {
          return (
            <span>
              <OverlayTrigger
                overlay={
                  <Tooltip
                    id="tooltip-disabled"
                    style={{
                      fontSize: "11px",
                    }}
                  >
                    BAR Assessment
                  </Tooltip>
                }
              >
                <span
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    textDecoration: "underline",
                  }}
                  onClick={() => {
                    history?.push({
                      pathname: `/pms/performanceAssessment/BARAssessment`,
                    });
                  }}
                >
                  {record["barScore." + index]}
                </span>
              </OverlayTrigger>
            </span>
          );
        },
        width: 50,
        align: "center",
      });
    });
  }
  result = result.concat([
    {
      title: "Avg. BAR Score",
      dataIndex: "avgBARScore",
      width: 50,
      align: "center",
    },
    {
      title: "Total BAR Score by Scale",
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
      render: (_, index) => {
        return totalBARScoreByScale ?? "";
      },
      width: 70,
      align: "center",
    },
  ]);
  return result;
};
