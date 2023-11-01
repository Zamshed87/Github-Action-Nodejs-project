import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import RangeSlider from "./../../../common/RangeSliders";

const initData = {
  skill: "",
};

const validationSchema = Yup.object({});

export default function Sliders() {
  const saveHandler = (values) => {};
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
            <Form onSubmit={handleSubmit}>
              <h2>Sliders</h2>
              <div className="container-fluid">
                <div className="my-3">
                  <div className="row">
                    <div className="col-md-4">
                      <RangeSlider />
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
