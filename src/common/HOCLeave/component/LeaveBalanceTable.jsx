import moment from "moment";
import React, { useEffect, useState } from "react";

const LeaveBalanceTable = ({ leaveBalanceData = [], show = false }) => {
  let leaves = leaveBalanceData;
  if (show) {
    leaves = leaveBalanceData?.filter(
      (item) => item?.isLveBalanceShowForSelfService
    );
  }

  return (
    <div className="card-style" style={{ minHeight: "213px" }}>
      <div className="table-card-styled tableOne">
        <table className="table">
          <thead>
            <tr
              style={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
              }}
            >
              <th>Leave Type</th>
              <th className="text-center">Balance</th>
              <th className="text-center">Taken</th>
              <th className="text-center">Total</th>
              <th className="text-center">Carry Balance</th>
              <th className="text-center">Carry Taken</th>
              <th className="text-center">Carry Allocated</th>
              <th className="text-center">Carry Expire</th>
            </tr>
          </thead>
          <tbody>
            {leaves?.length > 0 &&
              leaves.map((item) => (
                <tr key={item?.strLeaveType}>
                  <td>{item?.strLeaveType}</td>
                  <td className="text-center">{item?.intBalanceLveInDay}</td>
                  <td className="text-center">{item?.intTakenLveInDay}</td>
                  <td className="text-center">{item?.intAllocatedLveInDay}</td>
                  <td className="text-center">
                    {item?.intCarryBalanceLveInDay}
                  </td>
                  <td className="text-center">{item?.inyCarryTakenLveInDay}</td>
                  <td className="text-center">
                    {item?.intCarryAllocatedLveInDay}
                  </td>
                  <td className="text-center">
                    {moment(item?.intExpireyDate).format("DD MMM, YYYY")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveBalanceTable;
