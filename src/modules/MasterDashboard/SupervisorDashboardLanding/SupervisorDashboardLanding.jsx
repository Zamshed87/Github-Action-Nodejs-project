import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, { useEffect } from "react";
// import { shallowEqual, useSelector } from "react-redux";
import demoUserIcon from "../../../assets/images/userIcon.svg";
import Chips from "../../../common/Chips";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import { useState } from "react";
import { attendanceDetailsReport } from "./helper";
import moment from "moment";
import { InfoOutlined } from "@mui/icons-material";
import EmpInOutModal from "./EmpInOutModal";
import ViewModal from "../../../common/ViewModal";
import { useHistory } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";

const SupervisorDashboardLanding = ({ loading, setLoading }) => {
  // const { employeeId, orgId } = useSelector(
  //   (state) => state?.auth?.profileData,
  //   shallowEqual
  // );

  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(moment());
  const [modalLoading, setModalLoading] = useState(false);
  const history = useHistory();

  // redux
  const { buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  function currMonthName() {
    return value.format("MMM");
  }

  function currMonth() {
    return value.format("MM");
  }

  function currYear() {
    return value.format("YYYY");
  }

  function prevMonth() {
    return value.clone().subtract(1, "month");
  }

  function nextMonth() {
    return value.clone().add(1, "month");
  }

  const [empData, setEmpData] = useState(null);
  const [empDetails, setEmpDetails] = useState(null);

  const getAttendanceData = (empId, setLoading, value) => {
    attendanceDetailsReport(
      empId,
      moment(value).startOf("month").format("YYYY-MM-DD"),
      moment(value).endOf("month").format("YYYY-MM-DD"),
      setEmpData,
      setLoading
    );
  };

  const [
    dashboardApplicationInfoReport,
    getDashboardApplicationInfoReport,
    loading1,
  ] = useAxiosGet();

  //getData
  const getData = () => {
    getDashboardApplicationInfoReport(`/Dashboard/MidLevelDashboard`);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const { midLevelDashboardViewModel } = dashboardApplicationInfoReport;

  return (
    <>
      {loading1 && <Loading />}
      <div className="managerDashboard shadow-card-container">
        <div
          className="activities-Summery-grid-Container mb-1"
          style={{ boxShadow: "0px 4px 10px #D0D5DD" }}
        >
          <div
            className="managerDashboard-Report-Card"
            style={{ borderTop: `3px solid #F79009` }}
          >
            <div className="inner">
              <div className="card-head">
                <h4>Today Attendance</h4>
                {/* <span>
                  <ActionMenu
                    color={"rgba(0, 0, 0, 0.6)"}
                    fontSize={"18px"}
                    options={[
                      {
                        value: 1,
                        label: "Remove",
                      },
                    ]}
                  />
                </span> */}
              </div>
              <div className="card-context">
                <div>
                  <h4>{midLevelDashboardViewModel?.todayPresent}</h4>
                  <span>Present</span>
                </div>
                <div>
                  <h4>{midLevelDashboardViewModel?.todayLate}</h4>
                  <span>Late</span>
                </div>
                <div>
                  <h4>{midLevelDashboardViewModel?.todayAbsent}</h4>
                  <span>Absent</span>
                </div>
              </div>
            </div>
            {/* <p
              className="viewBtn"
              onClick={() => window.open("/", "_blank").focus()}
            >
              View Details{" "}
              <span className="ml-2">
                <ArrowForwardIcon
                  sx={{
                    fontSize: "16px",
                  }}
                />
              </span>
            </p> */}
          </div>
          {/*  */}
          <div
            className="managerDashboard-Report-Card"
            style={{ borderTop: `3px solid #D444F1` }}
          >
            <div className="inner">
              <div className="card-head">
                <h4>Movement</h4>
                {/* <span>
                  <ActionMenu
                    color={"rgba(0, 0, 0, 0.6)"}
                    fontSize={"18px"}
                    options={[
                      {
                        value: 1,
                        label: "Remove",
                      },
                    ]}
                  />
                </span> */}
              </div>
              <div className="card-context">
                <div>
                  <h4>{midLevelDashboardViewModel?.todayMovement}</h4>
                  <span>Today</span>
                </div>
                <div>
                  <h4>{midLevelDashboardViewModel?.yesterdayMovement}</h4>
                  <span>Yesterday</span>
                </div>
                <div>
                  <h4>{midLevelDashboardViewModel?.tommorrowMovement}</h4>
                  <span>Tomorrow</span>
                </div>
              </div>
            </div>
            <p
              className="viewBtn"
              onClick={() =>
                window.open("/approval/movementApproval", "_blank").focus()
              }
            >
              View Details{" "}
              <span className="ml-2">
                <ArrowForwardIcon
                  sx={{
                    fontSize: "16px",
                  }}
                />
              </span>
            </p>
          </div>
          {/*  */}
          <div
            className="managerDashboard-Report-Card"
            style={{ borderTop: `3px solid #F63D68` }}
          >
            <div className="inner">
              <div className="card-head">
                <h4>Leave</h4>
                {/* <span>
                  <ActionMenu
                    color={"rgba(0, 0, 0, 0.6)"}
                    fontSize={"18px"}
                    options={[
                      {
                        value: 1,
                        label: "Remove",
                      },
                    ]}
                  />
                </span> */}
              </div>
              <div className="card-context">
                <div>
                  <h4>{midLevelDashboardViewModel?.todayLeave}</h4>
                  <span>Today</span>
                </div>
                <div>
                  <h4>{midLevelDashboardViewModel?.yesterdayLeave}</h4>
                  <span>Yesterday</span>
                </div>
                <div>
                  <h4>{midLevelDashboardViewModel?.tommorrowLeave}</h4>
                  <span>Tomorrow</span>
                </div>
              </div>
            </div>
            <p
              className="viewBtn"
              onClick={() =>
                window.open("/approval/leaveApproval", "_blank").focus()
              }
            >
              View Details{" "}
              <span className="ml-2">
                <ArrowForwardIcon
                  sx={{
                    fontSize: "16px",
                  }}
                />
              </span>
            </p>
          </div>
          {/*  */}

          <div
            className="managerDashboard-Report-Card"
            style={{ borderTop: `3px solid #34A853` }}
          >
            <div className="inner">
              <div className="card-head">
                <h4>Approval</h4>
                {/* <span>
                  <ActionMenu
                    color={"rgba(0, 0, 0, 0.6)"}
                    fontSize={"18px"}
                    options={[
                      {
                        value: 1,
                        label: "Remove",
                      },
                    ]}
                  />
                </span> */}
              </div>
              <div className="card-context">
                <div>
                  <h4>
                    {dashboardApplicationInfoReport?.pendingApprovalCount}
                  </h4>
                </div>
              </div>
            </div>
            <p
              className="viewBtn"
              onClick={() => window.open("/approval", "_blank").focus()}
            >
              View Details{" "}
              <span className="ml-2">
                <ArrowForwardIcon
                  sx={{
                    fontSize: "16px",
                  }}
                />
              </span>
            </p>
          </div>
          {/*  */}
        </div>
        <div
          className="myEmployeeContainer mb-5 px-3"
          style={{ boxShadow: "0px 4px 10px #D0D5DD" }}
        >
          <div className="emp-container-header d-flex align-items-center justify-content-between">
            <div className="pt-2">
              <h4
                style={{
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#667085",
                }}
              >
                My Employess
              </h4>
              <p>
                Today Status | Total Employee{" "}
                <span>
                  {
                    midLevelDashboardViewModel?.employeeAttandanceListViewModels
                      ?.length
                  }
                </span>
              </p>
            </div>
            <div>
              {/* <MasterFilter
                styles={{ marginRight: "0px" }}
                inputWidth="250px"
                width="250px"
                isHiddenFilter
                value={""}
                setValue={(value) => {}}
                cancelHandler={() => {}}
                handleClick={(e) => {}}
              /> */}
            </div>
          </div>
          {/* <div className="table-card-body mb-5"> */}
          <div
            style={{
              overflow: "auto",
              maxHeight: "320px",
            }}
            className="table-card-styled tableOne"
          >
            {midLevelDashboardViewModel?.employeeAttandanceListViewModels
              ?.length ? (
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: "30px" }}>
                      <div>SL</div>
                    </th>
                    <th>
                      <div>Employee</div>
                    </th>
                    <th>
                      <div>Designation</div>
                    </th>
                    <th>
                      <div>Department</div>
                    </th>
                    <th>
                      <div>In-time</div>
                    </th>
                    <th>
                      <div>Out-time</div>
                    </th>
                    <th>
                      <div className="d-flex justify-content-center">
                        <div className="sortable">
                          <span>Status</span>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                {midLevelDashboardViewModel?.employeeAttandanceListViewModels?.map(
                  (item, i) => (
                    <tbody key={i}>
                      <tr>
                        <td>{i + 1}</td>
                        <td
                          onClick={() =>
                            history.push({
                              pathname: `/profile/employee/${item?.employeeId}`,
                              state: { buId, wgId },
                            })
                          }
                        >
                          <div
                            className="d-flex justify-content-left align-items-center"
                            style={{ cursor: "pointer" }}
                          >
                            <div>
                              <img src={demoUserIcon} alt="" />
                            </div>
                            <div className="ml-2">
                              <h4
                                style={{
                                  fontWeight: 400,
                                  fontSize: "14px",
                                  color: "#344054",
                                  lineHeight: "18px",
                                }}
                              >
                                {item?.employeeName}{" "}
                                <span style={{ color: "#667085" }}>
                                  [{item?.employeeId}]
                                </span>
                                <InfoOutlined
                                  style={{ cursor: "pointer" }}
                                  className="ml-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEmpData(null);
                                    getAttendanceData(
                                      item?.employeeId,
                                      setLoading,
                                      `${currYear()}-${currMonth()}`
                                    );
                                    setEmpDetails(item);
                                    !empData && setAnchorEl(true);
                                  }}
                                />
                              </h4>
                            </div>
                          </div>
                        </td>
                        <td>{item?.designation}</td>
                        <td>{item?.departmant}</td>
                        <td>{item?.inTime ? item?.inTime : "N/A"}</td>
                        <td>{item?.outTime ? item?.outTime : "N/A"}</td>
                        <td className="text-center">
                          {item?.status === "Present" && (
                            <Chips label={item?.status} classess="success" />
                          )}
                          {item?.status === "Late" && (
                            <Chips label={item?.status} classess="warning" />
                          )}
                          {item?.status === "Absent" && (
                            <Chips label={item?.status} classess="danger" />
                          )}
                          {item?.status === "Movement" && (
                            <span
                              style={{
                                color: "#9F1AB1",
                                background: "#FBE8FF",
                                borderRadius: "99px",
                                padding: "1px 8px",
                                fontWeight: 600,
                              }}
                            >
                              Movement
                            </span>
                          )}
                          {item?.status === "Leave" && (
                            <span
                              style={{
                                color: "#6927DA",
                                background: "#ECE9FE",
                                borderRadius: "99px",
                                padding: "1px 8px",
                                fontWeight: 600,
                              }}
                            >
                              Leave
                            </span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  )
                )}
              </table>
            ) : (
              <NoResult />
            )}
          </div>
        </div>
        {/* </div> */}
      </div>

      {!loading && (
        <ViewModal
          size="lg"
          title="Employee Attendance Report"
          backdrop="static"
          classes="default-modal preview-modal"
          show={anchorEl}
          onHide={() => {
            setAnchorEl(false);
            setEmpData(null);
            setValue(moment());
          }}
        >
          <div>
            {modalLoading && <Loading />}
            <EmpInOutModal
              propsObj={{
                setEmpData,
                setValue,
                prevMonth,
                getAttendanceData,
                setModalLoading,
                currMonthName,
                currYear,
                nextMonth,
                empData,
                modalLoading,
                empDetails,
              }}
            />
          </div>
        </ViewModal>
      )}
    </>
  );
};

export default SupervisorDashboardLanding;
