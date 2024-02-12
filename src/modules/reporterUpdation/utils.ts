export const getEmployee = (
  value: any,
  CommonEmployeeDDL: any,
  buId: number,
  wgId: number
) => {
  if (value?.length < 2) return CommonEmployeeDDL?.reset();

  CommonEmployeeDDL?.action({
    urlKey: "CommonEmployeeDDL",
    method: "GET",
    params: {
      businessUnitId: buId,
      workplaceGroupId: wgId,
      // workplaceId: wId,
      searchText: value,
    },
    onSuccess: (res) => {
      res.forEach((item: any, i: number) => {
        res[i].label = item?.employeeNameWithCode;
        res[i].value = item?.employeeId;
      });
    },
  });
};

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
  {
    title: "Department",
    dataIndex: "StrDepartmentName",
    sorter: true,
    filterKey: "departmentList",
  },
  {
    title: "Designation",
    dataIndex: "StrDesignationName",
    sorter: true,
    filterKey: "designationList",
  },
  {
    title: "Section",
    dataIndex: "StrSectionName",
    sorter: true,
  },
  {
    title: "Line Manager",
    dataIndex: "StrLineManagerName",
    sorter: true,
  },
  {
    title: "Supervisor",
    dataIndex: "StrSupervisorName",
    sorter: true,
  },
];
