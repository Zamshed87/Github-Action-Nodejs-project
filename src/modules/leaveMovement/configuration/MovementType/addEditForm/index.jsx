import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import FormikInput from "../../../../../common/FormikInput";
import FormikSelect from "../../../../../common/FormikSelect";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../../utility/todayDate";
import { saveMovementType, quotaFrequencyDDL } from "../helper";

const initData = {
  movementTypeName: "",
  movementTypeCode: "",
  quotaHour: "",
  quotaFrequency: "",
};
const validationSchema = Yup.object().shape({
  movementTypeName: Yup.string().required("Movement type is required"),
  movementTypeCode: Yup.string().required("Movement type code is required"),
  quotaHour: Yup.number()
    .min(0, "Min value 0")
    .required("Quota hour is required"),
  quotaFrequency: Yup.object()
    .shape({
      label: Yup.string().required("Quota frequency is required"),
      value: Yup.string().required("Quota frequency is required"),
    })
    .typeError("Quota frequency is required"),
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
  getData,
  setOpenModal,
  singleData,
  setSingleData,
}) {
  const { employeeId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [modifySingleData, setModifySingleData] = useState("");

  useEffect(() => {
    if (singleData?.intMovementTypeId) {
      setModifySingleData({
        movementTypeName: singleData?.strMovementType,
        movementTypeCode: singleData?.strMovementTypeCode,
        quotaHour: singleData?.intQuotaHour,
        quotaFrequency: quotaFrequencyDDL?.filter(
          (item) => item?.value === singleData?.intQuotaFrequency
        )[0],
      });
    }
  }, [singleData]);

  const saveHandler = (values, cb) => {
    saveMovementType(
      {
        intMovementTypeId: singleData?.intMovementTypeId
          ? singleData?.intMovementTypeId
          : 0,
        strMovementType: values?.movementTypeName,
        strMovementTypeCode: values?.movementTypeCode,
        intQuotaHour: values?.quotaHour,
        intQuotaFrequency: values?.quotaFrequency?.value,
        isActive: true,
        intAccountId: orgId,
        dteCreatedAt: todayDate(),
        intCreatedBy: employeeId,
        dteUpdatedAt: todayDate(),
        intUpdatedBy: employeeId,
      },
      cb
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          singleData?.intMovementTypeId ? modifySingleData : initData
        }
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            getData();
            resetForm(initData);
            setOpenModal(false);
            setSingleData("");
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
          setValues,
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
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <Modal.Title className="text-center">
                          {title}
                        </Modal.Title>
                        <div>
                          <IconButton
                            onClick={() => {
                              setSingleData("");
                              onHide();
                            }}
                          >
                            <Close />
                          </IconButton>
                        </div>
                      </div>
                    </Modal.Header>
                  )}

                  <Modal.Body id="example-modal-sizes-title-xl">
                    <div className="pipeLineModal">
                      <div className="modalBody px-0 pt-0">
                        <div className="row mx-0">
                          <div className="col-6">
                            <div className="input-field-main">
                              <label htmlFor="">Movement Type Name</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.movementTypeName}
                                name="movementTypeName"
                                type="text"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue(
                                    "movementTypeName",
                                    e.target.value
                                  );
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="input-field-main">
                              <label htmlFor="">Movement Type Code</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.movementTypeCode}
                                name="movementTypeCode"
                                type="text"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue(
                                    "movementTypeCode",
                                    e.target.value
                                  );
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row mx-0">
                          <div className="col-6">
                            <div className="input-field-main">
                              <label htmlFor="">Quota Hour</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.quotaHour}
                                name="quotaHour"
                                type="number"
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue("quotaHour", e.target.value);
                                }}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="input-field-main">
                              <label htmlFor="">Quota Frequency</label>
                              <FormikSelect
                                classes="input-sm"
                                styles={customStyles}
                                menuPosition="fixed"
                                name="quotaFrequency"
                                options={quotaFrequencyDDL}
                                value={values?.quotaFrequency}
                                onChange={(valueOption) => {
                                  setFieldValue("quotaFrequency", valueOption);
                                }}
                                errors={errors}
                                touched={touched}
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
                      className="btn btn-cancel"
                      style={{
                        marginRight: "15px",
                      }}
                      sx={{
                        marginRight: "10px",
                      }}
                      onClick={() => {
                        resetForm(initData);
                        onHide();
                        setSingleData("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-green"
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
