/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import BackButton from "../../../common/BackButton";
import FormikInput from "../../../common/FormikInput";
import FormikSelect from "../../../common/FormikSelect";
import FormikTextArea from "../../../common/FormikTextArea";
import Loading from "../../../common/loading/Loading";
import PrimaryButton from "../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { customStyles } from "../../../utility/selectCustomStyle";
import strPlanBG from "./strPlanHeaderBG.png";

const initData = {
  particularName: "",
  description: "",
  bscPerspective: "",
  particularType: "",
  objective: "",
};

const StrPlan = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Performance Management System"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        // saveHandler(values, () => {
        //   resetForm(initData);
        // });
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
            {loading && <Loading />}
            <div className="strPlan">
              <div className="col-md-12">
                <div className="table-card">
                  <div className="table-card-heading heading pt-0">
                    <BackButton title={"Create Strategic Plans"} />
                    <div className="table-card-heading ">
                      <div className="table-card-head-right">
                        <ul>
                          <li>
                            <div>
                              <PrimaryButton
                                type="button"
                                className="btn btn-default flex-center"
                                label={"Save"}
                                // onClick={() =>
                                //   history.push(
                                //     "/tm/task-project/"
                                //   )
                                // }
                              />
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.16)",
                      borderRadius: "4px",
                    }}
                    className="table-card-body"
                  >
                    <div className="table-card-styled">
                      <img
                        style={{
                          height: "14px",
                          marginTop: "-12px",
                          width: "100%",
                        }}
                        src={strPlanBG}
                        alt="bg"
                      />
                      <div
                        style={{ padding: "0 50px 50px" }}
                        className="row mt-3"
                      >
                        <div className="col-lg-12">
                          <div className="input-field-main">
                            <label
                              htmlFor=""
                              style={{ color: "rgba(0, 0, 0, 0.6)" }}
                            >
                              Strategic Particulars Name
                              <span className="text-danger">*</span>
                            </label>
                            <FormikInput
                              classes="input-sm"
                              type="text"
                              name="particularName"
                              className="form-control"
                              errors={errors}
                              touched={touched}
                              onChange={(e) => {
                                setFieldValue("particularName", e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="input-field-main">
                            <label>Description (Optional)</label>
                            <FormikTextArea
                              classes="textarea-with-label"
                              value={values?.description}
                              name="description"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("description", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                              style={{ height: "93px" }}
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: "26px",
                            fontWeight: "500px",
                            fontSize: "12px",
                            color: "#989EA3",
                          }}
                          className="col-md-12"
                        >
                          MORE INFORMATION
                        </div>
                        <div className="col-md-12">
                          <div
                            style={{
                              height: "1px",
                              width: "100%",
                              backgroundColor: "#E3E3E3",
                              marginBottom: "27px",
                            }}
                          ></div>
                        </div>
                        <div className="col-md-4">
                          <div className="input-field-main">
                            <label>
                              Select BSC Perspective{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <FormikSelect
                              name="bscPerspective"
                              placeholder=""
                              options={[
                                { value: 1, label: "Finance" },
                                { value: 2, label: "Customer" },
                                { value: 2, label: "Process" },
                              ]}
                              value={values?.bscPerspective}
                              onChange={(valueOption) => {
                                setFieldValue("bscPerspective", valueOption);
                              }}
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="input-field-main">
                            <label>
                              Select Strategic Particular Type
                              <span className="text-danger">*</span>
                            </label>
                            <FormikSelect
                              name="particularType"
                              placeholder=""
                              options={[
                                { value: 1, label: "Action" },
                                { value: 2, label: "Initiative" },
                                { value: 2, label: "Milestone" },
                              ]}
                              value={values?.particularType}
                              onChange={(valueOption) => {
                                setFieldValue("particularType", valueOption);
                              }}
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="input-field-main">
                            <label>
                              Select for Objective
                              <span className="text-danger">*</span>
                            </label>
                            <FormikSelect
                              name="objective"
                              placeholder=""
                              options={[
                                {
                                  value: 1,
                                  label: "Build best-in-class human resource",
                                },
                                {
                                  value: 2,
                                  label: "Acquire targeted customer milestone",
                                },
                                { value: 2, label: "Ensure cost efficiency" },
                              ]}
                              value={values?.objective}
                              onChange={(valueOption) => {
                                setFieldValue("objective", valueOption);
                              }}
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default StrPlan;
