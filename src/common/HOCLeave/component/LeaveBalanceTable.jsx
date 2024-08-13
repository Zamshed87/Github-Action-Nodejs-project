import { DataTable, PCardBody } from "Components";
import { InfoOutlined } from "@mui/icons-material";

import { LightTooltip } from "common/LightTooltip";
import moment from "moment";
import React, { useEffect, useState } from "react";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { failColor, gray900 } from "utility/customColor";
import ViewModal from "common/ViewModal";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Divider, Popover } from "antd";

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
  const [isView, setIsView] = useState(false);

  const [singleObjList, getSingleObjDataAPI, , setSingleObjList] = useAxiosGet(
    {}
  );
  useEffect(() => {
    setSingleObjList({});
  }, [values?.year?.value, values?.employee?.value]);

  const punishmentPopupContent = (LvePunishment, type) => {
    return (
      <div>
        <div>
          <p>
            <b>{type} leave taken details</b>
          </p>
          <Divider style={{ margin: "5px 0 0 0" }} />
          {LvePunishment?.map((item, index) => (
            <div className="mt-2" key={index}>
              <p className="fontWeight600">
                {item?.isFromApplication
                  ? "Leave Consumed"
                  : "Leave Punishment"}
              </p>
              <p className="pl-3">
                {item?.strMonth}:{" "}
                <span className="fontWeight600">{item?.intLeaveCount}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  console.log(show);
  const header = [
    {
      title: "Leave Type",
      render: (_, record) => (
        <>
          <p>
            {record?.strLeaveType}
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
      title: "Balance",
      dataIndex: "intBalanceLveInDay",
      width: 45,
    },
    {
      title: "Taken",
      render: (data, record) => (
        <>
          <p>
            {data}
            {show && record?.strLeaveType === "Sick Leave" && (
              <Popover
                placement="bottom"
                content={punishmentPopupContent(medicalLvePunishment, "Sick")}
                trigger="click"
              >
                <InfoCircleOutlined
                  style={{ color: failColor, marginLeft: "2px" }}
                />
              </Popover>
            )}
            {show && record?.strLeaveType === "Casual Leave" && (
              <Popover
                placement="bottom"
                content={punishmentPopupContent(casualLvePunishment, "Casual")}
                trigger="click"
              >
                <InfoCircleOutlined
                  style={{ color: failColor, marginLeft: "2px" }}
                />
              </Popover>
            )}
          </p>
        </>
      ),
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

      render: (data) =>
        data?.intExpireyDate ? moment(data?.intExpireyDate).format("l") : "N/A",
    },
  ];

  return (
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
  );
};

export default LeaveBalanceTable;
