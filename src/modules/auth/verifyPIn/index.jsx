/* eslint-disable eqeqeq */
import { ArrowBack } from "@mui/icons-material";
import { Box } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import FormikInput from "../../../common/FormikInput";
import PrimaryButton from "../../../common/PrimaryButton";
import {
  isOtpAuthAction,
  setLogoutAction
} from "../../../commonRedux/auth/actions";
import { getLoginOTP } from "../../../commonRedux/auth/api";
import { gray500 } from "../../../utility/customColor";
import mailIcon from "./mail.png";

const initData = {
  pinOne: "",
  pinTwo: "",
  pinThree: "",
  pinFour: "",
  pinFive: "",
  pinSix: "",
};

const validationSchema = Yup.object().shape({
  pinOne: Yup.string().matches(/^[0-9]{1}$/, "Number is invalid"),
  pinTwo: Yup.string().matches(/^[0-9]{1}$/, "Number is invalid"),
  pinThree: Yup.string().matches(/^[0-9]{1}$/, "Number is invalid"),
  pinFour: Yup.string().matches(/^[0-9]{1}$/, "Number is invalid"),
  pinFive: Yup.string().matches(/^[0-9]{1}$/, "Number is invalid"),
  pinSix: Yup.string().matches(/^[0-9]{1}$/, "Number is invalid"),
});

