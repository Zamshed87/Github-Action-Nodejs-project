import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { getPeopleDeskAllDDL, getPeopleDeskAllLanding } from "../../../../../common/api";
import FormikInput from "../../../../../common/FormikInput";
import FormikSelect from "../../../../../common/FormikSelect";
import FormikToggle from "../../../../../common/FormikToggle";
import Loading from "../../../../../common/loading/Loading";
import { blackColor80, greenColor } from "../../../../../utility/customColor";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { createPayrollElements } from "../helper";

const initData = {
  type: "",
  elements: "",
  code: "",
  isActive: true,
};

const validationSchema = Yup.object().shape({
  type: Yup.object()
    .shape({
      value: Yup.string().required("Type is required"),
      label: Yup.string().required("Type is required"),
    })
    .typeError("Type is required"),
  elements: Yup.string().required("Elements is required"),
  code: Yup.string().required("Code is required"),
});

const CreatePayrollElementsModal = ({
  id,
  orgId,
  buId,
  wgId,
  employeeId,
  singleData,
  setSingleData,
  handleOpen,
  onHide,
  setRowDto,
  setAllData
}) => {
  const [loading, setLoading] = useState(false);

  const [payrollTypeDDL, setPayrollTypeDDL] = useState([]);
  const [modifySingleData, setModifySingleData] = useState("");

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PayrollElementType&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
      "PayrollElementTypeId",
      "PayrollElementName",
      setPayrollTypeDDL,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (singleData) {
      const newRowData = {
        type: {
          Code: singleData?.PayrollElementTypeCode,
          value: singleData?.PayrollElementTypeId,
          label: singleData?.PayrollElementTypeName,
        },
        elements: singleData?.PayrollElementName,
        code: singleData?.PayrollElementCode,
        isActive: singleData?.IsActive || false,
      };
      setModifySingleData(newRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  useEffect(() => {
    getPeopleDeskAllLanding("PayrollElementById", orgId, buId, id, setSingleData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveHandler = (values, cb) => {
    let payload = {
      autoId: "1",
      partType: "PayrollElement",
      payrollElementName: values?.elements,
      payrollElementCode: values?.code,
      payrollElementTypeId: values?.type?.value,
      payrollElementTypeCode: values?.type?.Code,
      isActive: values?.isActive,
      intCreatedBy: employeeId,
      payrollGradeName: "",
      lowerLimit: "0",
      upperLimit: "0",
      payrollGroupName: "",
      payrollGroupCode: "",
      startDateOfMonth: "",
      endDateOfMonth: "",
      payFrequencyName: "",
      payFrequencyId: "0"
    }
    const callback = () => {
      cb();
      getPeopleDeskAllLanding(
        "PayrollElementAndRules",
        orgId,
        buId,
        "",
        setRowDto,
        setAllData,
        setLoading
      );
      getPeopleDeskAllLanding("PayrollElementById", orgId, buId, id, setSingleData);
      onHide();
    };
    if (id) {
      payload = {
        ...payload,
        autoId: id,
      };
      createPayrollElements(payload, setLoading, callback);
    }
    else {
      payload = {
        ...payload,
        autoId: 0,
      };
      createPayrollElements(payload, setLoading, callback);
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
            {loading && <Loading />}
            <Form>
              <div className="payroll-element-modal">
                <div className="modal-body2">
                  <div className="input-field-main">
                    <label>Type</label>
                    <FormikSelect
                      name="type"
                      options={payrollTypeDDL || []}
                      value={values?.type}
                      label=""
                      onChange={(valueOption) => {
                        setFieldValue("type", valueOption);
                      }}
                      placeholder=""
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isDisabled={false}
                    />
                  </div>
                  <div className="input-field-main">
                    <label>Elements</label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.elements}
                      name="elements"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("elements", e.target.value);
                      }}
                      className="form-control"
                      placeholder=""
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="input-field-main">
                    <label>Code</label>
                    <FormikInput
                      classes="input-sm"
                      value={values?.code}
                      name="code"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("code", e.target.value);
                      }}
                      className="form-control"
                      placeholder=""
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {id && (<div className="input-field-main">
                    <h6 className="title-item-name">Activation</h6>
                    <p className="subtitle-p">
                      Activation toggle indicates to the particular Payroll Elements status (Active/Inactive)
                    </p>
                    <div className="col-12 px-1">
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
                    </div>
                  </div>)}
                </div>
                <div className="modal-footer form-modal-footer">
                  <button
                    type="button"
                    onClick={(e) => {
                      if (id) {
                        resetForm(modifySingleData);
                      } else {
                        resetForm(initData);
                      }
                      onHide()
                    }}
                    className="btn btn-cancel"                >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onSubmit={() => handleSubmit()}
                    className="modal-btn modal-btn-save"
                  >
                    Save
                  </button>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default CreatePayrollElementsModal;
