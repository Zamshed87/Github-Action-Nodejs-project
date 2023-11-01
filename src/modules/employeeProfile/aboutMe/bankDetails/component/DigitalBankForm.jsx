import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import { getPeopleDeskAllDDL } from "../../../../../common/api";
import FormikInput from "../../../../../common/FormikInput";
import FormikSelect from "../../../../../common/FormikSelect";
import Loading from "../../../../../common/loading/Loading";
import { customStyles } from "../../../../../utility/selectCustomStyle";

const DigitalBankForm = ({
  setBankData,
  setConfirmationMOdal,
  rowDto,
  setRowDto,
  empBasic,
  singleData,
}) => {
  const initData = {
    gateway: "",
    mobileNo: "",
    isDefault: false,
  };

  const saveHandler = (values, cb) => {
    setConfirmationMOdal(true);
    setRowDto([
      {
        id: rowDto.length + 1,
        gatewayId: values?.gateway?.value,
        gateway: values?.gateway?.label,
        digitalBankingName: values?.accountName,
        mobileNo: values?.mobileNo,
        isDefault: values?.isDefault || false,
      },
    ]);
  };

  const { wgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [mobileBankDDL, setMobileBankDDL] = useState([]);
  const [mobileBankNumberCheck, setMobileBankNumberCheck] = useState(
    singleData ? singleData?.gateway?.value : 71
  );

  const validationSchema =
    mobileBankNumberCheck === 73
      ? Yup.object().shape({
        mobileNo: Yup.string()
          .required("Rocket Number is required")
          .matches(
            /^(?:\+?88|0088)?01[15-9]\d{9}$/,
            "Rocket Number is invalid"
          ),
      })
      : Yup.object().shape({
        mobileNo: Yup.string()
          .required("Mobile Number is required")
          .matches(
            /^(?:\+?88|0088)?01[15-9]\d{8}$/,
            "Mobile Number is invalid"
          ),
      });

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PaymentGateway&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
      "DigitalBankId",
      "DigitalBankName",
      setMobileBankDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik
        validationSchema={validationSchema}
        enableReinitialize={true}
        initialValues={singleData?.gateway?.label ? singleData : initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
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
            <Form>
              {loading && <Loading />}
              <div className="bank-about-me-form">
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
                    <label style={{ width: "110px" }}>Gateway</label>
                    <FormikSelect
                      name="gateway"
                      options={mobileBankDDL}
                      value={values?.gateway}
                      onChange={(valueOption) => {
                        setFieldValue("gateway", valueOption);
                        setMobileBankNumberCheck(valueOption?.value);
                      }}
                      placeholder=" "
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 d-flex">
                    <label style={{ width: "110px" }}>Mobile No</label>
                    <FormikInput
                      value={values?.mobileNo}
                      onChange={(e) => {
                        setFieldValue("mobileNo", e.target.value);
                      }}
                      name="mobileNo"
                      type="number"
                      className="form-control"
                      errors={errors}
                      touched={touched}
                      placeholder=" "
                      classes="input-sm"
                    />
                  </div>
                </div>
                <div className="about-me-bank-details-footer">
                  <button
                    className="btn btn-cancel"
                    type="button"
                    style={{
                      marginRight: "16px",
                    }}
                    onClick={() => {
                      if (
                        empBasic?.strAccountName ||
                        empBasic?.strBankWalletName
                      ) {
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
                    type="submit"
                    disabled={!values?.gateway || !values?.mobileNo}
                  >
                    Save
                  </button>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default DigitalBankForm;
