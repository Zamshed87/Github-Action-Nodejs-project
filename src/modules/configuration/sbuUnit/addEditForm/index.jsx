import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { Close } from "@mui/icons-material";
import { createSBU } from "./../helper";
import FormikToggle from "./../../../../common/FormikToggle";
import FormikInput from "./../../../../common/FormikInput";
import FormikSelect from "./../../../../common/FormikSelect";
import { customStyles } from "./../../../../utility/newSelectCustomStyle";
import { greenColor, blackColor80 } from "./../../../../utility/customColor";
import {
  getPeopleDeskAllDDL,
  getPeopleDeskAllLanding,
} from "./../../../../common/api/index";
import Loading from "./../../../../common/loading/Loading";

const initData = {
  sbu: "",
  code: "",
  address: "",
  email: "",
  businessUnit: "",
  isActive: true,
};
const validationSchema = Yup.object().shape({
  sbu: Yup.string().required("SBU is required"),
  code: Yup.string().required("Code is required"),
  address: Yup.string().required("Address is required"),
  email: Yup.string().email("Email is invalid"),
  businessUnit: Yup.object()
    .shape({
      label: Yup.string().required("Business Unit is required"),
      value: Yup.string().required("Business Unit is required"),
    })
    .typeError("Business Unit is required"),
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
  setRowDto,
  setAllData,
  singleData,
  setSingleData
}) {
  const [loading, setLoading] = useState(false);

  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [modifySingleData, setModifySingleData] = useState("");

  const { userId, orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getPeopleDeskAllDDL(
      "BusinessUnit",
      orgId,
      buId,
      setBusinessUnitDDL,
      "BusinessUnitId",
      "BusinessUnitName"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (singleData?.SBUName) {
      const newRowData = {
        sbu: singleData?.SBUName,
        code: singleData?.SBUCode,
        address: singleData?.SBUAddress,
        businessUnit: singleData?.BusinessUnitId && singleData?.BusinessUnitName ? {
          value: singleData?.BusinessUnitId,
          label: singleData?.BusinessUnitName,
        } : "",
        email: singleData?.Email,
        isActive: singleData?.Status || false,
      };
      setModifySingleData(newRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const saveHandler = (values, cb) => {
    const callback = () => {
      cb();
      onHide();
      getPeopleDeskAllLanding(
        "SBU",
        orgId,
        "",
        "",
        setRowDto,
        setAllData,
        setLoading
      );
      
    };
    if (singleData?.SBUName) {
      createSBU(
        {
          actionTypeId: 2,
          sbuid: singleData?.SBUId,
          sbucode: values?.code,
          sbuname: values?.sbu,
          sbuaddress: values?.address,
          email: values?.email,
          accountId: orgId,
          businessUnitId: values?.businessUnit?.value,
          isActive: values?.isActive,
          insertUserId: userId,
        },
        setLoading,
        callback
      );
    } else {
      createSBU(
        {
          actionTypeId: 1,
          sbuid: 0,
          sbucode: values?.code,
          sbuname: values?.sbu,
          sbuaddress: values?.address,
          email: values?.email,
          accountId: orgId,
          businessUnitId: values?.businessUnit?.value,
          isActive: values?.isActive,
          insertUserId: userId,
        },
        setLoading,
        callback
      );
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={singleData?.SBUName ? modifySingleData : initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
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
                              if (singleData?.SBUName) {
                                 resetForm(modifySingleData);
                              } else {
                                 resetForm(initData);
                              }
                              onHide()
                              setSingleData("")
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
                        <p>* Indicates required</p>
                        <div className="row">
                          <div className="col-6">
                            <label>SBU *</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.sbu}
                              name="sbu"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("sbu", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-6">
                            <label>Code *</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.code}
                              name="code"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("code", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-6">
                            <label>Address *</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.address}
                              name="address"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("address", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-6">
                            <label>Email</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.email}
                              name="email"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("email", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-6">
                            <label>Business Unit *</label>
                            <FormikSelect
                              name="businessUnit"
                              options={businessUnitDDL || []}
                              value={values?.businessUnit}
                              onChange={(valueOption) => {
                                setFieldValue("businessUnit", valueOption);
                              }}
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          {singleData?.SBUName && (<div className="col-12">
                            <div className="input-main position-group-select mt-2">
                              <h6 className="title-item-name">
                                SBU Activation
                              </h6>
                              <p className="subtitle-p">Activation toggle indicates to the particular SBU status (Active/Inactive)</p>
                            </div>
                            <FormikToggle
                              name="isActive"
                              color={
                                values?.isActive
                                  ? greenColor
                                  : blackColor80
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
                  
                      <button
                        type="button"
                        className="modal-btn modal-btn-cancel"
                        sx={{
                          marginRight: "10px",
                        }}
                        onClick={() => {
                          if (singleData?.SBUName) {
                             resetForm(modifySingleData);
                          } else {
                             resetForm(initData);
                          }
                          onHide()
                          setSingleData("")
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
