import { Close } from "@mui/icons-material";
import { Form, Formik } from "formik";
import React from "react";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import FormikInput from "../../../../../common/FormikInput";
import FormikToggle from "../../../../../common/FormikToggle";
import { blackColor80, greenColor } from "../../../../../utility/customColor";

const initData = {
  grade: "",
  lowerLimit: "",
  upperLimit: "",
};

const validationSchema = Yup.object({});

const AddEditFormComponent = ({ show, onHide, size, backdrop, classes, isVisibleHeading = true, fullscreen, title }) => {
  const saveHandler = (values, cb) => {
  };

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
            <div className="viewModal">
              <Modal
                show={show}
                onHide={onHide}
                size={size}
                backdrop={backdrop}
                aria-labelledby="example-modal-sizes-title-xl"
                className={classes}
                fullscreen={fullscreen && fullscreen}
              >
                <Form>
                  {isVisibleHeading && (
                    <Modal.Header className="bg-custom">
                      <div className="d-flex w-100 justify-content-between">
                        <Modal.Title className="text-center">{title}</Modal.Title>
                        <div>
                          <div
                            className="crossIcon"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              onHide();
                            }}
                          >
                            <Close />
                          </div>
                        </div>
                      </div>
                    </Modal.Header>
                  )}

                  <Modal.Body id="example-modal-sizes-title-xl" className="gradeModal">
                    <div className="modalBody pt-1">
                      <p className="subtitle-p mb-1">* Indicates required</p>
                      <div className="row">
                        <div className="col-12">
                          <div className="input-field-main">
                            <label>Grade Name</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.grade}
                              name="grade"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("grade", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="input-field-main">
                            <label>Lower Limit</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.lowerLimit}
                              name="lowerLimit"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("lowerLimit", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="input-field-main">
                            <label>Upper Limit</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.upperLimit}
                              name="upperLimit"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("upperLimit", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="input-main position-group-select mt-2">
                            <h6 className="title-item-name">Activation</h6>
                            <p className="subtitle-p mb-1">Activation toggle indicates to the particular Grade status (Active/Inactive)</p>
                          </div>
                        </div>
                        <div className="col-12">
                          <FormikToggle
                            name="isActive"
                            color={values?.isActive ? greenColor : blackColor80}
                            checked={values?.isActive}
                            onChange={(e) => {
                              setFieldValue("isActive", e.target.checked);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="form-modal-footer">

                    <button
                      type="button"
                      className="modal-btn modal-btn-cancel"
                      onClick={() => {
                        onHide();
                      }}
                    >
                      Cancel
                    </button>
                    <button className="modal-btn modal-btn-save" type="submit" onSubmit={() => handleSubmit()}>
                      Save
                    </button>

                  </Modal.Footer>
                </Form>
              </Modal>
            </div>
          </>
        )}
      </Formik>
    </>
  );
};

export default AddEditFormComponent;
