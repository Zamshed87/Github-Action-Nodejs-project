import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import DefaultInput from "../../../../common/DefaultInput";
import FormikToggle from "../../../../common/FormikToggle";
import { blackColor40, greenColor } from "../../../../utility/customColor";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
import { todayDate } from "../../../../utility/todayDate";
import { getPeopleDeskAllDDL } from "./../../../../common/api/index";
import FormikSelect from "./../../../../common/FormikSelect";
import Loading from "./../../../../common/loading/Loading";
import { customStyles } from "./../../../../utility/newSelectCustomStyle";

const initialValues = {
  bankBranchCode: "",
  bankBranchName: "",
  bankBranchAddress: "",
  district: "",
  bankName: "",
  routingNumber: "",
  isActive: true,
};

const validationSchema = Yup.object().shape({
  bankName: Yup.object()
    .shape({
      label: Yup.string().required("Bank Name is required"),
      value: Yup.string().required("Bank Name is required"),
    })
    .typeError("Bank Name Type is required"),
  bankBranchCode: Yup.date().required("Branch Code is required"),
  bankBranchName: Yup.string().required("Branch Name is required"),
  district: Yup.object()
    .shape({
      label: Yup.string().required("District Name is required"),
      value: Yup.string().required("District Name is required"),
    })
    .typeError("District Name Type is required"),
  bankBranchAddress: Yup.string().required("Branch Address is required"),
  routingNumber: Yup.string()
    .min(9, "Minimum 9 numbers")
    .required("Routing number is required"),
});

