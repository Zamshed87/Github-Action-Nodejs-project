import { Attachment, InfoOutlined } from "@mui/icons-material";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import { dateFormatter } from "utility/dateFormatter";
import { EyeOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Chips from "common/Chips";
import { LightTooltip } from "common/LightTooltip";
import { Button, Tooltip } from "antd";
import { formatTime12Hour } from "utility/formatTime12Hour";
import { gray900 } from "utility/customColor";
import { getMonthName } from "utility/monthUtility";
import { convertTo12HourFormat } from "utility/timeFormatter";
import React from "react";

export const columnsDefault = [
  {
    title: "SL",
    align: "center",
    render: (_, __, index) => index + 1, // Automatically adding a serial number
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Application Date",
    dataIndex: ["applicationInformation", "applicationDate"],
    render: (date) => <div>{new Date(date).toLocaleDateString()}</div>,
  },
  {
    title: "From Date",
    dataIndex: ["applicationInformation", "fromDate"],
    render: (date) => <div>{new Date(date).toLocaleDateString()}</div>,
  },
  {
    title: "To Date",
    dataIndex: ["applicationInformation", "toDate"],
    render: (date) => <div>{new Date(date).toLocaleDateString()}</div>,
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];

export const columnsAsset = [
  {
    title: "SL",
    align: "center",
    render: (_, __, index) => index + 1,
    width: "30px",
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Requisition Date",
    width: "90px",
    dataIndex: ["applicationInformation", "requisitionDate"],
    render: (date) => <div>{date ? dateFormatter(date) : "N/A"}</div>,
  },
  {
    title: "Qty",
    dataIndex: ["applicationInformation", "qty"],
    width: "25px",
  },
  {
    title: "Item Category",
    dataIndex: ["applicationInformation", "itemCategory"],
  },
  {
    title: "Item Name",
    dataIndex: ["applicationInformation", "itemName"],
  },
  {
    title: "Item Uom",
    dataIndex: ["applicationInformation", "itemUom"],
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
    width: "90px",
  },
  {
    title: "Status",
    width: "50px",
    dataIndex: ["applicationInformation", "status"],
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];

export const columnsAboutMe = (handleViewClick) => [
  {
    title: "SL",
    align: "center",
    render: (_, __, index) => index + 1,
    width: "30px",
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Created Date",
    width: "90px",
    dataIndex: "dteCreatedAt",
    render: (date) => <div>{date ? dateFormatter(date) : "N/A"}</div>,
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
    width: "90px",
  },
  {
    title: "Status",
    width: "50px",
    dataIndex: ["applicationInformation", "status"],
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
  {
    title: "Action",
    key: "action",
    width: 100,
    align: "center",
    render: (_, record) => {
      return (
        <Button type="dashed" cyan onClick={() => handleViewClick(record?.applicationInformation?.employeeId)}>
          View
        </Button>
      );
    },
  },
];

export const columnFinalSettlement = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1,
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
    filter: false,
    sorter: true,
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
    width: "90px",
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
    width: "70px",
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
    width: "70px",
  },
  {
    title: "Application Type",
    dataIndex: ["applicationType"],
    width: "90px",
  },
  {
    title: "Total Amount",
    dataIndex: ["applicationInformation", "numTotalAmount"],
    width: "90px",
  },

  {
    title: "Last Working Date",
    width: "90px",
    dataIndex: ["applicationInformation", "lastWorkingDate"],
    render: (date) => <div>{date ? dateFormatter(date) : "N/A"}</div>,
  },
  {
    title: "Effective Date",
    width: "90px",
    dataIndex: ["applicationInformation", "lastWorkingDate"],
    render: (date) => <div>{date ? dateFormatter(date) : "N/A"}</div>,
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
    width: "90px",
  },
  {
    title: "Status",
    width: "50px",
    dataIndex: ["applicationInformation", "status"],
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];

export const columnSalaryGenerate = [
  {
    title: "SL",
    align: "center",
    render: (_, __, index) => index + 1, // Automatically adding a serial number
  },
  {
    title: "Salary Code",
    dataIndex: ["applicationInformation", "salaryCode"],
  },
  {
    title: "Salary Type",
    dataIndex: ["applicationInformation", "salaryType"],
  },
  {
    title: "Workplace Group",
    dataIndex: ["applicationInformation", "workplaceGroupName"],
  },
  {
    title: "Net Payable Salary",
    dataIndex: ["applicationInformation", "netPayableSalary"],
  },
  {
    title: "Month",
    render: (_, record) => (
      <div className="d-flex align-items-center">
        <LightTooltip
          title={
            <div className="movement-tooltip p-1">
              <div className="border-bottom">
                <p
                  className="tooltip-title"
                  style={{ fontSize: "12px", fontWeight: "600" }}
                >
                  Reason
                </p>
                <p
                  className="tooltip-subTitle"
                  style={{ fontSize: "12px", fontWeight: "500" }}
                >
                  {record?.applicationInformation?.strRemarks}
                </p>
              </div>
            </div>
          }
          arrow
        >
          <InfoOutlined sx={{ color: gray900 }} />
        </LightTooltip>
        <div className="ml-2">
          {getMonthName(record?.applicationInformation?.monthId)},
          {record?.applicationInformation?.yearId}
        </div>
      </div>
    ),
    width: "60px",
  },
  {
    title: "From Date",
    dataIndex: ["applicationInformation", "fromDate"],
    render: (date) => <div>{dateFormatter(date)}</div>,
  },
  {
    title: "To Date",
    dataIndex: ["applicationInformation", "toDate"],
    render: (date) => <div>{dateFormatter(date)}</div>,
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];

export const columnsLeave = (dispatch) => [
  {
    title: "SL",
    align: "center",
    render: (_, __, index) => index + 1,
    width: "20px",
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Leave Type",
    dataIndex: ["applicationInformation", "leaveType"],
    render: (text, record) => (
      <>
        {text}{" "}
        <Tooltip
          title={`Reason: ${record?.applicationInformation?.strRemarks}`}
          arrow
        >
          <InfoCircleOutlined style={{ color: "green", cursor: "pointer" }} />
        </Tooltip>
      </>
    ),
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
    width: 70,
  },
  {
    title: "Consume Type",
    dataIndex: ["applicationInformation", "strConsumeType"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
    width: 70,
  },
  {
    title: "Application Date",
    dataIndex: ["applicationInformation", "applicationDate"],
    render: (date) => <div>{dateFormatter(date)}</div>,
  },
  {
    title: "Attachment",
    width: 70,

    dataIndex: "attachmentId",
    render: (_, record) => (
      <div className="leave-application-document ml-1">
        <span
          onClick={(e) => {
            e.stopPropagation();
            if (record?.applicationInformation?.attachmentId !== 0) {
              dispatch(
                getDownlloadFileView_Action(
                  record?.applicationInformation?.attachmentId
                )
              );
            }
          }}
        >
          {record?.applicationInformation?.attachmentId !== 0 && (
            <div style={{ color: "green", cursor: "pointer" }}>
              <Attachment /> attachment
            </div>
          )}
        </span>
      </div>
    ),
    filter: false,
    sorter: false,
  },
  {
    title: "From Date",
    dataIndex: ["applicationInformation", "fromDate"],
    render: (date) => <div>{dateFormatter(date)}</div>,
  },
  {
    title: "To Date",
    dataIndex: ["applicationInformation", "toDate"],
    render: (date) => <div>{dateFormatter(date)}</div>,
  },
  {
    title: "Start Time",
    dataIndex: ["applicationInformation", "startTime"],
    render: (startTime) => startTime && convertTo12HourFormat(startTime),
  },
  {
    title: "End Time",
    dataIndex: ["applicationInformation", "endTime"],
    render: (endTime) => endTime && convertTo12HourFormat(endTime),
  },
  {
    title: "Total Days",
    dataIndex: ["applicationInformation", "intTotalTakenDays"],
  },
  {
    title: "Reliver",
    dataIndex: ["applicationInformation", "strReliverName"],
    width: 70,
  },
  {
    title: "Address",
    dataIndex: ["applicationInformation", "address"],
    width: "60px",
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    width: "50px",
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];

export const columnOvertime = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1,
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Workplace Group",
    dataIndex: ["applicationInformation", "workplaceGroupName"],
  },
  {
    title: "Workplace",
    dataIndex: ["applicationInformation", "workplaceName"],
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Date",
    dataIndex: ["applicationInformation", "overTimeDate"],
    width: "50px",
    render: (date) => <div>{new Date(date).toLocaleDateString()}</div>,
  },
  {
    title: "Start Time",
    dataIndex: ["applicationInformation", "startTime"],
  },
  {
    title: "End Time",
    dataIndex: ["applicationInformation", "endTime"],
  },
  {
    title: "Hours",
    dataIndex: ["applicationInformation", "overTimeHour"],
  },
  {
    title: "OT Amount",
    dataIndex: ["applicationInformation", "overTimeAmount"],
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];

export const columnIncrement = [
  {
    title: "SL",
    align: "center",
    render: (_, __, index) => index + 1,
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Employee",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Application Date",
    dataIndex: ["applicationInformation", "applicationDate"],
    render: (date) => <div>{new Date(date).toLocaleDateString()}</div>,
  },
  {
    title: "Effective Date",
    dataIndex: ["applicationInformation", "dteEffectiveDate"],
    render: (date) => (
      <div>{date ? new Date(date).toLocaleDateString() : ""}</div>
    ),
  },
  {
    title: "Salary Type",
    dataIndex: ["applicationInformation", "salaryType"],
  },
  {
    title: "Slab Count",
    dataIndex: ["applicationInformation", "slabCount"],
  },
  {
    title: "Depend On",
    dataIndex: ["applicationInformation", "strDependOn"],
  },
  {
    title: "Amount",
    dataIndex: ["applicationInformation", "totalAmount"],
    render: (_, data) => (
      <div>
        {data
          ? `${data?.applicationInformation?.numIncrementAmount} (${data?.applicationInformation?.numIncrementPercentage}%)`
          : "0 (0%)"}
      </div>
    ),
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];

export const columnsManual = (page) => [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (text, record, index) =>
      (page?.pageNo - 1) * page?.pageSize + index + 1,
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Designation",
    width: "60px",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    width: "60px",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Attendance Date",
    dataIndex: ["applicationInformation", "dteAttendanceDate"],
    render: (date) => <div>{date ? dateFormatter(date) : "-"}</div>,
  },
  {
    title: "Actual In-Time",
    dataIndex: ["applicationInformation", "startTime"],
    render: (time) => <div>{time ? convertTo12HourFormat(time) : "-"}</div>,
  },
  {
    title: "Actual Out-Time",
    dataIndex: ["applicationInformation", "endTime"],
    render: (time) => <div>{time ? convertTo12HourFormat(time) : "-"}</div>,
  },

  {
    title: "Request In-Time",
    dataIndex: ["applicationInformation", "dteInDateTime"],
    render: (time) => (
      <div>{time ? new Date(time).toLocaleTimeString() : "-"}</div>
    ),
  },
  {
    title: "Request Out-Time",
    dataIndex: ["applicationInformation", "dteOutDateTime"],
    render: (time) => (
      <div>{time ? new Date(time).toLocaleTimeString() : "-"}</div>
    ),
  },
  {
    title: "Actual Status",
    dataIndex: ["applicationInformation", "strAttendanceStatus"],
    render: (status) => (
      <div
        style={{
          fontWeight: "bold",
        }}
      >
        {status === "Late" ? (
          <Chips label="Late" classess="warning" />
        ) : status === "Absent" ? (
          <Chips label="Absent" classess="danger" />
        ) : status === "Movement" ? (
          <Chips label="Movement" classess="movement" />
        ) : status === "Leave" ? (
          <Chips label="Leave" classess="indigo" />
        ) : status === "Offday" ? (
          <Chips label="Offday" classess="primary" />
        ) : status === "Holiday" ? (
          <Chips label="Holiday" classess="secondary" />
        ) : (
          ""
        )}
      </div>
    ),
  },
  {
    title: "Request Status",
    dataIndex: ["applicationInformation", "strRequestStatus"],
    width: "120px",
    render: (status, record) => (
      <div>
        <Tooltip
          title={`Reason: ${record?.applicationInformation?.strRemarks}`}
          arrow
        >
          <InfoCircleOutlined style={{ color: "green", cursor: "pointer" }} />
        </Tooltip>
        {status === "Present" && <Chips label="Present" classess="success" />}
        {status === "Late" && <Chips label="Late" classess="warning" />}
        {status === "Holiday" && <Chips label="Holiday" classess="secondary" />}
        {status === "Offday" && <Chips label="Offday" classess="primary" />}
        {status === "Leave" && <Chips label="Leave" classess="indigo" />}
        {status === "Movement" && (
          <Chips label="Movement" classess="movement" />
        )}
        {status === "Absent" && <Chips label="Absent" classess="danger" />}
        {status === "Changed In/Out Time" && (
          <Chips label="Changed In/Out Time" classess="success" />
        )}
      </div>
    ),
  },

  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
  },
  {
    title: "Status",
    width: "50px",
    dataIndex: ["applicationInformation", "status"],
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];

export const columnsMovement = (page) => [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (text, record, index) =>
      (page?.pageNo - 1) * page?.pageSize + index + 1,
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Movement Type",
    dataIndex: ["applicationInformation", "leaveType"],
    render: (text, record) => (
      <>
        {text}{" "}
        <Tooltip
          title={`Reason: ${record?.applicationInformation?.strRemarks}`}
          arrow
        >
          <InfoCircleOutlined style={{ color: "green", cursor: "pointer" }} />
        </Tooltip>
      </>
    ),
    width: "80px",
  },
  {
    title: "Application Date",
    dataIndex: ["applicationInformation", "applicationDate"],
    render: (date) => <div>{date ? dateFormatter(date) : "N/A"}</div>,
  },
  {
    title: "From Date",
    dataIndex: ["applicationInformation", "fromDate"],
    render: (date) => <div>{date ? dateFormatter(date) : "N/A"}</div>,
  },
  {
    title: "To Date",
    dataIndex: ["applicationInformation", "toDate"],
    width: "50px",
    render: (date) => <div>{date ? dateFormatter(date) : "N/A"}</div>,
  },
  {
    title: "Total Days",
    dataIndex: ["applicationInformation", "totalDays"],
  },
  {
    title: "Start Time",
    dataIndex: ["applicationInformation", "startTime"],
    render: (time) => formatTime12Hour(time),
  },
  {
    title: "End Time",
    dataIndex: ["applicationInformation", "endTime"],
    render: (time) => formatTime12Hour(time),
  },
  {
    title: "Address",
    dataIndex: ["applicationInformation", "address"],
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
  },
  {
    title: "Status",
    width: "50px",
    dataIndex: ["applicationInformation", "status"],
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];

export const columnsSeparation = (setViewData, setViewModal) => [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1,
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
    filter: false,
    sorter: true,
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
    width: "90px",
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
    width: "70px",
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
    width: "70px",
  },
  {
    title: "Application Type",
    dataIndex: ["applicationType"],
    width: "90px",
  },

  {
    title: "Separation Type",
    dataIndex: ["applicationInformation", "separationTypeName"],
    width: "90px",
  },
  {
    title: "Separation Date",
    dataIndex: ["applicationInformation", "separationDate"],
    width: "90px",
    render: (date) => <div>{date ? dateFormatter(date) : "N/A"}</div>,
  },
  {
    title: "Last Working Date",
    width: "90px",
    dataIndex: ["applicationInformation", "lastWorkingDate"],
    render: (date) => <div>{date ? dateFormatter(date) : "N/A"}</div>,
  },
  {
    title: "Effective Date",
    width: "90px",
    dataIndex: ["applicationInformation", "lastWorkingDate"],
    render: (date) => <div>{date ? dateFormatter(date) : "N/A"}</div>,
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
    width: "90px",
  },
  {
    title: "Status",
    width: "50px",
    dataIndex: ["applicationInformation", "status"],
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
    width: "50px",
    render: (_, render) => (
      <div>
        <EyeOutlined
          style={{ marginRight: 5 }}
          onClick={() => {
            setViewData(render?.applicationInformation);
            setViewModal(true);
          }}
        />
      </div>
    ),
  },
];

export const columnsAdvancedSalary = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1,
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Workplace Group",
    dataIndex: ["applicationInformation", "workplaceGroupName"],
  },
  {
    title: "Workplace",
    width: "100px",
    dataIndex: ["applicationInformation", "workplaceName"],
  },
  {
    title: "Application Type",
    dataIndex: ["applicationType"],
  },
  {
    title: "Advance Salary Code",
    dataIndex: ["applicationInformation", "advanceSalaryCode"],
  },

  {
    title: "From Date",
    dataIndex: ["applicationInformation", "fromDate"],
    render: (date) => (
      <div>{date ? new Date(date).toLocaleDateString() : "N/A"}</div>
    ),
  },
  {
    title: "To Date",
    dataIndex: ["applicationInformation", "toDate"],
    width: "50px",
    render: (date) => (
      <div>{date ? new Date(date).toLocaleDateString() : "N/A"}</div>
    ),
  },

  {
    title: "Total Amount",
    dataIndex: ["applicationInformation", "totalAmount"],
    render: (amount) => <div>{amount ? `${amount.toFixed(2)}` : "N/A"}</div>,
  },
  {
    title: "Payment Method",
    dataIndex: ["applicationInformation", "paymentMethod", "label"],
  },
  {
    title: "Advance Based On",
    dataIndex: ["applicationInformation", "advanceBasedOn", "label"],
  },
  {
    title: "Advance Percentage",
    dataIndex: ["applicationInformation", "advanceBasedOnPercentage"],
    render: (percentage) => <div>{percentage ? `${percentage}` : "N/A"}</div>,
  },
  {
    title: "Minimum Present Days",
    dataIndex: ["applicationInformation", "minimumPresentDays"],
    render: (days) => <div>{days || "N/A"}</div>,
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
  },
  {
    title: "Status",
    width: "50px",
    dataIndex: ["applicationInformation", "status"],
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];

export const columnsExpense = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1, // Automatically adding a serial number
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Application Date",
    dataIndex: ["applicationInformation", "applicationDate"],
    render: (date) => <div>{dateFormatter(date)}</div>,
  },
  {
    title: "From Date",
    dataIndex: ["applicationInformation", "fromDate"],
    render: (date) => <div>{dateFormatter(date)}</div>,
  },
  {
    title: "To Date",
    dataIndex: ["applicationInformation", "toDate"],
    render: (date) => <div>{dateFormatter(date)}</div>,
  },
  // {
  //   title: "Total Days",
  //   dataIndex: ["applicationInformation", "totalDays"],
  // },
  {
    title: "Remarks",
    dataIndex: ["applicationInformation", "reason"],
  },
  {
    title: "Expense Type",
    dataIndex: ["applicationInformation", "strExpenseType"],
  },
  {
    title: "Total Amount",
    dataIndex: ["applicationInformation", "numTotalAmount"],
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    width: "50px",
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];

export const columnsIOU = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1, // Serial number
  },
  {
    title: "Employee Name",
    width: "100px",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Application Type",
    dataIndex: "applicationType",
  },
  {
    title: "Application Date",
    dataIndex: ["applicationInformation", "applicationDate"],
    render: (date) => <div>{new Date(date).toLocaleDateString()}</div>,
  },
  {
    title: "From Date",
    dataIndex: ["applicationInformation", "fromDate"],
    render: (date) => <div>{new Date(date).toLocaleDateString()}</div>,
  },
  {
    title: "To Date",
    dataIndex: ["applicationInformation", "toDate"],
    render: (date) => <div>{new Date(date).toLocaleDateString()}</div>,
  },
  {
    title: "Total Days",
    dataIndex: ["applicationInformation", "totalDays"],
  },
  {
    title: "IOU Amount",
    dataIndex: ["applicationInformation", "numIouamount"],
  },
  {
    title: "Adjusted Amount",
    dataIndex: ["applicationInformation", "numAdjustedAmount"],
  },
  {
    title: "Payable Amount",
    dataIndex: ["applicationInformation", "numPayableAmount"],
  },
  {
    title: "Receivable Amount",
    dataIndex: ["applicationInformation", "numReceivableAmount"],
  },
  {
    title: "Remarks",
    dataIndex: ["applicationInformation", "remarks"],
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    width: "50px",
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];
export const columnsLoan = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1, // Serial number
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Application Type",
    dataIndex: "applicationType",
  },
  {
    title: "Application Date",
    dataIndex: ["applicationInformation", "applicationDate"],
    render: (date) => <div>{new Date(date).toLocaleDateString()}</div>,
  },
  {
    title: "Loan Type",
    dataIndex: ["applicationInformation", "strLoanType"],
  },
  {
    title: "Loan Amount",
    dataIndex: ["applicationInformation", "intLoanAmount"],
  },
  {
    title: "Installment Amount",
    dataIndex: ["applicationInformation", "intNumberOfInstallmentAmount"],
  },
  {
    title: "Effective Date",
    dataIndex: ["applicationInformation", "dteEffectiveDate"],
    render: (date) => <div>{new Date(date).toLocaleDateString()}</div>,
  },
  {
    title: "Total Amount",
    dataIndex: ["applicationInformation", "numTotalAmount"],
  },
  {
    title: "Remarks",
    dataIndex: ["applicationInformation", "remarks"],
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    width: "50px",
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];

