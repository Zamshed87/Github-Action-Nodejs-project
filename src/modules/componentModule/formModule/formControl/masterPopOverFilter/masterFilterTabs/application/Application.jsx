import React from 'react';
import FormikInput from './../../../../../../../common/FormikInput';
import FormikSelect from './../../../../../../../common/FormikSelect';
import { customStyles } from './../../../../../../../utility/newSelectCustomStyle';

export default function Application({ index, tabIndex, propsObj }) {
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
                        <h3>Expected Salary</h3>
                     </div>
                     <div className="col-md-8">
                        <div className="row">
                           <div className="col-md-6">
                              <FormikInput
                                 classes="input-borderless input-sm"
                                 placeholder="From"
                                 value={values?.expectedSalaryFrom}
                                 name="expectedSalaryFrom"
                                 type="number"
                                 errors={errors}
                                 touched={touched}
                                 onChange={(e) => {
                                    setFieldValue("expectedSalaryFrom", e.target.value);
                                 }}
                              />
                           </div>
                           <div className="col-md-6">
                              <FormikInput
                                 classes="input-borderless input-sm"
                                 placeholder="To"
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
                        <h3>Applied Date</h3>
                     </div>
                     <div className="col-md-8">
                        <div className="row">
                           <div className="col-md-6">
                              <FormikInput
                                 classes="input-borderless input-sm"
                                 placeholder="From"
                                 value={values?.appliedFormDate}
                                 name="appliedFormDate"
                                 type="date"
                                 errors={errors}
                                 touched={touched}
                                 onChange={(e) => {
                                    setFieldValue("appliedFormDate", e.target.value);
                                 }}
                              />
                           </div>
                           <div className="col-md-6">
                              <FormikInput
                                 classes="input-borderless input-sm"
                                 placeholder="To"
                                 value={values?.appliedToDate}
                                 name="appliedToDate"
                                 type="date"
                                 errors={errors}
                                 touched={touched}
                                 onChange={(e) => {
                                    setFieldValue("appliedToDate", e.target.value);
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
                        <h3>Notice Period</h3>
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
            </div>
         </>
      )
   );
}
