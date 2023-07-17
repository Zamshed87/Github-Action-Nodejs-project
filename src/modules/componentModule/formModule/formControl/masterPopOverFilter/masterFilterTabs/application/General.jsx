import React from 'react';
import FormikSelect from './../../../../../../../common/FormikSelect';
import { customStyles } from './../../../../../../../utility/newSelectCustomStyle';
import FormikInput from './../../../../../../../common/FormikInput';

export default function General({ index, tabIndex, propsObj }) {
   const {
      setFieldValue,
      values,
      errors,
      touched
   } = propsObj;
   return (
      index === tabIndex && (
         <>
            <div className="tab-form-application">
               <div className="expected-salery-fileds">
                  <div className="row align-items-center">
                     <div className="col-md-4">
                        <h3>Age</h3>
                     </div>
                     <div className="col-md-8">
                        <div className="row align-items-center">
                           <div className="col-md-6">
                              <FormikSelect
                                 name="noticePeriodTime"
                                 options={[
                                    { value: 1, label: "Immidiately" },
                                    { value: 2, label: "15 Days" },
                                    { value: 3, label: "1 Month" },
                                    { value: 4, label: "1 Month+" },
                                 ]}
                                 value={values?.noticePeriodTime}
                                 onChange={(valueOption) => {
                                    setFieldValue("noticePeriodTime", valueOption);
                                 }}
                                 placeholder=" "
                                 styles={customStyles}
                                 errors={errors}
                                 touched={touched}
                                 isDisabled={false}
                              />
                           </div>
                           <div className="col-md-6">
                              <FormikInput
                                 classes="input-sm input-borderless"
                                 placeholder={"To"}
                                 value={values?.expectedSalaryTo}
                                 name="expectedSalaryTo"
                                 type="number"
                                 errors={errors}
                                 touched={touched}
                                 onChange={(e) => {
                                    setFieldValue("expectedSalaryTo", e.target.value);
                                 }}
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="expected-salery-fileds">
                  <div className="row align-items-center">
                     <div className="col-md-4">
                        <h3>Gender</h3>
                     </div>
                     <div className="col-md-8">
                        <div className="row">
                           <div className="col-md-12">
                              <FormikSelect
                                 name="noticePeriodTime"
                                 options={[
                                    { value: 1, label: "Immidiately" },
                                    { value: 2, label: "15 Days" },
                                    { value: 3, label: "1 Month" },
                                    { value: 4, label: "1 Month+" },
                                 ]}
                                 value={values?.noticePeriodTime}
                                 onChange={(valueOption) => {
                                    setFieldValue("noticePeriodTime", valueOption);
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
               </div>
               <div className="expected-salery-fileds">
                  <div className="row align-items-center">
                     <div className="col-md-4">
                        <h3>Religion</h3>
                     </div>
                     <div className="col-md-8">
                        <div className="row">
                           <div className="col-md-12">
                              <FormikSelect
                                 name="noticePeriodTime"
                                 options={[
                                    { value: 1, label: "Immidiately" },
                                    { value: 2, label: "15 Days" },
                                    { value: 3, label: "1 Month" },
                                    { value: 4, label: "1 Month+" },
                                 ]}
                                 value={values?.noticePeriodTime}
                                 onChange={(valueOption) => {
                                    setFieldValue("noticePeriodTime", valueOption);
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
               </div>
               <div className="expected-salery-fileds">
                  <div className="row align-items-center">
                     <div className="col-md-4">
                        <h3>Institute</h3>
                     </div>
                     <div className="col-md-8">
                        <div className="row">
                           <div className="col-md-12">
                              <FormikInput
                                 classes="input-sm input-borderless"
                                 placeholder={"To"}
                                 value={values?.expectedSalaryTo}
                                 name="expectedSalaryTo"
                                 type="number"
                                 errors={errors}
                                 touched={touched}
                                 onChange={(e) => {
                                    setFieldValue("expectedSalaryTo", e.target.value);
                                 }}
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </>
      )
   );
}
