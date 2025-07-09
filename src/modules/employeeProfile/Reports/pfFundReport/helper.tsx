import { formatMoney } from "utility/formatMoney";
import { getSerial } from "Utils";
import PBadge from "Components/Badge";
import PrimaryButton from "common/PrimaryButton";

export const getHeader = (
  pfFundReportApi: any,
  isHidden: boolean,
  setFundReportView?: any
) =>
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
      width: 40,
    },
    {
      title: "Enroll ID",
      dataIndex: "employeeId",
      width: 80,
      align: "center",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      width: 100,
      align: "center",
    },
    {
      title: "Code",
      dataIndex: "employeeCode",
      width: 100,
      align: "center",
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      width: 100,
      align: "center",
    },
    {
      title: "Designation",
      dataIndex: "designationName",
      width: 100,
      align: "center",
    },
    // {
    //   title: "Type",
    //   dataIndex: "types",
    //   isHidden: isHidden,
    //   width: 60,
    // },
    {
      title: "Salary Code",
      dataIndex: "salaryCode",
      align: "center",
      isHidden: isHidden,
      width: 100,
      render: (data: any, record: any) => record?.salaryCode || "N/A",
    },
    {
      title: "Month",
      dataIndex: "month",
      isHidden: isHidden,
      align: "center",
      width: 50,
    },
    {
      title: "Year",
      dataIndex: "year",
      isHidden: isHidden,
      align: "center",
      width: 50,
    },
    {
      title: "Employee Contribution",
      dataIndex: "employeeContributionAmount",
      align: "center",
      width: 120,

      render: (data: any, record: any) =>
        formatMoney(record?.employeeContributionAmount),
    },
    {
      title: "Company Contribution",
      dataIndex: "companyContributionAmount",
      align: "center",
      width: 120,
      render: (data: any, record: any) =>
        formatMoney(record?.companyContributionAmount),
    },
    {
      title: "Employee Profit",
      dataIndex: "employeeProfit",
      align: "center",
      width: 100,

      render: (data: any, record: any) => formatMoney(record?.employeeProfit),
    },
    {
      title: "Company Profit",
      dataIndex: "companyProfit",
      align: "center",
      width: 100,

      render: (data: any, record: any) => formatMoney(record?.companyProfit),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      isHidden: isHidden,
      align: "center",
      width: 80,
      render: (data: any, record: any) => record?.totalAmount || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      isHidden: !isHidden,
      render: (data: any, record: any) =>
        // Write condition to check status
        record?.status ? (
          <PBadge type="success" text="Active" />
        ) : record?.status === false ? (
          <PBadge type="danger" text="Inactive" />
        ) : (
          "N/A"
        ),
      width: 60,
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      width: 70,
      className: "text-center",
      render: (value: any, rec: any) => (
        <PrimaryButton
          icon={""}
          type="button"
          className="btn btn-default mr-1"
          label="Details"
          customStyle={{ padding: "5px 10px" }}
          onClick={() => {
            setFundReportView && setFundReportView({ open: true, data: rec });
          }}
        />
      ),
      isHidden: !isHidden,
    },
  ].filter((item) => !item?.isHidden);
