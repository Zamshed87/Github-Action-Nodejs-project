import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { todayDate } from "../../../../utility/todayDate";
import { getPeopleDeskAllDDL } from "./../../../../common/api/index";
import FormikInput from "./../../../../common/FormikInput";
import FormikToggle from "./../../../../common/FormikToggle";
import Loading from "./../../../../common/loading/Loading";
import { blackColor40, greenColor } from "./../../../../utility/customColor";
import {
  createEditWorklineConfig,
  getAllWorklineConfig,
  getWorklineConfigById
} from "./../helper";

const initData = {
  employmentType: "",
  intServiceLengthDays: "",
  intNotifyDays: "",
  isActive: true,
};

const validationSchema = Yup.object().shape({
  employmentType: Yup.object()
    .shape({
      label: Yup.string().required("Employment type is required"),
      value: Yup.string().required("Employment type  is required"),
    })
    .typeError("First level is required"),
  intServiceLengthDays: Yup.string().required("Service length is required"),
  intNotifyDays: Yup.string().required("Notify Day is required"),
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
  setId,
  singleData,
  setSingleData,
  setRowDto,
  setAllData,
}) {
  const [loading, setLoading] = useState(false);
  const [employmentTypeDDL, setEmploymentTypeDDL] = useState([]);
  const [modifySingleData, setModifySingleData] = useState({});

  const { employeeId, orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    if (singleData) {
      const newRowData = {
        employmentType: {
          value: singleData?.intEmploymentTypeId,
          label: singleData?.strEmploymentType,
        },
        intServiceLengthDays: singleData?.intServiceLengthInDays,
        intNotifyDays: singleData?.intNotifyInDays,
        isActive: singleData?.isActive,
      };
      setModifySingleData(newRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  useEffect(() => {
    if (id) {
      getWorklineConfigById(setSingleData, id, setLoading);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/SaasMasterData/GetAllEmploymentTypeForWorkline?accountId=${orgId}`,
      "intEmploymentTypeId",
      "strEmploymentType",
      setEmploymentTypeDDL
    );
  }, [orgId, buId]);

  const saveHandler = (values, cb) => {
    let payload = {
      intEmploymentTypeId: values?.employmentType?.value,
      strEmploymentType: values?.employmentType?.label,
      intServiceLengthInDays: +values?.intServiceLengthDays || null,
      intNotifyInDays: +values?.intNotifyDays,
      intAccountId: orgId,
      isActive: values?.isActive,
      intCreatedBy: employeeId,
      dteCreatedAt: todayDate(),
      intUpdateBy: employeeId,
      dteUpdateAt: todayDate(),
    };

    const callback = () => {
      cb();
      onHide();
      getAllWorklineConfig(setRowDto, setAllData, setLoading, orgId);
    };

    if (id) {
      createEditWorklineConfig(
        { ...payload, intWorklineId: id },
        setLoading,
        callback
      );
    } else {
      createEditWorklineConfig(
        { ...payload, intWorklineId: 0 },
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
            setId("");
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
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <Modal.Title className="text-center">
                          {title}
                        </Modal.Title>
                        <div>
                          <IconButton onClick={() => onHide()}>
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
                          <div className="col-md-12">
                            <label>Employment Type</label>
                            <FormikSelect
                              name="employmentType"
                              options={employmentTypeDDL || []}
                              value={values?.employmentType}
                              onChange={(valueOption) => {
                                setFieldValue("employmentType", valueOption);
                              }}
                              menuPosition="fixed"
                              placeholder=""
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          {values?.employmentType?.label !== "Contractual" && (
                            <div className="col-md-12">
                              <label>Service Length Days</label>
                              <FormikInput
                                classes="input-sm"
                                value={values?.intServiceLengthDays}
                                onChange={(val) => {
                                  setFieldValue(
                                    "intServiceLengthDays",
                                    val.target.value
                                  );
                                }}
                                name="intServiceLengthDays"
                                type="text"
                                className="form-control"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                          )}
                          <div className="col-md-12">
                            <label>Notify Days</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.intNotifyDays}
                              onChange={(val) => {
                                setFieldValue(
                                  "intNotifyDays",
                                  val.target.value
                                );
                              }}
                              name="intNotifyDays"
                              type="text"
                              className="form-control"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          {id && (
                            <div className="col-12">
                              <div className="input-main position-group-select mt-2">
                                <h6 className="title-item-name">
                                  Workline Type Activation
                                </h6>
                                <p className="subtitle-p">
                                  Activation toggle indicates to the particular
                                  Workline status (Active/Inactive)
                                </p>
                                <FormikToggle
                                  name="isActive"
                                  color={
                                    values?.isActive ? greenColor : blackColor40
                                  }
                                  checked={values?.isActive}
                                  onChange={(e) => {
                                    setFieldValue("isActive", e.target.checked);
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="form-modal-footer">
                    <button
                      type="button"
                      className="btn btn-cancel"
                      sx={{
                        marginRight: "10px",
                      }}
                      onClick={() => {
                        onHide();
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