export default function AddEditFormComponent({
  id,
  setId,
  show,
  onHide,
  size,
  backdrop,
  classes,
  isVisibleHeading = true,
  fullscreen,
  title,
  getLandingData,
}) {
  const [, createBankBranch, loading1] = useAxiosPost();
  const [singleData, getSingleData, loading2] = useAxiosGet();
  const [bankDDL, setBankDDL] = useState([]);
  const [districtDDL, setDistrictDDL] = useState([]);
  const [modifySingleData, setModifySingleData] = useState("");

  const { employeeId, orgId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Bank&WorkplaceGroupId=${wgId}`,
      "BankID",
      "BankName",
      setBankDDL
    );
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=District&WorkplaceGroupId=${wgId}`,
      "DistrictId",
      "DistrictName",
      setDistrictDDL
    );
  }, [wgId]);

  const getSingleDataValues = () => {
    getSingleData(
      `/SaasMasterData/BankBranchLandingById?IntBankBranchId=${id}`
    );
  };

  useEffect(() => {
    if (id) {
      getSingleDataValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (id) {
      const newRowData = {
        bankName: {
          label: singleData?.strBankName || "",
          value: singleData?.intBankId || "",
        },
        district: {
          label: singleData?.strDistrict || "",
          value: singleData?.intDistrictId || "",
        },
        bankBranchCode: singleData?.strBankBranchCode || "",
        bankBranchAddress: singleData?.strBankBranchAddress || "",
        bankBranchName: singleData?.strBankBranchName || "",
        routingNumber: singleData?.strRoutingNo || "",
        isActive: singleData?.isActive || false,
      };
      setModifySingleData(newRowData);
    }
  }, [id, singleData]);

  const saveHandler = () => {
    let payload = {
      intBankBranchId: !id ? 0 : id,
      strBankBranchCode: values?.bankBranchCode,
      strBankBranchName: values?.bankBranchName,
      strBankBranchAddress: values?.bankBranchAddress,
      intAccountId: orgId,
      intDistrictId: values?.district?.value,
      intCountryId: 18,
      intBankId: values?.bankName?.value,
      strBankName: values?.bankName?.label,
      strBankShortName: !id
        ? values?.bankName?.BankShortName
        : singleData?.strBankShortName,
      strBankCode: !id ? values?.bankName?.BankCode : singleData?.strBankCode,
      strRoutingNo: values?.routingNumber,
      isActive: values?.isActive,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
    };

    const callback = () => {
      if (id) {
        getSingleDataValues();
        resetForm(modifySingleData);
      } else {
        resetForm(initialValues);
      }
      // For landing page data
      getLandingData();
      onHide();
    };

    createBankBranch(`/Employee/CreateBankBranch`, payload, callback, true);
  };

  const { setFieldValue, values, errors, touched, handleSubmit, resetForm } =
    useFormik({
      enableReinitialize: true,
      validationSchema,
      initialValues: id ? modifySingleData : initialValues,
      onSubmit: () => {
        saveHandler();
      },
    });

  return (
    <>
      {(loading1 || loading2) && <Loading />}
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
                        if (id) {
                          resetForm(modifySingleData);
                        } else {
                          resetForm(initialValues);
                        }
                        setId(null);
                        onHide();
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
                    <div className="col-lg-6 pl-0">
                      <div className="input-field">
                        <label htmlFor=""> Branch Name </label>
                        <DefaultInput
                          classes="input-sm"
                          type="text"
                          value={values?.bankBranchName}
                          name="bankBranchName"
                          onChange={(e) => {
                            setFieldValue("bankBranchName", e.target.value);
                          }}
                          placeholder=""
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 pr-0">
                      <div className="input-field">
                        <label htmlFor=""> Branch Code </label>
                        <DefaultInput
                          classes="input-sm"
                          type="text"
                          value={values?.bankBranchCode}
                          name="bankBranchCode"
                          onChange={(e) => {
                            setFieldValue("bankBranchCode", e.target.value);
                          }}
                          placeholder=""
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 pl-0">
                      <div className="input-field">
                        <label htmlFor=""> Branch Address</label>
                        <DefaultInput
                          classes="input-sm"
                          type="text"
                          value={values?.bankBranchAddress}
                          name="bankBranchAddress"
                          onChange={(e) => {
                            setFieldValue("bankBranchAddress", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 pr-0">
                      <div className="input-field-main">
                        <label>District</label>
                        <FormikSelect
                          name="district"
                          options={districtDDL}
                          value={values?.district}
                          onChange={(valueOption) => {
                            setFieldValue("district", valueOption);
                          }}
                          placeholder=""
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 pl-0">
                      <div className="input-field-main">
                        <label>Bank</label>
                        <FormikSelect
                          name="bankName"
                          options={bankDDL}
                          value={values?.bankName}
                          onChange={(valueOption) => {
                            setFieldValue("bankName", valueOption);
                          }}
                          placeholder=""
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 pr-0">
                      <div className="input-field">
                        <label htmlFor=""> Routing Number </label>
                        <DefaultInput
                          classes="input-sm"
                          type="number"
                          value={values?.routingNumber}
                          name="routingNumber"
                          onChange={(e) => {
                            if (
                              e.target.value > 0 &&
                              e.target.value.length < 10
                            ) {
                              setFieldValue("routingNumber", e.target.value);
                            } else {
                              setFieldValue("routingNumber", "");
                            }
                          }}
                          placeholder=""
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    {!!id && (
                      <div className="col-12 px-0">
                        <div className="input-main position-group-select mt-2">
                          <h6 className="title-item-name">
                            Bank Branch Activation
                          </h6>
                          <p className="subtitle-p">
                            Activation toggle indicates to the particular Bank
                            Branch status (Active/Inactive)
                          </p>
                          <FormikToggle
                            name="isActive"
                            color={values?.isActive ? greenColor : blackColor40}
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
                disabled={loading1}
                type="button"
                className="btn btn-cancel"
                style={{
                  marginRight: "15px",
                }}
                onClick={() => {
                  if (id) {
                    resetForm(modifySingleData);
                  } else {
                    resetForm(initialValues);
                  }
                  setId(null);
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
          </form>
        </Modal>
      </div>
    </>
  );
}
