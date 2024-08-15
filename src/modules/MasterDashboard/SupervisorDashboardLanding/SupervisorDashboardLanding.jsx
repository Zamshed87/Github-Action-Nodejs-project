import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, { useEffect } from "react";
// import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import { useState } from "react";
import {
  attendanceDetailsReport,
  attendanceLogColumns,
  supervisorLandingColumn,
} from "./helper";
import moment from "moment";
import EmpInOutModal from "./EmpInOutModal";
import ViewModal from "../../../common/ViewModal";
import { useHistory } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { DataTable, PForm, PInput } from "Components";
import LeaveBalanceTable from "common/HOCLeave/component/LeaveBalanceTable";
import { useApiRequest } from "Hooks";
import { Form } from "antd";
import useDebounce from "utility/customHooks/useDebounce";
import MasterFilter from "common/MasterFilter";
import { todayDate } from "utility/todayDate";
import { paginationSize } from "common/AntTable";

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

  // leave balance modal states
  const [open, setOpen] = useState(false);
  const [leaveBalanceData, setLeaveBalanceData] = useState([]);

  const getAttendanceData = (empId, setLoading, value) => {
    attendanceDetailsReport(
      empId,
      moment(value).startOf("month").format("YYYY-MM-DD"),
      moment(value).endOf("month").format("YYYY-MM-DD"),
      setEmpData,
      setLoading
    );
  };

  const debounce = useDebounce();
  const DashboardLanding = useApiRequest({});
  const AttendanceLog = useApiRequest({});
  const [filterList, setFilterList] = useState({});
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  const [isAttLogOpen, setIsAttLogOpen] = useState(false);

  // Form Instance
  const [form] = Form.useForm();

  //getData
  const getData = (
    pagination = { pageSize: 25, current: 1 },
    filter,
    searchText = form.getFieldValue("searchString"),
    attDate = moment(form.getFieldValue("attDate")).format("YYYY-MM-DD")
  ) => {
    const payload = {
      attendanceDate: attDate,
      pageNo: pagination?.current || 1,
      pageSize: pagination?.pageSize || 25,
      isHeaderNeed: true,
      searchTxt: searchText || "",
      departmentList: filter?.departmant || [],
      designationList: filter?.designation || [],
      sectionList: filter?.sectionName || [],
    };
    DashboardLanding.action({
      urlKey: "SupervirorDashboardLanding",
      method: "POST",
      payload: payload,
    });
  };

  const getAttendanceLog = (empId) => {
    setIsAttLogOpen(true);
    const values = form.getFieldsValue(true);
    AttendanceLog.action({
      urlKey: "AttendanceLogLanding",
      method: "GET",
      params: {
        employeeId: empId,
        fromDate: moment(values?.attDate).format("YYYY-MM-DD"),
        toDate: moment(values?.attDate).format("YYYY-MM-DD"),
        workplaceGroupId: wgId,
        businessUnitId: buId,
      },
    });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const { midLevelDashboardViewModel } = DashboardLanding?.data;
  const employeeAttandanceListViewModels =
    midLevelDashboardViewModel?.employeeAttandanceListViewModels;

  const isToday = () => {
    if (
      moment(todayDate()).format("DD-MM-YYYY") ===
      moment(form.getFieldValue("attDate")).format("DD-MM-YYYY")
    ) {
      return "Today";
    } else {
      return moment(form.getFieldValue("attDate")).format("DD MMM, YYYY");
    }
  };

  return (
    <>
      {(AttendanceLog?.loading || DashboardLanding.loading || loading) && (
        <Loading />
      )}
      <PForm
        form={form}
        initialValues={{
          attDate: moment(todayDate()),
          searchString: "",
        }}
      >
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
                  <h4>{isToday()} Attendance</h4>
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
            </div>
            {/*  */}
            <div
              className="managerDashboard-Report-Card"
              style={{ borderTop: `3px solid #D444F1` }}
            >
              <div className="inner">
                <div className="card-head">
                  <h4>Movement</h4>
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
                </div>
                <div className="card-context">
                  <div>
                    <h4>{DashboardLanding?.pendingApprovalCount}</h4>
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
                  {isToday()} Status | Total Employee{" "}
                  <span>{employeeAttandanceListViewModels?.totalCount}</span>
                </p>
              </div>
              <div className="d-flex align-items-center">
                <div className="mr-2">
                  <PInput
                    type="date"
                    name="attDate"
                    placeholder="Attendance Date"
                    onChange={(value) => {
                      form.setFieldsValue({
                        attDate: value,
                      });
                      getData(
                        pages,
                        filterList,
                        form.getFieldValue("searchString"),
                        moment(value).format("YYYY-MM-DD")
                      );
                    }}
                  />
                </div>

                <MasterFilter
                  styles={{ marginRight: "0px" }}
                  inputWidth="250px"
                  width="250px"
                  isHiddenFilter
                  value={form.getFieldValue("searchString")}
                  setValue={(value) => {
                    form.setFieldsValue({
                      searchString: value,
                    });
                    debounce(() => {
                      getData(pages, filterList, value);
                    }, 500);
                  }}
                  cancelHandler={() => {
                    form.setFieldsValue({
                      searchString: "",
                    });
                    getData(pages, filterList, "");
                  }}
                />
              </div>
            </div>
            {/* <div className="table-card-body mb-5"> */}
            <div
              style={{
                overflow: "auto",
                maxHeight: "320px",
              }}
            >
              {employeeAttandanceListViewModels?.totalCount > 0 ? (
                <DataTable
                  scroll={{ y: "230px", x: 1000 }}
                  bordered
                  loading={DashboardLanding?.loading}
                  filterData={
                    employeeAttandanceListViewModels?.dailyAttendanceHeader
                  }
                  data={employeeAttandanceListViewModels?.data || []}
                  pagination={{
                    pageSize: employeeAttandanceListViewModels?.pageSize,
                    total: employeeAttandanceListViewModels?.totalCount,
                  }}
                  header={supervisorLandingColumn(
                    setEmpData,
                    getAttendanceData,
                    setLoading,
                    currYear,
                    currMonth,
                    setEmpDetails,
                    empData,
                    setAnchorEl,
                    setOpen,
                    setLeaveBalanceData,
                    buId,
                    wgId,
                    getAttendanceLog
                  )}
                  onChange={(pagination, filters) => {
                    setPages({
                      current: pagination.current,
                      pageSize: pagination.pageSize,
                      total: pagination.total,
                    });
                    getData(pagination, filters);
                    setFilterList(filters);
                  }}
                  onRow={(record) => ({
                    onClick: () => {
                      history.push({
                        pathname: `/profile/employee/${record?.employeeId}`,
                        state: { buId, wgId },
                      });
                    },
                    className: "pointer",
                  })}
                />
              ) : (
                <NoResult />
              )}
            </div>
          </div>
          {/* </div> */}
        </div>
      </PForm>

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
                currMonth,
              }}
            />
          </div>
        </ViewModal>
      )}
      {!loading && (
        <ViewModal
          size="lg"
          title="Employee Leave Balance Report"
          backdrop="static"
          classes="default-modal preview-modal"
          show={open}
          onHide={() => {
            setOpen(false);
            setEmpData(null);
            setLeaveBalanceData([]);
          }}
        >
          <div className="modal-body2 mx-3">
            <div>
              <p>
                Employee :{" "}
                <span style={{ fontWeight: "bold" }}>
                  {empData?.employeeName} [{empData?.employeeCode}]
                </span>
              </p>
              <p>
                Designation :{" "}
                <span style={{ fontWeight: "bold" }}>
                  {empData?.designation}
                </span>
              </p>
              <p>
                Department :{" "}
                <span style={{ fontWeight: "bold" }}>
                  {empData?.departmant}
                </span>
              </p>
            </div>
            <div className="my-3">
              <LeaveBalanceTable
                leaveBalanceData={leaveBalanceData}
                values={{
                  year: { value: currYear() },
                  employee: { value: empData?.employeeId },
                }}
              />
            </div>
          </div>
        </ViewModal>
      )}
      {!AttendanceLog?.loading && (
        <ViewModal
          size="lg"
          title="Employee Attendance Log"
          backdrop="static"
          classes="default-modal preview-modal"
          show={isAttLogOpen}
          onHide={() => {
            setIsAttLogOpen(false);
          }}
        >
          <div className="modal-body2 mx-3 mb-3">
            <DataTable
              bordered
              data={AttendanceLog?.data || []}
              header={attendanceLogColumns()}
            />
          </div>
        </ViewModal>
      )}
    </>
  );
};

export default SupervisorDashboardLanding;
