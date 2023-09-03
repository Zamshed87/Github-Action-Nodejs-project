import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "../../../../../../common/FormikInput";
import FormikSelect from "../../../../../../common/FormikSelect";
import { customStyles } from "../../../../../../utility/selectCustomStyle";
import AsyncFormikSelect from "../../../../../../common/AsyncFormikSelect";
import axios from "axios";
import FormikDatePicker from "../../../../../../common/DatePicker";

const initData = {
  employee: "",
  fromMonthYear: "",
  toMonthYear: "",
  typeName: "",
  additionDeduction: "",
  amount: "",
};

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Name is required"),
});

export default function AddEditForm({ setIsAddEditForm, getData, isEdit, singleData }) {

  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(`/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${1}&BusinessUnitId=${2}&Search=${v}`)
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  return (
    <>
      <Formik enableReinitialize={true} validationSchema={validationSchema} initialValues={isEdit ? singleData : initData} onSubmit={(values, { setSubmitting, resetForm }) => { }}>
        {({ handleSubmit, resetForm, values, errors, touched, setFieldValue, isValid }) => (
          <>
            <Form onSubmit={handleSubmit} className="add-new-employee-form">
              <div className="row content-input-field">
                <div className="col-6">
                  <div className="input-field-main">
                    <label>Employee</label>
                    <AsyncFormikSelect
                      selectedValue={values?.employee}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("employee", valueOption);
                      }}
                      loadOptions={loadUserList}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="input-field-main">
                    <label>Employee Type</label>
                    <FormikSelect
                      menuPosition="fixed"
                      name="employeeType"
                      options={[]}
                      value={values?.employeeType}
                      onChange={(valueOption) => {
                        setFieldValue("employeeType", valueOption);
                      }}
                      styles={customStyles}
                      errors={errors}
                      placeholder=""
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="input-field-main">
                    <label>From Month Year</label>
                    <FormikDatePicker
                      isSmall
                      label=""
                      value={values?.toMonthYear}
                      name="toMonthYear"
                      type="month"
                      onChange={(e) => {
                        setFieldValue("toMonthYear", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="input-field-main">
                    <label>To Month Year</label>
                    <FormikDatePicker
                      isSmall
                      label=""
                      value={values?.monthYear}
                      name="monthYear"
                      type="month"
                      onChange={(e) => {
                        setFieldValue("monthYear", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="input-field-main">
                    <label>Type</label>
                    <FormikSelect
                      placeholder="Select typeName"
                      classes="input-sm"
                      styles={customStyles}
                      name="typeName"
                      options={[
                        { label: "Addition", value: "addition" },
                        { label: "Deduction", value: "deduction" },
                      ]}
                      value={values?.typeName}
                      onChange={(valueOption) => {
                        setFieldValue("typeName", valueOption);
                      }}
                      errors={errors}
                      isMulti
                      touched={touched}
                      isDisabled={false}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="input-field-main">
                    <label>Addition/Deduction Name</label>
                    <FormikSelect
                      placeholder="Select typeName"
                      classes="input-sm"
                      styles={customStyles}
                      name="additionDeductionType"
                      options={[
                        { label: "Addition", value: "addition" },
                        { label: "Deduction", value: "deduction" },
                      ]}
                      value={values?.additionDeductionType}
                      onChange={(valueOption) => {
                        setFieldValue("additionDeductionType", valueOption);
                      }}
                      errors={errors}
                      isMulti
                      touched={touched}
                      isDisabled={false}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="input-field-main">
                    <label>amount</label>
                    <FormikInput
                      placeholder="Select typeName"
                      classes="input-sm"
                      name="amount"
                      value={values?.amount}
                      onChange={(valueOption) => {
                        setFieldValue("amount", valueOption);
                      }}
                      type="number"
                      errors={errors}
                      touched={touched}
                      isDisabled={false}
                    />
                  </div>
                </div>
                <div className=" emp-create buttons-form-main row">
                  <button type="button" className="modal-btn modal-btn-cancel" onClick={() => setIsAddEditForm(false)}>
                    Cancel
                  </button>

                  <button type="submit" className="modal-btn modal-btn-save">
                    submit
                  </button>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
