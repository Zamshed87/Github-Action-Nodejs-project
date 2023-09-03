import { Close } from "@mui/icons-material";
import { Form, Formik } from "formik";
import React from "react";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import FormikInput from "../../../common/FormikInput";
import FormikSelect from "../../../common/FormikSelect";
import { getDifferenceBetweenTime } from "../../../utility/getDifferenceBetweenTime";
import { customStyles } from "../../../utility/selectCustomStyle";
import { todayDate } from "../../../utility/todayDate";

const initData = {
  employee: "",
  workPlace: "",
  date: "",
  startTime: "",
  endTime: "",
  overTimeHour: "",
  reason: "",
  search: "",
};

const validationSchema = Yup.object().shape({
  employee: Yup.object()
    .shape({
      label: Yup.string().required("Employee is required"),
      value: Yup.string().required("Employee is required"),
    })
    .typeError("Employee is required"),
  date: Yup.string().required("Date is required"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string().required("End time is required"),
});

export default function CreateModalFormModule({
  show,
  onHide,
  size,
  backdrop,
  classes,
  isVisibleHeading = true,
  fullscreen,
  title,
  setCreateModal,
  type,
  getData,
}) {
  const initialValue = initData;

  const saveHandler = (values, cb) => {};

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initialValue);
            setCreateModal(false);
            getData();
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
                        <Modal.Title className="text-center">
                          {title}
                        </Modal.Title>
                        <div>
                          <div
                            className="crossIcon"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              onHide();
                              resetForm(initialValue);
                            }}
                          >
                            <Close />
                          </div>
                        </div>
                      </div>
                    </Modal.Header>
                  )}

                  <Modal.Body id="example-modal-sizes-title-xl">
                    <div className="businessUnitModal">
                      <div className="modalBody">
                        <div className="row">
                          <div className="col-6">
                            <div className="input-field-main">
                              <label>Employee</label>
                              <FormikSelect
                                name="employee"
                                options={[]}
                                value={values?.employee}
                                onChange={(valueOption) => {
                                  setFieldValue("employee", valueOption);
                                }}
                                styles={customStyles}
                                errors={errors}
                                touched={touched}
                                isDisabled={type === "edit"}
                                menuPosition="fixed"
                              />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="input-field-main">
                              <label>Workplace</label>
                              <FormikSelect
                                name="workPlace"
                                options={[]}
                                value={values?.workPlace}
                                onChange={(valueOption) => {
                                  setFieldValue("workPlace", valueOption);
                                }}
                                styles={customStyles}
                                errors={errors}
                                touched={touched}
                                isDisabled={false}
                                menuPosition="fixed"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-6">
                            <div className="input-field-main">
                              <label>Date</label>
                              <FormikInput
                                classes="input-sm"
                                name="date"
                                type="date"
                                value={values?.date}
                                max={todayDate()}
                                onChange={(e) => {
                                  setFieldValue("date", e.target.value);
                                  if (values?.startTime && values?.endTime) {
                                    let difference = getDifferenceBetweenTime(
                                      e.target.value,
                                      values?.startTime,
                                      values?.endTime
                                    );
                                    setFieldValue("overTimeHour", difference);
                                  }
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="input-field-main">
                              <label>Start Time</label>
                              <FormikInput
                                classes="input-sm"
                                type="time"
                                name="startTime"
                                value={values?.startTime}
                                onChange={(e) => {
                                  setFieldValue("startTime", e.target.value);
                                  if (values?.date && values?.endTime) {
                                    let difference = getDifferenceBetweenTime(
                                      values?.date,
                                      e.target.value,
                                      values?.endTime
                                    );
                                    setFieldValue("overTimeHour", difference);
                                  }
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-6">
                            <div className="input-field-main">
                              <label>End Time</label>
                              <FormikInput
                                classes="input-sm"
                                type="time"
                                name="endTime"
                                value={values?.endTime}
                                onChange={(e) => {
                                  setFieldValue("endTime", e.target.value);
                                  if (values?.date && values?.startTime) {
                                    let difference = getDifferenceBetweenTime(
                                      values?.date,
                                      values?.startTime,
                                      e.target.value
                                    );
                                    setFieldValue("overTimeHour", difference);
                                  }
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="input-field-main">
                              <label>Overtime Hour</label>
                              <FormikInput
                                classes="input-sm"
                                type="text"
                                name="overTimeHour"
                                disabled={true}
                                value={values?.overTimeHour}
                                onChange={(e) => {
                                  setFieldValue("overTimeHour", e.target.value);
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="input-field-main">
                              <label>Reason (Optional)</label>
                              <FormikInput
                                classes="input-sm"
                                type="text"
                                name="reason"
                                value={values?.reason}
                                onChange={(e) => {
                                  setFieldValue("reason", e.target.value);
                                }}
                                disabled={type === "edit"}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="form-modal-footer">
                    <button
                      type="button"
                      className="modal-btn modal-btn-cancel"
                      sx={{
                        marginRight: "10px",
                      }}
                      onClick={() => {
                        resetForm(initialValue);
                        onHide();
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="modal-btn modal-btn-save"
                      type="submit"
                      onSubmit={() => handleSubmit()}
                    >
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
}
