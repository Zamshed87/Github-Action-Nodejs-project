import React from "react";
import { DataTable } from "Components";
import { employmentHeader } from "../utils";

const EmploymentHistory = ({ employmentHistory, loading }) => {
  return (
    <div className="mt-3">
      <DataTable
        header={employmentHeader}
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
