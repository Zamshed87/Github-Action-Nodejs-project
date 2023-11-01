import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import DefaultInput from "../../../../common/DefaultInput";
import FormikToggle from "../../../../common/FormikToggle";
import { blackColor80, greenColor } from "../../../../utility/customColor";
import { getBankBranchDDL } from "../../../employeeProfile/aboutMe/helper";
import { createEditBankOrgDetails } from "../helper";
import {
  getPeopleDeskAllDDL,
  PeopleDeskSaasDDL,
} from "./../../../../common/api/index";
import FormikSelect from "./../../../../common/FormikSelect";
import Loading from "./../../../../common/loading/Loading";
import { customStyles } from "./../../../../utility/newSelectCustomStyle";

const initialValues = {
  businessUnit: "",
  isActive: true,
  bankName: "",
  branchName: "",
  routingNo: "",
  districtName: "",
  swiftCode: "",
  accName: "",
  accNo: "",
};

const validationSchema = Yup.object().shape({
  businessUnit: Yup.object().shape({
    value: Yup.string().required("Business unit is required"),
    label: Yup.string().required("Business unit is required"),
  }),
  bankName: Yup.object().shape({
    value: Yup.string().required("Bank name is required"),
    label: Yup.string().required("Bank name is required"),
  }),
  branchName: Yup.object().shape({
    value: Yup.string().required("Branch name is required"),
    label: Yup.string().required("Branch name is required"),
  }),
  routingNo: Yup.string().required("Routing no is required"),
  districtName: Yup.string().required("District name is required"),
  accName: Yup.string().required("Account name is required"),
  accNo: Yup.string().required("Account no is required"),
});

