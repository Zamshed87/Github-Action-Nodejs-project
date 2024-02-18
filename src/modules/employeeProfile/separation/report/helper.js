import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/styles";
import AvatarComponent from "../../../../common/AvatarComponent";
import Chips from "../../../../common/Chips";
import { dateFormatter } from "../../../../utility/dateFormatter";

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

export const empSeparationCol = (page, paginationSize) => {
  return [
    {
      title: "SL",
      render: (_, index) => (page - 1) * paginationSize + index + 1,
      sort: false,
      filter: false,
      className: "text-center",
      width: 60,
    },
    {
      title: "Work. Group/Location",
      dataIndex: "strWorkplaceGroupName",
      sort: true,
      filter: false,
      fieldType: "string",
      width: 200,
    },
    {
      title: "Workplace/Concern",
      dataIndex: "strWorkplaceName",
      sort: true,
      filter: false,
      fieldType: "string",
      width: 200,
    },
    {
      title: "Department",
      dataIndex: "strDepartment",
      sort: true,
      filter: false,
      width: 200,
      fieldType: "string",
    },
    {
      title: "Section",
      dataIndex: "strSectionName",
      sort: true,
      filter: false,
      width: 200,
      fieldType: "string",
    },
    {
      title: "Employee ID",
      dataIndex: "strEmployeeCode",
      sort: true,
      filter: false,
      fieldType: "string",
      width: 100,
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      render: (record) => {
        return (
          <div className="d-flex align-items-center">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={record?.strEmployeeName}
            />
            <span className="ml-2">{record?.strEmployeeName}</span>
          </div>
        );
      },
      sort: true,
      filter: false,
      fieldType: "string",
      width: 250,
    },
    {
      title: "Designation",
      dataIndex: "strDesignation",
      sort: true,
      filter: false,
      width: 200,
      fieldType: "string",
    },

    {
      title: "Separation Type",
      dataIndex: "strSeparationTypeName",
      sort: true,
      filter: false,
      width: 200,
      fieldType: "string",
      render: (item) => {
        return (
          <div className="d-flex align-items-center">
            <LightTooltip
              title={
                <div className="movement-tooltip p-2">
                  <div className="application-tooltip">
                    <h6>Employement Type</h6>
                    <h5 className="tableBody-title">
                      {item?.strEmploymentType}
                    </h5>
                  </div>
                  <div
                    className="application-tooltip"
                    dangerouslySetInnerHTML={{
                      __html: item?.strReason,
                    }}
                  />
                </div>
              }
              arrow
            >
              <InfoOutlinedIcon sx={{ fontSize: "1rem" }} />
            </LightTooltip>
            <span>{item?.strSeparationTypeName}</span>
          </div>
        );
      },
    },
    {
      title: "Joining Date",
      dataIndex: "dteJoiningDate",
      isDate: true,
      width: 200,
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "Separetion Date",
      dataIndex: "dteSeparationDate",
      render: (item) => dateFormatter(item?.dteSeparationDate),
      isDate: true,
      width: 200,
      sort: true,
      filter: false,
      fieldType: "date",
    },
    {
      title: "Service Length",
      dataIndex: "serviceLength",
      sort: true,
      filter: false,
      fieldType: "string",
      width: 200,
    },
    {
      title: "Application Date",
      dataIndex: "dteCreatedAt",
      render: (item) => dateFormatter(item?.dteCreatedAt),
      sort: true,
      filter: false,
      fieldType: "date",
      width: 200,
    },
    // {
    //   title: "Adjusted Amount",
    //   dataIndex: "intAdjustedAmount",
    //   render: (item) => dateFormatter(item?.intAdjustedAmount),
    //   width: 200,
    //   sort: true,
    //   filter: false,
    //   fieldType: "number",
    // },
    {
      title: "Status",
      dataIndex: "approvalStatus",
      sorter: true,
      filter: false,
      fieldType: "string",
      width: 200,
      render: (item) => {
        return (
          <div className="tableBody-title">
            {item?.approvalStatus === "Approve" && (
              <Chips label="Approved" classess="success" />
            )}
            {item?.approvalStatus === "Pending" && (
              <Chips label="Pending" classess=" warning" />
            )}
            {item?.approvalStatus === "Reject" && (
              <Chips label="Rejected" classess="danger" />
            )}
            {item?.approvalStatus === "Released" && (
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
