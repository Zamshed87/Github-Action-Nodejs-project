import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "../../../common/FormikInput";
import { createPolicyCategory, getPolicyCategoryDDL } from "../helper";

const initData = {
   policyNewCategory: "",
};

const validationSchema = Yup.object().shape({
   policyNewCategory: Yup.string().required("Policy New Category is required"),
});

export default function AddPolicyCategory({ orgId, employeeId, setPolicyCategoryDDL, setShow }) {
   const saveHandler = (values, cb) => {
      const payload = {
         policyCategoryId: 0,
         policyCategoryName: values?.policyNewCategory,
         accountId: orgId,
         isActive: true,
         intCreatedBy: employeeId
      }

      const callBack = () => {
         cb();
         getPolicyCategoryDDL(orgId, setPolicyCategoryDDL);
         setShow(false);
      };

      createPolicyCategory(payload, callBack);
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
                     <div className="modalBody pt-0 px-0">
                        <div className="row mx-0">
                           <div className="col-lg-4">
                              <div className="input-field-main">
                                 <label>Policy Category</label>
                                 <FormikInput
                                    classes="input-sm"
                                    value={values?.policyNewCategory}
                                    placeholder=""
                                    name="policyNewCategory"
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => {
                                       setFieldValue("policyNewCategory", e.target.value);
                                    }}
                                    errors={errors}
                                    touched={touched}
                                 />
                              </div>
                           </div>
                           <div className="col-lg-2">
                              <button
                                 className="btn btn-green btn-green-disable mt-4"
                                 type="submit"
                              >
                                 Save
                              </button>
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
