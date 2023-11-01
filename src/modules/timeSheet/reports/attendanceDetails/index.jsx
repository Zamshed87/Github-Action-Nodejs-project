/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import Chips from "../../../../common/Chips";
import { attendanceDetailsReport, empBasicInfo } from "../helper";
import {
  monthFirstDate,
  monthLastDate,
} from "../../../../utility/dateFormatter";
import { Tooltip } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import PrimaryButton from "../../../../common/PrimaryButton";
import { getPDFAction } from "../../../../utility/downloadFile";
import FormikInput from "../../../../common/FormikInput";
import ResetButton from "../../../../common/ResetButton";
import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import "./attendanceDetails.css";

/* const todayDate = dateFormatterForInput(new Date()); */

const firstDate = monthFirstDate(new Date());
const lastDate = monthLastDate(new Date());

const initData = {
  search: "",
  fromDate: firstDate,
  toDate: lastDate,
};

export default function AttendanceDetails() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, []);

  const { buId, orgId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState(null);
  const [empInfo, setEmpInfo] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [singleData, setSingleData] = useState(null);
  const [isFilter, setIsFilter] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  // eslint-disable-next-line no-unused-vars
  const handleClose = () => setOpen(false);

  // eslint-disable-next-line no-unused-vars
  const [formData, setFormData] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [toDate, setToDate] = useState("");

  const getData = () => {
    attendanceDetailsReport(
      employeeId,
      firstDate,
      lastDate,
      setRowDto,
      setLoading
    );
  };

  useEffect(() => {
    empBasicInfo(buId, orgId, employeeId, setEmpInfo, setLoading);
    getData();
  }, [buId, orgId]);

  const saveHandler = (values) => {
    setToDate(values?.toDate);
    setFormData(values?.fromDate);
    attendanceDetailsReport(
      employeeId,
      values.fromDate,
      values.toDate,
      setRowDto,
      setLoading
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="table-card">
                <div className="attendence-details-heading">
                  <div className="configuration-heading pb-2">
                    <div className="table-card-heading d-flex flex-wrap">
                      <div className="d-flex">
                        <Tooltip title="Print" arrow>
                          <button
                            className="btn-save ml-3"
                            type="button"
                            style={{
                              border: "transparent",
                              width: "30px",
                              height: "30px",
                              background: "#f2f2f7",
                              borderRadius: "100px",
                            }}
                            onClick={() => {
                              getPDFAction(
                                `/emp/PdfAndExcelReport/DailyAttendanceReportByEmployee?TypeId=0&EmployeeId=${employeeId}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`,
                                setLoading
                              );
                            }}
                          >
                            <PrintIcon
                              sx={{ color: "#637381", fontSize: "16px" }}
                            />
                          </button>
                        </Tooltip>
                      </div>
                      <div className="table-card-head-right">
                        <div
                          className="d-flex align-items-end"
                          style={{ paddingBottom: "23px" }}
                        >
                          <ul>
                            {isFilter && (
                              <li>
                                <ResetButton
                                  title="reset"
                                  icon={
                                    <SettingsBackupRestoreOutlined
                                      sx={{ marginRight: "10px" }}
                                    />
                                  }
                                  onClick={() => {
                                    setIsFilter(false);
                                    getData();
                                    setFieldValue("fromDate", firstDate);
                                    setFieldValue("toDate", lastDate);
                                  }}
                                />
                              </li>
                            )}
                          </ul>
                          <div className="mr-3">
                            <small>From Date</small>
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
                          <div className="mr-3">
                            <small>To Date</small>
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
                              onClick={() => {
                                setIsFilter(true);
                              }}
                              onSubmit={() => handleSubmit()}
                            />
                          </div>
                        </div>
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
                        <p>
                          Employee:
                          <strong>{` ${empInfo?.Result?.[0]?.EmployeeName}`}</strong>
                        </p>
                        <p>
                          Workplace Group:
                          <strong>{` ${empInfo?.Result?.[0]?.EmploymentTypeName}`}</strong>
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
                          HR Position:
                          <strong>{` ${empInfo?.Result?.[0]?.PositionName}`}</strong>
                        </p>
                        <p>
                          Business Unit:
                          <strong>{` ${empInfo?.Result?.[0]?.BusinessUnitName}`}</strong>
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
                          Designation:
                          <strong>{` ${empInfo?.Result?.[0]?.DesignationName}`}</strong>
                        </p>
                        <p>
                          Department:
                          <strong>{` ${empInfo?.Result?.[0]?.DepartmentName}`}</strong>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card-des">
                        <p>
                          Employment Type:
                          <strong>{` ${empInfo?.Result?.[0]?.EmploymentTypeName}`}</strong>
                        </p>
                        <p>
                          {supervisor || "Supervisor"}:
                          <strong>{` ${empInfo?.Result?.[0]?.SupervisorName}`}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table-card-body">
                  <div className="table-card-styled employee-table-card tableOne">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>
                            <div className="sortable justify-content-center">
                              <span>Attendance Date</span>
                            </div>
                          </th>
                          <th>
                            <div className="sortable">
                              <span>In-Time</span>
                            </div>
                          </th>
                          <th>
                            <div className="sortable justify-content-center">
                              <span>Out-Time</span>
                            </div>
                          </th>
                          <th>
                            <div className="sortable justify-content-center">
                              <span>Attendance Status</span>
                            </div>
                          </th>
                          {/* <th>
                                    <div className="sortable">
                                      <span>Reason</span>
                                    </div>
                                  </th> */}
                          <th>
                            <div className="sortable">
                              <span>Remarks</span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.map((data, index) => (
                          <tr
                            key={index}
                            onClick={(e) => {
                              setSingleData(data);
                              handleOpen();
                            }}
                            className=""
                          >
                            <td>
                              {/* {dateFormatter(data?.AttendanceDateWithName)} */}
                              <div className="tableBody-title td-left">
                                {data?.AttendanceDateWithName}
                              </div>
                            </td>
                            <td>
                              <div className="tableBody-title">
                                {data?.InTime}
                              </div>
                            </td>
                            <td>
                              <div className="tableBody-title td-center">
                                {data?.OutTime}
                              </div>
                            </td>
                            <td className="text-center">
                              {data?.AttStatus === "Present" && (
                                <Chips
                                  label={data?.AttStatus}
                                  classess="success"
                                />
                              )}
                              {data?.AttStatus === "Absent" && (
                                <Chips
                                  label={data?.AttStatus}
                                  classess="danger"
                                />
                              )}
                              {data?.AttStatus === "Late Present" && (
                                <Chips
                                  label={data?.AttStatus}
                                  classess="warning"
                                />
                              )}
                              {data?.AttStatus === "Leave" && (
                                <Chips
                                  label={data?.AttStatus}
                                  classess="indigo"
                                />
                              )}
                              {data?.AttStatus === "Holiday" && (
                                <Chips
                                  label={data?.AttStatus}
                                  classess="secondary"
                                />
                              )}
                              {data?.AttStatus === "Offday" && (
                                <Chips
                                  label={data?.AttStatus}
                                  classess="primary"
                                />
                              )}
                              {data?.AttStatus === "Movement" && (
                                <Chips
                                  label={data?.AttStatus}
                                  classess="movement"
                                />
                              )}
                            </td>
                            {/* <td className="text-left">{data?.MReason}</td> */}
                            <td>
                              {data?.Remarks === "Not Found"
                                ? "-"
                                : data?.Remarks}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* <ShowAttendenceModal
                show={open}
                empId={employeeId}
                title="Punch Details"
                onHide={handleClose}
                fromDate={formData}
                toDate={toDate}
                empInfo={empInfo?.Result[0]}
                singleData={singleData}
                size="md"
                classes="default-modal"
                handleOpen={handleOpen}
              /> */}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
