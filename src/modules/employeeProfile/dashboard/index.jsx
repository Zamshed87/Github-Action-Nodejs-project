import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatterForDashboard } from "../../../utility/dateFormatter";
import { getEmployeeDashboard } from "../../dashboard/helper";
import { getPolicyOnEmployeeInbox } from "../../policyUpload/helper";

import moment from "moment";
import docIcon from "../../../assets/images/docs.svg";
import imageFileIcon from "../../../assets/images/imageFileIcon.png";
import pdfIcon from "../../../assets/images/pdfIcon.svg";
import Chips from "../../../common/Chips";
import NoResult from "../../../common/NoResult";
import ViewModal from "../../../common/ViewModal";
import { getDownlloadFileView_Action } from "../../../commonRedux/auth/actions";
import {
  gray200,
  gray400,
  gray500,
  gray700,
} from "../../../utility/customColor";
import SingleNotice from "../../dashboard/dashboardModule/SingleNotice";
import EmployeeSelfCalender from "./components/EmployeeSelfCalendar";
import EmployeeSelfDashboardHeader from "./components/EmployeeSelfDashboardHeader";
import EmployeeSelfManagerList from "./components/EmployeeSelfManagerList";
import NoticeBoard from "./Noticeboard";
import "./style.css";
export default function SelfDashboard() {
  const dispatch = useDispatch();

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // current Yaer
  // let currentYear = new Date().getFullYear();

  const [employeeDashboard, setEmployeeDashboard] = useState("");
  const [show, setShow] = useState(false);
  const [allNoticeData, setAllNoticeData] = useState([]);
  const [singleNoticeData, setSingleNoticeData] = useState("");
  const [policyLanding, setPolicyLanding] = useState([]);
  useEffect(() => {
    getEmployeeDashboard(employeeId, buId, setEmployeeDashboard);
  }, [employeeId, buId]);

  useEffect(() => {
    getPolicyOnEmployeeInbox(employeeId, setPolicyLanding);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Dashboard";
  }, []);
  return (
    <>
      <div
        className="table-card employee-self-dashboard"
        style={{ paddingTop: "40px" }}
      >
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ marginBottom: "8px" }}
        >
          <div>
            <p
              style={{
                color: "#344054",
                fontWeight: 400,
                fontSize: "12px",
              }}
            >
              {dateFormatterForDashboard()}
            </p>
            <h4 className="employee-self-dashboard-employee-name">
              Hello {employeeDashboard?.employeeName}, Welcome Back !
            </h4>
          </div>
        </div>
        <div>
          <div className="row mx-0 w-100">
            <EmployeeSelfDashboardHeader
              calendarName={employeeDashboard?.calendarName}
              workingPeriod={employeeDashboard?.workingPeriod}
              calendarStartTime={employeeDashboard?.calendarStartTime}
              calendarEndTime={employeeDashboard?.calendarEndTime}
              serviceLength={employeeDashboard?.serviceLength}
              joiningDate={employeeDashboard?.joiningDate}
              confirmationDate={employeeDashboard?.confirmationDate}
            />
          </div>
          <div className="row mx-0" style={{ marginTop: "12px" }}>
            <div className="col-md-9 pl-0">
              <EmployeeSelfCalender employeeDashboard={employeeDashboard} />
            </div>
            <div className="col-md-3 px-0">
              <EmployeeSelfManagerList
                intLineManagerImageUrlId={
                  employeeDashboard?.intLineManagerImageUrlId
                }
                lineManager={employeeDashboard?.lineManager}
                intDottedSupervisorImageUrlId={
                  employeeDashboard?.intDottedSupervisorImageUrlId
                }
                dottedSupervisor={employeeDashboard?.dottedSupervisor}
                intSupervisorImageUrlId={
                  employeeDashboard?.intSupervisorImageUrlId
                }
                supervisor={employeeDashboard?.supervisor}
              />

              <div
                style={{
                  height: "60%",
                  paddingTop: "12px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    boxShadow: "0px 1px 4px 1px rgba(99, 115, 129, 0.3)",
                  }}
                >
                  <h2
                    className="w-100"
                    style={{
                      color: gray500,
                      fontSize: "1rem",
                      height: "15%",
                      padding: "12px 0 0 12px",
                    }}
                  >
                    Leave Balance
                  </h2>

                  <div style={{ height: "85%" }}>
                    <div className="tableOne h-100">
                      <table
                        className="table mh-100 mb-0"
                        style={{ borderBottom: "1px solid #F2F4F7" }}
                      >
                        <thead>
                          <tr>
                            <th style={{ borderTop: "none" }}>
                              <p style={{ color: gray400, paddingLeft: "8px" }}>
                                Type
                              </p>
                            </th>
                            <th style={{ borderTop: "none" }}>
                              <p
                                style={{ color: gray400, textAlign: "center" }}
                              >
                                Taken
                              </p>
                            </th>
                            <th style={{ borderTop: "none" }}>
                              <p
                                style={{ color: gray400, textAlign: "center" }}
                              >
                                Remaining
                              </p>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {employeeDashboard?.leaveBalanceHistoryList?.map(
                            (item) => (
                              <>
                                <tr key={item?.leaveBalanceId}>
                                  <td
                                    style={{ borderTop: "1px solid #F2F4F7" }}
                                  >
                                    <p
                                      style={{
                                        color: gray700,
                                        paddingLeft: "8px",
                                      }}
                                    >
                                      {item?.leaveType}
                                    </p>
                                  </td>
                                  <td
                                    style={{ borderTop: "1px solid #F2F4F7" }}
                                  >
                                    <p
                                      style={{
                                        textAlign: "center",
                                        color: gray700,
                                      }}
                                    >
                                      {item?.leaveTakenDays}
                                    </p>
                                  </td>
                                  <td
                                    style={{ borderTop: "1px solid #F2F4F7" }}
                                  >
                                    <p
                                      style={{
                                        textAlign: "center",
                                        color: gray700,
                                      }}
                                    >
                                      {item?.remainingDays}
                                    </p>
                                  </td>
                                </tr>
                              </>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="row mx-0 w-100"
            style={{ height: "350px", marginTop: "12px" }}
          >
            <div className="col-md-9 h-100 pl-0">
              <div className="row mx-0 w-100 h-100">
                <div className="col-md-8 h-100 pl-0">
                  <div
                    style={{
                      boxShadow: "0px 1px 4px 1px rgba(99, 115, 129, 0.3)",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        height: "10%",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <h2
                        style={{
                          width: "100%",
                          fontSize: "1rem",
                          color: gray500,
                          fontWeight: 600,
                          paddingLeft: "10px",
                        }}
                      >
                        My Applications
                      </h2>
                    </div>
                    <div className="tableOne" style={{ height: "90%" }}>
                      {employeeDashboard?.applicationPendingViewModels?.length <
                      1 ? (
                        <NoResult />
                      ) : (
                        <table className="table">
                          <thead>
                            <tr>
                              <th style={{ border: "none" }}>
                                <p className="pl-2">Type</p>
                              </th>
                              <th style={{ border: "none" }}>
                                <p>Application Date</p>
                              </th>
                              <th style={{ border: "none" }}>
                                <p className="text-center">Status</p>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {employeeDashboard?.applicationPendingViewModels?.map(
                              (item, index) => (
                                <tr key={index}>
                                  <td>
                                    <p
                                      className="pl-2"
                                      style={{ color: gray700 }}
                                    >
                                      {item?.applicationType}
                                    </p>
                                  </td>
                                  <td>
                                    <p style={{ color: gray700 }}>
                                      {moment(
                                        item?.applicationDate,
                                        "YYYY-MM-DDThh-mm-ss"
                                      ).format("DD MMM, YYYY")}
                                    </p>
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center">
                                      <Chips
                                        label={item?.approvalStatus}
                                        classess={
                                          item?.approvalStatus === "Approved"
                                            ? "success"
                                            : item?.approvalStatus === "Pending"
                                            ? "warning"
                                            : item?.approvalStatus ===
                                              "Rejected"
                                            ? "danger"
                                            : "primary"
                                        }
                                      />
                                    </div>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className="col-md-4 h-100 px-0"
                  style={{
                    boxShadow: "0px 1px 4px 1px rgba(99, 115, 129, 0.3)",
                    paddingLeft: "12px !important",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      placeItems: "center",
                      height: "10%",
                    }}
                  >
                    <h2
                      style={{
                        width: "100%",
                        fontSize: "1rem",
                        color: gray500,
                        fontWeight: 600,
                        paddingLeft: "12px",
                      }}
                    >
                      Company Policy
                    </h2>
                  </div>
                  <div
                    style={{
                      height: "90%",
                      overflowX: "hidden",
                      overflowY: "auto",
                    }}
                  >
                    {policyLanding.length < 1 ? (
                      <NoResult />
                    ) : (
                      <div className="h-100" style={{ paddingLeft: "12px" }}>
                        {policyLanding?.map((item) => (
                          <>
                            <div
                              className="d-flex align-items-center"
                              style={{ paddingBottom: "6px" }}
                              key={item?.policyId}
                            >
                              <div
                                className="pointer mr-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(
                                    getDownlloadFileView_Action(
                                      item?.policyFileUrlId
                                    )
                                  );
                                }}
                              >
                                <img
                                  style={{ width: "35px", height: "35px" }}
                                  src={getFileIcon(
                                    item?.policyFileName.split(".")[
                                      item?.policyFileName.split(".").length - 1
                                    ]
                                  )}
                                  alt=""
                                />
                              </div>
                              <div
                                className=""
                                style={{
                                  flex: 1,
                                  padding: "0 0 8px 0",
                                  borderBottom: `1px solid ${gray200}`,
                                }}
                              >
                                <p style={{ color: gray500 }}>
                                  {item?.policyTitle}
                                </p>
                                <p
                                  style={{
                                    color: "#1570EF",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item?.policyFileUrlId
                                      )
                                    );
                                  }}
                                >
                                  {item?.policyFileName}
                                </p>
                              </div>
                            </div>
                          </>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-md-3 pr-0 h-100"
              style={{ boxShadow: "0px 1px 4px 1px rgba(99, 115, 129, 0.3)" }}
            >
              <NoticeBoard
                allNoticeData={allNoticeData}
                setShow={setShow}
                setSingleNoticeData={setSingleNoticeData}
                employeeId={employeeId}
                orgId={orgId}
                buId={buId}
                setAllNoticeData={setAllNoticeData}
              />
            </div>
          </div>
        </div>
      </div>
      <ViewModal
        size="lg"
        title="Details Notice"
        backdrop="static"
        classes="default-modal preview-modal"
        show={show}
        onHide={() => {
          setShow(false);
          setSingleNoticeData("");
        }}
      >
        <SingleNotice setShow={setShow} singleNoticeData={singleNoticeData} />
      </ViewModal>
    </>
  );
}

const getFileIcon = (fileName) =>
  fileName === "pdf"
    ? pdfIcon
    : fileName === "doc" || fileName === "docx"
    ? docIcon
    : imageFileIcon;
