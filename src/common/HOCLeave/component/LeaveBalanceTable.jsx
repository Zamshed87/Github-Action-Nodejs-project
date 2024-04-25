import { InfoOutlined } from "@mui/icons-material";
import { LightTooltip } from "common/LightTooltip";
import ViewModal from "common/ViewModal";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { gray900 } from "utility/customColor";
import { dateFormatter } from "utility/dateFormatter";

const LeaveBalanceTable = ({ leaveBalanceData = [], show = false }) => {
  let leaves = leaveBalanceData;
  if (show) {
    leaves = leaveBalanceData?.filter(
      (item) => item?.isLveBalanceShowForSelfService
    );
  }
  const [isView, setIsView] = useState(false);
  const [singleObjList, setSingleObjList] = useState({
    leaveTypeName: "Compensatory Leave",
    totalLeaveBalance: 2,
    totalLeaveAmount: 8,
    totalLeaveTaken: 6,
    compensatoryLeaveHistory: [
      {
        dteAttendenceDate: "05 April, 2024",
        dteExpiryDate: "05 May, 2024",
        strReason: "Offday",
        strWorkingHour: "8 hr 0 min",
        lveTaken: 0,
        lveExpired: 0,
        lveAmount: 1,
      },
      {
        dteAttendenceDate: "16 February, 2024",
        dteExpiryDate: "17 March, 2024",
        strReason: "Offday",
        strWorkingHour: "8 hr 0 min",
        lveTaken: 0,
        lveExpired: 1,
        lveAmount: 1,
      },
      {
        dteAttendenceDate: "26 February, 2024",
        dteExpiryDate: "27 March, 2024",
        strReason: "Holiday",
        strWorkingHour: "8 hr 0 min",
        lveTaken: 0,
        lveExpired: 1,
        lveAmount: 1,
      },
      {
        dteAttendenceDate: "17 March, 2024",
        dteExpiryDate: "16 April, 2024",
        strReason: "Holiday",
        strWorkingHour: "8 hr 0 min",
        lveTaken: 0,
        lveExpired: 1,
        lveAmount: 1,
      },
      {
        dteAttendenceDate: "19 April, 2024",
        dteExpiryDate: "19 May, 2024",
        strReason: "Offday",
        strWorkingHour: "8 hr 0 min",
        lveTaken: 0,
        lveExpired: 0,
        lveAmount: 1,
      },
      {
        dteAttendenceDate: "19 January, 2024",
        dteExpiryDate: "18 February, 2024",
        strReason: "Offday",
        strWorkingHour: "8 hr 0 min",
        lveTaken: 0,
        lveExpired: 1,
        lveAmount: 1,
      },
      {
        dteAttendenceDate: "23 February, 2024",
        dteExpiryDate: "24 March, 2024",
        strReason: "Offday",
        strWorkingHour: "8 hr 0 min",
        lveTaken: 0,
        lveExpired: 1,
        lveAmount: 1,
      },
      {
        dteAttendenceDate: "02 February, 2024",
        dteExpiryDate: "03 March, 2024",
        strReason: "Offday",
        strWorkingHour: "8 hr 0 min",
        lveTaken: 0,
        lveExpired: 1,
        lveAmount: 1,
      },
    ],
  });
  return (
    <>
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
                    <td>
                      <div className="d-flex align-items-center">
                        <p>{item?.strLeaveType} </p>
                        {item?.strLeaveType === "Compensatory Leave" &&  item?.intBalanceLveInDay > 0 ? (
                          <div>
                            <LightTooltip
                              title={"Leave History"}
                              arrow
                              onClick={() => {
                                setIsView(true);
                              }}
                            >
                              {" "}
                              <InfoOutlined
                                sx={{
                                  color: gray900,
                                  cursor: "pointer",
                                }}
                              />
                            </LightTooltip>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </td>
                    <td className="text-center">{item?.intBalanceLveInDay}</td>
                    <td className="text-center">{item?.intTakenLveInDay}</td>
                    <td className="text-center">
                      {item?.intAllocatedLveInDay}
                    </td>
                    <td className="text-center">
                      {item?.intCarryBalanceLveInDay}
                    </td>
                    <td className="text-center">
                      {item?.inyCarryTakenLveInDay}
                    </td>
                    <td className="text-center">
                      {item?.intCarryAllocatedLveInDay}
                    </td>
                    <td className="text-center">
                      {item?.intExpireyDate
                        ? moment(item?.intExpireyDate).format("DD MMM, YYYY")
                        : "N/A"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <ViewModal
        size="lg"
        title="Compensatory Leave History"
        backdrop="static"
        classes="default-modal preview-modal"
        show={isView}
        onHide={() => setIsView(false)}
      >
        <div className="card-style" style={{ minHeight: "213px" }}>
          <div className="d-flex align-items-center justify-content-between px-3">
            <p>Leave Type: {singleObjList?.strLeaveType}</p>
            <p>Balance: {singleObjList?.intBalanceLveInDay}</p>
            <p>Taken: {singleObjList?.intTakenLveInDay}</p>
            <p className="mr-3">Total: {singleObjList?.intAllocatedLveInDay}</p>
          </div>
          <div className="table-card-styled tableOne">
            <table className="table">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                  }}
                >
                  <th>Attendance Date</th>
                  <th className="text-center">Expiry Date</th>
                  <th className="text-center">Reason</th>
                  <th className="text-center">Working Hours</th>
                  <th className="text-center">Taken</th>
                  <th className="text-center">Expired</th>
                  <th className="text-center">Amount</th>
                </tr>
              </thead>
              <tbody>
                {singleObjList?.compensatoryLeaveHistory?.length > 0 &&
                  singleObjList?.compensatoryLeaveHistory?.map((item) => (
                    <tr key={item?.dteAttendenceDate}>
                      <td>{item?.dteAttendenceDate}</td>
                      <td className="text-center">{item?.dteExpiryDate}</td>
                      <td className="text-center">{item?.strReason}</td>
                      <td className="text-center">{item?.strWorkingHour}</td>
                      <td className="text-center">{item?.lveTaken}</td>
                      <td className="text-center">{item?.lveExpired}</td>
                      <td className="text-center">{item?.lveAmount}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </ViewModal>
    </>
  );
};

export default LeaveBalanceTable;
