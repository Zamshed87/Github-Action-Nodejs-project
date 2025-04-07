
export const getHeader = (pages) => [
  {
    title: "SL",
    render: (text, record, index) => (pages?.current - 1) * pages?.pageSize + index + 1,
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
    title: "Key Performance Indicator (KPI)",
    children: [
      {
        title: "Scale",
        dataIndex: "keyPerformanceIndicatorScale",
        sorter: true,
        width: 50,
        align: "center",
      },
      {
        title: "Score",
        dataIndex: "keyPerformanceIndicatorScore",
        sorter: true,
        width: 50,
        align: "center",
      }
    ],
  },
  {
    title: "Behaviorally Anchored Rating (BAR)",
    children: [
      {
        title: "Scale",
        dataIndex: "behaviorallyAnchoredRatingScale",
        sorter: true,
        width: 50,
        align: "center",
      },
      {
        title: "Score",
        dataIndex: "behaviorallyAnchoredRatingScore",
        sorter: true,
        width: 50,
        align: "center",
      }
    ],
  },
  {
    title: "Total Performance Score (Out of 100)",
    dataIndex: "totalPerformanceScore",
    sorter: true,
    width: 50,
    align: "center",
  },
  {
    title: "Grade Name",
    dataIndex: "gradeName",
    sorter: true,
    width: 50,
    align: "center",
  },
  {
    title: "Cola (%)",
    dataIndex: "cola",
    sorter: true,
    width: 50,
    align: "center",
  },
  {
    title: "Appraisal (%)",
    dataIndex: "appraisal",
    sorter: true,
    width: 50,
    align: "center",
  },
  {
    title: "Total Appraisal (%)",
    dataIndex: "totalAppraisal",
    sorter: true,
    width: 50,
    align: "center",
  },
];
