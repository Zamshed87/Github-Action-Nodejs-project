/* eslint-disable react-hooks/exhaustive-deps */
import { LockOpen } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import BackButton from "../../../common/BackButton";
import Loading from "../../../common/loading/Loading";
import LoginInput from "../../../common/login/LoginInput";
import { setLogoutAction } from "../../../commonRedux/auth/actions";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { changePassword } from "./helper";

const initData = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Old password is required"),
  newPassword: Yup.string()
    .min(4, "Minimum 4 character")
    .max(50, "Maximum 50 character")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf(
      [Yup.ref("newPassword"), null],
      "Password must match with new password"
    ),
});

export default function ChangePassword() {
  const { orgId, employeeId, strLoginId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [loading] = useState(false);

  const saveHandler = (values, cb) => {
    changePassword({
      accountId: orgId,
      loginId: strLoginId,
      oldPassword: values?.oldPassword,
      newPassword: values?.newPassword,
      employeeId,
      cb: () => {
        dispatch(setLogoutAction());
        dispatch(setFirstLevelNameAction(""));
      },
    });
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
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
                <div className="table-card-heading heading pt-0">
                  <BackButton title={"Change Password"} />
                  <ul className="d-flex flex-wrap">
                    <li>
                      <button
                        type="button"
                        onClick={() => resetForm(initData)}
                        className="btn btn-default mr-2"
                      >
                        Reset
                      </button>
                    </li>
                    <li>
                      <button
                        onSubmit={handleSubmit}
                        type="submit"
                        className="btn btn-default flex-center"
                      >
                        Save
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="table-card-body">
                  <div className="auth-login-inner-wrapper">
                    <div className="form-card col-md-12 pl-0">
                      <div className="auth-login-body">
                        <div
                          className="card-body"
                          style={{ padding: "0.5rem 0 0.75rem 0" }}
                        >
                          <div className="row m-lg-1 m-0">
                            <div className="col-12">
                              <LoginInput
                                label="Old Password"
                                value={values?.oldPassword}
                                name="oldPassword"
                                type="password"
                                className="form-control"
                                leadicon={<LockOpen />}
                                passwordicon={" "}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-12">
                              <LoginInput
                                label="New Password"
                                value={values?.newPassword}
                                name="newPassword"
                                type="password"
                                className="form-control"
                                leadicon={<LockOpen />}
                                passwordicon={" "}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-12">
                              <LoginInput
                                label="Confirm Password"
                                value={values?.confirmPassword}
                                name="confirmPassword"
                                type="password"
                                className="form-control"
                                leadicon={<LockOpen />}
                                passwordicon={" "}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
