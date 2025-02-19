import { PButton } from "Components";

export const getHeader = (pages, history) => [
  {
    title: "SL",
    render: (text, record, index) =>
      (pages?.current - 1) * pages?.pageSize + index + 1,
    width: 25,
    align: "center",
  },
  {
    title: "Employee Name",
    dataIndex: "employeeName",
    width: 80,
    sorter: true,
  },

  {
    title: "Department",
    dataIndex: "department",
    sorter: true,
    width: 70,
  },
  {
    title: "Designation",
    dataIndex: "designation",
    sorter: true,
    width: 70,
  },
  {
    title: "Supervisor",
    dataIndex: "supervisor",
    sorter: true,
    width: 70,
  },
  {
    title: "KPIs Count",
    dataIndex: "kpIsCount",
    sorter: true,
    width: 40,
  },
  {
    title: "Actual Weight",
    dataIndex: "actualWeight",
    sorter: true,
    width: 40,
  },
  {
    title: "Gap",
    dataIndex: "gap",
    sorter: true,
    width: 30,
  },
  {
    title: "Action",
    dataIndex: "",
    align: "center",
    render: (_, record) => {
      return (
        <PButton
          content="Details"
          type="primary-outline"
          onClick={() => {
            history?.push({
              pathname: `/pms/targetsetup/EmployeeTarget/edit/${record?.employeeId}`,
              state: {
                isEdit: true,
                empInfo: record,
                // prevlandingValues: values,
              },
            });
          }}
        />
      );
    },
  },
];
