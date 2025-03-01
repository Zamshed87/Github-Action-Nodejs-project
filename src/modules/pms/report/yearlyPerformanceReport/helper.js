import { PButton } from "Components";

export const getHeader = (pages,setModal) => [
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
        title: "Total Target",
        dataIndex: ["keyPerformanceIndicator", "totalTarget"],
        sorter: true,
        width: 50,
        align: "center",
      },
      {
        title: "Self Score",
        dataIndex: ["keyPerformanceIndicator", "selfScore"],
        sorter: true,
        width: 50,
        align: "center",
      },
      {
        title: "Supervisor Score",
        dataIndex: ["keyPerformanceIndicator", "supervisorScore"],
        sorter: true,
        width: 50,
        align: "center",
      },
      {
        title: "Avg. KPI Score",
        dataIndex: ["keyPerformanceIndicator", "avgKPIScore"],
        sorter: true,
        width: 50,
        align: "center",
      },
    ],
  },
  {
    title: "Behaviorally Anchored Rating (BAR)",
    children: [
      {
        title: "Self Score",
        dataIndex: ["behaviorallyAnchoredRating", "selfScore"],
        sorter: true,
        width: 50,
        align: "center",
      },
      {
        title: "Supervisor Score",
        dataIndex: ["behaviorallyAnchoredRating", "supervisorScore"],
        sorter: true,
        width: 50,
        align: "center",
      },
      {
        title: "Cross Functional Score",
        dataIndex: ["behaviorallyAnchoredRating", "crossFuncationalScore"],
        sorter: true,
        width: 50,
        align: "center",
      },
      {
        title: "Avg. BAR Score",
        dataIndex: ["behaviorallyAnchoredRating", "avgBARScore"],
        sorter: true,
        width: 50,
        align: "center",
      },
    ],
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
    align: "center",
    render: (_, rec) => {
      return <PButton content="Details" color="primary" type="primary-outline" onClick={()=>{setModal({open:true,data:rec})}}/>;
    },
  },
];
