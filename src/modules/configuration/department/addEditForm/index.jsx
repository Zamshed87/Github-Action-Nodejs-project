import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
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
import { createDepartment, getAllEmpDepartment } from "./../helper";

const initData = {
  department: "",
  code: "",
  sectionDepartment: "",
  businessUnit: "",
  isActive: true,
};

const validationSchema = Yup.object().shape({
  department: Yup.string().required("Department is required"),
  code: Yup.string().required("Code is required"),
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
  setSingleData,
}) {
  const [loading, setLoading] = useState(false);

  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [sectionDepartmentDDL, setSectionDepartmentDDL] = useState([]);

  const [modifySingleData, setModifySingleData] = useState("");

  const { employeeId, orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=${employeeId}`,
      "intBusinessUnitId",
      "strBusinessUnit",
      setBusinessUnitDDL
    );
    getPeopleDeskAllDDL(
      `/Employee/GetAllEmpDepartment?accountId=${orgId}&businessUnitId=${buId}`,
      "intDepartmentId",
      "strDepartment",
      setSectionDepartmentDDL
    );
  }, [orgId, buId, employeeId, wgId]);

  useEffect(() => {
    if (singleData?.strDepartment) {
      const newRowData = {
        department: singleData?.strDepartment,
        code: singleData?.strDepartmentCode,
        sectionDepartment: {
          value: singleData?.intParentDepId,
          label: singleData?.strParentDepName,
        },
        businessUnit: {
          value: singleData?.intBusinessUnitId,
          label: singleData?.strBusinessUnit,
        },
        isActive: singleData?.isActive || false,
      };
      setModifySingleData(newRowData);
    }
  }, [singleData]);

  const saveHandler = (values, cb) => {
    let payload = {
      strDepartment: values?.department,
      strDepartmentCode: values?.code,
      isActive: values?.isActive,
      isDeleted: true,
      intParentDepId: values?.sectionDepartment?.value,
      strParentDepName: values?.sectionDepartment?.label,
      intBusinessUnitId: values?.businessUnit?.value || 0,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
    };

    const callback = () => {
      cb();
      onHide();

      // For landing page data
      getAllEmpDepartment(orgId, buId, setRowDto, setAllData, setLoading);
    };

    if (singleData?.strDepartment) {
      createDepartment(
        {
          ...payload,
          actionTypeId: 2,
          intDepartmentId: singleData?.intDepartmentId,
        },
        setLoading,
        callback
      );
    } else {
      createDepartment(
        { ...payload, actionTypeId: 1, intDepartmentId: 0 },
        setLoading,
        callback
      );
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          singleData?.strDepartment
            ? modifySingleData
            : {
              ...initData,
              businessUnit: { value: 0, label: "All" },
            }
        }
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            if (singleData?.strDepartment) {
              resetForm(modifySingleData);
            } else {
              resetForm(initData);
            }
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
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <Modal.Title className="text-center">
                          {title}
                        </Modal.Title>
                        <div>
                          <IconButton
                            onClick={() => {
                              if (singleData?.strDepartment) {
                                resetForm(modifySingleData);
                              } else {
                                resetForm(initData);
                              }
                              onHide();
                              setSingleData("");
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
                      <div className="modalBody" style={{ padding: "0px 12px" }}>
                        <div className="row mx-0">
                          <div className="col-12 px-0">
                            <label>Department Name </label>
                            <FormikInput
                              classes="input-sm"
                              value={values?.department}
                              name="department"
                              type="text"
                              className="form-control"
                              placeholder=""
                              onChange={(e) => {
                                setFieldValue("department", e.target.value);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-12 px-0">
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
                          <div className="col-12 px-0">
                            <label>Department Section</label>
                            <FormikSelect
                              name="sectionDepartment"
                              options={sectionDepartmentDDL || []
                              }
                              value={values?.sectionDepartment}
                              onChange={(valueOption) => {
                                setFieldValue("sectionDepartment", valueOption);
                              }}
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                              menuPosition="fixed"
                            />
                          </div>
                          <div className="col-12 px-0">
                            <label>Business Unit</label>
                            <FormikSelect
                              name="businessUnit"
                              options={
                                [
                                  {
                                    value: 0,
                                    label: "All",
                                  },
                                  ...businessUnitDDL,
                                ] || []
                              }
                              value={values?.businessUnit}
                              onChange={(valueOption) => {
                                setFieldValue("businessUnit", valueOption);
                              }}
                              styles={customStyles}
                              errors={errors}
                              touched={touched}
                              menuPosition="fixed"
                            />
                          </div>
                          {singleData?.strDepartment && (
                            <>
                              <div className="col-12 px-0">
                                <div className="input-main position-group-select mt-2">
                                  <label
                                    className="lebel-bold"
                                    style={{ fontSize: "14px" }}
                                  >
                                    Department Activation
                                  </label>
                                  <p>
                                    Activation toggle indicates to the
                                    particular department status
                                    (Active/Inactive)
                                  </p>
                                </div>
                              </div>
                              <div className="col-12 px-0">
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
                            </>
                          )}
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
                      onClick={() => {
                        if (singleData?.strDepartment) {
                          resetForm(modifySingleData);
                        } else {
                          resetForm(initData);
                        }
                        onHide();
                        setSingleData("");
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
