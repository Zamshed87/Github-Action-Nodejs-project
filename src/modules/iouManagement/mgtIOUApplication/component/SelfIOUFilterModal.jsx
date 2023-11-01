import React from 'react';
import DatePickerBorderLess from "../../../../common/DatePickerBorderless";

const SelfIOUFilterModal = ({ propsObj }) => {

  const { getFilterValues, setFieldValue, values, errors, touched } = propsObj;

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <div className="row align-items-center">
            <div className="col-md-5">
              <h3>Application Date</h3>
            </div>
            <div className="col-md-7 ml-0">
              <DatePickerBorderLess
                label=""
                type="date"
                value={values?.applicationDate}
                name="applicationDate"
                onChange={(e) => {
                  setFieldValue("applicationDate", e.target.value);
                  getFilterValues("applicationDate", e.target.value);
                }}
                minDate={values?.applicationDate}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-5">
              <h3>To Date</h3>
            </div>
            <div className="col-md-7 ml-0">
              <DatePickerBorderLess
                label=""
                type="date"
                value={values?.toDate}
                name="toDate"
                onChange={(e) => {
                  setFieldValue("toDate", e.target.value);
                  getFilterValues("toDate", e.target.value);
                }}
                minDate={values?.toDate}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6 ">
          <div className="row align-items-center">
            <div className="col-md-5">
              <h3>From Date</h3>
            </div>
            <div className="col-md-7 ml-0">
              <DatePickerBorderLess
                label=""
                type="date"
                value={values?.fromDate}
                name="fromDate"
                onChange={(e) => {
                  setFieldValue("fromDate", e.target.value);
                  getFilterValues("fromDate", e.target.value);
                }}
                minDate={values?.fromDate}
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelfIOUFilterModal;
