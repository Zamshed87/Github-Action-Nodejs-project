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
      title: "Section",
      dataIndex: "strSectionName",
      width: 25,
    },
    {
      title: "Calender Name",
      dataIndex: "strCalenderName",
    },
    {
      title: "Swap Date",
      dataIndex: "strSwapDate",
    },
  ];
};

export const holidayOffdaySwapLandingheader: any = () => {
  /* 
  {
    "empCode": "30002230",
    "empName": "Md Saad",
    "empDepartment": "Store",
    "empDesignation": "Assistant Store Keeper",
    "empHr": "Worker",
    "empSection": "Store",
    "calenderName": "Day Shift_Worker_08:00AM to 08:00PM_No Grace",
    "dteAttendenceDate": "17 May, 2024",
    "attendendeceStatus": "Offday",
    "swapDate": "22 May, 2024",
    "strRemarks": ""
}
  */
  return [
    {
      title: "SL",
      render: (value: any, row: any, index: number) => index + 1,
      align: "center",
      width: 25,
    },
    {
      title: "Emp ID",
      dataIndex: "empCode",
      width: 55,
    },
    {
      title: "Employee Name",
      dataIndex: "empName",

      // width: 65,
    },
    {
      title: "Department",
      dataIndex: "empDepartment",
    },
    {
      title: "Designation",
      dataIndex: "empDesignation",
    },
    {
      title: "HR Position",
      dataIndex: "empHr",
    },
    {
      title: "Section",
      dataIndex: "empSection",
      width: 45,
    },
    {
      title: "Calender Name",
      dataIndex: "calenderName",
    },
    {
      title: "Attendence Date",
      dataIndex: "dteAttendenceDate",
      className: "text-center",
    },
    {
      title: "Attendence Status",
      dataIndex: "attendendeceStatus",
      className: "text-center",
    },
    {
      title: "Swap Date",
      dataIndex: "swapDate",
      className: "text-center",
    },
    {
      title: "Remarks",
      dataIndex: "strRemarks",
    },
  ];
};