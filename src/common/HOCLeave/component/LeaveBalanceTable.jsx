import { DataTable, PCardBody, TableButton } from "Components";
import { InfoOutlined } from "@mui/icons-material";

import { LightTooltip } from "common/LightTooltip";
import React, { useEffect, useState } from "react";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { gray900 } from "utility/customColor";
import ViewModal from "common/ViewModal";
import { Popover, Tag } from "antd";
import Loading from "common/loading/Loading";
import moment from "moment";

const LeaveBalanceTable = ({
  leaveBalanceData = [],
  show = false,
  values,
  isHistory = false,
  casualLvePunishment = [],
  medicalLvePunishment = [],
}) => {
  let leaves = leaveBalanceData;
  if (show) {
    leaves = leaveBalanceData?.filter(
      (item) => item?.isLveBalanceShowForSelfService
    );
  }

  const [isView, setIsView] = useState(false);
  const [details, setDetails] = useState([]);
  const [punishData, setPunish] = useState([]);
  const [loading] = useState(false);
  const [selectedRowKey, setSelectedRowKey] = useState(null);

  const toggleRowDetails = (key, details, isPunish = false) => {
    if (selectedRowKey === key) {
      setSelectedRowKey(null); // Close if the same row is clicked
      setDetails([]);
      setPunish([]);
    } else {
      setSelectedRowKey(key);
      if (isPunish) {
        setPunish(details);
        setDetails([]);
      } else {
        setPunish([]);
        setDetails([details]);
      }
    }
  };
  const [singleObjList, getSingleObjDataAPI, , setSingleObjList] = useAxiosGet(
    {}
  );
  const [, getPunishmentData, loader] = useAxiosGet({});
  useEffect(() => {
    setSingleObjList({});
  }, [values?.year?.value, values?.employee?.value]);

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
      title: "Start Date",
      render: (_, record) => (
        <>
          <p>{record?.startDate}</p>
        </>
      ),
      width: 80,
      hidden: isHistory ? false : true,
    },
    {
      title: "End Date",
      render: (_, record) => (
        <>
          <p>{record?.endDate}</p>
        </>
      ),
      width: 80,
      hidden: isHistory ? false : true,
    },
    {
      title: "Taken",
      render: (data, record) => (
        <>
          <p>
            {data}
            {/* <Popover
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
            </Popover> */}
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
      title: "Balance",
      dataIndex: "totalBalanceDays",
      width: 45,
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
      width: isHistory ? 85 : 35,
    },
    {
      width: 30,
      align: "center",
      render: (_, rec, idx) => (
        <>
          <TableButton
            buttonsList={[
              {
                type: "view",
                onClick: () => {
                  toggleRowDetails(idx, rec?.details, false);
                },
              },
              {
                type: "punishment",
                parentStyle: { fontSize: "25px!important" },
                onClick: () => {
                  getPunishmentData(
                    `/LeaveBalance/EmployeeLeavePunishmentHistory?employeeId=${
                      values?.employee?.value
                    }&leaveTypeId=${rec?.leaveTypeId}&fromDate=${
                      isHistory
                        ? moment(rec?.startDate)?.format("YYYY-MM-DD")
                        : rec?.startDate
                    }&toDate=${
                      isHistory
                        ? moment(rec?.endDate)?.format("YYYY-MM-DD")
                        : rec?.endDate
                    }`,
                    (data) => {
                      if (data?.length > 0) {
                        toggleRowDetails(idx, data, true);
                      }
                    }
                  );
                },
              },
            ]}
          />
          {selectedRowKey === idx && details?.length > 0 && (
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
          {selectedRowKey === idx && punishData?.length > 0 && (
            <Popover
              placement="bottom"
              content={
                <div style={{ width: "570px" }}>
                  <DataTable header={punishHeader} data={punishData} />
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
      width: 60,
    },

    {
      title: "Total",
      dataIndex: "totalAllocatedDays",
      width: 45,
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
      title: "Carry Expire Balance",
      dataIndex: "carryExpiredDays",
    },
    {
      title: "Carry Expire Date",
      render: (data) => (data?.expireDate ? data?.expireDate : "N/A"),
    },
  ];
  const punishHeader = [
    {
      title: "Date",
      dataIndex: "date",
      width: 47,
    },
    {
      title: "Leave Days",
      dataIndex: "leaveDays",
      width: 60,
    },
    {
      title: "Carry Days",
      dataIndex: "carryDays",
      width: 60,
    },

    {
      title: "Application Date",
      dataIndex: "createdAt",
      width: 45,
    },

    {
      title: "Reference",
      dataIndex: "reference",
    },
  ];
  return (
    <>
      {(loading || loader) && <Loading />}
      <div>
        <PCardBody styles={{ minHeight: "240px" }}>
          <DataTable
            header={header.filter((item) => !item.hidden)}
            nodataStyle={{ marginTop: "-35px", height: "175px" }}
            // bordered
            data={leaves?.length > 0 ? leaves : []}
            // scroll={{ x: 1500 }}
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
