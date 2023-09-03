import React from 'react';
import FormikSelect from './../../../../../../../common/FormikSelect';
import { customStyles } from './../../../../../../../utility/newSelectCustomStyle';
import FormikRatings from './../../../../../../../common/FormikRatings';
import { ratingColor } from '../../../../../../../utility/customColor';

export default function Pipeline({ index, tabIndex, propsObj }) {
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
                        <h3>Status</h3>
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
                        <h3>Rating</h3>
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
                              <FormikRatings
                                 name="ratings"
                                 value={values?.ratings}
                                 color={ratingColor}
                                 onChange={(e) => {
                                    setFieldValue("ratings", +e.target.value);
                                 }}
                                 ratingStyle={{
                                    width: 200,
                                    display: 'flex',
                                    alignItems: 'center',
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
