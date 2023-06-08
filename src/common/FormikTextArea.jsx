import React, { useState } from "react";
import { useField } from "formik";
import FormikError from './login/FormikError';

const FormikTextArea = (props) => {
   const [field] = useField(props);
   const {
      placeholder,
      value,
      name,
      type,
      errors,
      touched,
      disabled,
      label,
      rows,
      classes
   } = props;
   const [isFocusForm, setIsFocusForm] = useState(false);
   return (
      <div
         className={classes ? `form-group login-input input-xl textarea ${classes}` : `form-group login-input input-xl textarea`}
         onFocus={() => setIsFocusForm(true)}
         onBlur={() => setIsFocusForm(false)}
      >
         {label && (
            <div>
               <label
                  className={disabled ? "onFocusLabel is-disabled" : isFocusForm || value ? "onFocusLabel" : "onBlurLabel"}
               >
                  {label}
               </label>
            </div>
         )}
         <div>
            <textarea
               {...props}
               {...field}
               value={value}
               name={name}
               placeholder={placeholder}
               type={type}
               disabled={disabled}
               rows={rows || 1}
               className={"form-control"}
            />
         </div>
         <FormikError errors={errors} touched={touched} name={name} />
      </div>
   );
};

export default FormikTextArea;

/*
   Usage

   a. formik textarea with label
      <label>Bio</label>
      <FormikTextArea
         className="form-control"
         label="Bio"
         value={values?.bio}
         name="bio"
         type="text"
         errors={errors}
         touched={touched}
      />

   b. formik textarea without label
      <FormikTextArea
         className="form-control"
         label="Bio"
         value={values?.bio}
         name="bio"
         type="text"
         placeholder="Address"
         errors={errors}
         touched={touched}
      />

*/
