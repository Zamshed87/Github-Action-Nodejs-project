import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { getPeopleDeskAllDDL } from "../../../../common/api";
import FormikInput from "../../../../common/FormikInput";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { yearDDLAction } from "../../../../utility/yearDDL";
import { yearlyLeavePolicyAction } from "../helper";
import "../style.css";

const validationSchema = Yup.object().shape({
  days: Yup.number()
    .min(0, "Days must be a non-negative number")
    .required("Days is required"),
  leaveType: Yup.object()
    .shape({
      label: Yup.string().required("Leave type is required"),
      value: Yup.string().required("Leave type is required"),
    })
    .typeError("Leave type is required"),
  employmentType: Yup.object()
    .shape({
      label: Yup.string().required("Employment type is required"),
      value: Yup.string().required("Employment type is required"),
    })
    .typeError("Employment type is required"),
  gender: Yup.object()
    .shape({
      label: Yup.string().required("Gender is required"),
      value: Yup.string().required("Gender is required"),
    })
    .typeError("Gender is required"),
  year: Yup.object()
    .shape({
      label: Yup.string().required("Year is required"),
      value: Yup.string().required("Year is required"),
    })
    .typeError("Year is required"),
});

const initData = {
  year: "",
  employmentType: "",
  leaveType: "",
  gender: "",
  days: "",
};

const CreateYearlyPolicyModal = ({ setShow, singleData, getData }) => {
  const [employmentTypeDDL, setEmploymentTypeDDL] = useState([]);
  const [leaveTypeDDL, setLeaveTypeDDL] = useState([]);

  const { orgId, employeeId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  const saveHandler = (values, cb) => {
    yearlyLeavePolicyAction(
      singleData?.autoId ? 2 : 1,
      values?.autoId || 0,
      values?.employmentType?.value,
      +values?.days,
      values?.year?.value,
      values?.leaveType?.value,
      values?.gender?.value,
      values?.gender?.label,
      orgId,
      employeeId,
      cb,
      buId,
      setLoading
    );
  };

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmploymentType&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
      "Id",
      "EmploymentType",
      setEmploymentTypeDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=LeaveType&BusinessUnitId=${buId}&intId=0&WorkplaceGroupId=${wgId}`,
      "LeaveTypeId",
      "LeaveType",
      setLeaveTypeDDL
    );
  }, [orgId, buId, wgId]);

  return (
    <Formik
      enableReinitialize={true}
      validationSchema={validationSchema}
      initialValues={
        singleData?.autoId
          ? singleData
          : {
            ...initData,
            gender: { value: 0, label: "Male & Female" },
          }
      }
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          setShow(false);
          getData();
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
        <Form onSubmit={handleSubmit}>
          {loading && <Loading />}
          <div className="create-approval-form">
            <div className="modal-body2 py-0">
              <div className="row">
                <div className="col-lg-12">
                  <label>Year</label>
                  <FormikSelect
                    name="year"
                    options={yearDDLAction()}
                    value={values?.year}
                    label=""
                    onChange={(valueOption) => {
                      setFieldValue("year", valueOption);
                    }}
                    menuPosition="fixed"
                    placeholder=" "
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-12">
                  <label>Employment Type</label>
                  <FormikSelect
                    name="employmentType"
                    options={employmentTypeDDL}
                    value={values?.employmentType}
                    menuPosition="fixed"
                    label=""
                    onChange={(valueOption) => {
                      setFieldValue("employmentType", valueOption);
                    }}
                    placeholder=" "
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-12">
                  <label>Leave Type</label>
                  <FormikSelect
                    name="leaveType"
                    options={leaveTypeDDL}
                    menuPosition="fixed"
                    value={values?.leaveType}
                    label=""
                    onChange={(valueOption) => {
                      setFieldValue("leaveType", valueOption);
                    }}
                    placeholder=" "
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-12">
                  <label>Gender</label>
                  <FormikSelect
                    name="gender"
                    options={[
                      { value: 0, label: "Male & Female" },
                      { value: 1, label: "Male" },
                      { value: 2, label: "Female" },
                    ]}
                    menuPosition="fixed"
                    value={values?.gender}
                    label=""
                    onChange={(valueOption) => {
                      setFieldValue("gender", valueOption);
                    }}
                    placeholder=" "
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-12">
                  <label>Days</label>
                  <FormikInput
                    // label="Days"
                    placeholder=" "
                    classes="input-sm"
                    value={values?.days}
                    onChange={(e) => {
                      setFieldValue("days", e.target.value);
                    }}
                    name="days"
                    type="number"
                    // className="form-control"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer form-modal-footer">
              <button
                type="button"
                onClick={(e) => {
                  setShow(false);
                }}
                className="btn btn-cancel"
                style={{
                  marginRight: "15px",
                }}
              >
                Cancel
              </button>
              <button className="btn btn-green">Save</button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateYearlyPolicyModal;
