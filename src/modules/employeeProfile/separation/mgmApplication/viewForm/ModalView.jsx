import React, { useRef } from "react";
import { APIUrl } from "../../../../../App";
import { gray700 } from "../../../../../utility/customColor";
import profileImg from "../../../../../assets/images/profile.jpg";
import PBadge from "Components/Badge";
import { DataTable } from "Components";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import ReactToPrint from "react-to-print";
import { Button } from "@mui/material";
import { PrintOutlined } from "@mui/icons-material";

const ManagementSeparationApproverView = ({ empBasic }) => {
  const printRef = useRef();
  const [data, getData, loading] = useAxiosGet();
  // Table Header
  const header = [
    {
      title: "SL",
      render: (value, row, index) => index + 1,
      align: "center",
      width: 20,
    },
    {
      title: "Approve Dept.",
      dataIndex: "approveDept",
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      // render: (data, record) =>
      //   // Write condition to check status
      //   record?.status === "Pending" ? (
      //     <PBadge type="warning" text={record?.status} />
      //   ) : (
      //     <PBadge type="success" text={record?.status} />
      //   ),
      width: "50px",
    },
    {
      title: "Comments",
      dataIndex: "comments",
    },
  ];
  return (
    <>
      <div className="mb-2 d-flex justify-content-end">
        <ReactToPrint
          documentTitle={"Separation Approver View"}
          trigger={() => (
            <Button
              variant="outlined"
              sx={{
                borderColor: "rgba(0, 0, 0, 0.6)",
                color: "rgba(0, 0, 0, 0.6)",
                fontSize: "12px",
                fontWeight: "bold",
                letterSpacing: "1.15px",
                "&:hover": {
                  borderColor: "rgba(0, 0, 0, 0.6)",
                },
              }}
              startIcon={
                <PrintOutlined
                  sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                  className="emp-print-icon"
                />
              }
            >
              Print
            </Button>
          )}
          content={() => printRef.current}
          pageStyle={"@page { !important width: 100% } @media print {}"}
        />
      </div>
      <div ref={printRef}>
        <div className="card-about-info-main about-info-card">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex" style={{ maxWidth: "464px" }}>
              <div>
                <div
                  style={{
                    width: empBasic > 0 ? empBasic && "auto" : "36px",
                  }}
                  className={
                    empBasic > 0
                      ? empBasic && "add-image-about-info-card height-auto"
                      : "add-image-about-info-card"
                  }
                >
                  <label
                    htmlFor="contained-button-file"
                    className="label-add-image sm-size"
                  >
                    {empBasic?.empEmployeePhotoIdentity ? (
                      <img
                        src={`${APIUrl}/Document/DownloadFile?id=${empBasic?.empEmployeePhotoIdentity?.intProfilePicFileUrlId}`}
                        alt=""
                        style={{ maxHeight: "36px", minWidth: "36px" }}
                      />
                    ) : (
                      <img
                        src={profileImg}
                        alt="iBOS"
                        height="36px"
                        width="36px"
                        style={{ height: "inherit" }}
                      />
                    )}
                  </label>
                </div>
              </div>

              <div className="content-about-info-card ml-3">
                <div className="d-flex justify-content-between">
                  <h4
                    className="name-about-info"
                    style={{ marginBottom: "5px" }}
                  >
                    {empBasic?.employeeProfileLandingView?.strEmployeeName}
                    <span style={{ fontWeight: "400", color: gray700 }}>
                      [{empBasic?.employeeProfileLandingView?.strCardNumber}]
                    </span>{" "}
                  </h4>
                </div>
                <div className="employee-info-div" style={{ width: "550px" }}>
                  <div>
                    <div className="single-info">
                      <p
                        className="text-single-info"
                        style={{ fontWeight: "500", color: gray700 }}
                      >
                        <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                          Designation -
                        </small>{" "}
                        {empBasic?.employeeProfileLandingView?.strDesignation}
                      </p>
                    </div>
                    <div className="single-info">
                      <p
                        className="text-single-info"
                        style={{ fontWeight: "500", color: gray700 }}
                      >
                        <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                          Department -
                        </small>{" "}
                        {empBasic?.employeeProfileLandingView?.strDepartment}
                      </p>
                    </div>
                    <div className="single-info">
                      <p
                        className="text-single-info"
                        style={{ fontWeight: "500", color: gray700 }}
                      >
                        <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                          Joining Date -
                        </small>{" "}
                        {
                          empBasic?.employeeProfileLandingView
                            ?.strSupervisorName
                        }
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="single-info">
                      <p
                        className="text-single-info"
                        style={{ fontWeight: "500", color: gray700 }}
                      >
                        <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                          Business Unit -
                        </small>{" "}
                        {
                          empBasic?.employeeProfileLandingView
                            ?.strBusinessUnitName
                        }
                      </p>
                    </div>
                    <div className="single-info">
                      <p
                        className="text-single-info"
                        style={{ fontWeight: "500", color: gray700 }}
                      >
                        <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                          Workplace Group -
                        </small>{" "}
                        {
                          empBasic?.employeeProfileLandingView
                            ?.strWorkplaceGroupName
                        }
                      </p>
                    </div>
                    <div className="single-info">
                      <p
                        className="text-single-info"
                        style={{ fontWeight: "500", color: gray700 }}
                      >
                        <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                          Workplace -
                        </small>{" "}
                        {empBasic?.employeeProfileLandingView?.strWorkplaceName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <DataTable
            header={header}
            bordered
            data={data || []}
            loading={loading}
            scroll={{ x: 700 }}
            onChange={(pagination, filters, sorter, extra) => {
              if (extra.action === "sort") return;
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ManagementSeparationApproverView;
