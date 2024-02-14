import { DataTable } from "Components";
import moment from "moment";
import React from "react";

const EmploymentHistory = ({ employmentHistory, loading }) => {
  const header = [
    {
      title: "SL",
      render: (value, row, index) => index + 1,
      align: "center",
      width: 20,
    },
    {
      title: "Workplace",
      dataIndex: "workPlace",
    },
    {
      title: "Employee Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Code",
      dataIndex: "code",
      width: "40px",
    },
    {
      title: "Department",
      dataIndex: "department",
    },
    {
      title: "Designation",
      dataIndex: "designation",
    },
    {
      title: "HR Position",
      dataIndex: "hrPosition",
    },
    {
      title: "Employment Type",
      dataIndex: "employmentType",
    },
    {
      title: "Effective Date",
      dataIndex: "effectiveDate",
      render: (data, record) =>
        record?.effectiveDate
          ? moment(record?.effectiveDate).format("DD-MM-YYYY")
          : "N/A",
    },
    {
      title: "Salary",
      dataIndex: "salaryAmount",
    },
  ];
  return (
    <div className="mt-3">
      <DataTable
        header={header}
        bordered
        data={employmentHistory || []}
        loading={loading}
        scroll={{ x: 700 }}
        onChange={(pagination, filters, sorter, extra) => {
          if (extra.action === "sort") return;
        }}
      />
    </div>
  );
};

export default EmploymentHistory;