export default function VerifyPin() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [seconds, setSeconds] = useState(0);

  // const pinNumberObj = [];

  const { profileData } = useSelector((state) => state?.auth, shallowEqual);

  const goToLogin = () => {
    history.push("/");
  };
  setTimeout(() => {
    dispatch(
      isOtpAuthAction({
        ...profileData,
        isOtpAuth: false,
        loginPin: "",
      })
    );
    goToLogin();
  }, 1000000);

  const setFormFieldValue = (
    values,
    setFieldValue,
    fieldName,
    value,
    element_number
  ) => {
    // common  for value and backspace both
    (values[fieldName] == "" || value == "") && setFieldValue(fieldName, value);
    // when you type a value in field this will blur the field..only the last field will not blur because if a user want to edit pin without clicking on field
    document.getElementsByClassName("code")[element_number].value != "" &&
      element_number != 5 &&
      document.getElementsByClassName("code")[element_number].blur();
    // when you type a value in field ...this will make focus to next field
    value !== "" &&
      document.getElementsByClassName("code")[element_number + 1] &&
      document.getElementsByClassName("code")[element_number + 1].value == 0 &&
      document.getElementsByClassName("code")[element_number + 1].focus();
    // if you type a back button ...this will make previous field focused if there is no value in next field....
    value == "" &&
      element_number != 0 &&
      !document.getElementsByClassName("code")[element_number + 1]?.value &&
      document.getElementsByClassName("code")[element_number - 1].focus();
  };

  const saveHandler = (values, cb) => {
    let payload = `${values?.pinOne}${values?.pinTwo}${values?.pinThree}${values?.pinFour}${values?.pinFive}${values?.pinSix}`;

    if (profileData?.loginPin === +payload) {
      dispatch(
        isOtpAuthAction({
          ...profileData,
          isOtpAuth: true,
        })
      );
      toast.success("Login Successfully!!");
    } else {
      toast.warning("Please provide a valid pin number!!!");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
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
          setValues,
          handleChange,
          handleBlur,
        }) => (
          <>
            <Form autoComplete="off">
              <div className="auth-wrapper-page">
                <div className="auth-login-wrapper">
                  <div className="auth-login-inner-wrapper">
                    <div className="auth-login-header">
                      <div className="auth-login-header-logo">
                        <img src={mailIcon} alt="iBOS" />
                      </div>
                    </div>
                    <div className="auth-login-body">
                      <div className="forget-modal-body">
                        <p className="forget-modal-body-para">
                          Please check your email, we sent a OTP to
                          <span style={{ marginLeft: "3px" }}>
                            {profileData?.strOfficeMail ||
                              profileData?.strPersonalMail}
                          </span>
                        </p>
                        <div className="forget-modal-form">
                          <div className="row">
                            <div className="col-12">
                              <Box
                                className="forget-modal-pin-form"
                                id="otp-form"
                              >
                                {/* <div className="form-group login-input input-xl verify-pin-form">
                                  <input
                                    className="form-control verify-pin-form"
                                    type="text"
                                    name="pinOne"
                                    id="pinOne"
                                    maxLength="1"
                                  />
                                </div>
                                <div className="form-group login-input input-xl verify-pin-form">
                                  <input
                                    className="form-control verify-pin-form"
                                    type="text"
                                    name="pinTwo"
                                    id="pinTwo"
                                    maxLength="1"
                                  />
                                </div>
                                <div className="form-group login-input input-xl verify-pin-form">
                                  <input
                                    className="form-control verify-pin-form"
                                    type="text"
                                    name="pinThree"
                                    id="pinThree"
                                    maxLength="1"
                                  />
                                </div>
                                <div className="form-group login-input input-xl verify-pin-form">
                                  <input
                                    className="form-control verify-pin-form"
                                    type="text"
                                    name="pinFour"
                                    id="pinFour"
                                    maxLength="1"
                                  />
                                </div>
                                <div className="form-group login-input input-xl verify-pin-form">
                                  <input
                                    className="form-control verify-pin-form"
                                    type="text"
                                    name="pinFive"
                                    id="pinFive"
                                    maxLength="1"
                                  />
                                </div>
                                <div className="form-group login-input input-xl verify-pin-form">
                                  <input
                                    className="form-control verify-pin-form"
                                    type="text"
                                    name="pinSix"
                                    id="pinSix"
                                    maxLength="1"
                                  />
                                </div> */}
                                <FormikInput
                                  classes="verify-pin-form"
                                  value={values?.pinOne}
                                  name="pinOne"
                                  type="text"
                                  inputClasses="auth-pin-form code"
                                  onChange={(e) => {
                                    setFormFieldValue(
                                      values,
                                      setFieldValue,
                                      "pinOne",
                                      e.target.value,
                                      0
                                    );
                                  }}
                                  maxLength={1}
                                  errors={errors}
                                  touched={touched}
                                />
                                <FormikInput
                                  classes="verify-pin-form"
                                  value={values?.pinTwo}
                                  name="pinTwo"
                                  type="text"
                                  inputClasses="auth-pin-form code"
                                  onChange={(e) => {
                                    setFormFieldValue(
                                      values,
                                      setFieldValue,
                                      "pinTwo",
                                      e.target.value,
                                      1
                                    );
                                  }}
                                  maxLength={1}
                                  errors={errors}
                                  touched={touched}
                                />
                                <FormikInput
                                  classes="verify-pin-form"
                                  value={values?.pinThree}
                                  name="pinThree"
                                  type="text"
                                  inputClasses="auth-pin-form code"
                                  onChange={(e) => {
                                    setFormFieldValue(
                                      values,
                                      setFieldValue,
                                      "pinThree",
                                      e.target.value,
                                      2
                                    );
                                  }}
                                  maxLength={1}
                                  errors={errors}
                                  touched={touched}
                                />
                                <FormikInput
                                  classes="verify-pin-form"
                                  value={values?.pinFour}
                                  name="pinFour"
                                  type="text"
                                  inputClasses="auth-pin-form code"
                                  onChange={(e) => {
                                    setFormFieldValue(
                                      values,
                                      setFieldValue,
                                      "pinFour",
                                      e.target.value,
                                      3
                                    );
                                  }}
                                  maxLength={1}
                                  errors={errors}
                                  touched={touched}
                                />
                                <FormikInput
                                  classes="verify-pin-form"
                                  value={values?.pinFive}
                                  name="pinFive"
                                  type="text"
                                  inputClasses="auth-pin-form code"
                                  onChange={(e) => {
                                    setFormFieldValue(
                                      values,
                                      setFieldValue,
                                      "pinFive",
                                      e.target.value,
                                      4
                                    );
                                  }}
                                  maxLength={1}
                                  errors={errors}
                                  touched={touched}
                                />
                                <FormikInput
                                  classes="verify-pin-form"
                                  value={values?.pinSix}
                                  name="pinSix"
                                  type="text"
                                  inputClasses="auth-pin-form code"
                                  onChange={(e) => {
                                    setFormFieldValue(
                                      values,
                                      setFieldValue,
                                      "pinSix",
                                      e.target.value,
                                      5
                                    );
                                  }}
                                  maxLength={1}
                                  errors={errors}
                                  touched={touched}
                                />
                              </Box>
                            </div>
                            <div className="col-12">
                              <div className="auth-log-submit">
                                <PrimaryButton
                                  type="submit"
                                  className="btn btn-green"
                                  label="Verify"
                                  disabled={
                                    !values?.pinOne ||
                                    !values?.pinTwo ||
                                    !values?.pinThree ||
                                    !values?.pinFour ||
                                    !values?.pinFive ||
                                    !values?.pinSix
                                  }
                                />
                              </div>
                            </div>
                            {seconds > 60 && (
                              <>
                                <div className="col-12">
                                  <div className="auth-resend">
                                    Didn't receive the email?
                                    <span
                                      onClick={() => {
                                        getLoginOTP(
                                          profileData?.strOfficeMail ||
                                            profileData?.strPersonalMail
                                        )
                                          .then((res) => {
                                            dispatch(
                                              isOtpAuthAction({
                                                ...profileData,
                                                loginPin: +res?.data?.message,
                                              })
                                            );
                                            clearInterval(setSeconds(0));
                                          })
                                          .catch((error) => {
                                            toast.error(
                                              "Login failed, please try again"
                                            );
                                          });
                                      }}
                                    >
                                      Clicks to resend
                                    </span>
                                  </div>
                                </div>
                              </>
                            )}

                            <div className="col-12">
                              <div className="auth-log-submit">
                                <div
                                  className="auth-back-login pointer text-center"
                                  onClick={() => {
                                    history.push("/");
                                    dispatch(setLogoutAction());
                                  }}
                                >
                                  <ArrowBack
                                    sx={{
                                      color: gray500,
                                      fontSize: "16px",
                                      marginRight: "12px",
                                    }}
                                  />
                                  Back to log in
                                </div>
                              </div>
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
