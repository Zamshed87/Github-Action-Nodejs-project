import { useFormik } from "formik";
import React from "react";
import DefaultInput from "../../../../common/DefaultInput";
import { useState } from "react";
import PrimaryButton from "../../../../common/PrimaryButton";
import { useEffect } from "react";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  ErrorLinearProgress,
  calcDateDiff,
  initialValues,
  onGetAttendanceResponse,
  validationSchema,
} from "./helper";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import LinearProgress from "@mui/material/LinearProgress";
import moment from "moment";
import ResetButton from "../../../../common/ResetButton";
import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import Loading from "../../../../common/loading/Loading";

function AttendanceRawDataProcess() {
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30383) {
      permission = item;
    }
  });

  const dispatch = useDispatch();
  const today = moment().format("YYYY-MM-DD");

  //   the api response will throw only a string either success or server error
  const [res, setRes] = useState("");
  const [loading, setLoading] = useState(false);
  const [empDDL, setEmpDDL] = useState([]);

  const { handleSubmit, values, setFieldValue, errors, touched, resetForm } =
    useFormik({
      enableReinitialize: true,
      initialValues,
      validationSchema,
      onSubmit: (values, { setSubmitting, resetForm }) => {
        saveHandler(values);
      },
    });

  const saveHandler = (values) => {
    onGetAttendanceResponse({
      setRes,
      setLoading,
      orgId,
      employeeId: values?.employee?.value || "",
      fromDate: values?.fromDate,
      toDate: values?.toDate,
    });
  };

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeBasicInfo&AccountId=${orgId}&BusinessUnitId=${buId}&intId=${employeeId}`,
      "EmployeeId",
      "EmployeeName",
      setEmpDDL
    );
  }, [orgId, buId, employeeId]);

  return permission?.isView ? (
    <form onSubmit={handleSubmit}>
      {loading && <Loading />}
      <div className="table-card">
        <div className="table-card-body">
          <div className="card-style with-form-card pb-0 my-3">
            <div className="row">
              <div className="input-field-main col-lg-3">
                <label>From Date</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.fromDate}
                  name="fromDate"
                  type="date"
                  className="form-control"
                  max={today}
                  onChange={(e) => {
                    setFieldValue("fromDate", e.target.value);
                    setFieldValue("toDate", "");
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="input-field-main col-lg-3">
                <label>To Date</label>
                <DefaultInput
                  classes="input-sm"
                  value={values?.toDate}
                  name="toDate"
                  type="date"
                  min={values?.fromDate}
                  max={
                    calcDateDiff(values?.fromDate, today) < 10
                      ? today
                      : moment(values?.fromDate)
                          .add(10, "days")
                          .format("YYYY-MM-DD")
                  }
                  className="form-control"
                  onChange={(e) => {
                    setFieldValue("toDate", e.target.value);
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="input-field-main col-lg-3">
                <label>Employee</label>
                <FormikSelect
                  classes="input-sm"
                  name="employee"
                  options={empDDL || []}
                  value={values?.employee}
                  onChange={(valueOption) => {
                    setFieldValue("employee", valueOption);
                  }}
                  placeholder=" "
                  styles={customStyles}
                  errors={errors}
                  touched={touched}
                  menuPosition="fixed"
                />
              </div>
              <div style={{ marginTop: "21px" }} className="col-lg-3">
                <PrimaryButton
                  type="submit"
                  className="btn btn-green flex-center"
                  label={"Process"}
                  disabled={loading ? true : false}
                />
              </div>
              {res !== "" && (
                <div className="col-lg-3">
                  <ResetButton
                    classes="btn-filter-reset"
                    title="reset"
                    icon={
                      <SettingsBackupRestoreOutlined
                        sx={{ marginRight: "10px", fontSize: "16px" }}
                      />
                    }
                    styles={{
                      marginRight: "16px",
                    }}
                    onClick={() => {
                      resetForm();
                      setRes("");
                    }}
                  />
                </div>
              )}
            </div>
            <div className="py-2 pb-4">
              {loading && (
                <>
                  <h3 className="mb-2">Processing</h3>
                  <LinearProgress
                    color="success"
                    sx={{ height: "16px", width: "50%" }}
                  />
                </>
              )}
              {!loading &&
                (res === "success" ? (
                  <>
                    <h3 className="mb-2">Processing Completed</h3>
                    <LinearProgress
                      color="success"
                      sx={{ height: "16px", width: "50%" }}
                      variant="determinate"
                      value={100}
                    />
                  </>
                ) : (
                  res !== "" && (
                    <>
                      <h3 className="mb-2">Something Went Wrong</h3>
                      <ErrorLinearProgress variant="determinate" value={100} />
                    </>
                  )
                ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  ) : (
    <NotPermittedPage />
  );
}

export default AttendanceRawDataProcess;
