import AvatarComponent from "../../common/AvatarComponent";

export const userRoleExtensionCol = (pages) => {
  return [
    {
      title: "SL",
      render: (_, index) => (pages?.current - 1) * pages?.pageSize + index + 1,
      sort: false,
      className: "text-center",
    },
    {
      title: "Employee Id",
      dataIndex: "employeeCode",
      sort: true,
      // filter: true,
      fieldType: "string",
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      render: (record) => (
        <div className="d-flex align-items-center">
          <AvatarComponent
            classess=""
            letterCount={1}
            label={record?.strEmployeeName}
          />
          <span className="ml-2">{record?.strEmployeeName}</span>
        </div>
      ),
      sort: true,
      // filter: true,
      fieldType: "string",
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sort: true,
      fieldType: "string",
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sort: true,
      fieldType: "string",
    },

    {
      title: "Workplace",
      dataIndex: "strWorkplace",
      sorter: true,
      fieldType: "string",
    },
  ];
};
