import { Close } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { todayDate } from "../../../../utility/todayDate";
import { getPeopleDeskAllDDL } from "./../../../../common/api/index";
import FormikInput from "./../../../../common/FormikInput";
import FormikSelect from "./../../../../common/FormikSelect";
import FormikToggle from "./../../../../common/FormikToggle";
import Loading from "./../../../../common/loading/Loading";
import { blackColor80, greenColor } from "./../../../../utility/customColor";
import { customStyles } from "./../../../../utility/newSelectCustomStyle";
import {
  createWorkplace,
  createWorkplaceGroup,
  getWorkplaceById,
  getWorkplaceLanding,
} from "./../helper";

const initData = {
  workplace: "",
  code: "",
  workplaceGroup: "",
  newWorkplaceGroup: "",
  // newWorkplaceGroupCode: "",
  businessUnit: "",
  isActive: true,
};
const validationSchema = Yup.object().shape({
  workplace: Yup.string().required("Workplace is required"),
  code: Yup.string().required("Code is required"),
  workplaceGroup: Yup.object()
    .shape({
      label: Yup.string().required("Workplace Group is required"),
      value: Yup.string().required("Workplace Group is required"),
    })
    .typeError("Workplace Group is required"),
  businessUnit: Yup.object()
    .shape({
      label: Yup.string().required("Business is required"),
      value: Yup.string().required("Business is required"),
    })
    .typeError("Business is required"),
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
}) {
  const [loading, setLoading] = useState(false);

  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [modifySingleData, setModifySingleData] = useState("");

  const [addNewType, setAddNewType] = useState(false);

  const { orgId, buId, wgId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    if (singleData) {
      const newRowData = {
        workplace: singleData?.strWorkplace,
        code: singleData?.strWorkplaceCode,
        workplaceGroup: {
          value: singleData?.intWorkplaceGroupId,
          label: singleData?.strWorkplaceGroup,
        },
        businessUnit: {
          value: singleData?.intBusinessUnitId,
          label: singleData?.strBusinessUnit,
        },
        isActive: singleData?.isActive,
      };
      setModifySingleData(newRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  useEffect(() => {
    if (id) {
      getWorkplaceById(id, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/SaasMasterData/GetAllWorkplaceGroup?accountId=${orgId}&businessUnitId=${buId}`,
      "intWorkplaceGroupId",
      "strWorkplaceGroup",
      setWorkplaceGroupDDL
    );
    getPeopleDeskAllDDL(
      `/SaasMasterData/GetAllBusinessUnit?accountId=${orgId}`,
      "intBusinessUnitId",
      "strBusinessUnit",
      setBusinessUnitDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addWorkplaceGroup = (values, setFieldValue) => {
    const payload = {
      intWorkplaceGroupId: 0,
      strWorkplaceGroup: values?.newWorkplaceGroup,
      strWorkplaceGroupCode: values?.newWorkplaceGroup,
      // strWorkplaceGroupCode: values?.newWorkplaceGroupCode,
      isActive: true,
      intAccountId: orgId,
    };

    const callback = () => {
      getPeopleDeskAllDDL(
        `/SaasMasterData/GetAllWorkplaceGroup?accountId=${orgId}&businessUnitId=${buId}`,
        "intWorkplaceGroupId",
        "strWorkplaceGroup",
        setWorkplaceGroupDDL
      );
      setAddNewType(false);
      setFieldValue("newPositionGroup", "");
      setFieldValue("newPositionGroupCode", "");
    };
    createWorkplaceGroup(payload, setLoading, callback);
  };

  const saveHandler = (values, cb) => {
    let payload = {
      strWorkplace: values?.workplace,
      strWorkplaceCode: values?.code,
      strAddress: "",
      intDistrictId: 0,
      strDistrict: "",
      intWorkplaceGroupId: values?.workplaceGroup?.value,
      strWorkplaceGroup: values?.workplaceGroup?.label,
      isActive: values?.isActive,
      intBusinessUnitId: values?.businessUnit?.value,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
    };

    const callback = () => {
      cb();
      onHide();
      getWorkplaceLanding(orgId, buId, wgId, setRowDto, setAllData);
      id && getWorkplaceById(id, setSingleData);
    };
    if (id) {
      createWorkplace(
        { ...payload, actionTypeId: id, intWorkplaceId: id },
        setLoading,
        callback
      );
    } else {
      createWorkplace(
        { ...payload, actionTypeId: 0, intWorkplaceId: 0 },
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
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <Modal.Title className="text-center">
                          {title}
                        </Modal.Title>
                        <div>
                          <IconButton
                            onClick={() => {
                              if (id) {
                                resetForm(modifySingleData);
                              } else {
                                resetForm(initData);
                              }
                              onHide();
                              setAddNewType(false);
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
                            <label>Workplace</label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.workplace}
                              name="workplace"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("workplace", e.target.value);
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
                          <div className="col-6">
                            <label>Workplace Group</label>
                            <FormikSelect
                              name="workplaceGroup"
                              options={workplaceGroupDDL || []}
                              value={values?.workplaceGroup}
                              onChange={(valueOption) => {
                                setFieldValue("workplaceGroup", valueOption);
                              }}
                              placeholder=" "
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-6">
                            <label>Business Unit</label>
                            <FormikSelect
                              name="businessUnit"
                              options={businessUnitDDL || []}
                              value={values?.businessUnit}
                              onChange={(valueOption) => {
                                setFieldValue("businessUnit", valueOption);
                              }}
                              placeholder=" "
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          {addNewType ? (
                            <>
                              <div className="col-12 px-0 row m-0">
                                <div className="col-6">
                                  <label>New Workplace Group</label>
                                  <FormikInput
                                    classes="input-sm"
                                    value={values?.newWorkplaceGroup}
                                    name="newWorkplaceGroup"
                                    type="text"
                                    className="form-control"
                                    placeholder=""
                                    onChange={(e) => {
                                      setFieldValue(
                                        "newWorkplaceGroup",
                                        e.target.value
                                      );
                                    }}
                                    errors={errors}
                                    touched={touched}
                                  />
                                </div>
                                {/* <div className="col-6">
                                  <label>New Workplace Group Code</label>
                                  <FormikInput
                                    classes="input-sm"
                                    value={values?.newWorkplaceGroupCode}
                                    name="newWorkplaceGroupCode"
                                    type="text"
                                    className="form-control"
                                    placeholder=""
                                    onChange={(e) => {
                                      setFieldValue(
                                        "newWorkplaceGroupCode",
                                        e.target.value
                                      );
                                    }}
                                    errors={errors}
                                    touched={touched}
                                  />
                                </div> */}
                                <div className="offset-6 col-6">
                                  <div className="d-flex justify-content-end align-items-center mt-3">
                                    <Button
                                      type="button"
                                      className="btn btn-cancel"
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
                                        addWorkplaceGroup(
                                          values,
                                          setFieldValue
                                        );
                                      }}
                                      disabled={
                                        !values?.newWorkplaceGroup /* ||
                                        !values?.newWorkplaceGroupCode */
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
                              <div className="col-6 mt-3">
                                <button
                                  className="btn btn-green btn-green-disable"
                                  style={{ width: "auto" }}
                                  type="button"
                                  onClick={() => setAddNewType(true)}
                                >
                                  Add New Workplace Group
                                </button>
                              </div>
                            </>
                          )}

                          {id && (
                            <div className="col-6">
                              <div className="input-main position-group-select mt-2">
                                <h6
                                  className="title-item-name"
                                  style={{ fontSize: "14px" }}
                                >
                                  Workplace Activation
                                </h6>
                                <p className="subtitle-p">
                                  Activation toggle indicates to the particular
                                  Workplace status (Active/Inactive)
                                </p>
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
                          )}
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="form-modal-footer">
                    <button
                      type="button"
                      className="btn btn-cancel"
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
