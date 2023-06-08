import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Modal } from "react-bootstrap";
import React, { useEffect } from "react";
import Loading from "../../../common/loading/Loading";
import DefaultInput from "../../../common/DefaultInput";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../utility/customHooks/useAxiosPost";
import FormikSelect from "../../../common/FormikSelect";
import { customStyles } from "../../../utility/selectCustomStyle";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  onCreateTaxChallanConfig,
  onGetTaxChallanById,
  // yearToYearDDL,
} from "./helper";
import { shallowEqual, useSelector } from "react-redux";
import { todayDate } from "../../../utility/todayDate";
import { yearDDLAction } from "../../../utility/yearDDL";
const initialState = {
  intTaxChallanConfigId: null,
  year: null,
  fiscalYearRange: null,
  fromDate: null,
  toDate: null,
  circle: null,
  zone: null,
  challanNumber: null,
  bankName: null,
  dteChallanDate: null,
  dteCreatedAt: todayDate(),
  dteUpdatedAt: todayDate(),
};

const validationSchema = yup.object().shape({
  year: yup
    .object({
      label: yup.number().required("").typeError(""),
      value: yup.number().required("").typeError(""),
    })
    .required("Year is required")
    .typeError("Year is required"),
  fiscalYearRange: yup
    .object({
      label: yup.string().required("").typeError(""),
      value: yup.number().required("").typeError(""),
    })
    .required("Fiscal year is required")
    .typeError("Fiscal year is required"),
  fromDate: yup
    .date()
    .required("From date is required")
    .typeError("From date is required"),
  toDate: yup
    .date()
    .required("To date is required")
    .typeError("To date is required"),
  circle: yup
    .string()
    .required("Circle is required")
    .typeError("Circle is required"),
  zone: yup.string().required("Zone is required").typeError("Zone is required"),
  challanNumber: yup
    .string()
    .required("Challan number is required")
    .typeError("Challan number is required"),
  bankName: yup
    .object({
      label: yup.string().required("").typeError(""),
      value: yup.number().required("").typeError(""),
    })
    .required("Bank name is required")
    .typeError("Bank name is required"),
  dteChallanDate: yup
    .date()
    .required("Challan date is required")
    .typeError("Challan date is required"),
});

const TaxChallanConfigCreate = ({
  show,
  onHide,
  size,
  backdrop,
  classes,
  fullscreen,
  title,
  taxChallanId,
}) => {
  const { wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { profileData } = useSelector((state) => state?.auth, shallowEqual);
  const [, getTaxChallanInfo, loadingOnGetTaxChallanInfo] = useAxiosGet();
  const {
    values,
    setValues,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: initialState,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (formValues) => {
      onCreateTaxChallanConfig(
        formValues,
        profileData,
        createTaxChallanConfig,
        onHide,
        resetForm
      );
    },
  });
  const [fiscalYearDDL, getFiscalYearDDL, loadingOnGetFiscalDDL] =
    useAxiosGet();
  const [bankDDL, getBankDDL, loadingOnGetBankDDL, setBankDDL] = useAxiosGet();
  useEffect(() => {
    if (show) {
      getBankDDL("/MasterData/GetAllBankWallet", (response) => {
        const modfiedBankDDL = response.map((item) => ({
          label: item?.strBankWalletName,
          value: item?.intBankWalletId,
        }));
        setBankDDL(modfiedBankDDL);
      });
      getFiscalYearDDL(`/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=fiscalYearDDL&WorkplaceGroupId=${wgId}`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);
  useEffect(() => {
    if (taxChallanId) {
      onGetTaxChallanById(getTaxChallanInfo, taxChallanId, setValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxChallanId]);

  const [, createTaxChallanConfig, loadingOnCreateTaxChallanConfig] =
    useAxiosPost();
  return (
    <>
      {(loadingOnGetBankDDL ||
        loadingOnGetFiscalDDL ||
        loadingOnCreateTaxChallanConfig ||
        loadingOnGetTaxChallanInfo) && <Loading />}
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
            <Modal.Header className="bg-custom">
              <div className="d-flex w-100 justify-content-between align-items-center">
                <Modal.Title className="text-center">{title}</Modal.Title>
                <div>
                  <IconButton
                    onClick={() => {
                      onHide();
                      resetForm();
                    }}
                  >
                    <Close />
                  </IconButton>
                </div>
              </div>
            </Modal.Header>

            <Modal.Body id="example-modal-sizes-title-xl">
              <div className="businessUnitModal">
                <div className="modalBody pt-1 px-0">
                  <div className="row mx-0">
                    <div className="col-6">
                      <label>Year</label>
                      <FormikSelect
                        name="year"
                        options={yearDDLAction(5, 100) || []}
                        value={values?.year}
                        placeholder="Year"
                        onChange={(valueOption) => {
                          setFieldValue("year", valueOption);
                        }}
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>Fiscal Year Range</label>
                      <FormikSelect
                        name="fiscalYearRange"
                        options={fiscalYearDDL || []}
                        value={values?.fiscalYearRange}
                        label=""
                        onChange={(valueOption) => {
                          setFieldValue("fiscalYearRange", valueOption);
                        }}
                        menuPosition="fixed"
                        placeholder=" "
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-6">
                      <label>From Date</label>
                      <DefaultInput
                        value={values?.fromDate}
                        name="fromDate"
                        type="date"
                        className="form-control"
                        max={values?.toDate}
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                        placeholder=" "
                        classes="input-sm"
                      />
                    </div>
                    <div className="col-6">
                      <label>To Date</label>
                      <DefaultInput
                        value={values?.toDate}
                        name="toDate"
                        type="date"
                        min={values?.fromDate}
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                        placeholder=" "
                        classes="input-sm"
                      />
                    </div>

                    <div className="col-6">
                      <label>Circle</label>
                      <DefaultInput
                        value={values?.circle}
                        name="circle"
                        type="text"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("circle", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                        placeholder=" "
                        classes="input-sm"
                      />
                    </div>
                    <div className="col-6">
                      <label>Zone</label>
                      <DefaultInput
                        value={values?.zone}
                        name="zone"
                        type="text"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("zone", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                        placeholder=" "
                        classes="input-sm"
                      />
                    </div>
                    <div className="col-6">
                      <label>Challan Number</label>
                      <DefaultInput
                        value={values?.challanNumber}
                        name="challanNumber"
                        type="text"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("challanNumber", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                        placeholder=" "
                        classes="input-sm"
                      />
                    </div>
                    <div className="col-6">
                      <label>Challan Date</label>
                      <DefaultInput
                        value={values?.dteChallanDate}
                        name="dteChallanDate"
                        type="date"
                        className="form-control"
                        onChange={(e) => {
                          setFieldValue("dteChallanDate", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                        placeholder=" "
                        classes="input-sm"
                      />
                    </div>
                    <div className="col-6">
                      <label>Bank Name</label>
                      <FormikSelect
                        name="bankName"
                        options={bankDDL}
                        value={values?.bankName}
                        menuPosition="fixed"
                        onChange={(valueOption) => {
                          setFieldValue("bankName", valueOption);
                        }}
                        placeholder=" "
                        styles={customStyles}
                        errors={errors}
                        touched={touched}
                        isDisabled={false}
                      />
                    </div>
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
                  resetForm();
                  onHide();
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-green btn-green-disable"
                style={{ width: "auto" }}
                type="button"
                onClick={handleSubmit}
              >
                Save
              </button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default TaxChallanConfigCreate;
