/* eslint-disable react-hooks/exhaustive-deps */
import { SaveAlt } from "@mui/icons-material";
import PrintIcon from "@mui/icons-material/Print";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { gray900 } from "utility/customColor";
import AntTable from "../../../../common/AntTable";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";
import FormikInput from "../../../../common/FormikInput";
import { getBuDetails, getSearchEmployeeList } from "../../../../common/api";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import {
  dateFormatter,
  monthFirstDate,
  monthLastDate,
} from "../../../../utility/dateFormatter";
import { getPDFAction } from "../../../../utility/downloadFile";
import {
  attendanceDetailsReport,
  empBasicInfo,
} from "../../../timeSheet/reports/helper";
import "./attendanceDetails.css";
import {
  JobCardTableHeadColumn,
  createJobCardExcelHandler,
  custom26to25LandingDataHandler,
} from "./utils";

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
  const { buId, orgId, employeeId, userName, wgId, buName } = useSelector(
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

  const [BuDetails, setBuDetails] = useState(null);
  useEffect(() => {
    getBuDetails(buId, setBuDetails, setLoading);
  }, [buId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          employee: { value: employeeId, label: userName },
        }}
        onSubmit={(values) => {
          saveHandler(values);
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
                      <div className="d-flex align-items-center gap-2">
                        <Tooltip title="Download Excel" arrow>
                          <button
                            className="btn-save"
                            type="button"
                            onClick={() => {
                              if (!rowDto?.length > 0) {
                                return toast.warn("No Data Found");
                              }
                              try {
                                createJobCardExcelHandler({
                                  BuDetails,
                                  buName,
                                  rowDto,
                                  empInfo,
                                });
                              } catch (error) {}
                              //
                            }}
                          >
                            <SaveAlt
                              sx={{
                                color: gray900,
                                fontSize: "14px",
                              }}
                            />
                          </button>
                        </Tooltip>
                        <Tooltip title="Print" arrow>
                          <button
                            className="btn-save ml-2"
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
                    </div>
                    <div className="card-style pb-0 mb-2 mt-3">
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
                        <div className="col-lg-2">
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
                        <div className="col-lg-2">
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
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-green btn-green-disable mt-4"
                              type="submit"
                              onClick={handleSubmit}
                            >
                              Apply
                            </button>

                            <Tooltip
                              title="Previous Month 26 to Current Month 25"
                              arrow
                            >
                              <button
                                style={{
                                  height: "32px",
                                  width: "160px",
                                  fontSize: "12px",
                                  padding: "0px 12px 0px 12px",
                                }}
                                className="btn btn-default mt-4 ml-3"
                                type="button"
                                onClick={() => {
                                  custom26to25LandingDataHandler(
                                    (previousMonthDate, currentMonthDate) => {
                                      setFieldValue("fromDate", previousMonthDate);
                                      setFieldValue("toDate", currentMonthDate);
                                      saveHandler({...values, fromDate: previousMonthDate, toDate: currentMonthDate})
                                    }
                                  );
                                }}
                              >
                                Custom [26 - 25]
                              </button>
                            </Tooltip>
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
                          <p>
                            Workplace Name:{" "}
                            <strong>{empInfo?.[0]?.WorkplaceName}</strong>{" "}
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
                          {console.log("empInfo",empInfo)}
                          <p>
                            HR Position:{" "}
                            <strong>{empInfo?.[0]?.PositionName}</strong>
                          </p>
                          {/* <p>
                            Business Unit:{" "}
                            <strong>{empInfo?.[0]?.BusinessUnitName}</strong>
                          </p> */}
                          <p>
                           Joining Date:{" "}
                            <strong>{dateFormatter(empInfo?.[0]?.JoiningDate)}</strong>
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
                              Total Manual Present:{" "}
                              <strong>
                                {rowDto?.[0]?.totalManualPresent} Days
                              </strong>{" "}
                            </p>
                            <p>
                              Total Leave: :{" "}
                              <strong>{rowDto?.[0]?.totalLeave} Days</strong>{" "}
                            </p>
                            <p>
                              Total Late Time:{" "}
                              <strong>{rowDto?.[0]?.totalLateMin}</strong>{" "}
                            </p>
                            <p>
                              Total Early Out Time:{" "}
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
                              Total Manual late:{" "}
                              <strong>
                                {rowDto?.[0]?.totalManualLate} Days
                              </strong>{" "}
                            </p>
                            <p>
                              Total Absent:{" "}
                              <strong>{rowDto?.[0]?.totalAbsent} Days</strong>{" "}
                            </p>
                            <p>
                              Total Manual Absent:{" "}
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
                              Total Holiday:{" "}
                              <strong>{rowDto?.[0]?.totalHoliday} Days</strong>{" "}
                            </p>
                            <p>
                              Total Movement:{" "}
                              <strong>{rowDto?.[0]?.totalMovement} Days</strong>{" "}
                            </p>
                            <p>
                              Total Off day:{" "}
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
                          columnsData={JobCardTableHeadColumn(
                            page,
                            paginationSize
                          )}
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
