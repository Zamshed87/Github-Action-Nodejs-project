/* eslint-disable react-hooks/exhaustive-deps */
import { Close } from "@mui/icons-material";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Avatar, IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { todayDate } from "../../../../utility/todayDate";
import { createUser } from "../helper";
import { getPeopleDeskAllDDL } from "../../../../common/api/index";
import FormikInput from "../../../../common/FormikInput";
import FormikSelect from "../../../../common/FormikSelect";
import FormikToggle from "../../../../common/FormikToggle";
import Loading from "../../../../common/loading/Loading";
import {
  blackColor40,
  gray900,
  greenColor,
} from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/newSelectCustomStyle";

const initData = {
  loginUserId: "",
  password: "",
  email: "",
  phone: "",
  userType: "",
  isActive: false,
};

const validationSchema = Yup.object().shape({
  loginUserId: Yup.string()
    .min(4, "Minimum 4 character")
    .required("User id is required")
    .typeError("User id is required"),
  password: Yup.string()
    .required("Password is required")
    .typeError("Password is required")
    .min(4, "Minimum 4 character"),
  email: Yup.string().required("Invalid email").typeError("Invalid email"),
  // phone: Yup.string()
  //   .matches(/^01[1-9]\d{8}$/, "Phone number is invalid")
  //   .required("Phone number is required")
  //   .typeError("Phone number is required"),
  userType: Yup.object()
    .shape({
      label: Yup.string().required("User type is required"),
      value: Yup.string().required("User type is required"),
    })
    .typeError("User type is required"),
});

