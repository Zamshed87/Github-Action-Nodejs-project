import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import {
   blueColor, greenColor, ratingColor
} from "../../../utility/customColor";
import FormikCheckBox from "./../../../common/FormikCheckbox";
import FormikRadio from "./../../../common/FormikRadio";
import FormikRatings from "./../../../common/FormikRatings";
import FormikToggle from "./../../../common/FormikToggle";
import PrimaryButton from "./../../../common/PrimaryButton";

const initData = {
  checkboxOne: false,
  checkboxTwo: true,
  checkboxThree: false,
  gender: "female",
  toggleOne: false,
  toggleTwo: true,
  toggleThree: false,
  ratings: 0,
  ratingsOne: 2,
};

const validationSchema = Yup.object().shape({});

export default function SelectionModule() {
  const saveHandler = (values, cb) => {};
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
          handleChange,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form>
              <h2>Selection</h2>
              <div className="container-fluid">
                <div className="my-3">
                  <h6 style={{ fontSize: "14px" }}>Checkboxes</h6>
                </div>
                <div className="my-3">
                  <div className="row">
                    <div className="col-md-4 d-flex">
                      <FormikCheckBox
                        styleObj={{
                          color: greenColor,
                        }}
                        checked={values?.checkboxOne}
                        onChange={(e) => {
                          setFieldValue("checkboxOne", e.target.checked);
                        }}
                      />
                      <FormikCheckBox
                        styleObj={{
                          color: blueColor,
                        }}
                        label="One"
                        checked={values?.checkboxTwo}
                        onChange={(e) => {
                          setFieldValue("checkboxTwo", e.target.checked);
                        }}
                        disabled={true}
                      />
                      <FormikCheckBox
                        checked={values?.checkboxThree}
                        onChange={(e) => {
                          setFieldValue("checkboxThree", e.target.checked);
                        }}
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div className="my-3">
                    <h6 style={{ fontSize: "14px" }}>Radio Buttons</h6>
                  </div>
                  <div className="my-3">
                    <div className="row">
                      <div className="col-md-4">
                        <FormikRadio
                          name="gender"
                          label="Male"
                          value={"male"}
                          color={blueColor}
                          onChange={(e) => {
                            setFieldValue("gender", e.target.value);
                          }}
                          checked={values?.gender === "male"}
                        />
                        <FormikRadio
                          name="gender"
                          label="Female"
                          value={"female"}
                          color={greenColor}
                          onChange={(e) => {
                            setFieldValue("gender", e.target.value);
                          }}
                          checked={values?.gender === "female"}
                          disabled={true}
                        />
                        <FormikRadio
                          name="gender"
                          label="Other"
                          value={"other"}
                          onChange={(e) => {
                            setFieldValue("gender", e.target.value);
                          }}
                          checked={values?.gender === "other"}
                          disabled={true}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="my-3">
                    <h6 style={{ fontSize: "14px" }}>Switches</h6>
                  </div>
                  <div className="my-3">
                    <div className="row">
                      <div className="col-md-4">
                        <FormikToggle
                          name="toggleOne"
                          label="One"
                          color={greenColor}
                          checked={values?.toggleOne}
                          onChange={(e) => {
                            setFieldValue("toggleOne", e.target.checked);
                          }}
                        />
                        <FormikToggle
                          name="toggleTwo"
                          label="Two"
                          color={blueColor}
                          checked={values?.toggleTwo}
                          onChange={(e) => {
                            setFieldValue("toggleTwo", e.target.checked);
                          }}
                          disabled={true}
                        />
                        <FormikToggle
                          name="toggleThree"
                          label="Three"
                          color={greenColor}
                          checked={values?.toggleThree}
                          onChange={(e) => {
                            setFieldValue("toggleThree", e.target.checked);
                          }}
                          disabled={true}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="my-3">
                    <h6 style={{ fontSize: "14px" }}>Ratings</h6>
                  </div>
                  <div className="my-3">
                    <div className="row">
                      <div className="col-md-2">
                        <FormikRatings
                          name="ratings"
                          value={values?.ratings}
                          color={ratingColor}
                          onChange={(e) => {
                            setFieldValue("ratings", +e.target.value);
                          }}
                          ratingStyle={{
                            width: 200,
                            display: "flex",
                            alignItems: "center",
                          }}
                        />
                      </div>
                      <div className="col-md-2">
                        <FormikRatings
                          name="ratingsOne"
                          value={values?.ratingsOne}
                          color={blueColor}
                          onChange={(e) => {
                            setFieldValue("ratingsOne", +e.target.value);
                          }}
                          ratingStyle={{
                            width: 200,
                            display: "flex",
                            alignItems: "center",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-2">
                      <PrimaryButton
                        type="submit"
                        className="btn btn-basic"
                        label="Submit"
                      />
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
