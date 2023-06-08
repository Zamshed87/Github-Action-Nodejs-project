import React from 'react';
import { Form, Formik } from "formik";
import * as Yup from "yup";
import lockIcon from "../assets/images/icon/lock.svg";
import Box from '@mui/material/Box';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AuthInput from './AuthInput.jsx';
import PrimaryButton from './PrimaryButton';

const initData = {
    email: "",
};
const validationSchema = Yup.object().shape({});


export default function ForgetEmail({ setShowEmailModal, setShowPinModal }) {
    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={initData}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    setShowEmailModal(false);
                    setShowPinModal(true);
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
                                        We will send a code, that you will able to reset your password
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
                                                    <MailOutlineIcon
                                                        sx={{
                                                            color: "action.active",
                                                            mr: 1,
                                                            my: 0.5,
                                                            position: "absolute",
                                                            top: "31px",
                                                            left: "20px",
                                                            zIndex: 1
                                                        }}
                                                    />
                                                    <AuthInput
                                                        name="email"
                                                        label="Email address"
                                                        type="email"
                                                        value={values.email}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
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
                                                        label="Send"
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