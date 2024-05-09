export const attendenceStatusDDL = [
  {
    label: "Holiday",
    value: 1,
  },
  {
    label: "Offday",
    value: 2,
  },
];

export const header: any = () => {
  return [
    {
      title: "SL",
      render: (value: any, row: any, index: number) => index + 1,
      align: "center",
    },
    {
      title: "Employee ID",
      dataIndex: "strEmpCode",
      width: 25,
    },
    {
      title: "Employee Name",
      dataIndex: "strEmpName",
      width: 45,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
    },
    {
      title: "HR Position",
      dataIndex: "strHr",
      width: 25,
    },
    {
      title: "Calender Name",
      dataIndex: "strCalenderName",
    },
  ];
};
