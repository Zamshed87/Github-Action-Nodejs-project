import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { Field } from "formik";
import moment from "moment";
import React, { useState } from "react";
import { blackColor40 } from "./../utility/customColor";
import FormikError from "./login/FormikError";
const FormikInput = (props) => {
  const {
    id,
    label,
    placeholder,
    value,
    name,
    type,
    errors,
    touched,
    disabled,
    classes,
    inputClasses,
    trailicon,
    isNumber,
    onChange,
    min,
    max,
    step,
    onKeyDown,
    autoFocus,
    autoFocusForm,
    maxLength,
    passwordicon,
    isParentFormContainerClass,
    handleBlur,
  } = props;
  // const number = type === "number" ? String(Number(value)) : value;
  const [isFocusForm, setIsFocusForm] = useState(false);
  const [isPasswordShow, setIsPassword] = useState(false);

  return (
    <div
      className={
        isParentFormContainerClass
          ? `form-container ${isParentFormContainerClass}`
          : `form-container`
      }
    >
      <div
        className={
          classes
            ? `form-group login-input input-xl ${classes}`
            : `form-group login-input input-xl`
        }
        onFocus={() => setIsFocusForm(true)}
        onBlur={() => setIsFocusForm(false)}
      >
        {label && (
          <label
            className={
              disabled
                ? "onFocusLabel is-disabled"
                : isFocusForm || value || value === 0 || autoFocusForm
                ? "onFocusLabel"
                : "onBlurLabel"
            }
          >
            {label}
          </label>
        )}
        {/* trailIcon */}
        {trailicon && (
          <span className={"form-icon form-trail-icon"}>{trailicon}</span>
        )}

        {/* increment & decrement buttons */}
        {isNumber && (
          <div className={"number-button-group"}>
            <button
              type="button"
              onClick={props?.incrementHandler}
              className="btn-add"
            >
              <KeyboardArrowUp sx={{ color: blackColor40 }} />
            </button>
            <button
              type="button"
              onClick={props?.decrementHandler}
              className="btn-add"
            >
              <KeyboardArrowDown sx={{ color: blackColor40 }} />
            </button>
          </div>
        )}
        {/* Password Icon */}
        {value && passwordicon ? (
          <span
            className={
              touched[name]
                ? value
                  ? "form-icon form-trail-icon"
                  : "form-icon form-trail-icon form-trail-icon-error"
                : isFocusForm
                ? "form-icon form-trail-icon active"
                : "form-icon form-trail-icon"
            }
            onClick={() => setIsPassword(!isPasswordShow)}
          >
            {isPasswordShow ? (
              <VisibilityOutlined />
            ) : (
              <VisibilityOffOutlined />
            )}
          </span>
        ) : null}
        <Field
          // {...props}
          id={id}
          value={value}
          name={name}
          placeholder={placeholder}
          type={isPasswordShow ? "text" : type}
          className={
            inputClasses ? `form-control ${inputClasses}` : `form-control`
          }
          disabled={disabled}
          min={min}
          max={max}
          maxLength={maxLength}
          data-date={value ? moment(value).format("DD-MMMM-YYYY") : placeholder}
          onChange={onChange}
          step={step}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          onBlur={handleBlur}
        />
      </div>
      <FormikError errors={errors} touched={touched} name={name} />
    </div>
  );
};

export default FormikInput;

/*
   Usage

   a. formik input with label
      <label>Bio</label>
      <FormikInput
         classes="input-sm"
         value={values?.bio}
         name="bio"
         type="text"
         className="form-control"
         placeholder="Bio"
         errors={errors}
         touched={touched}
         onChange={e => setFieldValue("name", e.target.value)}
      />

   b. formik input without label
      <FormikInput
         label="First Name"
         value={values?.firstName}
         name="firstName"
         type="text"
         className="form-control"
         errors={errors}
         touched={touched}
         onChange={e => setFieldValue("name", e.target.value)}
      />

   c. Input Borderless
      <FormikInput
         classes="input-borderless"
         label="Noted"
         value={values?.noted}
         name="noted"
         type="text"
         className="form-control"
         errors={errors}
         touched={touched}
         onChange={e => setFieldValue("name", e.target.value)}
      />

   d. Input Number

      <FormikInput
         inputClasses="input-number"
         onChange={e => setFieldValue("name", e.target.value)}
         label="Number"
         value={values?.amount}
         name="amount"
         type="number"
         className="form-control"
         isNumber={true}
         incrementHandler={(e) => {
            setFieldValue("amount", +values?.amount + 1)
         }}
         decrementHandler={(e) => {
            if (!values?.amount || values?.amount < 0) {
               setFieldValue("amount", 0)
            }
            else {
               setFieldValue("amount", +values?.amount - 1)
            }
         }}
         errors={errors}
         touched={touched}
      />

   e. Input Number Borderless

      <FormikInput
         classes="input-borderless"
         ...
      />

*/
