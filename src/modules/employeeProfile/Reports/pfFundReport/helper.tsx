import { formatMoney } from "utility/formatMoney";
import { getSerial } from "Utils";
import PBadge from "Components/Badge";
import PrimaryButton from "common/PrimaryButton";

export const getHeader = (pfFundReportApi: any, isHidden: boolean, setFundReportView?:any) =>
  [
    {
      title: "SL",
      render: (value: any, row: any, index: number) =>
        getSerial({
          currentPage: pfFundReportApi?.data?.currentPage,
          pageSize: pfFundReportApi?.data?.pageSize,
          index,
        }),

      align: "center",
      width: 20,
    },
    {
      title: "Enroll ID",
      dataIndex: "employeeId",
      sorter: true,
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      sorter: true,
    },
    {
      title: "Code",
      dataIndex: "employeeCode",
      sorter: true,
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      sorter: true,
    },
    {
      title: "Designation",
      dataIndex: "designationName",
      sorter: true,
    },
    {
      title: "Type",
      dataIndex: "types",
      isHidden: isHidden,
      width:60,
    },
    {
      title: "Month",
      dataIndex: "month",
      isHidden: isHidden,
      width:40,
    },
    {
      title: "Year",
      dataIndex: "year",
      isHidden: isHidden,
      width:30,
    },
    {
      title: "Employee Amount",
      dataIndex: "employeeContributionAmount",
      align: "right",
      render: (data: any, record: any) =>
        formatMoney(record?.employeeContributionAmount),
    },
    {
      title: "Company Amount",
      dataIndex: "companyContributionAmount",
      align: "right",
      render: (data: any, record: any) =>
        formatMoney(record?.companyContributionAmount),
    },
    {
      title: "Employee Profit",
      dataIndex: "employeeProfit",
      align: "right",
      render: (data: any, record: any) =>
        formatMoney(record?.employeeProfit),
    },
    {
      title: "Company Profit",
      dataIndex: "companyProfit",
      align: "right",
      render: (data: any, record: any) =>
        formatMoney(record?.companyProfit),
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (data: any, record: any) =>
        // Write condition to check status
        record?.status ? (
          <PBadge type="success" text="Active" />
        ) : record?.status === false ? (
          <PBadge type="danger" text="Inactive" />
        ) : (
          "N/A"
        ),
      width: "50px",
    },
    {
      title: "Action",
      dataIndex: "action",
      sort: false,
      filter: false,
      width: 40,
      className: "text-center",
      render: () => (
        <PrimaryButton
          icon={""}
          type="button"
          className="btn btn-default mr-1"
          label="Details"
          customStyle={{ padding: "5px 10px" }}
          onClick={() => {
            setFundReportView && setFundReportView(true)
          }}
        />
      ),
      isHidden: !isHidden,
    },
  ].filter((item) => !item?.isHidden);
