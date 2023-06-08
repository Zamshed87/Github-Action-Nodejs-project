/* eslint-disable react-hooks/exhaustive-deps */
import { Refresh } from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import BackButton from "../../../../common/BackButton";
import FormikInput from "../../../../common/FormikInput";
import FormikRadio from "../../../../common/FormikRadio";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import { gray700, greenColor } from "../../../../utility/customColor";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { monthFirstDate } from "../../../../utility/dateFormatter";
import { getDifferenceBetweenTime } from "../../../../utility/getDifferenceBetweenTime";
import { customStyles } from "../../../../utility/newSelectCustomStyle";
import { todayDate } from "../../../../utility/todayDate";
import { getOvertimeById, overtimeEntry_API } from "../helper";
import { getEmployeeProfileViewData } from "./../helper";

const initData = {
  employee: "",
  workPlace: "",
  date: "",
  startTime: "",
  endTime: "",
  overTimeHour: "",
  reason: "",
  duration: "hourly",
};

const validationSchema = Yup.object().shape({
  employee: Yup.object()
    .shape({
      label: Yup.string().required("Employee is required"),
      value: Yup.string().required("Employee is required"),
    })
    .typeError("Employee is required"),
  date: Yup.string().required("Date is required"),
  duration: Yup.string().required("Duration is required"),
});

