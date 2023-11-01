/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import FormikInput from "../../../../../common/FormikInput";
import Loading from "../../../../../common/loading/Loading";
import FormikSelect from "../../../../../common/FormikSelect";
import { customStyles } from "../../../../../utility/selectCustomStyle";
import { shallowEqual, useSelector } from "react-redux";
import { getPeopleDeskAllDDL } from "../../../../../common/api";
import { AddOutlined } from "@mui/icons-material";
import ViewModal from "../../../../../common/ViewModal";
import AddBankBranch from "./AddBankBranch";
import { getBankBranchDDL } from "../../helper";

const BankForm = ({
  setBankData,
  setConfirmationMOdal,
  // setHasBankData,
  rowDto,
  setRowDto,
  empBasic,
  singleData,
  getEmpData,
  isEditBtn,
}) => {
  const initData = {
    isDefault: false,
    bankName: "",
    branchName: "",
    routingNo: "",
    // districtName: "",
    swiftCode: "",
    accName: "",
    accNo: "",
  };
  const saveHandler = (values, cb) => { };

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [bankDDL, setBankDDL] = useState([]);
  const [bankBranchDDL, setBankBranchDDL] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [show, setShow] = useState(false);

  const { orgId, buId, employeeId, wgId } = useSelector((state) => state?.auth?.profileData, shallowEqual);

  useEffect(() => {
    getPeopleDeskAllDDL(`/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Bank&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`, "BankID", "BankName", setBankDDL);
  }, []);

  useEffect(() => {
    if (singleData?.bankName?.value) {
      getBankBranchDDL(singleData?.bankName?.value, orgId, 0, setBankBranchDDL);
    }
  }, [singleData]);



  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={singleData?.bankName?.label ? singleData : initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, resetForm, values, errors, touched, setFieldValue, isValid }) => (
          <>
            <Form>
              {loading && <Loading />}
              <div className="bank-about-me-form">
                {/* Bank Name */}
                <div className="row">
                  {/* <div className="col-md-12 d-flex">
                    <label style={{ width: "110px" }}></label>
                    <FormikCheckBox
                      height="15px"
                      styleObj={{
                        color: gray900,
                        checkedColor: greenColor,
                        padding: "0px 0px 0px 5px",
                      }}
                      label="Is default?"
                      name="isDefault"
                      checked={values?.isDefault}
                      onChange={(e) => {
                        setFieldValue(
                          "isDefault",
                          e.target.checked
                        );
                      }}
                    />
                  </div> */}
                  <div className="col-md-12 d-flex">
                    <label style={{ width: "110px" }}> Bank Name</label>
                    <FormikSelect
                      name="bankName"
                      options={bankDDL}
                      value={values?.bankName}
                      menuPosition="fixed"
                      onChange={(valueOption) => {
                        setFieldValue("routingNo", "");
                        setFieldValue("branchName", "");
                        setFieldValue("bankName", valueOption);
                        setSelectedBank(valueOption);
                        getBankBranchDDL(valueOption?.value, orgId, 0, setBankBranchDDL);
                      }}
                      placeholder=" "
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isDisabled={false}
                    />
                  </div>
                </div>

                {/* Branch Name */}
                <div className="row">
                  <div className="col-md-12 d-flex">
                    <label style={{ width: "110px" }}>Branch Name</label>
                    <div
                      className="policy-category-ddl-wrapper"
                      style={{ marginBottom: "5px" }}
                    >
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
                      <div className="category-add">
                        {isEditBtn && (
                          <button
                            type="button"
                            className="btn add-ddl-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShow(true);
                            }}
                            disabled={!values?.bankName}
                          >
                            <AddOutlined sx={{ fontSize: "16px" }} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* routing no */}
                <div className="row">
                  <div className="col-md-12 d-flex">
                    <label style={{ width: "110px" }}>Routing No</label>
                    <FormikInput
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
                </div>

                {/* Swift Code */}
                <div className="row">
                  <div className="col-md-12 d-flex">
                    <label style={{ width: "110px" }}>Swift Code</label>
                    <FormikInput
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
                </div>

                {/* Account Name */}
                <div className="row">
                  <div className="d-flex col-12">
                    <label style={{ width: "110px" }}>Account Name</label>
                    <FormikInput
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
                </div>

                {/* Account No */}
                <div className="row">
                  <div className="col-md-12 d-flex">
                    <label style={{ width: "110px" }}>Account No</label>
                    <FormikInput
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
                </div>

                {/* <FormikInput
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
                    placeholder="District Name"
                    classes="input-sm"
                  /> */}
                <div className="about-me-bank-details-footer">
                  <button
                    className="btn btn-cancel"
                    style={{ marginRight: "16px" }}
                    type="button"
                    onClick={() => {
                      if (empBasic?.strAccountName || empBasic?.strBankWalletName) {
                        setBankData("complete");
                      } else {
                        setBankData("empty");
                      }
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-green btn-green-disable"
                    type="button"
                    onClick={() => {
                      setConfirmationMOdal(true);
                      setRowDto([
                        {
                          id: 1,
                          bankId: values?.bankName.value,
                          bankName: values?.bankName.label,
                          branchId: values?.branchName?.value,
                          branch: values?.branchName?.label,
                          // districtName: values?.districtName,
                          routingNo: values?.routingNo,
                          swiftCode: values?.swiftCode || "",
                          accName: values?.accName,
                          accNo: values?.accNo,
                          isDefault: values?.isDefault
                        },
                      ]);
                    }}
                    disabled={!values.bankName || !values.branchName || !values.routingNo || !values.accName || !values.accNo}
                  >
                    Save
                  </button>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>

      {/* Bank Branch DDL Create Modal */}
      <ViewModal
        size="lg"
        title={`Create New Bank Branch`}
        backdrop="static"
        classes="default-modal preview-modal"
        show={show}
        onHide={() => setShow(false)}
      >
        <AddBankBranch orgId={orgId} employeeId={employeeId} selectedBank={selectedBank} setShow={setShow} setBankBranchDDL={setBankBranchDDL} />
      </ViewModal>
    </>
  );
};

export default BankForm;
