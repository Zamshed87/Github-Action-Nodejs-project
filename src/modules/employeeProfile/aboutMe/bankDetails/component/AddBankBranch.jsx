import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { todayDate } from "../../../../../utility/todayDate";
import FormikInput from "../../../../../common/FormikInput";
import { createBankBranch, getBankBranchDDL } from "../../helper";

const initData = {
  branchName: "",
  routingNo: "",
};

const validationSchema = Yup.object().shape({
  branchName: Yup.string().required("New bank branch name is required"),
  routingNo: Yup.string().max(9,"Routing number is invalid").min(9)
  .required("New Routing number is required"),
});

export default function AddBankBranch({ orgId, employeeId, setShow, selectedBank, setBankBranchDDL }) {
  const saveHandler = (values, cb) => {
    const payload = {
      intBankBranchId: 0,
      strBankBranchCode: "",
      strBankBranchName: values?.branchName,
      strBankBranchAddress: "",
      intAccountId: 0,
      intDistrictId: 0,
      intCountryId: 0,
      intBankId: selectedBank?.BankID || 0,
      strBankName: selectedBank?.BankName,
      strBankShortName: selectedBank?.BankShortName,
      strBankCode: selectedBank?.BankCode,
      strRoutingNo: values?.routingNo.toString(),
      isActive: true,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
    };

    const callBack = () => {
      cb();
      getBankBranchDDL(selectedBank?.BankID, orgId, 0, setBankBranchDDL);
      setShow(false);
    };
    createBankBranch(payload, callBack);
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, resetForm, values, errors, touched, setFieldValue, isValid }) => (
          <>
            <Form onSubmit={handleSubmit}>
              <div className="create-approval-form">
                <div className="modal-body2">
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="input-field-main">
                        <label htmlFor="">New Bank Branch Name</label>
                        <FormikInput
                          classes="input-sm"
                          value={values?.branchName}
                          placeholder=""
                          name="branchName"
                          type="text"
                          className="form-control"
                          onChange={(e) => {
                            setFieldValue("branchName", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="input-field-main">
                        <label htmlFor="">New Routing No</label>
                        <FormikInput
                          classes="input-sm"
                          value={values?.routingNo}
                          placeholder=""
                          name="routingNo"
                          type="number"
                          className="form-control"
                          onChange={(e) => {
                            if(e.target.value < 0){
                              setFieldValue("routingNo", "");
                            }else{
                              setFieldValue("routingNo", e.target.value);
                            }
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <button className="btn btn-green btn-category mt-4" type="submit">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