export const columnsMarketVisit = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1, // Serial number
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Attendance Date",
    dataIndex: ["applicationInformation", "dteAttendanceDate"],
    render: (date) => <div>{new Date(date).toLocaleDateString()}</div>,
  },
  {
    title: "Start Time",
    dataIndex: ["applicationInformation", "startTime"],
  },
  {
    title: "Place Name",
    dataIndex: ["applicationInformation", "placeName"],
  },
  {
    title: "Address",
    dataIndex: ["applicationInformation", "address"],
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    width: "50px",
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];

export const columnsMasterLocation = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1, // Serial number
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Longitude",
    dataIndex: ["applicationInformation", "longitude"],
  },
  {
    title: "Latitude",
    dataIndex: ["applicationInformation", "latitude"],
  },
  {
    title: "Place Name",
    dataIndex: ["applicationInformation", "placeName"],
  },
  {
    title: "Address",
    dataIndex: ["applicationInformation", "address"],
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    width: "50px",
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];

export const columnsRemoteAttendance = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1, // Serial number
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Attendance Date",
    dataIndex: ["applicationInformation", "dteAttendanceDate"],
    render: (date) => <div>{dateFormatter(date)}</div>,
  },
  {
    title: "Start Time",
    dataIndex: ["applicationInformation", "startTime"],
    render: (time) => formatTime12Hour(time),
  },
  {
    title: "Place Name",
    dataIndex: ["applicationInformation", "placeName"],
  },
  {
    title: "Address",
    dataIndex: ["applicationInformation", "address"],
    width: "60px",
    render: (_, rec) => {
      const address = rec?.applicationInformation?.address || "";
      const addressParts = address.split(",").map((part) => part.trim());

      if (addressParts.length > 1) {
        return (
          <Tooltip title={address}>
            <span>{addressParts[0]}, ...</span>
          </Tooltip>
        );
      }
      return addressParts[0] || "N/A";
    },
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    width: "50px",
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];

