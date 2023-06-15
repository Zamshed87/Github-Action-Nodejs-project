import { Refresh } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { FieldArray, FormikProvider, useFormik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { getSearchEmployeeList } from "../../../../common/api";
import BackButton from "../../../../common/BackButton";
import DefaultInput from "../../../../common/DefaultInput";
import FormikRadio from "../../../../common/FormikRadio";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { todayDate } from "../../../../utility/todayDate";
import { getOvertimeById, saveOvertime } from "../helper";
import AsyncFormikSelect from "../../../../common/AsyncFormikSelect";

const initData = {
  employee: "",

  duration: "Daily",
  otInfo: [
    {
      date: "",
      overTimeHour: "",
      reason: "",
    },
  ],
};

const validationSchema = Yup.object().shape({
  employee: Yup.object()
    .shape({
      label: Yup.string().required("Employee is required"),
      value: Yup.string().required("Employee is required"),
    })
    .typeError("Employee is required"),
  // date: Yup.string().required("Date is required"),
  duration: Yup.string().required("Duration is required"),
  otInfo: Yup.array().of(
    Yup.object().shape({
      date: Yup.string().required("Date is required"),
      overTimeHour: Yup.string().required("Overtime Hour is required"),
    })
  ),
});

export default function AddEditOverTime() {
  const params = useParams();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState("");
  const history = useHistory();

  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
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
          workplaceGroupId: state?.WorkplaceGroupId,
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

  console.log(state);

  const saveHandler = (values, cb) => {
    let payload = values?.otInfo?.map((data) => {
      // let modifiedData = {
      //   employeeCode: params?.id
      //     ? values?.employee?.label
      //     : values?.employee?.strEmployeeCode,
      //   intAccountId: orgId,
      //   intBusinessUnitId: buId,
      //   intYear: +data?.date.split("-")[0],
      //   intMonth: +data?.date.split("-")[1],
      //   dteOverTimeDate:
      //     values?.duration === "Monthly"
      //       ? params.id
      //         ? `${moment(data?.date).format("YYYY-MM")}-01`
      //         : `${moment(data?.date).format("YYYY-MM")}-01`
      //       : data?.date,
      //   numOverTimeHour: +data?.overTimeHour,
      //   strReason: data?.reason,
      //   strDailyOrMonthly: values?.duration,
      //   isActive: true,
      //   intCreatedBy: employeeId,
      //   dteCreatedAt: todayDate(),
      //   intUpdatedBy: employeeId,
      //   dteUpdatedAt: todayDate(),
      // };

      let modifiedData = {
        intOverTimeId: state?.OvertimeId || 0,
        intEmployeeId: state?.EmployeeId || values?.employee?.employeeId,
        employeeCode: state?.EmployeeCode || values?.employee?.employeeCode,
        intAccountId: orgId,
        intBusinessUnitId: buId,
        intWorkplaceGroupId: state?.WorkplaceGroupId || wgId,
        intYear: +data?.date.split("-")[0],
        intMonth: +data?.date.split("-")[1],
        dteOverTimeDate:
          values?.duration === "Monthly"
            ? params.id
              ? `${moment(data?.date).format("YYYY-MM")}-01`
              : `${moment(data?.date).format("YYYY-MM")}-01`
            : data?.date,
        numOverTimeHour: +data?.overTimeHour,
        strReason: data?.reason,
        strDailyOrMonthly: values?.duration,
        isActive: true,
        intCreatedBy: employeeId,
        dteCreatedAt: todayDate(),
        intUpdatedBy: employeeId,
        dteUpdatedAt: todayDate(),
      };
      return modifiedData;
    });

    const callback = () => {
      history.push("/profile/overTime/manualEntry");
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
            workplaceGroupId: state?.WorkplaceGroupId,
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

    saveOvertime(payload, setLoading, callback);
  };

  // useEffect(() => {
  //   if (params?.id) {
  //     getEmployeeProfileViewData(
  //       state?.EmployeeId,
  //       setEmpBasic,
  //       setLoading,
  //       buId,
  //       wgId
  //     );
  //   }
  // }, [params?.id, state?.EmployeeId, buId, wgId]);

  const forms = useFormik({
    enableReinitialize: true,
    initialValues: params?.id
      ? {
          ...singleData,
          employee: {
            value: state?.EmployeeId,
            label: state?.EmployeeName,
          },
          duration: singleData?.strDailyOrMonthly,
          otInfo: [
            {
              date:
                singleData?.strDailyOrMonthly === "Monthly"
                  ? moment(singleData?.date).format("YYYY-MM")
                  : singleData?.date,
              overTimeHour: singleData?.overTimeHour,
              reason: singleData?.reason,
            },
          ],
        }
      : initData,

    validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      saveHandler(values, () => {
        if (!params?.id) {
          resetForm(initData);
        }
      });
    },
  });

  let { values, errors, touched, setFieldValue, handleSubmit, resetForm } =
    forms;

  const varifyNumber = (e) => {
    return e.nativeEvent.data === "-" || e.target.value.includes("-");
  };

  return (
    <FormikProvider value={forms}>
      {loading && <Loading />}
      {permission?.isCreate ? (
        <form onSubmit={handleSubmit}>
          <div className="table-card">
            <div
              className="table-card-heading"
              style={{ marginBottom: "12px" }}
            >
              <div className="d-flex align-items-center">
                <BackButton />
                <h2>
                  {params?.id ? `Edit Overtime Entry` : `Create Overtime Entry`}
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
                    disabled={Object.keys(errors).length > 0 || loading}
                  >
                    Save
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-style with-form-card">
              <div className="row align-items-center  mt-2">
                {/* employee */}
                <div className="col-lg-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <label>Employee</label>
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
                  <AsyncFormikSelect
                    selectedValue={values?.employee}
                    isSearchIcon={true}
                    handleChange={(valueOption) => {
                      setFieldValue("employee", valueOption);
                    }}
                    placeholder="Search (min 3 letter)"
                    loadOptions={(v) => getSearchEmployeeList(buId, wgId, v)}
                    isDisabled={params?.id && true}
                  />
                </div>

                {/* checkbox */}
                <div className="col-lg-6">
                  <div className="input-feild-main">
                    <FormikRadio
                      styleObj={{
                        iconWidth: "15px",
                        icoHeight: "15px",
                        padding: "0px 8px 0px 10px",
                      }}
                      name="duration"
                      label="Daily"
                      value={"Daily"}
                      onChange={(e) => {
                        setFieldValue("otInfo", [
                          {
                            date: "",
                            overTimeHour: "",
                            reason: "",
                          },
                        ]);
                        setFieldValue("duration", e.target.value);
                      }}
                      checked={values?.duration === "Daily"}
                      disabled={values?.duration === "Monthly"}
                    />
                    <FormikRadio
                      styleObj={{
                        iconWidth: "15px",
                        icoHeight: "15px",
                        padding: "0px 8px 0px 10px",
                      }}
                      name="duration"
                      label="Monthly"
                      value={"Monthly"}
                      onChange={(e) => {
                        setFieldValue("otInfo", [
                          {
                            date: "",
                            overTimeHour: "",
                            reason: "",
                          },
                        ]);
                        setFieldValue("duration", e.target.value);
                      }}
                      checked={values?.duration === "Monthly"}
                      disabled={values?.duration === "Daily"}
                    />
                  </div>
                </div>
                <div className="col-12"></div>
              </div>
              <FieldArray name="otInfo">
                {({ remove, push, form }) => (
                  <div>
                    <div className="row">
                      {form?.values.otInfo?.map((data, index) => (
                        <>
                          {values?.duration === "Monthly" && (
                            <div className="col-3">
                              <div className="input-field-main">
                                <label>Month</label>
                                <DefaultInput
                                  classes="input-sm"
                                  value={values?.otInfo[index]?.date}
                                  onChange={(val) => {
                                    setFieldValue(
                                      `otInfo.${index}.date`,
                                      val.target.value
                                    );
                                  }}
                                  name={`otInfo.${index}.date`}
                                  type="month"
                                  className="form-control"
                                  errors={errors}
                                  touched={touched}
                                  disabled={params?.id && true}
                                />
                              </div>
                            </div>
                          )}

                          {values?.duration === "Daily" && (
                            <div className="col-lg-3">
                              <div className="input-field-main">
                                <label>Date</label>
                                <DefaultInput
                                  classes="input-sm"
                                  name={`otInfo.${index}.date`}
                                  type="date"
                                  value={values?.otInfo[index]?.date}
                                  max={todayDate()}
                                  onChange={(e) => {
                                    setFieldValue(
                                      `otInfo.${index}.date`,
                                      e.target.value
                                    );
                                  }}
                                  errors={errors}
                                  touched={touched}
                                  disabled={params?.id && true}
                                />
                              </div>
                            </div>
                          )}

                          {/* hourly form */}
                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>Overtime Hour</label>
                              <DefaultInput
                                classes="input-sm"
                                type="number"
                                name={`otInfo.${index}.overTimeHour`}
                                value={values?.otInfo[index]?.overTimeHour}
                                onChange={(e) => {
                                  if (
                                    values?.duration === "Daily" &&
                                    (e.target.value > 24 || varifyNumber(e))
                                  ) {
                                    return toast.warning(
                                      `Please provide a valid number between 0-24`
                                    );
                                  }
                                  if (
                                    values?.duration === "Monthly" &&
                                    (e.target.value > 720 || varifyNumber(e))
                                  ) {
                                    return toast.warning(
                                      `Please provide a valid number between 0-720`
                                    );
                                  }
                                  setFieldValue(
                                    `otInfo.${index}.overTimeHour`,
                                    e.target.value
                                  );
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>

                          <div className="col-lg-3">
                            <div className="input-field-main">
                              <label>Reason (Optional)</label>
                              <DefaultInput
                                classes="input-sm"
                                type="text"
                                name={`otInfo.${index}.reason`}
                                value={values?.otInfo[index]?.reason}
                                onChange={(e) => {
                                  setFieldValue(
                                    `otInfo.${index}.reason`,
                                    e.target.value
                                  );
                                }}
                                disabled={
                                  params?.id && singleData?.reason && true
                                }
                              />
                            </div>
                          </div>

                          {!params.id && (
                            <div className="col-lg-3 d-flex align-items-center">
                              {index > 0 && (
                                <RemoveCircleIcon
                                  sx={{
                                    marginRight: "0px",
                                    mt: 1,
                                    fontSize: "20px",
                                    color: "var(--error)",
                                  }}
                                  className="pointer"
                                  onClick={() => remove(index)}
                                />
                              )}
                              {values?.duration === "Daily" &&
                                index === form?.values.otInfo?.length - 1 && (
                                  <AddCircleIcon
                                    sx={{
                                      marginRight: "0px",
                                      mt: 1,
                                      fontSize: "20px",
                                      color: "var(--success700)",
                                    }}
                                    className="pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      push({
                                        date: "",
                                        overTimeHour: "",
                                        reason: "",
                                      });
                                    }}
                                  />
                                )}
                            </div>
                          )}
                        </>
                      ))}
                    </div>
                    {/* <div>
                      {values?.duration === "daily" && (
                        <div className="pb-2">
                          <PrimaryButton
                            type="button"
                            className="btn btn-default flex-center"
                            label="Add"
                            icon={<AddOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              push({
                                date: "",
                                overTimeHour: "",
                                reason: "",
                              });
                            }}
                          />
                        </div>
                      )}
                    </div> */}
                  </div>
                )}
              </FieldArray>
              {/* date */}
            </div>
          </div>
        </form>
      ) : (
        <NotPermittedPage />
      )}
    </FormikProvider>
  );
}
