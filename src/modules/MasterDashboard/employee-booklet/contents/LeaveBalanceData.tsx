import { Tag } from "antd";
import { DataTable } from "Components";
import React, { forwardRef } from "react";

const LeaveBalanceData = forwardRef((props: any, ref: any) => {
  const { balanceApi } = props;

  const header = [
    {
      title: "Leave Type",
      render: (_: any, record: any) => (
        <>
          <p>{record?.type}</p>
        </>
      ),
      width: 80,
    },
    {
      title: "Taken",
      render: (data: any, record: any) => (
        <>
          <p>{record?.details?.takenDays}</p>
        </>
      ),
      width: 47,
    },
    {
      title: "Balance",
      dataIndex: "balanceDays",
      render: (data: any, record: any) => (
        <>
          <p>{record?.details?.balanceDays}</p>
        </>
      ),
      width: 60,
    },

    {
      title: "Total",
      dataIndex: "totalAllocatedDays",
      render: (data: any, record: any) => (
        <>
          <p>{record?.details?.totalAllocatedDays}</p>
        </>
      ),
      width: 45,
    },

    {
      title: "Carry Taken",
      dataIndex: "carryTakenDays",
      render: (data: any, record: any) => (
        <>
          <p>{record?.details?.carryTakenDays}</p>
        </>
      ),
      width: 70,
    },
    {
      title: "Carry Balance",
      dataIndex: "carryBalanceDays",
      render: (data: any, record: any) => (
        <>
          <p>{record?.details?.carryBalanceDays}</p>
        </>
      ),
      width: 70,
    },
    {
      title: "Carry Allocated",
      dataIndex: "carryTotalAllocatedDays",
      render: (data: any, record: any) => (
        <>
          <p>{record?.details?.carryTotalAllocatedDays}</p>
        </>
      ),
      width: 70,
    },
    {
      title: "Carry Expire Balance",
      dataIndex: "carryExpiredDays",
      render: (data: any, record: any) => (
        <>
          <p>{record?.details?.carryExpiredDays}</p>
        </>
      ),
      width: 70,
    },
    {
      title: "Carry Expire Date",
      render: (data: any, record: any) => (
        <>
          <p>{record?.details?.expireDate}</p>
        </>
      ),
      width: 70,
    },
    {
      title: "Status",
      render: (_: any, rec: any) => {
        return (
          <div>
            {rec?.status === "Active" ? (
              <Tag color="green">{rec?.status}</Tag>
            ) : rec?.status === "Inactive" ? (
              <Tag color="red">{rec?.status}</Tag>
            ) : rec?.status === "Salary Hold" ? (
              <Tag color="orange">{rec?.status}</Tag>
            ) : (
              <Tag color="gold">{rec?.status}</Tag>
            )}
          </div>
        );
      },
      width: 75,
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
          scroll={{ x: 2000 }}
          data={balanceApi?.data?.length > 0 ? balanceApi?.data : []}
        />
      </div>
    </div>
  );
});

export default LeaveBalanceData;
