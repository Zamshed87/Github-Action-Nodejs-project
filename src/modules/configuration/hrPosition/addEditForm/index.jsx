import { Close } from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { todayDate } from "../../../../utility/todayDate";
import FormikInput from "./../../../../common/FormikInput";
import FormikToggle from "./../../../../common/FormikToggle";
import Loading from "./../../../../common/loading/Loading";
import { blackColor80, greenColor } from "./../../../../utility/customColor";
import { createPosition, getPositionById } from "./../helper";

const initData = {
  hrPosition: "",
  code: "",
  positionGroup: "",
  newPositionGroup: "",
  newPositionGroupCode: "",
  isActive: true,
};
const validationSchema = Yup.object().shape({
  hrPosition: Yup.string().required("HR Position is required"),
  code: Yup.string().required("Code is required"),
  // positionGroup: Yup.object()
  //   .shape({
  //     label: Yup.string().required("Position Group is required"),
  //     value: Yup.string().required("Position Group is required"),
  //   })
  //   .typeError("Position Group is required"),
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
  setEditId,
  singleData,
  setSingleData,
  setRowDto,
  setAllData,
  getData,
}) {
  const [loading, setLoading] = useState(false);

  // const [positionGroupDDL, setPositionGroupDDL] = useState([]);
  const [modifySingleData, setModifySingleData] = useState("");

  const [, setAddNewType] = useState(false);

  const { employeeId, orgId, buId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    if (singleData?.intPositionId) {
      const newRowData = {
        hrPosition: singleData?.strPosition,
        code: singleData?.strPositionCode,
        // positionGroup: {
        //   value: singleData?.Result[0]?.PositionGroupId,
        //   label: singleData?.Result[0]?.PositionGroupName,
        // },
        isActive: singleData?.isActive,
      };
      setModifySingleData(newRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  useEffect(() => {
    if (id) {
      getPositionById({ positionId: id, setter: setSingleData, setLoading });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // useEffect(() => {
  //   getPeopleDeskAllDDL(
  //     "PositionGroup",
  //     orgId,
  //     buId,
  //     setPositionGroupDDL,
  //     "PositionGroupId",
  //     "PositionGroupName"
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [orgId, buId]);

  // const addPositionGroup = (values, setFieldValue) => {
  //   const payload = {
  //     actionTypeId: 1,
  //     positionGroupId: 0,
  //     positionGroupCode: values?.newPositionGroupCode,
  //     positionGroupName: values?.newPositionGroup,
  //     accountId: orgId,
  //     isActive: true,
  //     insertUserId: employeeId,
  //   };
  //   const callback = () => {
  //     getPeopleDeskAllDDL(
  //       "PositionGroup",
  //       orgId,
  //       buId,
  //       setPositionGroupDDL,
  //       "PositionGroupId",
  //       "PositionGroupName"
  //     );
  //     setAddNewType(false);
  //     setFieldValue("newPositionGroup", "");
  //     setFieldValue("newPositionGroupCode", "");
  //   };
  //   createPositionGroup(payload, setLoading, callback);
  // };

  const saveHandler = (values, cb) => {
    let payload = {
      strPosition: values?.hrPosition,
      strPositionCode: values?.code,
      intBusinessUnitId: buId,
      isActive: values?.isActive,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: id ? 0 : employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: id ? employeeId : 0,
      intWorkplaceId: wId,
    };
    const callback = () => {
      cb();
      onHide();
      getData();
    };
    if (id) {
      createPosition({ ...payload, intPositionId: id }, setLoading, callback);
    } else {
      createPosition({ ...payload, intPositionId: 0 }, setLoading, callback);
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
                              setAddNewType(false);
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
                        <div className="row">
                          <div className="col-6">
                            <label>HR Position</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.hrPosition}
                              name="hrPosition"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("hrPosition", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-6">
                            <label>Code</label>
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
                          {/* <div className="col-6">
                            <label>Position Group *</label>
                            <FormikSelect
                              name="positionGroup"
                              options={positionGroupDDL || []}
                              value={values?.positionGroup}
                              onChange={(valueOption) => {
                                setFieldValue("positionGroup", valueOption);
                              }}
                              placeholder=" "
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                            />
                          </div> */}
                          {/* {addNewType ? (
                            <>
                              
                            <div className="col-12 px-0 row m-0">
                              <div className="col-6">
                                <label>New Position Group</label>
                                <FormikInput
                                  classes="input-sm"
                                  value={values?.newPositionGroup}
                                  name="newPositionGroup"
                                  type="text"
                                  className="form-control"
                                  placeholder=""
                                  onChange={(e) => {
                                    setFieldValue(
                                      "newPositionGroup",
                                      e.target.value
                                    );
                                  }}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                              <div className="col-6">
                                <label>New Position Group Code</label>
                                <FormikInput
                                  classes="input-sm"
                                  value={values?.newPositionGroupCode}
                                  name="newPositionGroupCode"
                                  type="text"
                                  className="form-control"
                                  placeholder=""
                                  onChange={(e) => {
                                    setFieldValue(
                                      "newPositionGroupCode",
                                      e.target.value
                                    );
                                  }}
                                  errors={errors}
                                  touched={touched}
                                />
                              </div>
                              <div className="offset-6 col-6 ">
                                <div className="d-flex justify-content-end align-items-center mt-3">
                                  <Button
                                    type="button"
                                    sx={{
                                      fontWeight: "500",
                                      fontSize: "14px",
                                      lineHeight: "19px",
                                      letterSpacing: "0.15px",
                                      color: "rgba(0, 0, 0, 0.7)",
                                      marginRight: "10px",
                                    }}
                                    onClick={() => {
                                      setAddNewType(false);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="button"
                                    sx={{
                                      fontWeight: "500",
                                      fontSize: "14px",
                                      lineHeight: "19px",
                                      letterSpacing: "0.15px",
                                      color: "#34A853",
                                      marginRight: "10px",
                                    }}
                                    onClick={() => {
                                      addPositionGroup(values, setFieldValue);
                                    }}
                                    disabled={
                                      !values?.newPositionGroup ||
                                      !values?.newPositionGroupCode
                                    }
                                  >
                                    Add
                                  </Button>
                                </div>
                              </div>
                             </div>
                            </>
                          ) : (
                            <>
                              <div className="col-6">
                              <button
                                  className="btn btn-green btn-green-less row align-items-center  mx-0 mt-4"
                                  type="button"
                                  onClick={() => setAddNewType(true)}
                                >
                                  <AddSharp
                                    sx={{
                                      fontSize: "16px",
                                      marginRight: "8px",
                                    }}
                                  />
                                  ADD
                                </button>
                              </div>
                            </>
                          )} */}
                          {id && (
                            <div className="col-6 d-none">
                              <div className="input-main position-group-select mt-2">
                                <h6
                                  className="title-item-name"
                                  style={{ fontSize: "14px" }}
                                >
                                  HR Position Activation
                                </h6>
                                <p className="subtitle-p">
                                  Activation toggle indicates to the particular
                                  HR Position status (Active/Inactive)
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
                      className="btn btn-green btn-green-disable"
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
