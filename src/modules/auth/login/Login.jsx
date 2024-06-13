import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import authLogo from "../../../assets/images/authLogo.svg";
import ForgetConfirmPassword from "../../../common/ForgetConfirmPassword";
import FormikInput from "../../../common/FormikInput";
import PrimaryButton from "../../../common/PrimaryButton";
import { setLoginAction } from "../../../commonRedux/auth/actions";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import ForgetEmail from "./../../../common/ForgetEmail";
import ForgetPinVerify from "./../../../common/ForgetPinVerify";
import Loading from "./../../../common/loading/Loading";
import ViewModal from "./../../../common/ViewModal";
import LoginWithGoogle from "./LoginWithGoogle";

const initData = {
  username: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  username: Yup.string().required("User id is required"),
  password: Yup.string()
    .min(4, "Minimum 4 character")
    .max(100, "Maximum 100 character")
    .required("Password is required"),
});

const LogIn = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        dispatch(
          setLoginAction(
            values?.username,
            values?.password,
            history,
            setLoading
          )
        );
        dispatch(setFirstLevelNameAction("Dashboard"));
      }}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <>
          <Form autoComplete="off">
            <div className="auth-wrapper-page">
              {loading && <Loading />}
              <div className="auth-login-wrapper">
                <div className="auth-login-inner-wrapper">
                  <div
                    onClick={() => history.push("/")}
                    className="auth-login-header pointer"
                  >
                    <div className="auth-login-header-logo">
                      <img src={authLogo} alt="iBOS" />
                    </div>
                    <p>
                      Most powerful HR management system, that you have never
                      seen before.
                    </p>
                  </div>
                  <div className="auth-login-body">
                    <div className="row">
                      <div className="col-12">
                        <div className="input-field-main login-input-field custom-login-placeholder">
                          <label>Enter ID</label>
                          <FormikInput
                            classes="input-sm auth-input-sm"
                            value={values?.username}
                            placeholder="Enter your id"
                            name="username"
                            type="text"
                            onChange={(e) => {
                              setFieldValue("username", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      <div className="col-12" style={{ marginTop: "-1em" }}>
                        <div className="input-field-main login-input-field">
                          <label>Password</label>
                          <FormikInput
                            classes="input-sm auth-input-sm"
                            value={values?.password}
                            placeholder="Enter your password"
                            name="password"
                            type="password"
                            passwordicon={" "}
                            onChange={(e) => {
                              setFieldValue("password", e.target.value);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                      {/*  label="Confirm Password"
                                value={values?.confirmPassword}
                                name="confirmPassword"
                                type="password"
                                className="form-control"
                                leadicon={<LockOpen />}
                                passwordicon={" "}
                                errors={errors}
                                touched={touched} */}
                      {/* <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center">
                          <MasterCheckBox
                            options={[
                              {
                                value: "1",
                                label: "Remember me",
                              },
                            ]}
                            styleObj={{
                              color: greenColor,
                            }}
                          />
                          <p
                            style={{ cursor: "pointer" }}
                            className="o-cursor-pointer auth-forget"
                            onClick={(e) => {
                              setShowEmailModal(true);
                            }}
                          >
                            Forget Password ?
                          </p>
                        </div>
                      </div> */}
                      <div className="col-12" style={{ marginTop: "-1.3em" }}>
                        <div className="auth-log-submit">
                          <PrimaryButton
                            type="submit"
                            className="btn btn-green"
                            label="Log In"
                            disabled={loading}
                          />
                        </div>
                        <div
                          style={{
                            marginTop: 10,
                          }}
                        >
                          <LoginWithGoogle
                            history={history}
                            setLoading={setLoading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <AuthFooter /> */}
            </div>

            {/* Forget Email */}
            <div className="auth-modal">
              <ViewModal
                show={showEmailModal}
                title={"Forget Password"}
                onHide={() => setShowEmailModal(false)}
                size="xl"
              >
                <ForgetEmail
                  setShowEmailModal={setShowEmailModal}
                  setShowPinModal={setShowPinModal}
                />
              </ViewModal>
            </div>

            {/* Forget Pin Verify */}
            <div className="auth-modal">
              <ViewModal
                show={showPinModal}
                title={"Forget Password"}
                onHide={() => setShowPinModal(false)}
                size="xl"
              >
                <ForgetPinVerify
                  setShowPinModal={setShowPinModal}
                  setShowPasswordModal={setShowPasswordModal}
                />
              </ViewModal>
            </div>

            {/* Forget password */}
            <div className="auth-modal">
              <ViewModal
                show={showPasswordModal}
                title={"Forget Password"}
                onHide={() => setShowPasswordModal(false)}
                size="xl"
              >
                <ForgetConfirmPassword />
              </ViewModal>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default LogIn;
