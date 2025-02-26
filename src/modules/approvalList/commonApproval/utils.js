import { Attachment, InfoOutlined } from "@mui/icons-material";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import { dateFormatter } from "utility/dateFormatter";
import { EyeOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Chips from "common/Chips";
import { LightTooltip } from "common/LightTooltip";
import { Tooltip } from "antd";
import { formatTime12Hour } from "utility/formatTime12Hour";

export const columnsDefault = [
  {
    title: "SL",
    align: "center",
    render: (_, __, index) => index + 1, // Automatically adding a serial number
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

export const columnsLeave = (dispatch) => [
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
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
  },
  {
    title: "Leave Type",
    dataIndex: ["applicationInformation", "leaveType"],
    render: (text, record) => (
      <>
        {text}{" "}
        <Tooltip title={`Reason: ${record?.applicationInformation?.strRemarks}`} arrow>
          <InfoCircleOutlined style={{ color: "green", cursor: "pointer" }} />
        </Tooltip>
      </>
    ),
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
    title: "Attachment",
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
    title: "Total Days",
    dataIndex: ["applicationInformation", "totalDays"],
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

export const columnOvertime = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1,
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
    title: "Employee ID",
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
    title: "Employee ID",
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
  /**
   * 
numIncrementAmount
: 
0
numIncrementPercentage
: 
0
   */
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

export const columnsManual = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1,
  },
  {
    title: "Employee Name",
    dataIndex: ["applicationInformation", "employeeName"],
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
    dataIndex: ["applicationInformation", "tmeStartTime"],
    render: (time) => (
      <div>{time ? new Date(time).toLocaleTimeString() : "-"}</div>
    ),
  },
  {
    title: "Actual Out-Time",
    dataIndex: ["applicationInformation", "tmeEndTime"],
    render: (time) => (
      <div>{time ? new Date(time).toLocaleTimeString() : "-"}</div>
    ),
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
        <LightTooltip
          style={{ fontSize: "14px" }}
          title={
            <div className="movement-tooltip p-1">
              <div className="">
                <p className="tooltip-title">Reason</p>
                <p className="tooltip-subTitle mb-0">{record?.reason}</p>
              </div>
            </div>
          }
          arrow
        >
          <InfoOutlined sx={{ marginRight: "12px" }} />
        </LightTooltip>
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

export const columnsMovement = [
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
    title: "Movement Type",
    dataIndex: ["applicationInformation", "leaveType"],
    render: (text, record) => (
      <>
        {text}{" "}
        <Tooltip title={`Reason: ${record?.applicationInformation?.strRemarks}`} arrow>
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
    title: "Remarks",
    dataIndex: ["applicationInformation", "remarks"],
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
    render: (date) => (
      <div>{date ? new Date(date).toLocaleDateString() : "N/A"}</div>
    ),
  },
  {
    title: "Last Working Date",
    width: "90px",
    dataIndex: ["applicationInformation", "lastWorkingDate"],
    render: (date) => (
      <div>{date ? new Date(date).toLocaleDateString() : "N/A"}</div>
    ),
  },
  {
    title: "Effective Date",
    width: "90px",
    dataIndex: ["applicationInformation", "lastWorkingDate"],
    render: (date) => (
      <div>{date ? new Date(date).toLocaleDateString() : "N/A"}</div>
    ),
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
            console.log("render", render);
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
  },
  {
    title: "Start Time",
    dataIndex: ["applicationInformation", "startTime"],
    render: (time) => {
      if (!time) return "N/A";

      const dateObj = new Date(`1970-01-01T${time}Z`);
      const formattedTime = dateObj.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return formattedTime;
    },
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
  },
  {
    title: "Location Or Device",
    dataIndex: ["applicationInformation", "isLocationRegister"],
    render: (isLocationRegister) => (
      <div>{isLocationRegister ? "Location" : "Device"}</div>
    ),
  },
  {
    title: "Longitude",
    dataIndex: ["applicationInformation", "strLongitude"],
  },
  {
    title: "Latitude",
    dataIndex: ["applicationInformation", "strLatitude"],
  },
  {
    title: "Place Name",
    dataIndex: ["applicationInformation", "strPlaceName"],
  },
  {
    title: "Address",
    dataIndex: ["applicationInformation", "strAddress"],
  },
  {
    title: "Device ID",
    dataIndex: ["applicationInformation", "strDeviceId"],
  },
  {
    title: "Device Name",
    dataIndex: ["applicationInformation", "strDeviceName"],
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
    title: "Bonus Name",
    dataIndex: ["applicationInformation", "strBonusName"],
    render: (bonusName) => bonusName || "N/A",
  },
  {
    title: "Bonus Amount",
    dataIndex: ["applicationInformation", "numBonusAmount"],
    render: (amount) => (amount ? `৳${amount.toLocaleString()}` : "N/A"),
  },
  {
    title: "Effective Date",
    dataIndex: ["applicationInformation", "dteEffectiveDate"],
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

export const columnsIOUAdjustment = [
  {
    title: "SL",
    align: "center",
    width: "30px",
    render: (_, __, index) => index + 1, // Serial number
  },
  {
    title: "Code",
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
