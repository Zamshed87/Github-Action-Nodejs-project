import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import FormikCheckBox from "../../../../common/FormikCheckbox";
import FormikInput from "./../../../../common/FormikInput";
import FormikToggle from "./../../../../common/FormikToggle";
import Loading from "./../../../../common/loading/Loading";
import { blackColor40, gray900, greenColor } from "./../../../../utility/customColor";
import { todayDate } from "./../../../../utility/todayDate";
import { saveSeparationType, getSeparationTypeById, getSeparationType } from "./../helper";

const initData = {
  separationType: "",
  isEmployeeView: false,
  isActive: true,
};
const validationSchema = Yup.object().shape({
  separationType: Yup.string().required("Separation Type is required"),
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

  const [modifySingleData, setModifySingleData] = useState("");

  const { employeeId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    if (singleData) {
      const newRowData = {
        separationType: singleData?.strSeparationType,
        isEmployeeView: singleData?.isEmployeeView,
        isActive: singleData?.isActive,
      };
      setModifySingleData(newRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  useEffect(() => {
    if (id) {
      getSeparationTypeById(setSingleData, id, setLoading);
    }
  }, [id, setSingleData]);

  const saveHandler = (values, cb) => {
    let payload = {
      strSeparationType: values?.separationType,
      isEmployeeView: values?.isEmployeeView,
      isActive: values?.isActive,
      intAccountId: orgId,
      intCreatedBy: employeeId,
      dteCreatedAt: todayDate(),
    };

    const callback = () => {
      cb();
      onHide();
      getSeparationType(orgId, setRowDto, setAllData, setLoading);
    };

    if (id) {
      saveSeparationType(
        { ...payload, intSeparationTypeId: id },
        setLoading,
        callback
      );
    } else {
      saveSeparationType(
        { ...payload, intSeparationTypeId: 0 },
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
                          <div className="col-12">
                            <label>Separation Type</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.separationType}
                              name="separationType"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("separationType", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <FormikCheckBox
                              height="15px"
                              styleObj={{
                                color: gray900,
                                checkedColor: greenColor,
                                padding: "0px 0px 0px 5px",
                              }}
                              label="Is Employee View?"
                              name="isEmployeeView"
                              checked={values?.isEmployeeView}
                              onChange={(e) => {
                                setFieldValue(
                                  "isEmployeeView",
                                  e.target.checked
                                );
                              }}
                            />
                          </div>
                          {id && (
                            <div className="col-12">
                              <div className="input-main position-group-select mt-2">
                                <h6 className="title-item-name">
                                  Separation Type Activation
                                </h6>
                                <p className="subtitle-p">
                                  Activation toggle indicates to the particular
                                  Separation Type status (Active/Inactive)
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
