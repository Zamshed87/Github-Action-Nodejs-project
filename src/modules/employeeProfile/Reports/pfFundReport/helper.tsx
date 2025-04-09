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
      width: 100,
      isHidden: isHidden,
    },
    {
      title: "Employee Amount",
      dataIndex: "employeeContributionAmount",
      align: "right",
      render: (data: any, record: any) =>
        formatMoney(record?.employeeContributionAmount),
    },
    {
      title: "Employer Amount",
      dataIndex: "companyContributionAmount",
      align: "right",
      render: (data: any, record: any) =>
        formatMoney(record?.companyContributionAmount),
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
      width: 30,
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