export const columnsLocationDevice = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1, // Serial number
    fixed: "left",
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
    fixed: "left",
  },
  {
    title: "Location Or Device",
    dataIndex: ["applicationInformation", "isLocationRegister"],
    fixed: "left",
    render: (isLocationRegister) => (
      <div>{isLocationRegister ? "Location" : "Device"}</div>
    ),
  },
  {
    title: "Longitude",
    dataIndex: ["applicationInformation", "longitude"],
  },
  {
    title: "Latitude",
    dataIndex: ["applicationInformation", "latitude"],
  },
  {
    title: "Place Name",
    dataIndex: ["applicationInformation", "placeName"],
    render: (placeName) => {
      const placeNameParts = placeName?.split(" ");
      if (placeNameParts?.length > 2) {
        return (
          <Tooltip title={placeName}>
            <span>{placeNameParts[0]} ...</span>
          </Tooltip>
        );
      }
      return placeName;
    },
  },
  {
    title: "Address",
    dataIndex: ["applicationInformation", "address"],
    render: (address) => {
      const addressParts = address?.split(" ");
      if (addressParts?.length > 2) {
        return (
          <Tooltip title={address}>
            <span>{addressParts[0]} ...</span>
          </Tooltip>
        );
      }
      return address;
    },
  },
  {
    title: "Device ID",
    dataIndex: ["applicationInformation", "deviceId"],
    width: "50px",
  },
  {
    title: "Device Name",
    dataIndex: ["applicationInformation", "deviceName"],
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    width: "50px",
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];

