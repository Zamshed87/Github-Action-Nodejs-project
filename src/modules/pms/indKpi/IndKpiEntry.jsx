/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import AvatarComponent from "../../../common/AvatarComponent";
import BackButton from "../../../common/BackButton";
import FormikSelect from "../../../common/FormikSelect";
import Loading from "../../../common/loading/Loading";
import PrimaryButton from "../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { customStyles } from "../../../utility/selectCustomStyle";

const initData = {
  kpiName: "",
  description: "",
  objective: "",
  kpiFormat: "",
  bscPerspective: "",
  aggregationType: "",
  targetFrequency: "",
  maxMin: "",
};

const IndKpiEntry = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
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
            {/* provident-fund classname used for background and card design */}
            <div className="provident-fund">
              <div className="col-md-12">
                <div className="table-card">
                  <div className="table-card-heading heading pt-0">
                    <BackButton title={" Create Individual KPI"} />
                    <div className="table-card-heading ">
                      <div className="table-card-head-right">
                        <ul>
                          <li>
                            <div>
                              <PrimaryButton
                                type="button"
                                className="btn btn-default flex-center"
                                label={"Save"}
                              />
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="table-card-body pt-2">
                    <div className="card">
                      <div className="card-body">
                        <div className="row pt-1">
                          <div className="col-lg-4">
                            <div className="input-field-main">
                              <label style={{ fontSize: "12px" }}>
                                Select Employee <span id="color">*</span>
                              </label>
                              <FormikSelect
                                name="selectEmployee"
                                value={values?.Category}
                                options={[
                                  { value: 1, label: "Md. Imran Uddin" },
                                  {
                                    value: 2,
                                    label: "Md. Taufiqur Rahman",
                                  },
                                  { value: 3, label: "Abdur Rahim" },
                                ]}
                                placeholder=""
                                styles={customStyles}
                                isDisabled={false}
                                errors={errors}
                                touched={touched}
                                onChange={(valueOption) => {}}
                              />
                            </div>
                          </div>
                        </div>
                        <div style={{ marginTop: "36px" }} className="row">
                          <div className="col-lg">
                            <div className="emp-avatar d-flex align-items-center ">
                              <AvatarComponent
                                classess=""
                                letterCount={1}
                                label={"Md. Imran Uddin"}
                              />
                              <div className="ml-3">
                                <h4 style={{ fontSize: "14px" }}>
                                  Md. Imran Uddin
                                </h4>
                                <p
                                  className="sub-text"
                                  style={{ fontSize: "12px" }}
                                >
                                  Executive UI/UX Designer, Full-time
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg">
                            <div className="emp-avatar d-flex align-items-center ">
                              <div className="ml-3">
                                <h4 style={{ fontSize: "14px" }}>
                                  imran@ibos.io
                                </h4>
                                <p
                                  className="sub-text"
                                  style={{ fontSize: "12px" }}
                                >
                                  Email
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg">
                            <div className="emp-avatar d-flex align-items-center ">
                              <div className="ml-3">
                                <h4 style={{ fontSize: "14px" }}>Executive</h4>
                                <p
                                  className="sub-text"
                                  style={{ fontSize: "12px" }}
                                >
                                  HR Position
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg">
                            <div className="emp-avatar d-flex align-items-center ">
                              <div className="ml-3">
                                <h4 style={{ fontSize: "14px" }}>UI/UX</h4>
                                <p
                                  className="sub-text"
                                  style={{ fontSize: "12px" }}
                                >
                                  Department
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg">
                            <div className="emp-avatar d-flex align-items-center ">
                              <div className="ml-3">
                                <h4 style={{ fontSize: "14px" }}>
                                  01897908657
                                </h4>
                                <p
                                  className="sub-text"
                                  style={{ fontSize: "12px" }}
                                >
                                  Contact No
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row pt-5">
                      <div className="col-lg-4 pr-0">
                        <div className="input-field-main">
                          <label style={{ fontSize: "12px" }}>
                            Select KPI
                            <span id="color">*</span>
                          </label>
                          <FormikSelect
                            name="kpi"
                            value={values?.kpi}
                            options={[
                              {
                                value: 1,
                                label: "BDT Revenue (M)",
                              },
                              {
                                value: 2,
                                label: " # New customer developed",
                              },
                            ]}
                            placeholder=""
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                            onChange={(valueOption) => {}}
                          />
                        </div>
                      </div>

                      <div className="col-lg-4 pr-0">
                        <div className="input-field-main">
                          <label style={{ fontSize: "12px" }}>
                            Frequency
                            <span id="color">*</span>
                          </label>
                          <FormikSelect
                            name="frequency"
                            value={values?.frequency}
                            options={[
                              {
                                value: 1,
                                label: "Monthly",
                              },
                              {
                                value: 2,
                                label: "Yearly",
                              },
                            ]}
                            placeholder=""
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                            onChange={(valueOption) => {}}
                          />
                        </div>
                      </div>

                      <div className="col-lg-4 pr-0">
                        <div className="input-field-main">
                          <label style={{ fontSize: "12px" }}>
                            BSC Perspective
                            <span id="color">*</span>
                          </label>
                          <FormikSelect
                            name="bscPerspective"
                            value={values?.bscPerspective}
                            options={[
                              {
                                value: 1,
                                label: "Finance",
                              },
                              {
                                value: 2,
                                label: "Customer",
                              },
                            ]}
                            placeholder=""
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                            onChange={(valueOption) => {}}
                          />
                        </div>
                      </div>

                      <div className="col-lg-4 pr-0">
                        <div className="input-field-main">
                          <label style={{ fontSize: "12px" }}>
                            Select Year
                            <span id="color">*</span>
                          </label>
                          <FormikSelect
                            name="year"
                            value={values?.year}
                            options={[
                              {
                                value: 1,
                                label: "2021",
                              },
                              {
                                value: 2,
                                label: "2022",
                              },
                            ]}
                            placeholder=""
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                            onChange={(valueOption) => {}}
                          />
                        </div>
                      </div>

                      <div className="col-lg-4 pr-0">
                        <div className="input-field-main">
                          <label style={{ fontSize: "12px" }}>
                            Weight
                            <span id="color">*</span>
                          </label>
                          <FormikSelect
                            name="weight"
                            value={values?.weight}
                            options={[
                              {
                                value: 1,
                                label: "1",
                              },
                              {
                                value: 2,
                                label: "2",
                              },
                            ]}
                            placeholder=""
                            styles={customStyles}
                            errors={errors}
                            touched={touched}
                            onChange={(valueOption) => {}}
                          />
                        </div>
                      </div>

                      <div className="col-lg-4 pr-0">
                        <div
                          style={{ marginTop: "30px" }}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <input
                              style={{ cursor: "pointer" }}
                              type="checkbox"
                              aria-label="Checkbox"
                            />
                            <label
                              style={{ fontSize: "12px" }}
                              className="m-0 ml-2"
                              htmlFor=""
                            >
                              Include subordinate targets with individual
                            </label>
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

export default IndKpiEntry;
