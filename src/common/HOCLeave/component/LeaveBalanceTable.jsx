import { DataTable, PCardBody, TableButton } from "Components";
import { InfoOutlined } from "@mui/icons-material";

import { LightTooltip } from "common/LightTooltip";
import moment from "moment";
import React, { useEffect, useState } from "react";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { failColor, gray900 } from "utility/customColor";
import ViewModal from "common/ViewModal";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Divider, Popover, Tag } from "antd";
import { getLeaveTypeData } from "../utils";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "common/loading/Loading";

const LeaveBalanceTable = ({
  leaveBalanceData = [],
  show = false,
  values,
  casualLvePunishment = [],
  medicalLvePunishment = [],
}) => {
  let leaves = leaveBalanceData;
  if (show) {
    leaves = leaveBalanceData?.filter(
      (item) => item?.isLveBalanceShowForSelfService
    );
  }

  // console.log("values", values);
  const {
    profileData: { buId },
    permissionList,
  } = useSelector((state) => state?.auth, shallowEqual);

  const [isView, setIsView] = useState(false);
  const [details, setDetails] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState(null);

  const toggleRowDetails = (key, details) => {
    if (selectedRowKey === key) {
      setSelectedRowKey(null); // Close if the same row is clicked
      setDetails([]);
    } else {
      setSelectedRowKey(key);
      setDetails([details]);
    }
  };
  const [singleObjList, getSingleObjDataAPI, , setSingleObjList] = useAxiosGet(
    {}
  );
  useEffect(() => {
    setSingleObjList({});
  }, [values?.year?.value, values?.employee?.value]);

  // 🔥🔥 leave balance table is also used in supervisor dashboard  and employee booklet. for any kind of change please consider that.

  const punishmentPopupContent = (leaveData) => {
    return (
      <div>
        <div>
          <Divider style={{ margin: "5px 0 0 0" }} />
          <div className="mt-2">
            <p className="fontWeight600">Leave Consumed</p>
            {/* Filter and map through the leaveData for Casual Leave */}
            {leaveData
              ?.filter((item) => item?.MonthNameFull === "Casual Leave")
              .map((item, index) => (
                <>
                  {item?.LeaveDay > 0 && (
                    <p key={index} className="pl-3">
                      {item?.MonthNameFull}:{" "}
                      <span className="fontWeight600">{item?.LeaveDay}</span>
                    </p>
                  )}
                </>
              ))}
          </div>

          <div className="mt-2">
            <p className="fontWeight600">Leave Punishment</p>
            {/* Filter and map through the leaveData for months other than Casual Leave */}
            {leaveData
              ?.filter((item) => item?.MonthNameFull !== "Casual Leave")
              .map((item, index) => (
                <>
                  {item?.LeaveDay > 0 && (
                    <p key={index} className="pl-3">
                      {item?.MonthNameFull}:{" "}
                      <span className="fontWeight600">{item?.LeaveDay}</span>
                    </p>
                  )}
                </>
              ))}
          </div>
        </div>
      </div>
    );
  };

  const header = [
    {
      title: "Leave Type",
      render: (_, record) => (
        <>
          <p>
            {record?.type}
            {record?.strLeaveType === "Compensatory Leave" &&
            record?.intAllocatedLveInDay > 0 ? (
              <span>
                <LightTooltip
                  title={"Leave History"}
                  arrow
                  onClick={() => {
                    // setSingleObjList({});
                    if (singleObjList?.compensatoryLeaveHistory?.length > 0) {
                      setIsView(true);
                    } else {
                      getSingleObjDataAPI(
                        `/LeaveMovement/CompensatoryLeaveHistory?yearId=${
                          values?.year || values?.year?.value
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
                      width: 16,
                      cursor: "pointer",
                    }}
                  />
                </LightTooltip>
              </span>
            ) : (
              ""
            )}
          </p>
        </>
      ),
      width: 80,
    },
    {
      title: "Remaining",
      dataIndex: "totalBalanceDays",
      width: 45,
    },
    {
      title: "Taken",
      render: (data, record) => (
        <>
          <p>
            {data}
            <Popover
              placement="bottom"
              content={punishmentPopupContent(leaveData)}
              onClick={() => {
                getLeaveTypeData(
                  "EmployeeLeavePunishmentData",
                  buId,
                  values?.employee?.value,
                  values?.year || moment().format("YYYY"),
                  setLoading,
                  record?.intLeaveTypeId || 0,
                  setLeaveData
                );
              }}
              trigger="click"
            >
              <InfoCircleOutlined
                style={{ color: failColor, marginLeft: "2px" }}
              />
            </Popover>
            {/* {show && record?.strLeaveType === "Casual Leave" && (
              <Popover
                placement="bottom"
                content={punishmentPopupContent(casualLvePunishment, "Casual")}
                trigger="hover"
              >
                <InfoCircleOutlined
                  style={{ color: failColor, marginLeft: "2px" }}
                />
              </Popover>
            )} */}
          </p>
        </>
      ),
      dataIndex: "totalTakenDays",
      width: 40,
    },

    {
      title: "Total",
      dataIndex: "totalAllocatedDays",
      width: 40,
    },
    {
      title: "Status",
      render: (_, rec) => {
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
      width: 35,
    },
    {
      width: 20,
      align: "center",
      render: (_, rec, idx) => (
        <>
          <TableButton
            buttonsList={[
              {
                type: "view",
                onClick: () => {
                  toggleRowDetails(idx, rec?.details);
                },
              },
            ]}
          />
          {selectedRowKey === idx && (
            <Popover
              placement="bottom"
              content={
                <div style={{ width: "570px" }}>
                  <DataTable header={detailsHeader} data={details} />
                </div>
              }
              open={selectedRowKey === idx}
              trigger="click"
              onOpenChange={(newOpen) => {
                if (!newOpen) {
                  setSelectedRowKey(null); // Close popover when clicking outside
                }
              }}
            />
          )}
        </>
      ),
    },
    // {
    //   title: "Carry Balance",
    //   dataIndex: "intCarryBalanceLveInDay",
    // },
    // {
    //   title: "Carry Taken",
    //   dataIndex: "inyCarryTakenLveInDay",
    // },
    // {
    //   title: "Carry Allocated",
    //   dataIndex: "intCarryAllocatedLveInDay",
    // },
    // {
    //   title: "Carry Expire",
    //   render: (data) =>
    //     data?.intExpireyDate ? moment(data?.intExpireyDate).format("l") : "N/A",
    // },
  ];
  // --
  const detailsHeader = [
    {
      title: "Taken",
      render: (data, record) => (
        <>
          <p>{data}</p>
        </>
      ),
      dataIndex: "takenDays",
      width: 47,
    },
    {
      title: "Balance",
      dataIndex: "balanceDays",
      width: 50,
    },

    {
      title: "Total",
      dataIndex: "totalAllocatedDays",
      width: 40,
    },

    {
      title: "Carry Taken",
      dataIndex: "carryTakenDays",
    },
    {
      title: "Carry Balance",
      dataIndex: "carryBalanceDays",
    },
    {
      title: "Carry Allocated",
      dataIndex: "carryTotalAllocatedDays",
    },
    {
      title: "Carry Expire",
      dataIndex: "carryExpiredDays",
    },
    {
      title: "Carry Expire",
      render: (data) => (data?.expireDate ? data?.expireDate : "N/A"),
    },
  ];
  return (
    <>
      {loading && <Loading />}
      <div>
        <PCardBody styles={{ minHeight: "240px" }}>
          <DataTable
            header={header}
            nodataStyle={{ marginTop: "-35px", height: "175px" }}
            // bordered
            data={leaves?.length > 0 ? leaves : []}
          />
        </PCardBody>

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
        {/* </div> */}
      </div>
    </>
  );
};

export default LeaveBalanceTable;
