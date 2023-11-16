import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  PeopleDeskSaasDDL,
  PeopleDeskSaasDDLWithFilter,
} from "../../../../common/api/index";
import DefaultInput from "../../../../common/DefaultInput";
import FormikSelect from "../../../../common/FormikSelect";
import FormikToggle from "../../../../common/FormikToggle";
import Loading from "../../../../common/loading/Loading";
import {
  blackColor80,
  gray600,
  greenColor,
  success500,
} from "../../../../utility/customColor";
import { customStyles } from "../../../../utility/newSelectCustomStyle";
import { todayDate } from "../../../../utility/todayDate";
import { createDesignation, getAllDesignation } from "../helper";

const initData = {
  designation: "",
  code: "",
  businessUnit: "",
  userRole: "",
  isActive: true,
  isDeleted: false,
  payscaleGrade: "",
};

const validationSchema = Yup.object().shape({
  designation: Yup.string().required("Designation is required"),
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
  const [userRoleDDL, setUserRoleDDL] = useState([]);
  const [payscaleGradeDDL, setPayscaleGradeDDL] = useState([]);

  const [modifySingleData, setModifySingleData] = useState("");

  const { employeeId, orgId, buId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    // Business Unit DDL
    PeopleDeskSaasDDL(
      "BusinessUnit",
      wgId,
      buId,
      setBusinessUnitDDL,
      "intBusinessUnitId",
      "strBusinessUnit",
      employeeId
    );
  }, [wgId, buId, employeeId]);

  useEffect(() => {
    PeopleDeskSaasDDLWithFilter(
      "UserRoleDDL",
      wgId,
      buId,
      setUserRoleDDL,
      "value",
      "label",
      0,
      true,
      "isDefault",
      true
    );
    PeopleDeskSaasDDL(
      "PayscaleGrade",
      wgId,
      "",
      setPayscaleGradeDDL,
      "PayscaleGradeId",
      "PayscaleGradeName",
      0
    );
  }, [wgId, buId]);

  useEffect(() => {
    if (singleData?.intDesignationId) {
      const newRowData = {
        designation: singleData?.strDesignation,
        code: singleData?.strDesignationCode,
        businessUnit: singleData?.businessUnitValuLabelVMList.map((itm) => {
          return {
            value: itm?.value,
            label: itm?.label,
          };
        }),
        userRole: singleData?.roleValuLabelVMList.map((itm) => {
          return {
            value: itm?.value,
            label: itm?.label,
          };
        }),
        isActive: singleData?.isActive || false,
        payscaleGrade: {
          value: singleData?.intPayscaleGradeId,
          label: singleData?.strPayscaleGradeName,
        },
      };
      setModifySingleData(newRowData);
    }
  }, [singleData]);

  const { setFieldValue, values, errors, touched, handleSubmit, resetForm } =
    useFormik({
      enableReinitialize: true,
      validationSchema: validationSchema,
      initialValues: singleData?.intDesignationId ? modifySingleData : initData,
      onSubmit: (values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          if (singleData?.intDesignationId) {
            resetForm(modifySingleData);
          } else {
            resetForm(initData);
          }
          setSingleData("");
        });
      },
    });

  const saveHandler = (values, cb) => {
    if (values?.businessUnit?.length <= 0) {
      return toast.warn("Busisness Unit is required!!!");
    }
    // if (values?.userRole?.length <= 0) {
    //   return toast.warn("User role is required!!!");
    // }

    let userRoleListId = [];
    let busUnitListId = values?.businessUnit?.map((itm) => itm?.value);

    if (values?.userRole?.length > 0) {
      userRoleListId = values?.userRole?.map((itm) => itm?.value);
    }

    // if (busUnitListId[0] !== 0 && busUnitListId?.length > 1) {
    //   return toast.warn("Please remove all busisness unit type !!!");
    // }

    let payload = {
      strDesignation: values?.designation,
      strDesignationCode: values?.code,
      intPositionId: 0,
      isActive: values?.isActive,
      isDeleted: values?.isDeleted,
      intBusinessUnitIdList: busUnitListId,
      intUserRoleIdList: userRoleListId,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      dteUpdatedAt: todayDate(),
      intPayscaleGradeId: values?.payscaleGrade?.value,
      intWorkplaceId: wId,
    };

    const callback = () => {
      cb();
      onHide();

      // For landing page data
      getAllDesignation(orgId, buId, setRowDto, setAllData,'', wId);
    };

    if (singleData?.intDesignationId) {
      createDesignation(
        {
          ...payload,
          intDesignationId: singleData?.intDesignationId,
          intCreatedBy: 0,
          intUpdatedBy: employeeId,
        },
        setLoading,
        callback
      );
    } else {
      createDesignation(
        {
          ...payload,
          intDesignationId: 0,
          intCreatedBy: employeeId,
          intUpdatedBy: 0,
        },
        setLoading,
        callback
      );
    }
  };

  return (
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
          <form onSubmit={handleSubmit}>
            {isVisibleHeading && (
              <Modal.Header className="bg-custom">
                <div className="d-flex w-100 justify-content-between align-items-center">
                  <Modal.Title className="text-center">{title}</Modal.Title>
                  <div>
                    <IconButton
                      onClick={() => {
                        if (singleData?.DesignationName) {
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
                <div className="modalBody pt-1 px-0">
                  <div className="row mx-0">
                    <div className="col-6">
                      <label>Designation </label>
                      <DefaultInput
                        classes="input-sm"
                        value={values?.designation}
                        name="designation"
                        type="text"
                        className="form-control"
                        placeholder=""
                        onChange={(e) => {
                          setFieldValue("designation", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>Payscale Grade</label>
                      <FormikSelect
                        name="payscaleGrade"
                        options={payscaleGradeDDL || []}
                        value={values?.payscaleGrade}
                        onChange={(valueOption) => {
                          setFieldValue("payscaleGrade", valueOption);
                        }}
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        placeholder=" "
                        isDisabled={false}
                        menuPosition="fixed"
                      />
                    </div>
                    <div className="col-6">
                      <label>Code</label>
                      <DefaultInput
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
                      <label>Business Unit</label>
                      <FormikSelect
                        placeholder=" "
                        classes="input-sm"
                        styles={{
                          ...customStyles,
                          control: (provided, state) => ({
                            ...provided,
                            minHeight: "auto",
                            height:
                              values?.businessUnit?.length > 1
                                ? "auto"
                                : "30px",
                            borderRadius: "4px",
                            boxShadow: `${success500}!important`,
                            ":hover": {
                              borderColor: `${gray600}!important`,
                            },
                            ":focus": {
                              borderColor: `${gray600}!important`,
                            },
                          }),
                          valueContainer: (provided, state) => ({
                            ...provided,
                            height:
                              values?.businessUnit?.length > 1
                                ? "auto"
                                : "30px",
                            padding: "0 6px",
                          }),
                          multiValue: (styles) => {
                            return {
                              ...styles,
                              position: "relative",
                              top: "-1px",
                            };
                          },
                          multiValueLabel: (styles) => ({
                            ...styles,
                            padding: "0",
                            position: "relative",
                            top: "-1px",
                          }),
                        }}
                        options={[...businessUnitDDL] || []}
                        value={values?.businessUnit}
                        name="businessUnit"
                        onChange={(valueOption) => {
                          let getAllBusUnit = valueOption.filter(
                            (itm) => itm?.label === "ALL"
                          );
                          if (getAllBusUnit?.length > 0) {
                            setFieldValue("businessUnit", [
                              { value: 0, label: "ALL" },
                            ]);
                          } else {
                            setFieldValue("businessUnit", valueOption);
                          }
                        }}
                        menuPosition="fixed"
                        errors={errors}
                        touched={touched}
                        isMulti
                      />
                    </div>
                    <div className="col-6">
                      <label>User Role</label>
                      <FormikSelect
                        placeholder=" "
                        classes="input-sm"
                        styles={{
                          ...customStyles,
                          control: (provided, state) => ({
                            ...provided,
                            minHeight: "auto",
                            height:
                              values?.userRole?.length > 1 ? "auto" : "30px",
                            borderRadius: "4px",
                            boxShadow: `${success500}!important`,
                            ":hover": {
                              borderColor: `${gray600}!important`,
                            },
                            ":focus": {
                              borderColor: `${gray600}!important`,
                            },
                          }),
                          valueContainer: (provided, state) => ({
                            ...provided,
                            height:
                              values?.userRole?.length > 1 ? "auto" : "30px",
                            padding: "0 6px",
                          }),
                          multiValue: (styles) => {
                            return {
                              ...styles,
                              position: "relative",
                              top: "-1px",
                            };
                          },
                          multiValueLabel: (styles) => ({
                            ...styles,
                            padding: "0",
                            position: "relative",
                            top: "-1px",
                          }),
                        }}
                        options={[...userRoleDDL] || []}
                        value={values?.userRole}
                        name="userRole"
                        onChange={(valueOption) => {
                          let allUserRole = valueOption.filter(
                            (itm) => itm?.label === "All"
                          );
                          if (allUserRole?.length > 0) {
                            setFieldValue("userRole", [
                              { value: 0, label: "All" },
                            ]);
                          } else {
                            setFieldValue("userRole", valueOption);
                          }
                        }}
                        // isOptionDisabled={(option) => option.value === 2}
                        menuPosition="fixed"
                        errors={errors}
                        touched={touched}
                        isMulti
                      />
                    </div>
                    {singleData?.DesignationName && (
                      <div className="col-6">
                        <div className="input-main position-group-select mt-2">
                          <h6
                            className="title-item-name"
                            style={{ fontSize: "14px" }}
                          >
                            Designation Activation
                          </h6>
                          <p className="subtitle-p">
                            Activation toggle indicates to the particular
                            designation status (Active/Inactive)
                          </p>
                        </div>
                        <FormikToggle
                          name="isActive"
                          color={values?.isActive ? greenColor : blackColor80}
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
                className="btn btn-cancel"
                type="button"
                sx={{
                  marginRight: "15px",
                }}
                onClick={() => {
                  if (singleData?.DesignationName) {
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
              >
                Save
              </button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    </>
  );
}