export const columnsSalaryIncrement = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1, // Serial number
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Last Increment Date",
    dataIndex: ["applicationInformation", "lastIncrementDate"],
  },
  {
    title: "Last Increment Amount",
    dataIndex: ["applicationInformation", "lastIncrementAmount"],
  },
  {
    title: "Recent Gross Salary",
    dataIndex: ["applicationInformation", "recentGrossSalary"],
  },
  {
    title: "Increment Proposal Percentage",
    dataIndex: ["applicationInformation", "incrementProposalPercentage"],
  },
  {
    title: "Increment Proposal Amount",
    dataIndex: ["applicationInformation", "incrementProposalAmount"],
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    width: "50px",
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];
export const columnsSalaryCertificate = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1,
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Last Increment Date",
    dataIndex: ["applicationInformation", "lastIncrementDate"],
    render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
  },

  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
    render: (stage) => stage || "N/A",
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    width: "100px",
    render: (status) => (
      <div
        style={{
          color:
            status === "Approved"
              ? "green"
              : status === "Pending"
              ? "orange"
              : "red",
          fontWeight: "bold",
        }}
      >
        {status}
      </div>
    ),
  },
];

export const columnsBonusGenerate = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1, // Serial number
  },
  {
    title: "Workplace Group",
    dataIndex: ["applicationInformation", "workplaceGroupName"],
    render: (workplaceGroupName) => workplaceGroupName || "N/A",
  },
  {
    title: "Salary Code",
    dataIndex: ["applicationInformation", "salaryCode"],
    render: (salaryCode) => salaryCode || "N/A",
  },

  {
    title: "Bonus Name",
    dataIndex: ["applicationInformation", "bonusName"],
    render: (bonusName) => bonusName || "N/A",
  },
  {
    title: "Bonus Amount",
    dataIndex: ["applicationInformation", "bonusAmount"],
    render: (bonusAmount) =>
      bonusAmount ? `${bonusAmount.toLocaleString()}` : "N/A",
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
    render: (stage) => stage || "N/A",
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    width: "100px",
    render: (status) => (
      <div
        style={{
          color:
            status === "Approved"
              ? "green"
              : status === "Pending"
              ? "orange"
              : "red",
          fontWeight: "bold",
        }}
      >
        {status}
      </div>
    ),
  },
];

