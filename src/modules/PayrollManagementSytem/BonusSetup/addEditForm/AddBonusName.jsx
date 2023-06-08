import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "../../../../common/FormikInput";
import { todayDate } from "../../../../utility/todayDate";
import { getBonusNameDDL } from "../helper";
import { createBonusSetup } from './../helper';

const initData = {
   bonusNewName: "",
};

const validationSchema = Yup.object().shape({
   bonusNewName: Yup.string().required("Bonus new name is required"),
});

export default function AddBonusName({ orgId, employeeId, buId, setBonusNameDDL, setShow, setLoading }) {
   const saveHandler = (values, cb) => {
      const payload = {
         strPartName: "BonusNameCreate",
         intBonusSetupId: 0,
         intBonusId: 0,
         strBonusName: values?.bonusNewName,
         strBonusDescription: "",
         intAccountId: orgId,
         intBusinessUnitId: buId,
         intReligion: 0,
         strReligionName: "",
         intEmploymentTypeId: 0,
         strEmploymentType: "",
         intMinimumServiceLengthMonth: 0,
         strBonusPercentageOn: "",
         numBonusPercentage: 0,
         intCreatedBy: employeeId,
         isActive: true
      }

      const callBack = () => {
         cb();
         getBonusNameDDL({
            strPartName: "BonusNameList",
            intBonusHeaderId: 0,
            intAccountId: orgId,
            intBusinessUnitId: buId,
            intBonusId: 0,
            intPayrollGroupId: 0,
            intWorkplaceGroupId: 0,
            intReligionId: 0,
            dteEffectedDate: todayDate(),
            intCreatedBy: employeeId
         }, setBonusNameDDL);
         setShow(false);
      };

      createBonusSetup(payload, setLoading, callBack);
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
                                 <label>Bonus Name</label>
                                 <FormikInput
                                    classes="input-sm"
                                    value={values?.bonusNewName}
                                    placeholder=""
                                    name="bonusNewName"
                                    type="text"
                                    className="form-control"
                                    onChange={(e) => {
                                       setFieldValue("bonusNewName", e.target.value);
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
