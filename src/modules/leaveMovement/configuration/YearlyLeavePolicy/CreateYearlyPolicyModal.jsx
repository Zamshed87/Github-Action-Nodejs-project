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
import { getYearlyPolicyPopUpDDL } from "./helper";
import { gray600, success500 } from "../../../../utility/customColor";

const validationSchema = Yup.object().shape({
  // businessUnit: Yup.object()
  //   .shape({
  //     label: Yup.string().required("Business Unit type is required"),
  //     value: Yup.string().required("Business Unit type is required"),
  //   })
  //   .typeError("Business Unit type is required"),
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
  businessUnit: [],
  workplaceGroup: [],
  workplace: [],
  year: "",
  employmentType: "",
  leaveType: "",
  gender: "",
  days: "",
};

const CreateYearlyPolicyModal = ({ setShow, singleData, getData }) => {
  const [employmentTypeDDL, setEmploymentTypeDDL] = useState([]);
  const [leaveTypeDDL, setLeaveTypeDDL] = useState([]);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [loading, setLoading] = useState(false);

  const { orgId, employeeId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const saveHandler = (values, cb) => {
    let businessUnitPayload = [],
      workplaceGroupPayload = [],
      workplacePayload = [];
    if (
      values?.businessUnit?.length > 0 &&
      values?.businessUnit[0]?.label === "All"
    ) {
      businessUnitDDL?.forEach((item) => {
        if (item.label !== "All") businessUnitPayload.push(item.value);
      });
    } else if (
      values?.businessUnit?.length > 0 &&
      values?.businessUnit[0]?.label !== "All"
    ) {
      values?.businessUnit?.forEach((item) => {
        businessUnitPayload.push(item.value);
      });
    }
    if (
      values?.workplaceGroup?.length > 0 &&
      values?.workplaceGroup[0]?.label === "All"
    ) {
      workplaceGroupDDL?.forEach((item) => {
        if (item.label !== "All") workplaceGroupPayload.push(item.value);
      });
    } else if (
      values?.workplaceGroup?.length > 0 &&
      values?.workplaceGroup[0]?.label !== "All"
    ) {
      values?.workplaceGroup?.forEach((item) => {
        workplaceGroupPayload.push(item.value);
      });
    }
    if (
      values?.workplace?.length > 0 &&
      values?.workplace[0]?.label === "All"
    ) {
      workplaceDDL?.forEach((item) => {
        if (item.label !== "All") workplacePayload.push(item.value);
      });
    } else if (
      values?.workplace?.length > 0 &&
      values?.workplace[0]?.label !== "All"
    ) {
      values?.workplace?.forEach((item) => {
        workplacePayload.push(item.value);
      });
    }
    yearlyLeavePolicyAction(
      values?.autoId || 0,
      values?.employmentType?.value,
      +values?.days,
      values?.year?.value,
      values?.leaveType?.value,
      values?.gender?.value,
      values?.gender?.label,
      businessUnitPayload,
      workplaceGroupPayload,
      workplacePayload,
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

  useEffect(() => {
    getYearlyPolicyPopUpDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&BusinessUnitId=${buId}&WorkplaceGroupId=0&intId=${employeeId}`,
      "intBusinessUnitId",
      "strBusinessUnit",
      setBusinessUnitDDL
    );
  }, [orgId, buId, employeeId]);

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
                <div className="col-lg-6">
                  <div className="input-field-main">
                    <label>Business Unit</label>
                    <FormikSelect
                      placeholder=" "
                      classes="input-sm"
                      styles={{
                        ...customStyles,
                        control: (provided, state) => ({
                          ...provided,
                          minHeight: "auto",
                          height:
                            values?.businessUnit?.length > 1 ? "auto" : "30px",
                          borderRadius: "4px",
                          boxShadow: `${success500}!important`,
                          ":hover": {
                            borderColor: `${gray600}!important`,
                          },
                          ":focus": {
                            borderColor: `${gray600}!important`,
                          },
                        }),
                        valueContainer: (provided, state) => ({
                          ...provided,
                          height:
                            values?.businessUnit?.length > 1 ? "auto" : "30px",
                          padding: "0 6px",
                        }),
                        multiValue: (styles) => {
                          return {
                            ...styles,
                            position: "relative",
                            top: "-1px",
                          };
                        },
                        multiValueLabel: (styles) => ({
                          ...styles,
                          padding: "0",
                        }),
                      }}
                      name="businessUnit"
                      options={businessUnitDDL || []}
                      value={values?.businessUnit}
                      onChange={(valueOption) => {
                        setFieldValue("workplaceGroup", "");
                        setFieldValue("workplace", "");
                        if (
                          valueOption?.some((item) => item?.label === "All")
                        ) {
                          setFieldValue("businessUnit", [
                            { value: 0, label: "All" },
                          ]);
                        } else if (valueOption?.length === 1) {
                          getYearlyPolicyPopUpDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=0&BusinessUnitId=${valueOption[0]?.value}&intId=${employeeId}`,
                            "intWorkplaceGroupId",
                            "strWorkplaceGroup",
                            setWorkplaceGroupDDL
                          );
                          setFieldValue("workplaceGroup", "");
                          setFieldValue("workplace", "");
                          setFieldValue("businessUnit", valueOption);
                        } else {
                          setFieldValue("businessUnit", valueOption);
                        }
                      }}
                      isMulti
                      isDisabled={singleData?.autoId}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="input-field-main">
                    <label>Workplace Group</label>
                    <FormikSelect
                      placeholder=" "
                      classes="input-sm"
                      styles={{
                        ...customStyles,
                        control: (provided, state) => ({
                          ...provided,
                          minHeight: "auto",
                          height:
                            values?.workplaceGroup?.length > 1
                              ? "auto"
                              : "30px",
                          borderRadius: "4px",
                          boxShadow: `${success500}!important`,
                          ":hover": {
                            borderColor: `${gray600}!important`,
                          },
                          ":focus": {
                            borderColor: `${gray600}!important`,
                          },
                        }),
                        valueContainer: (provided, state) => ({
                          ...provided,
                          height:
                            values?.workplaceGroup?.length > 1
                              ? "auto"
                              : "30px",
                          padding: "0 6px",
                        }),
                        multiValue: (styles) => {
                          return {
                            ...styles,
                            position: "relative",
                            top: "-1px",
                          };
                        },
                        multiValueLabel: (styles) => ({
                          ...styles,
                          padding: "0",
                        }),
                      }}
                      name="workplaceGroup"
                      options={workplaceGroupDDL || []}
                      value={values?.workplaceGroup}
                      onChange={(valueOption) => {
                        if (
                          valueOption?.some((item) => item?.label === "All")
                        ) {
                          setFieldValue("workplaceGroup", [
                            { value: 0, label: "All" },
                          ]);
                        } else if (valueOption?.length === 1) {
                          getYearlyPolicyPopUpDDL(
                            `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&AccountId=${orgId}&BusinessUnitId=${values?.businessUnit[0]?.value}&WorkplaceGroupId=${valueOption[0]?.value}&intId=${employeeId}`,
                            "intWorkplaceId",
                            "strWorkplace",
                            setWorkplaceDDL
                          );
                          setFieldValue("workplace", "");
                          setFieldValue("workplaceGroup", valueOption);
                        } else {
                          setFieldValue("workplaceGroup", valueOption);
                        }
                      }}
                      isMulti
                      isDisabled={
                        singleData?.autoId ||
                        (values?.businessUnit &&
                          values?.businessUnit?.some(
                            (item) => item?.label === "All"
                          ))
                      }
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="input-field-main">
                    <label>Workplace</label>
                    <FormikSelect
                      placeholder=" "
                      classes="input-sm"
                      styles={{
                        ...customStyles,
                        control: (provided, state) => ({
                          ...provided,
                          minHeight: "auto",
                          height:
                            values?.workplace?.length > 1 ? "auto" : "30px",
                          borderRadius: "4px",
                          boxShadow: `${success500}!important`,
                          ":hover": {
                            borderColor: `${gray600}!important`,
                          },
                          ":focus": {
                            borderColor: `${gray600}!important`,
                          },
                        }),
                        valueContainer: (provided, state) => ({
                          ...provided,
                          height:
                            values?.workplace?.length > 1 ? "auto" : "30px",
                          padding: "0 6px",
                        }),
                        multiValue: (styles) => {
                          return {
                            ...styles,
                            position: "relative",
                            top: "-1px",
                          };
                        },
                        multiValueLabel: (styles) => ({
                          ...styles,
                          padding: "0",
                        }),
                      }}
                      name="workplace"
                      options={workplaceDDL || []}
                      value={values?.workplace}
                      onChange={(valueOption) => {
                        if (valueOption.some((item) => item?.label === "All")) {
                          setFieldValue("workplace", [
                            { value: 0, label: "All" },
                          ]);
                        } else {
                          setFieldValue("workplace", valueOption);
                        }
                      }}
                      isMulti
                      isDisabled={
                        singleData?.autoId ||
                        (values?.businessUnit &&
                          values?.businessUnit?.some(
                            (item) => item?.label === "All"
                          )) ||
                        (values?.workplaceGroup &&
                          values?.workplaceGroup?.some(
                            (item) => item?.label === "All"
                          )) ||
                        (values?.workplaceGroup &&
                          values?.workplaceGroup?.length > 1)
                      }
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
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
                <div className="col-lg-6">
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
                <div className="col-lg-6">
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
                <div className="col-lg-6">
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
                <div className="col-lg-6">
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
              <button type="submit" className="btn btn-green">
                Save
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateYearlyPolicyModal;