export const columnsIOUAdjustment = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1, // Serial number
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Employee",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Application Date",
    dataIndex: ["applicationInformation", "applicationDate"],
    render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
  },
  {
    title: "Date Range",
    render: (_, record) => {
      const fromDate = record?.applicationInformation?.fromDate
        ? new Date(record.applicationInformation.fromDate).toLocaleDateString()
        : "N/A";
      const toDate = record?.applicationInformation?.toDate
        ? new Date(record.applicationInformation.toDate).toLocaleDateString()
        : "N/A";
      return `${fromDate} - ${toDate}`;
    },
  },
  {
    title: "IOU Amount",
    dataIndex: ["applicationInformation", "numIouamount"],
    render: (amount) => (amount ? `৳${amount.toLocaleString()}` : "N/A"),
  },
  {
    title: "Total Adjusted",
    dataIndex: ["applicationInformation", "numAdjustedAmount"],
    render: (amount) => (amount ? `৳${amount.toLocaleString()}` : "N/A"),
  },
  {
    title: "Payable",
    dataIndex: ["applicationInformation", "numPayableAmount"],
    render: (amount) => (amount ? `৳${amount.toLocaleString()}` : "N/A"),
  },
  {
    title: "Receivable",
    dataIndex: ["applicationInformation", "numReceivableAmount"],
    render: (amount) => (amount ? `৳${amount.toLocaleString()}` : "N/A"),
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
    render: (stage) => stage || "N/A",
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    width: "100px",
    render: (status) => (
      <div
        style={{
          color:
            status === "Approved"
              ? "green"
              : status === "Pending"
              ? "orange"
              : "red",
          fontWeight: "bold",
        }}
      >
        {status}
      </div>
    ),
  },
];

