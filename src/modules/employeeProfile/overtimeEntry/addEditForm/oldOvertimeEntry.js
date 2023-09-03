import { Refresh } from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
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
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { greenColor } from "../../../../utility/customColor";
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
  duration: "isHourly",
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
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [empBasic, setEmpBasic] = useState([]);
  const [singleData, setSingleData] = useState("");

  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  const [employeeDDL, setEmployeeDDL] = useState([]);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30333) {
      permission = item;
    }
  });

  useEffect(() => {
    if (params?.id) {
      getOvertimeById(
        {
          strPartName: "OvertimeByEmployeeId",
          status: "All",
          intOverTimeId: +params?.id,
          departmentId: 0,
          designationId: 0,
          supervisorId: 0,
          employeeId: state?.EmployeeId,
          workplaceGroupId: 0,
          businessUnitId: buId,
          loggedEmployeeId: employeeId,
          FormDate: state?.fromDate,
          toDate: state?.toDate,
        },
        setSingleData,
        setLoading
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id, state?.EmployeeId, buId]);

  const saveHandler = (values, cb) => {
    if (
      (values?.duration === "isHourly" || values?.duration === "isMonthly") &&
      !values?.overTimeHour
    ) {
      return toast.warning("Overtime hour is required!!!");
    }

    if (
      values?.duration === "isHourly" &&
      (values?.overTimeHour <= 0 || values?.overTimeHour > 24)
    ) {
      return toast.warning("Overtime hour is not valid !!!");
    }
    if (
      values?.duration === "isMonthly" &&
      (values?.overTimeHour <= 0 || values?.overTimeHour > 720)
    ) {
      return toast.warning("Overtime hour is not valid !!!");
    }

    if (values?.duration === "isRange" && !values?.startTime) {
      return toast.warning("Start time is required!!!");
    }

    if (values?.duration === "isRange" && !values?.endTime) {
      return toast.warning("End time is required!!!");
    }

    const hour = values?.overTimeHour?.split(":")[0];
    const min = values?.overTimeHour?.split(":")[1];

    let overTime = `${hour}.${min}`;

    // create && edit
    // let payload = {
    //   partType: "Overtime",
    //   isActive: true,
    //   businessUnitId: buId,
    //   accountId: orgId,
    //   workplaceId: 0,
    //   intCreatedBy: employeeId,
    //   startTime: values?.startTime || null,
    //   endTime: values?.endTime || null,
    //   overtimeDate: values?.date,
    //   overtimeHour:
    //     values?.duration === "isHourly" ? +values?.overTimeHour : +overTime,
    //   reason: values?.reason,
    // };

    let payload = [
      {
        intAccountId: orgId,
        intBusinessUnitId: buId,
        dteOverTimeDate: values?.date,
        tmeStartTime: values?.startTime || null,
        tmeEndTime: values?.endTime || null,
        numOverTimeHour:
          values?.duration === "isHourly" || values?.duration === "isMonthly"
            ? +values?.overTimeHour
            : +overTime,
        strReason: values?.reason,
        strFor: values.duration,
        isActive: true,
        intUpdatedBy: employeeId,
        dteUpdatedAt: todayDate(),
      },
    ];

    const callback = () => {
      cb();
      if (params?.id) {
        getOvertimeById(
          {
            strPartName: "OvertimeByEmployeeId",
            status: "All",
            intOverTimeId: +params?.id,
            departmentId: 0,
            designationId: 0,
            supervisorId: 0,
            employeeId: singleData?.employee?.value,
            workplaceGroupId: 0,
            businessUnitId: buId,
            loggedEmployeeId: employeeId,
            FormDate: state?.fromDate,
            toDate: state?.toDate,
          },
          setSingleData,
          setLoading
        );
      }
    };

    if (params?.id) {
      payload = [
        {
          ...payload[0],
          intOverTimeId: state?.intOverTimeId,
          employeeCode: `${state?.employeeCode}`,
          intCreatedBy: state?.intCreatedBy,
          dteCreatedAt: state?.dteCreatedAt,
        },
      ];
    } else {
      payload = [
        {
          ...payload[0],
          intOverTimeId: 0,
          employeeCode: `${values?.employee?.value}`,
          intCreatedBy: employeeId,
          dteCreatedAt: todayDate(),
        },
      ];
    }

    overtimeEntry_API(payload, setLoading, callback);
  };

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/Employee/EmployeeListBySupervisorORLineManagerNOfficeadmin?EmployeeId=${employeeId}&WorkplaceGroupId=${wgId}`,
      "intEmployeeBasicInfoId",
      "strEmployeeCode",
      setEmployeeDDL
    );
  }, [employeeId, wgId]);

  useEffect(() => {
    if (params?.id) {
      getEmployeeProfileViewData(
        state?.EmployeeId,
        setEmpBasic,
        setLoading,
        buId,
        wgId
      );
    }
  }, [params?.id, state?.EmployeeId, wgId, buId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          params?.id
            ? {
                ...singleData,
                employee: {
                  value:
                    empBasic?.employeeProfileLandingView
                      ?.intEmployeeBasicInfoId,
                  label: empBasic?.employeeProfileLandingView?.strEmployeeCode,
                },
              }
            : initData
        }
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
                            <label>Employee Id</label>
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
                              // getEmployeeProfileViewData(
                              //   valueOption?.value,
                              //   setEmpBasic,
                              //   setLoading
                              // );
                            }}
                            styles={customStyles}
                            errors={errors}
                            placeholder=""
                            touched={touched}
                            isDisabled={values?.employee}
                          />
                        </div>

                        {/* <div className="col-lg-3 pt-3">
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
                        </div> */}

                        <div className="col-12"></div>

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
                              value={"isHourly"}
                              onChange={(e) => {
                                setFieldValue("overTimeHour", "");
                                setFieldValue("startTime", "");
                                setFieldValue("endTime", "");
                                setFieldValue("duration", e.target.value);
                              }}
                              checked={values?.duration === "isHourly"}
                            />
                            <FormikRadio
                              styleObj={{
                                iconWidth: "15px",
                                icoHeight: "15px",
                                padding: "0px 8px 0px 10px",
                              }}
                              name="duration"
                              label="Range"
                              value={"isRange"}
                              onChange={(e) => {
                                setFieldValue("overTimeHour", "");
                                setFieldValue("startTime", "");
                                setFieldValue("endTime", "");
                                setFieldValue("duration", e.target.value);
                              }}
                              checked={values?.duration === "isRange"}
                            />
                            <FormikRadio
                              styleObj={{
                                iconWidth: "15px",
                                icoHeight: "15px",
                                padding: "0px 8px 0px 10px",
                              }}
                              name="duration"
                              label="Month"
                              value={"isMonthly"}
                              onChange={(e) => {
                                setFieldValue("overTimeHour", "");
                                setFieldValue("startTime", "");
                                setFieldValue("endTime", "");
                                setFieldValue("duration", e.target.value);
                              }}
                              checked={values?.duration === "isMonthly"}
                            />
                          </div>
                        </div>
                        <div className="col-12"></div>
                        {/* date */}
                        {(values?.duration === "isHourly" ||
                          values?.duration === "isRange") && (
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
                        )}
                        {values?.duration === "isMonthly" && (
                          <div className="col-3">
                            <div className="input-field-main">
                              <label>Month</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.date}
                                onChange={(val) => {
                                  setFieldValue("date", val.target.value);
                                }}
                                name="date"
                                type="month"
                                className="form-control"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                        )}
                        {/* range form */}
                        {values?.duration === "isRange" && (
                          <>
                            <div className="col-lg-3">
                              <div className="input-field-main">
                                <label>Start Time</label>
                                <FormikInput
                                  classes="input-sm"
                                  type="time"
                                  name="startTime"
                                  value={values?.startTime}
                                  onChange={(e) => {
                                    setFieldValue("startTime", e.target.value);
                                    if (values?.date && values?.endTime) {
                                      let difference = getDifferenceBetweenTime(
                                        values?.date,
                                        e.target.value,
                                        values?.endTime
                                      );
                                      setFieldValue("overTimeHour", difference);
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
                                  onChange={(e) => {
                                    setFieldValue("endTime", e.target.value);
                                    if (values?.date && values?.startTime) {
                                      let difference = getDifferenceBetweenTime(
                                        values?.date,
                                        values?.startTime,
                                        e.target.value
                                      );
                                      setFieldValue("overTimeHour", difference);
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

                        <div
                          className={
                            values.duration === "isMonthly" ? "" : "col-12"
                          }
                        ></div>

                        {/* hourly form */}
                        <div className="col-lg-3">
                          <div className="input-field-main">
                            <label>Overtime Hour</label>
                            <FormikInput
                              classes="input-sm"
                              type={
                                values?.duration === "isHourly" ||
                                values?.duration === "isMonthly"
                                  ? "number"
                                  : "text"
                              }
                              name="overTimeHour"
                              disabled={values?.duration === "isRange"}
                              value={values?.overTimeHour}
                              onChange={(e) => {
                                if (
                                  values?.duration === "isHourly" &&
                                  e.target.value > 24
                                ) {
                                  return toast.warning(
                                    `Daily Overtime cannot be greater than 24 hours`
                                  );
                                }
                                if (
                                  values?.duration === "isMonthly" &&
                                  e.target.value > 720
                                ) {
                                  return toast.warning(
                                    `Monthly Overtime cannot be greater than 720 hours`
                                  );
                                }
                                setFieldValue("overTimeHour", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>

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
                              disabled={params?.id && true}
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
