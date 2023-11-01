import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import { greenColor } from "../../../../../utility/customColor";
import FormikSelect from "../../../../../common/FormikSelect";
import { customStyles } from "../../../../../utility/newSelectCustomStyle";
import { monthDDL } from "../../../../../utility/monthUtility";
import { yearDDLAction } from "../../../../../utility/yearDDL";
import FormikInput from "../../../../../common/FormikInput";

const initData = {
  month: "",
  year: "",
  fromDate: "",
  toDate: "",
  selectedBox: false,
};

const validationSchema = Yup.object().shape({});

export default function PayrollMonthModal({ orgId, employeeId, setShow, selectedBank, setBankBranchDDL }) {
  const saveHandler = (values, cb) => { };
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
        {({ handleSubmit, resetForm, values, errors, touched, setFieldValue, isValid }) => (
          <>
            <Form onSubmit={handleSubmit}>
              <div className="create-approval-form payrollMonthModal">
                <div className="modal-body2">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="input-field-main">
                        <div className="d-flex justify-content-between align-items-center" style={{ marginTop: "-3px" }}>
                          <label htmlFor="">Month</label>
                          <div style={{ marginTop: "-4px" }}>
                            <FormikCheckBox
                              styleObj={{
                                margin: "0 auto!important",
                                color: greenColor,
                              }}
                              height="16px"
                              labelColor="rgba(0, 0, 0, 0.87)!important"
                              labelFontSize="12px"
                              name="selectedBox"
                              checked={values?.selectedBox}
                              onChange={(e) => {
                                setFieldValue("selectedBox", e.target.checked);
                              }}
                              label="Partial"
                            />
                          </div>
                        </div>
                        <FormikSelect
                          name="month"
                          options={monthDDL || []}
                          value={values?.month}
                          // label="Month"
                          placeholder=" "
                          onChange={(valueOption) => {
                            setFieldValue("month", valueOption);
                          }}
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="input-field-main">
                        <label htmlFor="">Year</label>
                        <FormikSelect
                          name="year"
                          options={yearDDLAction(5, 10) || []}
                          value={values?.year}
                          // label="Year"
                          placeholder=" "
                          onChange={(valueOption) => {
                            setFieldValue("year", valueOption);
                          }}
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="input-field-main">
                        <label htmlFor="">From Date</label>
                        <FormikInput
                          classes="input-sm"
                          value={values?.fromDate}
                          placeholder=""
                          name="fromDate"
                          type="date"
                          className="form-control"
                          onChange={(e) => {
                            setFieldValue("fromDate", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="input-field-main">
                        <label htmlFor="">To Date</label>
                        <FormikInput
                          classes="input-sm"
                          value={values?.toDate}
                          placeholder=""
                          name="toDate"
                          type="date"
                          className="form-control"
                          onChange={(e) => {
                            setFieldValue("toDate", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                   
                  </div>
                </div>
                <div className="modal-footer form-modal-footer">
                  <button className="btn btn-green btn-green-disabled" type="submit">
                    Save
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
