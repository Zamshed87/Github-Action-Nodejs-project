import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { todayDate } from "../../../../utility/todayDate";
import { getAllGlobalEmploymentType } from "./../../../../common/api/index";
import FormikInput from "./../../../../common/FormikInput";
import FormikToggle from "./../../../../common/FormikToggle";
import Loading from "./../../../../common/loading/Loading";
import { blackColor40, greenColor } from "./../../../../utility/customColor";
import { createEmploymentType, getGlobalEmploymentTypeById } from "./../helper";

const initData = {
  employmentType: "",
  isActive: true,
};

const validationSchema = Yup.object().shape({
  employmentType: Yup.string().required("Employment type is required"),
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
        employmentType: singleData?.strEmploymentType,
        isActive: singleData?.isActive,
      };
      setModifySingleData(newRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  useEffect(() => {
    if (id) {
      getGlobalEmploymentTypeById(setSingleData, id, setLoading);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveHandler = (values, cb) => {
    let payload = {
      strEmploymentType: values?.employmentType,
      isActive: values?.isActive,
      intParentId: singleData?.intParentId || 0,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
    };

    const callback = () => {
      cb();
      onHide();
      getAllGlobalEmploymentType(setRowDto, setAllData, setLoading, orgId);
    };

    const options = { ...payload, intEmploymentTypeId: id || 0 };
    createEmploymentType(options, setLoading, callback);
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
                            <label>Employment Type</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.employmentType}
                              name="employmentType"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("employmentType", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          {id && (
                            <div className="col-12">
                              <div className="input-main position-group-select mt-2">
                                <h6 className="title-item-name">
                                  Employment Type Activation
                                </h6>
                                <p className="subtitle-p">
                                  Activation toggle indicates to the particular
                                  Employment Type status (Active/Inactive)
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