export default function AddEditOverTime() {
  const params = useParams();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [empBasic, setEmpBasic] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [overTimeLimit, getOverTimeLimit, , setterPolicy, policyError] =
    useAxiosGet();
  const [empOvertimeAmount, getEmpOvertimeAmount, , setEmpOvertimeAmount] =
    useAxiosGet();

  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  const [employeeDDL, setEmployeeDDL] = useState([]);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30333) {
      permission = item;
    }
  });
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (params?.id) {
      getOvertimeById(
        {
          strPartName: "OvertimeByEmployeeId",
          status: "",
          intOverTimeId: +params?.id,
          departmentId: 0,
          designationId: 0,
          supervisorId: 0,
          employeeId: state?.EmployeeId,
          workplaceGroupId: 0,
          businessUnitId: buId,
          loggedEmployeeId: 0,
          formDate: monthFirstDate(),
          toDate: todayDate(),
        },
        setSingleData,
        setLoading,
        (res) => {
          getEmpOvertimeAmount(
            `/Payroll/GetPerMinuteAmountByID?EmployeeId=${
              res?.EmployeeId
            }&AccountId=${+orgId}`
          );
        }
      );
      setAmount(state?.TotalAmount);
    }
  }, [params?.id, state?.EmployeeId, buId]);

  const saveHandler = (values, cb) => {
    if (
      !overTimeLimit?.intMaxOverTimeDaily ||
      !overTimeLimit?.intMaxOverTimeDaily > 0
    ) {
      return toast.warn("Please Configure Overtime Policy");
    }
    if (values?.duration === "hourly" && !values?.overTimeHour) {
      return toast.warning("Overtime hour is required!!!");
    }

    if (values?.duration === "hourly" && values?.overTimeHour <= 0) {
      return toast.warning("Overtime hour is not valid !!!");
    }

    if (values?.duration === "range" && !values?.startTime) {
      return toast.warning("Start time is required!!!");
    }

    if (values?.duration === "range" && !values?.endTime) {
      return toast.warning("End time is required!!!");
    }

    const hour = values?.overTimeHour?.split(":")[0];
    const min = values?.overTimeHour?.split(":")[1];

    let overTime = `${hour}.${min}`;

    // create && edit
    let payload = {
      partType: "Overtime",
      isActive: true,
      businessUnitId: buId,
      accountId: orgId,
      workplaceId: 0,
      intCreatedBy: employeeId,
      startTime: values?.startTime || null,
      endTime: values?.endTime || null,
      overtimeDate: values?.date,
      overtimeHour:
        values?.duration === "hourly" ? +values?.overTimeHour : +overTime,
      reason: values?.reason,
    };

    const callback = () => {
      cb();
      if (params?.id) {
        getOvertimeById(
          {
            strPartName: "OvertimeByEmployeeId",
            status: "",
            intOverTimeId: +params?.id,
            departmentId: 0,
            designationId: 0,
            supervisorId: 0,
            employeeId: singleData?.employee?.value,
            workplaceGroupId: 0,
            businessUnitId: buId,
            loggedEmployeeId: 0,
            formDate: values?.filterFromDate || monthFirstDate(),
            toDate: values?.filterToDate || todayDate(),
          },
          setSingleData,
          setLoading
        );
      }
    };

    if (params?.id) {
      payload = {
        ...payload,
        autoId: state?.OvertimeId,
        employeeId: state?.EmployeeId,
      };
    } else {
      payload = {
        ...payload,
        autoId: 0,
        employeeId: values?.employee?.value,
      };
    }

    overtimeEntry_API(payload, setLoading, callback);
  };

  const totalAmount = (overTimeHour, type, perMinuteRate) => {
    if (type === "range") {
      let total = empOvertimeAmount?.perMinuteRate
        ? +overTimeHour *
            +empOvertimeAmount?.perMinuteRate *
            overTimeLimit?.intOtbenefitsHour || 1
        : 0;
      setAmount(total.toFixed(2));
    } else {
      let total = empOvertimeAmount?.perMinuteRate
        ? +overTimeHour *
            60 *
            +empOvertimeAmount?.perMinuteRate *
            overTimeLimit?.intOtbenefitsHour || 1
        : 0;
      setAmount(total.toFixed(2));
    }
  };

  useEffect(() => {
    getOverTimeLimit(`/Payroll/GetOverTimeConfig?accountId=${orgId}`, (res) => {
      if (!res?.intMaxOverTimeDaily > 0) {
        return toast.warn("Overtime Policy Not Found");
      }
      setterPolicy(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  useEffect(() => {
    if (policyError) {
      toast.warn("Overtime Policy Not Found");
    }
  }, [overTimeLimit]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/Employee/EmployeeListBySupervisorORLineManagerNOfficeadmin?EmployeeId=${employeeId}&WorkplaceGroupId=${wgId}`,
      "intEmployeeBasicInfoId",
      "strEmployeeName",
      setEmployeeDDL
    );
  }, [employeeId, wgId]);

  useEffect(() => {
    if (params?.id) {
      getEmployeeProfileViewData(state?.EmployeeId, setEmpBasic, setLoading);
    }
  }, [params?.id, state?.EmployeeId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={params?.id ? singleData : initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            if (!params?.id) {
              resetForm(initData);
            }
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
            {loading && <Loading />}
            {permission?.isCreate ? (
              <>
                <Form>
                  <div className="table-card">
                    <div
                      className="table-card-heading"
                      style={{ marginBottom: "12px" }}
                    >
                      <div className="d-flex align-items-center">
                        <BackButton />
                        <h2>
                          {params?.id
                            ? `Edit Overtime Entry`
                            : `Create Overtime Entry`}
                        </h2>
                      </div>
                      <ul className="d-flex flex-wrap">
                        <li>
                          <button
                            type="button"
                            className="btn btn-cancel mr-2"
                            onClick={() => {
                              if (params?.id) {
                                setAmount(state?.TotalAmount);
                                resetForm(singleData);
                              } else {
                                resetForm(initData);
                              }
                            }}
                          >
                            Reset
                          </button>
                        </li>
                        <li>
                          <button
                            type="submit"
                            className="btn btn-green"
                            onSubmit={() => handleSubmit()}
                          >
                            Save
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div className="card-style with-form-card">
                      <div className="row align-items-center">
                        {/* employee */}
                        <div className="col-lg-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <label>Select Employee</label>
                            {values?.employee && !params?.id && (
                              <ResetButton
                                classes="btn-filter-reset w-50 mt-0 pt-0"
                                title="Reset Employee"
                                icon={
                                  <Refresh
                                    sx={{
                                      marginRight: "4px",
                                      fontSize: "12px",
                                    }}
                                  />
                                }
                                onClick={() => {
                                  setFieldValue("employee", "");
                                  setEmpOvertimeAmount(null);
                                }}
                                styles={{ height: "auto", fontSize: "12px" }}
                              />
                            )}
                          </div>
                          <FormikSelect
                            menuPosition="fixed"
                            name="employee"
                            options={employeeDDL || []}
                            value={values?.employee}
                            onChange={(valueOption) => {
                              setFieldValue("employee", valueOption);
                              getEmployeeProfileViewData(
                                valueOption?.value,
                                setEmpBasic,
                                setLoading
                              );
                              if (valueOption) {
                                getEmpOvertimeAmount(
                                  `/Payroll/GetPerMinuteAmountByID?EmployeeId=${valueOption?.intEmployeeBasicInfoId}&AccountId=${valueOption?.intAccountId}`
                                );
                              } else {
                                setEmpOvertimeAmount(null);
                              }
                            }}
                            styles={customStyles}
                            errors={errors}
                            placeholder=""
                            touched={touched}
                            isDisabled={values?.employee}
                          />
                        </div>
                        <div className="col-lg-3 pt-3">
                          <>
                            {values?.employee && (
                              <div className="d-flex flex-column">
                                <p
                                  style={{
                                    color: gray700,
                                    fontSize: "14px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {
                                    empBasic?.employeeProfileLandingView
                                      ?.strDesignation
                                  }
                                </p>
                                <p
                                  style={{
                                    color: gray700,
                                    fontSize: "12px",
                                    fontWeight: "400",
                                  }}
                                >
                                  Designation
                                </p>
                              </div>
                            )}
                          </>
                        </div>

                        <div className="col-12"></div>

                        {/* date */}
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Date</label>
                            <FormikInput
                              classes="input-sm"
                              name="date"
                              type="date"
                              value={values?.date}
                              max={todayDate()}
                              onChange={(e) => {
                                setFieldValue("date", e.target.value);
                                if (values?.startTime && values?.endTime) {
                                  let difference = getDifferenceBetweenTime(
                                    e.target.value,
                                    values?.startTime,
                                    values?.endTime
                                  );
                                  setFieldValue("overTimeHour", difference);
                                }
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>

                        {/* checkbox */}
                        <div className="col-lg-6">
                          <div className="input-feild-main">
                            <FormikRadio
                              styleObj={{
                                iconWidth: "15px",
                                icoHeight: "15px",
                                padding: "0px 8px 0px 10px",
                                checkedColor: greenColor,
                              }}
                              name="duration"
                              label="Hourly"
                              value={"hourly"}
                              onChange={(e) => {
                                totalAmount(0);
                                setFieldValue("overTimeHour", "");
                                setFieldValue("startTime", "");
                                setFieldValue("endTime", "");
                                setFieldValue("duration", e.target.value);
                              }}
                              checked={values?.duration === "hourly"}
                            />
                            <FormikRadio
                              styleObj={{
                                iconWidth: "15px",
                                icoHeight: "15px",
                                padding: "0px 8px 0px 10px",
                              }}
                              name="duration"
                              label="Range"
                              value={"range"}
                              onChange={(e) => {
                                totalAmount(0);
                                setFieldValue("overTimeHour", "");
                                setFieldValue("startTime", "");
                                setFieldValue("endTime", "");
                                setFieldValue("duration", e.target.value);
                              }}
                              checked={values?.duration === "range"}
                            />
                          </div>
                        </div>
                        <div className="col-12"></div>

                        {/* range form */}
                        {values?.duration === "range" && (
                          <>
                            <div className="col-lg-3">
                              <div className="input-field-main">
                                <label>Start Time</label>
                                <FormikInput
                                  classes="input-sm"
                                  type="time"
                                  name="startTime"
                                  value={values?.startTime}
                                  // onChange={(e) => {
                                  //   setFieldValue("startTime", e.target.value);
                                  //   if (values?.date && values?.endTime) {
                                  //     let difference = getDifferenceBetweenTime(
                                  //       values?.date,
                                  //       e.target.value,
                                  //       values?.endTime
                                  //     );
                                  //     setFieldValue("overTimeHour", difference);
                                  //   }
                                  // }}
                                  onChange={(e) => {
                                    setFieldValue("startTime", e.target.value);
                                    if (values?.date && values?.endTime) {
                                      let difference = getDifferenceBetweenTime(
                                        values?.date,
                                        e.target.value,
                                        values?.endTime
                                      );
                                      // setFieldValue("overTimeHour", difference);
                                      const splitTime = difference?.split(":");
                                      if (
                                        +splitTime[0] >
                                        overTimeLimit?.intMaxOverTimeDaily
                                      ) {
                                        setFieldValue("overTimeHour", "");
                                        return toast.warn(
                                          `Overtime Can't be more than ${overTimeLimit?.intMaxOverTimeDaily} hours`
                                        );
                                      } else if (
                                        +splitTime[0] >=
                                          overTimeLimit?.intMaxOverTimeDaily &&
                                        +splitTime[1] > 0
                                      ) {
                                        setFieldValue("overTimeHour", "");
                                        return toast.warn(
                                          `Overtime Can't be more than ${overTimeLimit?.intMaxOverTimeDaily} hours`
                                        );
                                      } else {
                                        setFieldValue(
                                          "overTimeHour",
                                          difference
                                        );
                                      }
                                      const totalTime =
                                        +splitTime[0] * 60 + +splitTime[1];
                                      totalAmount(totalTime, "range");
                                    }
                                  }}
                                  disabled={!values?.date}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="input-field-main">
                                <label>End Time</label>
                                <FormikInput
                                  classes="input-sm"
                                  type="time"
                                  name="endTime"
                                  value={values?.endTime}
                                  // onChange={(e) => {
                                  //   setFieldValue("endTime", e.target.value);
                                  //   if (values?.date && values?.startTime) {
                                  //     let difference = getDifferenceBetweenTime(
                                  //       values?.date,
                                  //       values?.startTime,
                                  //       e.target.value
                                  //     );
                                  //     setFieldValue("overTimeHour", difference);
                                  //   }
                                  // }}
                                  onChange={(e) => {
                                    setFieldValue("endTime", e.target.value);
                                    if (values?.date && values?.startTime) {
                                      let difference = getDifferenceBetweenTime(
                                        values?.date,
                                        values?.startTime,
                                        e.target.value
                                      );
                                      const splitTime = difference?.split(":");
                                      if (
                                        +splitTime[0] >
                                        overTimeLimit?.intMaxOverTimeDaily
                                      ) {
                                        setFieldValue("overTimeHour", "");
                                        return toast.warn(
                                          `Overtime Can't be more than ${overTimeLimit?.intMaxOverTimeDaily} hours`
                                        );
                                      } else if (
                                        +splitTime[0] >=
                                          overTimeLimit?.intMaxOverTimeDaily &&
                                        +splitTime[1] > 0
                                      ) {
                                        setFieldValue("overTimeHour", "");
                                        return toast.warn(
                                          `Overtime Can't be more than ${overTimeLimit?.intMaxOverTimeDaily} hours`
                                        );
                                      } else {
                                        setFieldValue(
                                          "overTimeHour",
                                          difference
                                        );
                                      }
                                      const totalTime =
                                        +splitTime[0] * 60 + +splitTime[1];
                                      totalAmount(totalTime, "range");
                                    }
                                  }}
                                  disabled={!values?.date}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                            </div>
                          </>
                        )}

                        <div className="col-12"></div>

                        {/* hourly form */}
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Overtime Hour</label>
                            <FormikInput
                              classes="input-sm"
                              type={
                                values?.duration === "hourly"
                                  ? "number"
                                  : "text"
                              }
                              name="overTimeHour"
                              disabled={values?.duration === "range"}
                              value={values?.overTimeHour}
                              onChange={(e) => {
                                if (values?.duration === "hourly") {
                                  if (
                                    +e.target.value >
                                    overTimeLimit?.intMaxOverTimeDaily
                                  ) {
                                    return toast.warn(
                                      `Overtime Can't be more than ${overTimeLimit?.intMaxOverTimeDaily} hours`
                                    );
                                  }
                                  if (e.target.value) {
                                    totalAmount(e.target.value);
                                  } else {
                                    totalAmount(0);
                                  }
                                  setFieldValue("overTimeHour", e.target.value);
                                }
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>

                        {amount > 0 && (
                          <div className="col-lg-3">
                            <label>Total Amount (Approx)</label>
                            <FormikInput
                              classes="input-sm"
                              type="text"
                              name="demo"
                              value={amount}
                              disabled={true}
                            />
                          </div>
                        )}

                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Reason (Optional)</label>
                            <FormikInput
                              classes="input-sm"
                              type="text"
                              name="reason"
                              value={values?.reason}
                              onChange={(e) => {
                                setFieldValue("reason", e.target.value);
                              }}
                              disabled={"type" === "edit"}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              </>
            ) : (
              <NotPermittedPage />
            )}
          </>
        )}
      </Formik>
    </>
  );
}