export default function AddEditFormComponentN({
  singelUser,
  isCreate,
  onHide,
  isVisibleHeading = true,
  title,
  getData,
  pages,
}) {
  console.log(singelUser);
  const [loading, setLoading] = useState(false);
  const [userTypeDDL, setUserTypeDDL] = useState([]);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [modifySingleData, setModifySingleData] = useState("");

  const { employeeId, orgId, buId, intUrlId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=UserType&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}`,
      "intUserTypeId",
      "strUserType",
      setUserTypeDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!isCreate) {
      const newRowData = {
        loginUserId: singelUser?.strLoginId || "",
        password: singelUser?.strPassword || "",
        email: singelUser?.strOfficeMail || "",
        phone: singelUser?.strPersonalMobile || "",
        isEdit: !isCreate,
        userType: {
          value: singelUser?.intUserTypeId || "",
          label: singelUser?.strUserType || "",
        },
        isActive: singelUser?.userStatus || false,
      };
      setModifySingleData(newRowData);
    }
  }, [singelUser]);

  const saveHandler = (values, cb) => {
    const payload = {
      intUserId: isCreate ? 0 : singelUser?.intUserId,
      strLoginId: values?.loginUserId,
      strPassword: values?.password,
      strDisplayName: singelUser?.strEmployeeName,
      intUserTypeId: values?.userType?.value,
      intRefferenceId: singelUser?.intEmployeeBasicInfoId, // empId
      isOfficeAdmin: values?.userType?.value === 7 ? true : false,
      isSuperuser: false,
      intUrlId: intUrlId,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      intUpdatedBy: employeeId,
      strOldPassword: values?.password,
      dteLastLogin: todayDate(),
      isOwner: false,
      isActive: isCreate ? true : values?.isActive,
      dteUpdatedAt: todayDate(),
      intOfficeMail: values?.email,
      strContactNo: values?.phone,
    };
    createUser(payload, setLoading, cb);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          isCreate
            ? { ...initData, loginUserId: singelUser?.strEmployeeCode }
            : modifySingleData
        }
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
          saveHandler(values, () => {
            onHide();
            setFieldValue("search", "");
            getData(pages);
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
            <Form>
              {isVisibleHeading && (
                <Modal.Header className="bg-custom">
                  {loading && <Loading />}
                  <div className="d-flex w-100 justify-content-between align-items-center">
                    <Modal.Title className="text-center">{title}</Modal.Title>
                    <div>
                      <IconButton
                        onClick={() => {
                          if (!isCreate) {
                            resetForm(modifySingleData);
                          } else {
                            resetForm(initData);
                          }
                          onHide();
                        }}
                      >
                        <Close sx={{ color: gray900 }} />
                      </IconButton>
                    </div>
                  </div>
                </Modal.Header>
              )}

              <Modal.Body id="example-modal-sizes-title-xl">
                <div className="businessUnitModal">
                  <div style={{ padding: "0px 12px" }}>
                    <div className="d-flex align-items-center modal-body-title">
                      <div className="py-1 px-0">
                        <Avatar
                          alt={"avatar"}
                          src={""}
                          sx={{
                            backgroundColor: "#5BABEF",
                            width: "40px",
                            height: "40px",
                            mr: 0,
                          }}
                        />
                      </div>
                      <div className="pl-2">
                        <h6 className="title-item-name">
                          {singelUser?.strEmployeeName} [
                          {singelUser?.strEmployeeCode}]
                        </h6>
                        <p className="subtitle-p">
                          {singelUser?.strEmploymentType}
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <label>Login User ID</label>
                        <FormikInput
                          classes="input-sm"
                          value={values?.loginUserId}
                          name="loginUserId"
                          type="text"
                          className="form-control"
                          placeholder=""
                          onChange={(e) => {
                            if (e.target.value.includes(" ")) {
                              e.target.value = e.target.value.replace(
                                /\s/g,
                                ""
                              );
                              setFieldValue("loginUserId", e.target.value);
                            }
                            setFieldValue("loginUserId", e.target.value);
                          }}
                          // disabled={true}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-6">
                        <div className="input-field-password-main">
                          <label>Password</label>
                          <div className="input-password">
                            <FormikInput
                              classes="input-sm"
                              value={values?.password}
                              name="password"
                              type={isShowPassword ? "text" : "password"}
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                if (e.target.value.includes(" ")) {
                                  e.target.value = e.target.value.replace(
                                    /\s/g,
                                    ""
                                  );
                                  setFieldValue("password", e.target.value);
                                }
                                setFieldValue("password", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                            {values?.password && (
                              <button
                                type="button"
                                onClick={() =>
                                  setIsShowPassword(!isShowPassword)
                                }
                                className="btn-showPassword"
                              >
                                {isShowPassword ? (
                                  <VisibilityOutlinedIcon
                                    sx={{ color: gray900 }}
                                  />
                                ) : (
                                  <VisibilityOffOutlinedIcon
                                    sx={{ color: gray900 }}
                                  />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <label>Office Email</label>
                        <FormikInput
                          classes="input-sm"
                          value={values?.email}
                          name="email"
                          type="email"
                          className="form-control"
                          placeholder=""
                          onChange={(e) => {
                            setFieldValue("email", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-6">
                        <label>Contact No.</label>
                        <FormikInput
                          classes="input-sm"
                          value={values?.phone}
                          name="phone"
                          type="text"
                          className="form-control"
                          placeholder=""
                          onChange={(e) => {
                            setFieldValue("phone", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-6">
                        <label>User Type</label>
                        <FormikSelect
                          name="userType"
                          menuPosition="fixed"
                          options={userTypeDDL || []}
                          value={values?.userType}
                          onChange={(valueOption) => {
                            setFieldValue("userType", valueOption);
                          }}
                          placeholder=" "
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      {!isCreate && (
                        <>
                          <div className="col-6">
                            <div className="input-main position-group-select mt-2">
                              <h6 className="title-item-name">
                                User Activation
                              </h6>
                            </div>
                            <FormikToggle
                              name="isActive"
                              color={
                                values?.isActive ? greenColor : blackColor40
                              }
                              checked={values?.isActive}
                              onChange={(e) => {
                                setFieldValue("isActive", e.target.checked);
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="form-modal-footer">
                <button
                  type="button"
                  className="btn btn-cancel"
                  style={{ fontSize: "14px" }}
                  onClick={() => {
                    if (!isCreate) {
                      resetForm(modifySingleData);
                    } else {
                      resetForm(initData);
                    }
                    onHide();
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-green"
                  type="submit"
                  onSubmit={() => handleSubmit()}
                >
                  Save
                </button>
              </Modal.Footer>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
