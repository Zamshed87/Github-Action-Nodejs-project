import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import FormikInput from "../../../../common/FormikInput";

const initData = {
  maintenanceReason: "",
};

const validationSchema = Yup.object().shape({
  maintenanceReason: Yup.string().required("Maintenance reason is required"),
});

export default function MaintenanceReason({
  orgId,
  userId,
  setPolicyCategoryDDL,
  setShow,
  setActionMenu,
}) {
  const saveHandler = (values, cb) => {
    // const payload = {
    //    policyCategoryId: 0,
    //    policyCategoryName: values?.policyNewCategory,
    //    accountId: orgId,
    //    isActive: true,
    //    insertBy: userId
    // }

    // const callBack = () => {
    //    cb();
    //    // getPolicyCategoryDDL(orgId, setPolicyCategoryDDL);
    //    setShow(false);
    // };

    // createPolicyCategory(payload, callBack);

    setActionMenu(true);
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
            <Form onSubmit={handleSubmit}>
              <div className="create-approval-form">
                <div className="modal-body2">
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="input-field-main">
                        <label htmlFor="">Maintenance Reason</label>
                        <FormikInput
                          classes="input-sm"
                          value={values?.maintenanceReason}
                          placeholder=""
                          name="maintenanceReason"
                          type="text"
                          className="form-control"
                          onChange={(e) => {
                            setFieldValue("maintenanceReason", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <button
                        className="btn btn-green btn-category mt-4"
                        type="submit"
                      >
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
