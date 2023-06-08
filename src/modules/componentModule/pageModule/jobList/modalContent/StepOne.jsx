import React from "react";
import FormikInput from "../../../../../common/FormikInput";
import FormikSelect from "../../../../../common/FormikSelect";
import { customStylesLarge } from "./../../../../../utility/selectCustomStyle";

const StepOne = ({ values, setFieldValue, errors, touched }) => {
  return (
    <div className="stepOne">
      <h3 className="step-title">Basic Information</h3>
      <div>
        <FormikInput
          label="Job title"
          name="jobTitle"
          value={values?.jobTitle}
          type="text"
          className="form-control"
          errors={errors}
          touched={touched}
        />
      </div>
      <div>
        <FormikSelect
          name="jobLevel"
          options={[
            { value: 1, label: "Entry level" },
            { value: 2, label: "Mid level" },
            { value: 3, label: "Senior level" },
          ]}
          value={values?.jobLevel}
          onChange={(valueOption) => {
            setFieldValue("jobLevel", valueOption);
          }}
          styles={customStylesLarge}
          placeholder="Job level"
          errors={errors}
          touched={touched}
          isDisabled={false}
        />
      </div>
      <div>
        <FormikInput
          label="Experience"
          name="experience"
          value={values?.experience}
          type="text"
          className="form-control"
          errors={errors}
          touched={touched}
        />
      </div>
      <div>
        <FormikSelect
          name="employmentType"
          options={[
            { value: 1, label: "BD" },
            { value: 2, label: "UK" },
            { value: 3, label: "USA" },
          ]}
          value={values?.employmentType}
          onChange={(valueOption) => {
            setFieldValue("employmentType", valueOption);
          }}
          placeholder="Employment type"
          styles={customStylesLarge}
          errors={errors}
          touched={touched}
          isDisabled={false}
        />
      </div>
      <div>
        <FormikSelect
          placeholder="Salary"
          name="salary"
          options={[
            { value: 1, label: "Range" },
            { value: 2, label: "Fixed" },
            { value: 3, label: "Negotiable" },
          ]}
          value={values?.salary}
          onChange={(valueOption) => {
            setFieldValue("salary", valueOption);
          }}
          styles={customStylesLarge}
          errors={errors}
          touched={touched}
          isDisabled={false}
        />
      </div>
      {values?.salary?.label === "Range" && (
        <div className="row">
          <div className="col-md-6">
            <FormikInput
              classes="input-borderless"
              inputClasses="input-number"
              label="From"
              value={values?.fromRange}
              name="fromRange"
              type="number"
              className="form-control"
              isNumber={true}
              incrementHandler={(e) => {
                setFieldValue("fromRange", +values?.fromRange + 1);
              }}
              decrementHandler={(e) => {
                if (!values?.fromRange || values?.fromRange < 0) {
                  setFieldValue("fromRange", 0);
                } else {
                  setFieldValue("fromRange", +values?.fromRange - 1);
                }
              }}
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="col-md-6">
            <FormikInput
              classes="input-borderless"
              inputClasses="input-number"
              label="To"
              value={values?.toRange}
              name="toRange"
              type="number"
              className="form-control"
              isNumber={true}
              incrementHandler={(e) => {
                setFieldValue("toRange", +values?.toRange + 1);
              }}
              decrementHandler={(e) => {
                if (!values?.toRange || values?.toRange < 0) {
                  setFieldValue("toRange", 0);
                } else {
                  setFieldValue("toRange", +values?.toRange - 1);
                }
              }}
              errors={errors}
              touched={touched}
            />
          </div>
        </div>
      )}
      {values?.salary?.label === "Fixed" && (
        <div>
          <FormikInput
            classes="input-borderless"
            inputClasses="input-number"
            label="Enter salary"
            value={values?.fixedSalaryRange}
            name="fixedSalaryRange"
            type="number"
            className="form-control"
            isNumber={true}
            incrementHandler={(e) => {
              setFieldValue("fixedSalaryRange", +values?.fixedSalaryRange + 1);
            }}
            decrementHandler={(e) => {
              if (!values?.fixedSalaryRange || values?.fixedSalaryRange < 0) {
                setFieldValue("fixedSalaryRange", 0);
              } else {
                setFieldValue("fixedSalaryRange", +values?.fixedSalaryRange - 1);
              }
            }}
            errors={errors}
            touched={touched}
          />
        </div>
      )}

      {(values?.salary?.label === "Range" ||
        values?.salary?.label === "Fixed") && (
          <div>
            <FormikInput
              classes="input-borderless"
              label="Optional"
              value={values?.noted}
              name="noted"
              type="text"
              className="form-control"
              errors={errors}
              touched={touched}
            />
          </div>
        )}

      <div>
        <FormikInput
          label="Location"
          value={values?.location}
          name="location"
          type="text"
          className="form-control"
          errors={errors}
          touched={touched}
        />
      </div>
      <div>
        <FormikInput
          inputClasses="input-number"
          label="Vacancy"
          value={values?.vacancy}
          name="vacancy"
          type="number"
          className="form-control"
          isNumber={true}
          incrementHandler={(e) => {
            setFieldValue("vacancy", +values?.vacancy + 1);
          }}
          decrementHandler={(e) => {
            if (!values?.vacancy || values?.vacancy < 0) {
              setFieldValue("vacancy", 0);
            } else {
              setFieldValue("vacancy", +values?.vacancy - 1);
            }
          }}
          errors={errors}
          touched={touched}
        />
      </div>
    </div>
  );
};

export default StepOne;
