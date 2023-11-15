import React from "react";

const LeaveBalanceTable = ({ leaveBalanceData }) => {
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
            </tr>
          </thead>
          <tbody>
            {leaveBalanceData?.length > 0 &&
              leaveBalanceData.map((item) => (
                <tr key={item?.LeaveBalanceId}>
                  <td>{item?.LeaveType}</td>
                  <td className="text-center">{item?.RemainingDays}</td>
                  <td className="text-center">{item?.LeaveTakenDays}</td>
                  <td className="text-center">{item?.BalanceDays}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveBalanceTable;
