import { DataTable } from "Components";
import moment from "moment";
import React, { forwardRef } from "react";

const LeaveBalanceData = forwardRef((props: any, ref: any) => {
  const leaveBalanceDto = props?.leaveBalanceDto;

  const header = [
    {
      title: "Leave Type",
      render: (_: any, record: any) => (
        <>
          <p>{record?.strLeaveType}</p>
        </>
      ),
      width: 80,
    },
    {
      title: "Balance",
      dataIndex: "intBalanceLveInDay",
      width: 45,
    },
    {
      title: "Taken",
      render: (data: any) => <p>{data}</p>,
      dataIndex: "intTakenLveInDay",
      width: 40,
    },
    {
      title: "Total",
      dataIndex: "intAllocatedLveInDay",
      width: 40,
    },
    {
      title: "Carry Balance",
      dataIndex: "intCarryBalanceLveInDay",
    },
    {
      title: "Carry Taken",
      dataIndex: "inyCarryTakenLveInDay",
    },
    {
      title: "Carry Allocated",
      dataIndex: "intCarryAllocatedLveInDay",
    },
    {
      title: "Carry Expire",
      render: (data: any) =>
        data?.intExpireyDate ? moment(data?.intExpireyDate).format("l") : "N/A",
    },
  ];
  return (
    <div ref={ref} style={{ fontSize: "12px" }}>
      <center>
        <h1 style={{ fontSize: "16px", marginBottom: "10px" }}>
          Leave Balance
        </h1>
      </center>
      <div>
        <DataTable
          header={header}
          nodataStyle={{ marginTop: "-35px", height: "175px" }}
          bordered
          data={leaveBalanceDto?.length > 0 ? leaveBalanceDto : []}
        />
      </div>
    </div>
  );
});

export default LeaveBalanceData;
