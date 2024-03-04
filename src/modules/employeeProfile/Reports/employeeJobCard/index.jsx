/* eslint-disable react-hooks/exhaustive-deps */
import PrintIcon from "@mui/icons-material/Print";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AntTable from "../../../../common/AntTable";
import { getSearchEmployeeList } from "../../../../common/api";
import Chips from "../../../../common/Chips";
import FormikInput from "../../../../common/FormikInput";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import {
  monthFirstDate,
  monthLastDate,
} from "../../../../utility/dateFormatter";
import { getPDFAction } from "../../../../utility/downloadFile";
import {
  attendanceDetailsReport,
  empBasicInfo,
} from "../../../timeSheet/reports/helper";
import "./attendanceDetails.css";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";

const firstDate = monthFirstDate(new Date());
const lastDate = monthLastDate(new Date());

const initData = {
  employee: "",
  fromDate: firstDate,
  toDate: lastDate,
};

export default function EmployeeJobCard() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    document.title = "Job Card";
  }, []);
  const { buId, orgId, employeeId, userName, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [empInfo, setEmpInfo] = useState(null);
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  useEffect(() => {
    empBasicInfo(buId, orgId, employeeId, setEmpInfo);
    attendanceDetailsReport(
      employeeId,
      firstDate,
      lastDate,
      setRowDto,
      setLoading
    );
  }, [buId, orgId]);

  const saveHandler = (values) => {
    empBasicInfo(
      buId,
      orgId,
      values?.employee?.value ? values?.employee?.value : employeeId,
      setEmpInfo,
      setLoading
    );
    attendanceDetailsReport(
      values?.employee?.value ? values?.employee?.value : employeeId,
      values.fromDate,
      values.toDate,
      setRowDto,
      setLoading
    );
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 137) {
      permission = item;
    }
  });

  const columns = (page, paginationSize) => {
    return [
      {
        title: "SL",
        render: (text, record, index) =>
          (page - 1) * paginationSize + index + 1,
        sorter: false,
        filter: false,
        className: "text-center",
      },
      {
        title: "Attendance Date",
        dataIndex: "AttendanceDateWithName",
      },
      {
        title: "In-Time",
        dataIndex: "InTime",
      },
      {
        title: "Out-Time",
        dataIndex: "OutTime",
      },
      {
        title: "Late Min",
        dataIndex: "LateMin",
      },
      {
        title: "Start Time",
        dataIndex: "StartTime",
      },
      {
        title: "Break Start",
        dataIndex: "breakStartTime",
      },
      {
        title: "Break End",
        dataIndex: "breakEndTime",
      },
      {
        title: "End Time",
        dataIndex: "EndTime",
      },
      {
        title: "Early Out",
        dataIndex: "EarlyOut",
      },
      {
        title: "Total Working Hours",
        dataIndex: "WorkingHours",
      },
      {
        title: "Over Time",
        dataIndex: "numOverTime",
      },
      {
        title: "Calendar Name",
        dataIndex: "CalendarName",
      },
      {
        title: "Attendance Status",
        render: (_, record) => (
          <>
            {record?.AttStatus === "Present" && (
              <Chips label={record?.AttStatus} classess="success" />
            )}
            {record?.AttStatus === "Absent" && (
              <Chips label={record?.AttStatus} classess="danger" />
            )}
            {record?.AttStatus === "Late" && (
              <Chips label={record?.AttStatus} classess="warning" />
            )}
            {record?.AttStatus === "Late Present" && (
              <Chips label={record?.AttStatus} classess="warning" />
            )}
            {record?.AttStatus === "Leave" && (
              <Chips label={record?.AttStatus} classess="indigo" />
            )}
            {record?.AttStatus === "Holiday" && (
              <Chips label={record?.AttStatus} classess="secondary" />
            )}
            {record?.AttStatus === "Offday" && (
              <Chips label={record?.AttStatus} classess="primary" />
            )}
            {record?.AttStatus === "Movement" && (
              <Chips label={record?.AttStatus} classess="movement" />
            )}
            {record?.AttStatus === "Manual Present" && (
              <Chips label={record?.AttStatus} classess="success" />
            )}
            {record?.AttStatus === "Manual Absent" && (
              <Chips label={record?.AttStatus} classess="danger" />
            )}
            {record?.AttStatus === "Manual Leave" && (
              <Chips label={record?.AttStatus} classess="indigo" />
            )}
            {record?.AttStatus === "Manual Late" && (
              <Chips label={record?.AttStatus} classess="warning" />
            )}
            {record?.AttStatus === "Early Out" && (
              <Chips label={record?.AttStatus} classess="info" />
            )}
            {record?.AttStatus === "Not Found" && <p>-</p>}
          </>
        ),
        dataIndex: "AttStatus",
        sorter: true,
        filter: true,
      },
      {
        title: "Remarks",
        dataIndex: "Remarks",
        sorter: true,
        filter: true,
        isNumber: true,
      },
    ];
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          employee: { value: employeeId, label: userName },
        }}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <div>
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div>
                        <Tooltip title="Print" arrow>
                          <button
                            className="btn-save"
                            type="button"
                            onClick={() => {
                              getPDFAction(
                                `/PdfAndExcelReport/DailyAttendanceReportByEmployee?TypeId=0&EmployeeId=${values?.employee?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`,
                                setLoading
                              );
                            }}
                          >
                            <PrintIcon
                              sx={{
                                color: "#637381",
                                fontSize: "16px",
                              }}
                            />
                          </button>
                        </Tooltip>
                      </div>
                      {/*     <ul className="d-flex flex-wrap">
                        <li>
                          <div
                            className="d-flex align-items-center justify-content-center"
                            style={{ paddingBottom: "7px" }}
                          >
                            {(isFilter || !values?.employee) && (
                              <div>
                                <ResetButton
                                  classes="btn-filter-reset"
                                  style={{ marginRight: "20px" }}
                                  title="Reset"
                                  icon={
                                    <SettingsBackupRestoreOutlined
                                      sx={{ marginRight: "10px" }}
                                    />
                                  }
                                  onClick={() => {
                                    attendanceDetailsReport(
                                      employeeId,
                                      firstDate,
                                      lastDate,
                                      setRowDto,
                                      setLoading
                                    );
                                    empBasicInfo(
                                      buId,
                                      orgId,
                                      employeeId,
                                      setEmpInfo,
                                      setLoading
                                    );
                                    setIsFilter(false);
                                    setFieldValue("employee", {
                                      value: employeeId,
                                      label: userName,
                                    });
                                  }}
                                />
                              </div>
                            )}
                            <div
                              className="mr-3 d-flex justify-content-center align-items-center"
                              style={{ minWidth: "300px !important" }}
                            >
                              <label className="mx-1">Employee Name</label>
                              <FormikSelect
                                name="employee"
                                options={employeeListDDL || []}
                                value={values?.employee}
                                onChange={(valueOption) => {
                                  setFieldValue("employee", valueOption);
                                  if (!valueOption) {
                                    setEmpInfo(null);
                                    setRowDto([]);
                                  }
                                }}
                                placeholder="Search"
                                styles={{
                                  ...customStyles,
                                  valueContainer: (provided, state) => ({
                                    ...provided,
                                    height: "30px",
                                    padding: "0 6px",
                                    width: "200px",
                                  }),
                                }}
                                errors={errors}
                                touched={touched}
                                isDisabled={false}
                              />
                            </div>
                            <div className="mr-3 d-flex justify-content-center align-items-center">
                              <label className="mr-1">From Date</label>
                              <FormikInput
                                classes="input-sm"
                                type="date"
                                value={values?.fromDate}
                                name="fromDate"
                                onChange={(e) => {
                                  setFieldValue("fromDate", e.target.value);
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="mr-3 d-flex justify-content-center align-items-center">
                              <label className="mr-1">To Date</label>
                              <FormikInput
                                classes="input-sm"
                                type="date"
                                value={values?.toDate}
                                name="toDate"
                                min={values?.fromDate}
                                onChange={(e) => {
                                  setFieldValue("toDate", e.target.value);
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div>
                              <PrimaryButton
                                type="submit"
                                className="btn btn-default flex-center"
                                label={"Apply"}
                                onSubmit={() => handleSubmit()}
                              />
                            </div>
                          </div>
                        </li>
                      </ul> */}
                    </div>
                    <div className="card-style pb-0 mb-2 mt-4">
                      <div className="row">
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Employee</label>
                            <AsyncFormikSelect
                              selectedValue={values?.employee}
                              isSearchIcon={true}
                              handleChange={(valueOption) => {
                                setFieldValue("employee", valueOption);
                                if (valueOption) {
                                  empBasicInfo(
                                    buId,
                                    orgId,
                                    valueOption?.value,
                                    setEmpInfo,
                                    setLoading
                                  );
                                } else {
                                  setEmpInfo(null);
                                  setRowDto([]);
                                  attendanceDetailsReport(
                                    employeeId,
                                    firstDate,
                                    lastDate,
                                    setRowDto,
                                    setLoading
                                  );
                                  empBasicInfo(
                                    buId,
                                    orgId,
                                    employeeId,
                                    setEmpInfo,
                                    setLoading
                                  );
                                  setFieldValue("employee", {
                                    value: employeeId,
                                    label: userName,
                                  });
                                }
                              }}
                              placeholder="Search (min 3 letter)"
                              loadOptions={(v) =>
                                getSearchEmployeeList(buId, wgId, v)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>From Date</label>
                            <FormikInput
                              classes="input-sm"
                              type="date"
                              value={values?.fromDate}
                              name="fromDate"
                              onChange={(e) => {
                                setFieldValue("fromDate", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>To Date</label>
                            <FormikInput
                              classes="input-sm"
                              type="date"
                              value={values?.toDate}
                              name="toDate"
                              min={values?.fromDate}
                              onChange={(e) => {
                                setFieldValue("toDate", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <button
                            className="btn btn-green btn-green-disable mt-4"
                            type="submit"
                            onClick={handleSubmit}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      className="row"
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        borderRadius: "6px",
                        padding: "10px",
                        marginRight: "0",
                        marginLeft: "0",
                        marginTop: "15px",
                      }}
                    >
                      <div className="col-md-3">
                        <div
                          className="card-des"
                          style={{
                            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                            fontSize: "17px",
                          }}
                        >
                          {console.log("empInfo", empInfo?.[0])}
                          <p>
                            Employee:{" "}
                            <strong>
                              {empInfo?.[0]?.EmployeeName} -
                              {empInfo?.[0]?.EmployeeCode}
                            </strong>{" "}
                          </p>
                          <p>
                            Workplace Group:{" "}
                            <strong>{empInfo?.[0]?.WorkplaceGroupName}</strong>{" "}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div
                          className="card-des"
                          style={{
                            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          }}
                        >
                          <p>
                            HR Position:{" "}
                            <strong>{empInfo?.[0]?.PositionName}</strong>
                          </p>
                          <p>
                            Business Unit:{" "}
                            <strong>{empInfo?.[0]?.BusinessUnitName}</strong>
                          </p>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div
                          className="card-des"
                          style={{
                            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                          }}
                        >
                          <p>
                            Designation:{" "}
                            <strong>{empInfo?.[0]?.DesignationName}</strong>
                          </p>
                          <p>
                            Department:{" "}
                            <strong>{empInfo?.[0]?.DepartmentName}</strong>{" "}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="card-des">
                          <p>
                            Employment Type:{" "}
                            <strong>{empInfo?.[0]?.EmploymentTypeName}</strong>
                          </p>
                          <p>
                            {supervisor || "Supervisor"}:{" "}
                            <strong>{empInfo?.[0]?.SupervisorName}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* employee totatl late, leave, absent, late, present section card here ....  */}

                    {rowDto?.length > 0 ? (
                      <div
                        className="row"
                        style={{
                          border: "1px solid rgba(0, 0, 0, 0.12)",
                          borderRadius: "6px",
                          padding: "10px",
                          marginRight: "0",
                          marginLeft: "0",
                          marginTop: "15px",
                        }}
                      >
                        <div className="col-md-4">
                          <div
                            className="card-des"
                            style={{
                              borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                              fontSize: "17px",
                            }}
                          >
                            <p>
                              Total Present:{" "}
                              <strong>{rowDto?.[0]?.totalPresent} Days</strong>{" "}
                            </p>
                            <p>
                              Total Manual Present: :{" "}
                              <strong>
                                {rowDto?.[0]?.totalManualPresent} Days
                              </strong>{" "}
                            </p>
                            <p>
                              Total Leave: :{" "}
                              <strong>{rowDto?.[0]?.totalLeave} Days</strong>{" "}
                            </p>
                            <p>
                              Total Late: :{" "}
                              <strong>{rowDto?.[0]?.totalLateMin}</strong>{" "}
                            </p>
                            <p>
                              Total Early Out: :{" "}
                              <strong>{rowDto?.[0]?.totalEarlyOutMin}</strong>{" "}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div
                            className="card-des"
                            style={{
                              borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                              fontSize: "17px",
                            }}
                          >
                            <p>
                              Total Late:{" "}
                              <strong>{rowDto?.[0]?.totalLate} Days</strong>{" "}
                            </p>
                            <p>
                              Total Manual late: :{" "}
                              <strong>
                                {rowDto?.[0]?.totalManualLate} Days
                              </strong>{" "}
                            </p>
                            <p>
                              Total Absent: :{" "}
                              <strong>{rowDto?.[0]?.totalAbsent} Days</strong>{" "}
                            </p>
                            <p>
                              Total Manual Absent: :{" "}
                              <strong>
                                {rowDto?.[0]?.totalManualAbsent} Days
                              </strong>{" "}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div
                            className="card-des"
                            style={{
                              // borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                              fontSize: "17px",
                            }}
                          >
                            <p>
                              Total Early Out:{" "}
                              <strong>{rowDto?.[0]?.totalEarlyOut} Days</strong>{" "}
                            </p>
                            <p>
                              Total Holiday: :{" "}
                              <strong>{rowDto?.[0]?.totalHoliday} Days</strong>{" "}
                            </p>
                            <p>
                              Total Movement: :{" "}
                              <strong>{rowDto?.[0]?.totalMovement} Days</strong>{" "}
                            </p>
                            <p>
                              Total Off day: :{" "}
                              <strong>{rowDto?.[0]?.totalOffday} Days</strong>{" "}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="table-card-body">
                    <div className="table-card-styled tableOne">
                      {rowDto?.length > 0 && (
                        <AntTable
                          data={rowDto?.length > 0 && rowDto}
                          columnsData={columns(page, paginationSize)}
                          setPage={setPage}
                          setPaginationSize={setPaginationSize}
                          removePagination
                        />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
