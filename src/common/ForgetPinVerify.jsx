import React from 'react';
import { Form, Formik } from "formik";
import * as Yup from "yup";
import lockIcon from "../assets/images/icon/lock.svg";
import Box from '@mui/material/Box';
import PrimaryButton from './PrimaryButton';

const initData = {
    email: "",
};
const validationSchema = Yup.object().shape({});


export default function ForgetPinVerify({ setShowPinModal, setShowPasswordModal }) {
    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={initData}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    setShowPasswordModal(true);
                    setShowPinModal(false);
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
                        <Form>
                            <div className="forget-modal-body">
                                <div className="forget-modal-img">
                                    <img src={lockIcon} alt="iBOS" />
                                </div>
                                <div className="forget-modal-body">
                                    <p className="forget-modal-body-para">
                                        We send a verification code to you email. If your didn’t receive the email? <span>Resend</span>
                                    </p>
                                    <div className="forget-modal-form">
                                        <div className="row">
                                            <div className="col-12">
                                                <Box className="forget-modal-pin-form">
                                                    <input
                                                        className="form-control auth-pin-form"
                                                        type="text"
                                                        errors={errors}
                                                        touched={touched}
                                                    />
                                                    <input
                                                        className="form-control auth-pin-form"
                                                        type="text"
                                                        errors={errors}
                                                        touched={touched}
                                                    />
                                                    <input
                                                        className="form-control auth-pin-form"
                                                        type="text"
                                                        errors={errors}
                                                        touched={touched}
                                                    />
                                                    <input
                                                        className="form-control auth-pin-form"
                                                        type="text"
                                                        errors={errors}
                                                        touched={touched}
                                                    />
                                                    <input
                                                        className="form-control auth-pin-form"
                                                        type="text"
                                                        errors={errors}
                                                        touched={touched}
                                                    />
                                                    <input
                                                        className="form-control auth-pin-form"
                                                        type="text"
                                                        errors={errors}
                                                        touched={touched}
                                                    />
                                                </Box>
                                            </div>
                                            <div className="col-12">
                                                <div className="auth-log-submit">
                                                    <PrimaryButton
                                                        type="submit"
                                                        className="btn btn-basic"
                                                        label="Verify"
                                                    // style={{ backgroundColor: "#00B200" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form></>
                )}
            </Formik>
        </>

    );
}