export const columnsShiftChange = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1,
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Attendance Date",
    dataIndex: ["applicationInformation", "dteAttendanceDate"],
    render: (date) => (
      <div>{date ? new Date(date).toLocaleDateString() : "-"}</div>
    ),
  },
  {
    title: "Current Calendar",
    dataIndex: ["applicationInformation", "previousCalendarName"],
  },
  {
    title: "In Time",
    dataIndex: ["applicationInformation", "dteInDateTime"],
    render: (time) => (
      <div>{time ? new Date(time).toLocaleTimeString() : "-"}</div>
    ),
  },
  {
    title: "Out Time",
    dataIndex: ["applicationInformation", "dteOutDateTime"],
    render: (time) => (
      <div>{time ? new Date(time).toLocaleTimeString() : "-"}</div>
    ),
  },
  {
    title: "Attendance Status",
    dataIndex: ["applicationInformation", "strAttendanceStatus"],
    render: (strAttendanceStatus) => (
      <div
        style={{
          color: strAttendanceStatus === "Late" ? "red" : "green",
          fontWeight: "bold",
        }}
      >
        {strAttendanceStatus}
      </div>
    ),
  },
  {
    title: "Requested Calendar",
    dataIndex: ["applicationInformation", "calendarName"],
  },
  {
    title: "Remarks",
    dataIndex: ["applicationInformation", "remarks"],
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
    render: (stage) => stage || "N/A",
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    width: "100px",
    render: (status) => (
      <div
        style={{
          color:
            status === "Approved"
              ? "green"
              : status === "Pending"
              ? "orange"
              : "red",
          fontWeight: "bold",
        }}
      >
        {status}
      </div>
    ),
  },
];

