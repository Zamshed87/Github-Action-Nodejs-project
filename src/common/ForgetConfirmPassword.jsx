import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import lockIcon from "../assets/images/icon/lock.svg";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import AuthInput from "./AuthInput.jsx";
import PrimaryButton from "./PrimaryButton";

const initData = {
  newPassword: "",
  confirmPassword: "",
};
const validationSchema = Yup.object().shape({});

export default function ForgetConfirmPassword() {
  const [isPasswordShow, setIsPassword] = useState(false);
  const [isConfirmPasswordShow, setIsConfirmPassword] = useState(false);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
            <Form>
              <div className="forget-modal-body">
                <div className="forget-modal-img">
                  <img src={lockIcon} alt="iBOS" />
                </div>
                <div className="forget-modal-body">
                  <p className="forget-modal-body-para">
                    We will send a code, that you will able to reset your
                    password
                  </p>
                  <div className="forget-modal-form">
                    <div className="row">
                      <div className="col-12">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                          }}
                        >
                          <LockOutlinedIcon
                            sx={{
                              color: "action.active",
                              mr: 1,
                              my: 0.5,
                              position: "absolute",
                              top: "31px",
                              left: "20px",
                              zIndex: 1,
                            }}
                          />
                          <AuthInput
                            name="newPassword"
                            label="New Password"
                            type={isPasswordShow ? "text" : "password"}
                            value={values.newPassword}
                            onChange={handleChange}
                            errors={errors}
                            touched={touched}
                          />
                          <span onClick={() => setIsPassword(!isPasswordShow)}>
                            {isPasswordShow ? (
                              <VisibilityOutlinedIcon
                                sx={{
                                  color: "action.active",
                                  mr: 1,
                                  my: 0.5,
                                  position: "absolute",
                                  top: "31px",
                                  right: "20px",
                                  zIndex: 1,
                                }}
                              />
                            ) : (
                              <VisibilityOffOutlinedIcon
                                sx={{
                                  color: "action.active",
                                  mr: 1,
                                  my: 0.5,
                                  position: "absolute",
                                  top: "31px",
                                  right: "20px",
                                  zIndex: 1,
                                }}
                              />
                            )}
                          </span>
                        </Box>
                      </div>
                      <div className="col-12">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            position: "relative",
                          }}
                        >
                          <LockOutlinedIcon
                            sx={{
                              color: "action.active",
                              mr: 1,
                              my: 0.5,
                              position: "absolute",
                              top: "31px",
                              left: "20px",
                              zIndex: 1,
                            }}
                          />
                          <AuthInput
                            name="confirmPassword"
                            label="Confirm Password"
                            type={isConfirmPasswordShow ? "text" : "password"}
                            value={values.confirmPassword}
                            onChange={handleChange}
                            errors={errors}
                            touched={touched}
                          />

                          <span
                            onClick={() =>
                              setIsConfirmPassword(!isConfirmPasswordShow)
                            }
                          >
                            {isConfirmPasswordShow ? (
                              <VisibilityOutlinedIcon
                                sx={{
                                  color: "action.active",
                                  mr: 1,
                                  my: 0.5,
                                  position: "absolute",
                                  top: "31px",
                                  right: "20px",
                                  zIndex: 1,
                                }}
                              />
                            ) : (
                              <VisibilityOffOutlinedIcon
                                sx={{
                                  color: "action.active",
                                  mr: 1,
                                  my: 0.5,
                                  position: "absolute",
                                  top: "31px",
                                  right: "20px",
                                  zIndex: 1,
                                }}
                              />
                            )}
                          </span>
                        </Box>
                      </div>
                      <div className="col-12">
                        <div className="auth-log-submit">
                          <PrimaryButton
                            type="submit"
                            className="btn btn-basic"
                            label="Confirm"
                            // style={{ backgroundColor: "#00B200" }}
                          />
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
