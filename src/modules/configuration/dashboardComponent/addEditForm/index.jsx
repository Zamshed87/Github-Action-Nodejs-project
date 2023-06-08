import { Close } from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { todayDate } from "../../../../utility/todayDate";
import FormikInput from "../../../../common/FormikInput";
import FormikToggle from "../../../../common/FormikToggle";
import Loading from "../../../../common/loading/Loading";
import { blackColor80, greenColor } from "../../../../utility/customColor";
import { createDashboardComponent, getComponentById } from "../helper";


const initData = {
  dashboardName: "",
  displayName: "",
  isActive: true,
};
const validationSchema = Yup.object().shape({
  dashboardName: Yup.string().required("Dashboard Name is required"),
  displayName: Yup.string().required("Display Name is required"),
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
  getData
}) {
  const [loading, setLoading] = useState(false);

  const [modifySingleData, setModifySingleData] = useState("");

  const { employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    if (singleData?.intId) {
      const newRowData = {
        dashboardName: singleData?.strName,
        displayName: singleData?.strDisplayName,
        isActive: singleData?.isActive,
      };
      setModifySingleData(newRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  useEffect(() => {
    if (id) {
      getComponentById({ id, setter: setSingleData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveHandler = (values, cb) => {
    let payload = {
      strName: values?.dashboardName,
      strDisplayName: values?.displayName,
      strHashCode: "",
      isActive: values?.isActive,
      dteCreatedAt: todayDate(),
      intCreatedBy: id ? 0 : employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: id ? 0 : employeeId,
    };
    const callback = () => {
      cb();
      onHide();
      getData();
    };
    if (id) {
      createDashboardComponent(
        { ...payload, intId: id, },
        setLoading,
        callback
      );
    } else {
      createDashboardComponent(
        { ...payload, intId: 0, },
        setLoading,
        callback
      );
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={id ? modifySingleData : initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            if (id) {
              resetForm(modifySingleData);
            } else {
              resetForm(initData);
            }
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
            {loading && <Loading />}
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
                    <div className="businessUnitModal">
                      <div className="modalBody pt-0">
                        <p className="subtitle-p pt-1">* Indicates required</p>
                        <div className="row">
                          <div className="col-6">
                            <label>Dashboard Name *</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.dashboardName}
                              name="dashboardName"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("dashboardName", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-6">
                            <label>Display Name *</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.displayName}
                              name="displayName"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("displayName", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>

                          {id && (<div className="col-6">
                            <div className="input-main position-group-select mt-2">
                              <h6 className="title-item-name" style={{ fontSize: "14px" }}>
                                Dashboard Component Activation
                              </h6>
                              <p className="subtitle-p">
                                Activation toggle indicates to the particular Dashboard Component status (Active/Inactive)
                              </p>
                            </div>
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
                          </div>)}

                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="form-modal-footer">
                    <div className="master-filter-btn-group">
                      <button
                        type="button"
                        className="modal-btn modal-btn-cancel"
                        sx={{
                          marginRight: "10px",
                        }}
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
                    </div>
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