export const columnDisbursment = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1,
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Application Date",
    dataIndex: ["applicationInformation", "applicationDate"],
    render: (date) => <div>{new Date(date).toLocaleDateString()}</div>,
  },
  {
    title: "Disbursement Date",
    dataIndex: ["applicationInformation", "disbursementDate"],
    render: (date) => <div>{new Date(date).toLocaleDateString()}</div>,
  },
  {
    title: "Disbursement Amount",
    dataIndex: ["applicationInformation", "disbursementAmount"],
  },
  {
    title: "Remarks",
    dataIndex: ["applicationInformation", "remarks"],
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    width: "50px",
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];

export const columnDeposit = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1,
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Application Date",
    dataIndex: ["applicationInformation", "applicationDate"],
    render: (date) => <div>{dateFormatter(date)}</div>,
  },
  {
    title: "Deposit Date",
    dataIndex: ["applicationInformation", "depositDate"],
    render: (date) => <div>{dateFormatter(date)}</div>,
  },
  {
    title: "Deposit Amount",
    dataIndex: ["applicationInformation", "depositsAmount"],
  },
  {
    title: "Deposit Type",
    dataIndex: ["applicationInformation", "depositsType"],
  },
  {
    title: "Remarks",
    dataIndex: ["applicationInformation", "remarks"],
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    width: "50px",
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];

