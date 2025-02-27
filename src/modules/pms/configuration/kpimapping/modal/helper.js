export const kpiColumnDataForIndividual = () => {
  return [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      width: 20,
    },
    // {
    //     title: "PM Type",
    //     dataIndex: "pmTypeName",
    //     width: 70,
    // },
    {
      title: "Objective Type",
      dataIndex: "objectiveTypeName",
      width: 100,
    },
    {
      title: "Objective",
      dataIndex: "objectiveName",
    },
    {
      title: "KPI Name",
      dataIndex: "kpiName",
      width: 200,
    },
  ];
};
export const kpiColumnDataForDepartment = () => {
  return [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      width: 20,
    },
    // {
    //     title: "PM Type",
    //     dataIndex: "pmTypeName",
    //     width: 70,
    // },
    {
      title: "Objective Type",
      dataIndex: "departmnetKpiObjectiveTypeName",
      width: 100,
    },
    {
      title: "Objective",
      dataIndex: "departmnetKpiObjectiveName",
    },
    {
      title: "KPI Name",
      dataIndex: "kpiName",
      width: 200,
    },
  ];
};
