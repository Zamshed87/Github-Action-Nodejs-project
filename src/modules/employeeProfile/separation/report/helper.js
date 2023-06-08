import AvatarComponent from "../../../../common/AvatarComponent";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { dateFormatter } from "../../../../utility/dateFormatter";
import Chips from "../../../../common/Chips";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff !important",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow:
      "0px 1px 5px rgba(0, 0, 0, 0.05), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 1px 5px rgba(0, 0, 0, 0.05)",
    fontSize: 11,
  },
}));

export const empSeparationCol = (pages) => {
  return [
    {
      title: "SL",
      render: (text, record, index) => {
        return (
          <span>
            {pages?.current === 1
              ? index + 1
              : (pages.current - 1) * pages?.pageSize + (index + 1)}
          </span>
        );
      },
      sorter: false,
      filter: false,
      className: "text-center",
      fixed: "left",
      width: 60,
    },
    {
      title: "Code",
      dataIndex: "EmployeeCode",
      sorter: true,
      filter: true,
      width: 100,
      fixed: "left",
    },
    {
      title: "Employee Name",
      dataIndex: "EmployeeName",
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.EmployeeName}
            />
            <span className="ml-2">{record?.EmployeeName}</span>
          </div>
        );
      },
      sorter: true,
      filter: true,
      fixed: "left",
      width: 250,
    },
    {
      title: "Designation",
      dataIndex: "DesignationName",
      sorter: true,
      filter: true,
      width: 200,
    },
    {
      title: "Department",
      dataIndex: "DepartmentName",
      sorter: true,
      filter: true,
      width: 200,
    },
    {
      title: "Separation Type",
      dataIndex: "SeparationTypeName",
      sorter: true,
      filter: true,
      width: 200,
      render: (_, item) => {
        return (
          <div className="d-flex align-items-center">
            <LightTooltip
              title={
                <div className="movement-tooltip p-2">
                  <div className="application-tooltip">
                    <h6>Employement Type</h6>
                    <h5 className="tableBody-title">{item?.EmployementType}</h5>
                  </div>
                  <div className="application-tooltip">{item?.Reason}</div>
                </div>
              }
              arrow
            >
              <InfoOutlinedIcon sx={{ fontSize: "1rem" }} />
            </LightTooltip>
            <span>{item?.SeparationTypeName}</span>
          </div>
        );
      },
    },
    {
      title: "Joining Date",
      dataIndex: "JoiningDate",
      isDate: true,
      width: 200,
    },
    {
      title: "Service Length",
      dataIndex: "ServiceLength",
      sorter: true,
      filter: true,
      width: 200,
    },
    {
      title: "Application Date",
      dataIndex: "InsertDate",
      isDate: true,
      render: (InsertDate) => dateFormatter(InsertDate),
      width: 200,
    },
    {
      title: "Adjusted Amount",
      dataIndex: "AdjustedAmount",
      isDate: true,
      render: (AdjustedAmount) => dateFormatter(AdjustedAmount),
      width: 200,
    },
    {
      title: "Status",
      dataIndex: "ApprovalStatus",
      sorter: true,
      filter: true,
      width: 200,
      render: (_, item) => {
        return (
          <div className="tableBody-title">
            {item?.ApprovalStatus === "Approve" && (
              <Chips label="Approved" classess="success" />
            )}
            {item?.ApprovalStatus === "Pending" && (
              <Chips label="Pending" classess=" warning" />
            )}
            {item?.ApprovalStatus === "Reject" && (
              <Chips label="Rejected" classess="danger" />
            )}
            {item?.ApprovalStatus === "Released" && (
              <>
                <Chips label="Released" classess=" p-2 mr-2" />
              </>
            )}
          </div>
        );
      },
    },
  ];
};