export const columnAdditionDeduction = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1,
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Application Date",
    dataIndex: ["dteCreatedAt"],
    render: (date) => <div>{dateFormatter(date)}</div>,
  },

  {
    title: "Addition/Deduction Type",
    dataIndex: ["applicationInformation", "additionDeductionType"],
  },
  {
    title: "Amount",
    dataIndex: ["applicationInformation", "numTotalAmount"],
  },
  {
    title: "Remarks",
    dataIndex: ["applicationInformation", "remarks"],
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    width: "50px",
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];

export const columnTransferPromotion = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1,
  },
  {
    title: "Employee Code",
    dataIndex: ["applicationInformation", "employeeCode"],
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Designation",
    dataIndex: ["applicationInformation", "designation"],
  },
  {
    title: "Department",
    dataIndex: ["applicationInformation", "department"],
  },
  {
    title: "Application Date",
    dataIndex: ["applicationInformation", "applicationDate"],
    render: (date) => <div>{dateFormatter(date)}</div>,
  },
  // {
  //   title: "Transfer/Promotion Type",
  //   dataIndex: ["applicationInformation", "transferPromotionType"],
  // },
  // {
  //   title: "Effective Date",
  //   dataIndex: ["applicationInformation", "effectiveDate"],
  //   render: (date) => <div>{dateFormatter(date)}</div>,
  // },
  {
    title: "Remarks",
    dataIndex: ["applicationInformation", "remarks"],
  },
  {
    title: "Waiting Stage",
    dataIndex: ["applicationInformation", "waitingStage"],
  },
  {
    title: "Status",
    dataIndex: ["applicationInformation", "status"],
    width: "50px",
    render: (status) => (
      <div style={{ color: "orange", fontWeight: "bold" }}>{status}</div>
    ),
  },
];
