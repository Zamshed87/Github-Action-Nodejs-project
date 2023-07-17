/* eslint-disable no-unused-vars */
import { Close } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { getPeopleDeskAllDDL } from "../../../../../common/api";
import FormikInput from "../../../../../common/FormikInput";
import FormikSelect from "../../../../../common/FormikSelect";
import FormikToggle from "../../../../../common/FormikToggle";
import { blackColor80, greenColor } from "../../../../../utility/customColor";
import { customStyles } from "../../../../../utility/selectCustomStyle";

const initData = {
  leaveType: "",
  approver: "",
  userGroup: "",
};
const validationSchema = Yup.object().shape({
  // businessUnit: Yup.string().required("Business Unit is required"),
  // code: Yup.string().required("Code is required"),
  // address: Yup.string().required("Address is required"),
  // email: Yup.string().email("Email is required"),
});

export default function AddEditFormComponent({
  id,
  show,
  onHide,
  size,
  backdrop,
  classes,
  isVisibleHeading = true,
  fullscreen,
  title,
  singleData,
  setSingleData,
  setRowDto,
  setAllData,
  singleBusinessItem,
  imageFile,
  setImageFile,
}) {
  const [leaveTypeDDL, setLeaveTypeDDL] = useState([]);
  const [modifySingleData, setModifySingleData] = useState("");

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getPeopleDeskAllDDL(
      "LeaveType",
      orgId,
      buId,
      setLeaveTypeDDL,
      "LeaveTypeId",
      "LeaveType"
    );
    setModifySingleData("");
  }, [orgId, buId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={id ? modifySingleData : initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // saveHandler(values, () => {
          //    if (id) {
          //       resetForm(modifySingleData);
          //    }
          //    else {
          //       resetForm(initData);
          //    }
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
                              if (id) {
                                resetForm(modifySingleData);
                              } else {
                                resetForm(initData);
                              }
                              onHide();
                            }}
                          >
                            <Close />
                          </div>
                        </div>
                      </div>
                    </Modal.Header>
                  )}

                  <Modal.Body id="example-modal-sizes-title-xl">
                    <div className="payroll-group-modal">
                      <div className="modalBody">
                        <div className="row">
                          <div className="col-6">
                            <div className="input-field-main">
                              <label>Payroll Group Name</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.payrollGroup}
                                name="payrollGroup"
                                type="text"
                                className="form-control"
                                placeholder=""
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="input-field-main">
                              <label>Code</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.code}
                                name="code"
                                type="text"
                                className="form-control"
                                placeholder=""
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="input-field-main">
                              <FormikSelect
                                name="startDate"
                                options={[
                                  { value: 1, label: "BD" },
                                  { value: 2, label: "UK" },
                                  { value: 3, label: "USA" },
                                ]}
                                value={values?.startDate}
                                label="Start Date"
                                onChange={(valueOption) => {
                                  setFieldValue("startDate", valueOption);
                                }}
                                placeholder=""
                                styles={customStyles}
                                errors={errors}
                                touched={touched}
                                isDisabled={false}
                              />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="input-field-main">
                              <FormikSelect
                                name="endDate"
                                options={[
                                  { value: 1, label: "BD" },
                                  { value: 2, label: "UK" },
                                  { value: 3, label: "USA" },
                                ]}
                                value={values?.endDate}
                                label="End Date"
                                onChange={(valueOption) => {
                                  setFieldValue("endDate", valueOption);
                                }}
                                placeholder=""
                                styles={customStyles}
                                errors={errors}
                                touched={touched}
                                isDisabled={false}
                              />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="input-field-main">
                              <FormikSelect
                                name="payFrequency"
                                options={[
                                  { value: 1, label: "BD" },
                                  { value: 2, label: "UK" },
                                  { value: 3, label: "USA" },
                                ]}
                                value={values?.payFrequency}
                                label="Pay Frequency"
                                onChange={(valueOption) => {
                                  setFieldValue("payFrequency", valueOption);
                                }}
                                placeholder=""
                                styles={customStyles}
                                errors={errors}
                                touched={touched}
                                isDisabled={false}
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="input-main position-group-select mt-2">
                              <h6 className="title-item-name">
                                Payroll Group Activation
                              </h6>
                              <p className="subtitle-p mb-1">
                                Activation toggle indicates to the particular
                                Payroll Group status (Active/Inactive)
                              </p>
                            </div>
                          </div>
                          <div className="col-12">
                            <FormikToggle
                              name="isActive"
                              color={
                                values?.isActive ? greenColor : blackColor80
                              }
                              checked={values?.isActive}
                              onChange={(e) => {
                                setFieldValue("isActive", e.target.checked);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="form-modal-footer">
                    <button
                      type="button"
                      className="modal-btn modal-btn-cancel"
                      onClick={() => {
                        if (id) {
                          resetForm(modifySingleData);
                        } else {
                          resetForm(initData);
                        }
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
