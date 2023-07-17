import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import { useHistory } from 'react-router-dom';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import Loading from '../../common/loading/Loading';
import DefaultInput from '../../common/DefaultInput';
import authLogo from "../../assets/images/authLogo.svg";
import PrimaryButton from '../../common/PrimaryButton';
import { setLoginAction, setLogoutAction } from '../../commonRedux/auth/actions';
import { setFirstLevelNameAction } from '../../commonRedux/reduxForLocalStorage/actions';

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

export default function ExpiredToken() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const { strLoginId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // for create state
  const [open, setOpen] = useState(true);

  // for create Modal
  const handleClose = () => {
    setOpen(true);
  };

  // on form submit
  const saveHandler = (values) => {
    dispatch(
      setLoginAction(
        values?.username,
        values?.password,
        history,
        setLoading
      )
    );
    dispatch(setFirstLevelNameAction("Dashboard"));
  };

  // useFormik hooks
  const {
    setFieldValue,
    values,
    errors,
    touched,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    validationSchema,
    initialValues: {
      ...initData,
      username: strLoginId
    },
    onSubmit: (values) => saveHandler(values),
  });

  return (
    <>
      {loading && <Loading />}
      <div className="viewModal">
        <Modal
          show={open}
          onHide={handleClose}
          size="lg"
          backdrop="static"
          aria-labelledby="example-modal-sizes-title-xl"
          className="default-modal"
        >
          <form onSubmit={handleSubmit}>
            <Modal.Body id="example-modal-sizes-title-xl">
              <div className="businessUnitModal">
                <div className="pt-0 px-0">
                  <div className="auth-login-wrapper">
                    <div
                      className="auth-login-inner-wrapper"
                      style={{ marginBottom: "35px" }}
                    >
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
                              <DefaultInput
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
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="input-field-main login-input-field">
                              <label>Password</label>
                              <DefaultInput
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
                          <div className="col-6">
                            <div className="auth-log-submit">
                              <PrimaryButton
                                type="submit"
                                className="btn btn-green"
                                label="Log In"
                                disabled={loading}
                              />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="auth-log-submit">
                              <PrimaryButton
                                type="button"
                                className="btn btn-green"
                                label="Log Out"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  history.push("/");
                                  dispatch(setLogoutAction());
                                  dispatch(setFirstLevelNameAction(""));
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </form>
        </Modal>
      </div>
    </>
  );
}
