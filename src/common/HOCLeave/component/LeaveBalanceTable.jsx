import { InfoOutlined } from "@mui/icons-material";
import { LightTooltip } from "common/LightTooltip";
import ViewModal from "common/ViewModal";
import Loading from "common/loading/Loading";
import moment from "moment";
import { useEffect, useState } from "react";
import { gray900 } from "utility/customColor";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const LeaveBalanceTable = ({
  leaveBalanceData = [],
  show = false,
  values = {},
}) => {
  let leaves = leaveBalanceData;
  if (show) {
    leaves = leaveBalanceData?.filter(
      (item) => item?.isLveBalanceShowForSelfService
    );
  }
  const [isView, setIsView] = useState(false);
  const [singleObjList, getSingleObjDataAPI, loading, setSingleObjList] =
    useAxiosGet({});
  useEffect(() => {
    setSingleObjList({});
  }, [values?.year?.value, values?.employee?.value]);
  return (
    <>
      <div className="card-style" style={{ minHeight: "213px" }}>
        {loading && <Loading />}
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
                        {item?.strLeaveType === "Compensatory Leave" &&
                        item?.intBalanceLveInDay > 0 ? (
                          <div>
                            <LightTooltip
                              title={"Leave History"}
                              arrow
                              onClick={() => {
                                // setSingleObjList({});
                                if (
                                  singleObjList?.compensatoryLeaveHistory
                                    ?.length > 0
                                ) {
                                  setIsView(true);
                                } else {
                                  getSingleObjDataAPI(
                                    `/LeaveMovement/CompensatoryLeaveHistory?yearId=${
                                      values?.year?.value
                                    }&empId=${values?.employee?.value || 0}`,
                                    (res) => {
                                      setIsView(true);
                                      setSingleObjList(res);
                                    }
                                  );
                                }
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
        onHide={() => {
          setIsView(false);
          // setSingleObjList({});
        }}
      >
        <div className="card-style" style={{ minHeight: "213px" }}>
          <div className="d-flex align-items-center justify-content-between px-3">
            <p>Leave Type: {singleObjList?.leaveTypeName}</p>
            <p>Balance: {singleObjList?.totalLeaveBalance}</p>
            <p>Taken: {singleObjList?.totalLeaveTaken}</p>
            <p className="mr-3">Total: {singleObjList?.totalLeaveAmount}</p>
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
