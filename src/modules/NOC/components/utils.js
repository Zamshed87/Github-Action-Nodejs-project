import { Attachment, EditOutlined, Print } from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip } from "@mui/material";
import Chips from "common/Chips";
import { LightTooltip } from "common/LightTooltip";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import { gray900 } from "utility/customColor";
import { dateFormatter } from "utility/dateFormatter";
import { getPDFAction } from "utility/downloadFile";
import * as Yup from "yup";

export const initialValueForNOCApplication = {
  employee: "",
  nocType: "",
  fromDate: "",
  toDate: "",
  passportNumber: "",
  country: "",
  purpose: "",
};

export const validationSchemaForNOCApplication = Yup.object({
  employee: Yup.object()
    .shape({
      value: Yup.string().required("Employee is required"),
      label: Yup.string().required("Employee is required"),
    })
    .typeError("Employee is required"),
  nocType: Yup.object()
    .shape({
      value: Yup.string().required("Noc Type is required"),
      label: Yup.string().required("Noc Type is required"),
    })
    .typeError("Noc Type is required"),
  country: Yup.object()
    .shape({
      value: Yup.string().required("Country is required"),
      label: Yup.string().required("Country is required"),
    })
    .typeError("Country is required"),
  fromDate: Yup.string().required("From Date is required"),
  toDate: Yup.string().required("To Date is required"),
  passportNumber: Yup.string().required("Passport Number is required"),
  purpose: Yup.string().required("Purpose Number is required"),
});
export const NocLandingColumn = (
  history,
  pathurl,
  isManagement,
  setLoading,
  dispatch
) => {
  const approvedStatuses = ["approved", "approve", "Approved"];
  const rejectStatuses = ["Rejected", "rejected", "Reject", "reject"];
  return [
    {
      dataIndex: "SL",
      title: "SL",
      width: "30px",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Emp ID",
      dataIndex: "employeeId", // Updated to match response data
      sorter: true,
      width: "80px",
    },
    // {
    //   title: "Employee",
    //   dataIndex: "employeeName", // Updated for employee name
    //   render: (employeeName, record) => (
    //     <div className="d-flex align-items-center">
    //       <AvatarComponent
    //         classess=""
    //         letterCount={1}
    //         label={employeeName || record?.strEmployeeName || ""}
    //       />
    //       <span className="ml-2">{employeeName || record?.strEmployeeName || ""}</span>
    //     </div>
    //   ),
    //   filter: true,
    //   sorter: true,
    //   width: "200px",
    // },
    {
      title: "NOC Type",
      dataIndex: "nocType", // Updated to match response data
      width: "100px",
      sorter: true,
      filter: true,
      render: (nocType, record) => (
        <div className="d-flex align-items-center ">
          <span className="mr-3">{nocType || record?.strNocType}</span>
          <LightTooltip
            title={
              <div className="movement-tooltip p-2">
                <div className="border-bottom">
                  <p className="tooltip-title">Purpose</p>
                  <p className="tooltip-subTitle">{record?.purpose || record?.strPurposeName}</p>
                </div>
                <div>
                  {record?.strFileIds &&
                    record?.strFileIds?.split(",").map((fileId, idx) => (
                      <div className="d-flex align-items-center mt-2" key={fileId || idx}>
                        <div className="leave-application-document ml-1">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(getDownlloadFileView_Action(fileId));
                            }}
                            className="pointer"
                          >
                            {fileId !== 0 && <Attachment />} Attachment{" "}
                            {idx + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            }
            arrow
          >
            <InfoOutlinedIcon
              sx={{
                marginRight: "12px",
                color: "rgba(0, 0, 0, 0.6)",
                cursor: "pointer",
              }}
            />
          </LightTooltip>
        </div>
      ),
    },
    {
      title: "Country Name",
      dataIndex: "countryName", // Updated to match response data
      sorter: true,
      filter: true,
      width: "130px",
    },
    {
      title: "From Date",
      dataIndex: "fromDate", // Updated to match response data
      isDate: true,
      render: (fromDate) => {
        return (
          <span className="text-center">{dateFormatter(fromDate)}</span>
        );
      },
      sorter: true,
      width: "100px",
    },
    {
      title: "To Date",
      dataIndex: "toDate", // Updated to match response data
      isDate: true,
      render: (toDate) => {
        return <span className="text-center">{dateFormatter(toDate)}</span>;
      },
      sorter: true,
      width: "100px",
    },
    {
      title: "Status",
      dataIndex: "status", // Updated to match response data
      render: (status, record) => (
        <div className="d-flex justify-content-start">
          {approvedStatuses.some((s) =>
            (status || record?.strStatus || "").toLowerCase().includes(s)
          ) && <Chips label="Approved" classess="success p-2" />}

          {(status === "Pending" || record?.strStatus === "Pending") && (
            <>
              <Chips label="Pending" classess="warning p-2" />
              <Tooltip title="Edit" arrow>
                <button className="iconButton ml-2" type="button">
                  <EditOutlined
                    onClick={(e) => {
                      console.log("Edit Clicked", record);
                      e.stopPropagation();
                      history.push({
                        pathname: `${pathurl}/edit/${record?.id}`,
                        state: { isManagement },
                      });
                    }}
                  />
                </button>
              </Tooltip>
            </>
          )}

          {(status === "Process" || record?.strStatus === "Process") && (
            <Chips label="Process" classess="primary p-2" />
          )}

          {rejectStatuses.some((s) =>
            (status || record?.strStatus || "").toLowerCase().includes(s)
          ) && <Chips label="Rejected" classess="danger p-2 mr-2" />}

          {approvedStatuses.some((s) =>
            (status || record?.strStatus || "").toLowerCase().includes(s)
          ) && (
            <Tooltip title="Print" arrow>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  getPDFAction(
                    `/PdfAndExcelReport/NocApplicationPDF?nocApplicationId=${record?.id || record?.intNocApplicationId}`,
                    setLoading
                  );
                }}
              >
                <Print
                  style={{
                    fontSize: "24px",
                    marginLeft: "10px",
                    color: gray900,
                    cursor: "pointer",
                  }}
                />
              </div>
            </Tooltip>
          )}
        </div>
      ),
      width: "150px",
      className: "text-left",
    },
  ];
};

export const updateDataById = (res) => {
  const updateInitialValue = {
    employee: {
      value: res?.employeeId || res?.intEmployeeBasicInfoId || 0,
      label: res?.employeeName || "",
    },
    nocType: {
      value: 1,
      label: res?.nocType || "",
    },
    fromDate: res?.fromDate ? res?.fromDate.split("T")[0] : "",
    toDate: res?.toDate ? res?.toDate.split("T")[0] : "",
    passportNumber: res?.passportNumber || "",
    country: {
      value: res?.countryId || 0,
      label: res?.countryName || "",
    },
    purpose: res?.purpose || "",
  };
  return { updateInitialValue };
};
export const formatTimeTo12Hour = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${period}`;
};
