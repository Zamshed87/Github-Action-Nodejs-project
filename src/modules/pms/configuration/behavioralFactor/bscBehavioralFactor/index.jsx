import React from "react";
import FormikSelect from "../../../../../common/FormikSelect";
import { useFormik } from "formik";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import CoreValues from "../coreValues";
import CoreCompetencies from "../coreCompetencies";

const initData = {
  type: {
    value: 1,
    label: "Core Values",
  },
};

const BscBehavioralFactor = () => {
  const { values, setFieldValue } = useFormik({
    initialValues: initData,
  });
  return (
    <div className="mt-2 pb-0">
      <div className="card-style mb-2">
        <div className="row">
          <div className="col-lg-3">
            <div className="input-field-main">
              <label>Type</label>
              <FormikSelect
                name="type"
                isClearable={false}
                options={[
                  {
                    value: 1,
                    label: "Core Values",
                  },
                  {
                    value: 2,
                    label: "Core Competencies",
                  },
                ]}
                value={values?.type}
                onChange={(valueOption) => {
                  setFieldValue("type", valueOption);
                }}
                placeholder=""
                styles={customStyles}
              />
            </div>
          </div>
        </div>
      </div>
      {[1].includes(values?.type?.value) && <CoreValues />}
      {[2].includes(values?.type?.value) && <CoreCompetencies />}
    </div>
  );
};

export default BscBehavioralFactor;
