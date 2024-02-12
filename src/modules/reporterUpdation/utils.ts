export const header: any = [
  {
    title: "SL",
    render: (value: any, row: any, index: number) => index + 1,
    align: "center",
    width: 30,
    fixed: "left",
  },
  {
    title: "Employee Name",
    dataIndex: "StrEmployeeName",
    fixed: "left",
    width: 120,
  },
  {
    title: "Employee ID",
    dataIndex: "StrEmployeeCode",
    fixed: "left",
    width: 90,
  },
];