export default function OrgBankDetailsAddEditFormComponent({
  show,
  onHide,
  size,
  backdrop,
  classes,
  isVisibleHeading = true,
  fullscreen,
  title,
  singleData,
  setSingleData,
  getLandingData,
}) {
  const [loading, setLoading] = useState(false);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [bankDDL, setBankDDL] = useState([]);
  const [bankBranchDDL, setBankBranchDDL] = useState([]);
  const [modifySingleData, setModifySingleData] = useState({});
  const { employeeId, orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Bank&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
      "BankID",
      "BankName",
      setBankDDL
    );
    PeopleDeskSaasDDL(
      "BusinessUnit",
      wgId,
      buId,
      setBusinessUnitDDL,
      "intBusinessUnitId",
      "strBusinessUnit",
      employeeId
    );
  }, [buId, employeeId, wgId]);

  useEffect(() => {
    if (singleData?.intAccountBankDetailsId) {
      const newRowData = {
        businessUnit: {
          value: singleData?.intBusinessUnitId,
          label: singleData?.strBusinessUnitName,
        },
        isActive: singleData?.isActive || false,
        bankName: {
          value: singleData?.intBankWalletId,
          label: singleData?.strBankWalletName,
        },
        branchName: {
          value: singleData?.intBankBranchId,
          label: singleData?.strBranchName,
        },
        routingNo: singleData?.strRoutingNo,
        districtName: singleData?.strDistrict,
        swiftCode: singleData?.strSwiftCode,
        accName: singleData?.strAccountName,
        accNo: singleData?.strAccountNo,
      };
      setModifySingleData(newRowData);
    }
  }, [singleData]);

  const saveHandler = () => {
    const payload = {
      intAccountBankDetailsId: !singleData?.intAccountBankDetailsId
        ? 0
        : singleData?.intAccountBankDetailsId,
      intAccountId: orgId,
      intBusinessUnitId: values?.businessUnit?.value,
      strBusinessUnitName: values?.businessUnit?.label,
      intBankOrWalletType: 1,
      intBankWalletId: values?.bankName?.value,
      strBankWalletName: values?.bankName?.label,
      strDistrict: values?.districtName,
      intBankBranchId: values?.branchName?.value,
      strBranchName: values?.branchName?.label,
      strRoutingNo: values?.routingNo,
      strSwiftCode: values?.swiftCode,
      strAccountName: values?.accName,
      strAccountNo: values?.accNo,
      isActive: values?.isActive,
      intCreatedBy: employeeId,
      intUpdatedBy: employeeId,
    };
    const callback = () => {
      if (singleData?.intAccountBankDetailsId) {
        resetForm(modifySingleData);
        onHide();
      } else {
        resetForm(initialValues);
        onHide();
      }
      getLandingData();
    };
    createEditBankOrgDetails(payload, setLoading, callback);
  };

  // useFormik hooks
  const { setFieldValue, values, errors, touched, handleSubmit, resetForm } =
    useFormik({
      enableReinitialize: true,
      validationSchema,
      initialValues: singleData?.intAccountBankDetailsId
        ? modifySingleData
        : initialValues,
      onSubmit: () => saveHandler(),
    });

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
                        if (singleData?.intAccountBankDetailsId) {
                          resetForm(modifySingleData);
                        } else {
                          resetForm(initialValues);
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
                      <label>Bank Name</label>
                      <FormikSelect
                        name="bankName"
                        options={bankDDL}
                        value={values?.bankName}
                        menuPosition="fixed"
                        onChange={(valueOption) => {
                          setFieldValue("routingNo", "");
                          setFieldValue("branchName", "");
                          setFieldValue("bankName", valueOption);
                          getBankBranchDDL(
                            valueOption?.value,
                            orgId,
                            0,
                            setBankBranchDDL
                          );
                        }}
                        placeholder=" "
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={false}
                      />
                    </div>
                    <div className="col-6">
                      <label>Bank Branch</label>
                      <FormikSelect
                        name="branchName"
                        options={bankBranchDDL}
                        value={values?.branchName}
                        menuPosition="fixed"
                        onChange={(valueOption) => {
                          setFieldValue("routingNo", valueOption?.name);
                          setFieldValue("branchName", valueOption);
                        }}
                        placeholder=" "
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.bankName}
                      />
                    </div>
                    <div className="col-6">
                      <label>Routing No</label>
                      <DefaultInput
                        value={values?.routingNo}
                        disabled={true}
                        name="routingNo"
                        type="text"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("routingNo", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                        placeholder=" "
                        classes="input-sm"
                      />
                    </div>
                    <div className="col-6">
                      <label>Swift Code</label>
                      <DefaultInput
                        value={values?.swiftCode}
                        onChange={(e) => {
                          setFieldValue("swiftCode", e.target.value);
                        }}
                        name="swiftCode"
                        type="text"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                        placeholder=" "
                        classes="input-sm"
                      />
                    </div>
                    <div className="col-6">
                      <label>Account Name</label>
                      <DefaultInput
                        value={values?.accName}
                        onChange={(e) => {
                          setFieldValue("accName", e.target.value);
                        }}
                        name="accName"
                        type="text"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                        placeholder=" "
                        classes="input-sm"
                      />
                    </div>
                    <div className="col-6">
                      <label>Account No</label>
                      <DefaultInput
                        value={values?.accNo}
                        onChange={(e) => {
                          setFieldValue("accNo", e.target.value);
                        }}
                        name="accNo"
                        type="number"
                        className="form-control"
                        errors={errors}
                        touched={touched}
                        placeholder=" "
                        classes="input-sm"
                      />
                    </div>
                    <div className="col-6">
                      <label>District Name</label>
                      <DefaultInput
                        value={values?.districtName}
                        disabled={false}
                        name="districtName"
                        type="text"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("districtName", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                        placeholder=" "
                        classes="input-sm"
                      />
                    </div>

                    <div className="col-6">
                      <label>Business Unit</label>
                      <FormikSelect
                        name="businessUnit"
                        options={
                          [{ value: 0, label: "All" }, ...businessUnitDDL] || []
                        }
                        value={values?.businessUnit}
                        onChange={(valueOption) => {
                          setFieldValue("businessUnit", valueOption);
                        }}
                        placeholder=" "
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        menuPosition="fixed"
                      />
                    </div>
                    {singleData?.intAccountBankDetailsId && (
                      <div className="col-6">
                        <div className="input-main position-group-select mt-2">
                          <h6
                            className="title-item-name"
                            style={{ fontSize: "14px" }}
                          >
                            Designation Activation
                          </h6>
                          <p className="subtitle-p">
                            Activation toggle indicates to the particular bank
                            account status (Active/Inactive)
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
                  if (singleData?.intAccountBankDetailsId) {
                    resetForm(modifySingleData);
                  } else {
                    resetForm(initialValues);
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
