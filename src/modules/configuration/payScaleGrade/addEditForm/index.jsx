import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { getControlPanelAllLanding } from "../../helper";
import { createBusinessUnit } from "../helper";
import FormikInput from "./../../../../common/FormikInput";
import FormikSelect from "./../../../../common/FormikSelect";
import Loading from "./../../../../common/loading/Loading";
import { customStyles } from "./../../../../utility/newSelectCustomStyle";

const initData = {
  payScaleGradeName: "",
  payScaleGradeCode: "",
  maxSalary: "",
  minSalary: "",
  dependOn: "",
};
const validationSchema = Yup.object().shape({
  payScaleGradeName: Yup.string().required("PayScale Grade Name is required"),
  maxSalary: Yup.number()
    .min(1, "Must be greater than zero")
    .required("Max Salary is required"),
  minSalary: Yup.number()
    .min(1, "Must be greater than zero")
    .required("Minimum Salary is required"),
  dependOn: Yup.object()
    .shape({
      label: Yup.string().required("Depend On is required"),
      value: Yup.string().required("Depend On is required"),
    })
    .typeError("Depend On is required"),
});

export default function AddEditFormComponent({
  propsObj,
  fullscreen,
  isVisibleHeading,
}) {
  const {
    show,
    title,
    onHide,
    size,
    backdrop,
    classes,
    setRowDto,
    // setAllData,
    paysaleGradeId,
    setPayscaleGradeId,
    setSingleData,
    singleData,
    // rowFileId,
  } = propsObj;
  const [loading, setLoading] = useState(false);

  const [modifySingleData, setModifySingleData] = useState("");

  const { employeeId, orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // useEffect(() => {
  //   if (paysaleGradeId) {
  //     getBusinessUnitById({
  //       orgId,
  //       paysaleGradeId,
  //       setter: setSingleData,
  //       setLoading,
  //     });
  //   }
  // }, [paysaleGradeId, orgId, setSingleData]);

  useEffect(() => {
    if (singleData?.intPayscaleGradeId) {
      const newRowData = {
        payScaleGradeName: singleData?.strPayscaleGradeName,
        payScaleGradeCode: singleData?.strPayscaleGradeCode,
        maxSalary: singleData?.numMaxSalary,
        minSalary: singleData?.numMinSalary,
        dependOn: {
          value: singleData?.strDepentOn,
          label: singleData?.strDepentOn,
        },
        isActive: singleData?.isActive,
      };
      setModifySingleData(newRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const saveHandler = (values, cb) => {
    if (values?.maxSalary < values?.minSalary) {
      return toast.warning("Max. Salary must be greater than min salary!!!");
    }

    const payload = {
      strPayscaleGradeName: values?.payScaleGradeName,
      strPayscaleGradeCode: values?.payScaleGradeCode,
      intAccountId: orgId,
      intBusinessUnitId: buId,
      strBusinessUnitName: "",
      intDesignationId: 0,
      strDesignationName: "",
      intShortOrder: 0,
      numMinSalary: +values?.minSalary,
      numMaxSalary: +values?.maxSalary,
      strDepentOn: values?.dependOn?.label,
      isActive: true,
      intCreatedBy: singleData?.intPayscaleGradeId ? 0 : employeeId,
    };

    const callback = () => {
      cb();
      onHide();
      getControlPanelAllLanding({
        apiUrl: `/Payroll/GetAllScaleGrade?IntAccountId=${orgId}&IntPayscaleGradeId=0`,
        setLoading,
        setter: setRowDto,
      });
    };

    if (paysaleGradeId) {
      createBusinessUnit(
        { ...payload, intPayscaleGradeId: singleData?.intPayscaleGradeId },
        setLoading,
        callback
      );
    } else {
      createBusinessUnit(
        { ...payload, intPayscaleGradeId: 0 },
        setLoading,
        callback
      );
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={paysaleGradeId ? modifySingleData : initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            if (paysaleGradeId) {
              resetForm(modifySingleData);
            } else {
              resetForm(initData);
            }
            setSingleData("");
            setPayscaleGradeId(null);
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
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <Modal.Title className="text-center">
                          {title}
                        </Modal.Title>
                        <div>
                          <IconButton
                            onClick={() => {
                              if (paysaleGradeId) {
                                resetForm(modifySingleData);
                              } else {
                                resetForm(initData);
                              }
                              onHide();
                              setSingleData("");
                              setPayscaleGradeId(null);
                            }}
                          >
                            <Close />
                          </IconButton>
                        </div>
                      </div>
                    </Modal.Header>
                  )}

                  <Modal.Body id="example-modal-sizes-title-xl">
                    <div className="businessUnitModal">
                      <div className="modalBody pt-0 px-0">
                        <div className="row mx-0">
                          <div className="col-6">
                            <label>PayScale Grade Name </label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.payScaleGradeName}
                              name="payScaleGradeName"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue(
                                  "payScaleGradeName",
                                  e.target.value
                                );
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-6">
                            <label>PayScale Grade Code</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.payScaleGradeCode}
                              name="payScaleGradeCode"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue(
                                  "payScaleGradeCode",
                                  e.target.value
                                );
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-6">
                            <label>Max Salary </label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.maxSalary}
                              name="maxSalary"
                              type="number"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("maxSalary", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-6">
                            <label>Min Salary </label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.minSalary}
                              name="minSalary"
                              type="number"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("minSalary", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-6">
                            <label>Depend On </label>
                            <FormikSelect
                              name="dependOn"
                              options={[
                                { value: "Basic", label: "Basic" },
                                { value: "Gross", label: "Gross" },
                              ]}
                              value={values?.dependOn}
                              onChange={(valueOption) => {
                                setFieldValue("dependOn", valueOption);
                              }}
                              placeholder=" "
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                              menuPosition="fixed"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="form-modal-footer">
                    <div className="master-filter-btn-group">
                      <button
                        type="button"
                        className="btn btn-cancel"
                        style={{
                          marginRight: "15px",
                        }}
                        onClick={() => {
                          if (setSingleData) {
                            resetForm(modifySingleData);
                          } else {
                            resetForm(initData);
                          }
                          onHide();
                          setSingleData("");
                          setPayscaleGradeId(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-green btn-green-disable"
                        style={{ width: "auto" }}
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
