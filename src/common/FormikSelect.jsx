/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import FormikError from "./login/FormikError";
import Select from "react-select";
import {
  customStyles,
  customStylesLarge,
  smallCustomStyles,
} from "../utility/selectCustomStyle";

const FormikSelect = (props) => {
  const target = useRef(null);
  const [isFocusForm, setIsFocusForm] = useState(false);
  const {
    name,
    options,
    value,
    label,
    placeholder,
    errors,
    touched,
    onChange,
    setClear,
    styleMode,
    isDisabled,
    menuPosition,
    isClearable,
    isSearchable,
    isOptionDisabled
  } = props;

  // styleMode = "small" || "medium" || "large"

  let styles = null;
  if (styleMode === "medium") {
    styles = customStyles;
  } else if (styleMode === "large") {
    styles = customStylesLarge;
  }

  return (
    <div className='form-container' id={name}>
      <div
        className='formik-select-wrapper'
        ref={target}
        onFocus={() => setIsFocusForm(true)}
        onBlur={() => setIsFocusForm(false)}
      >
        {label && <label> {label} </label>}
        <Select
          instanceId="peopleDesk"
          isDisabled={isDisabled ? true : false}
          isClearable={isClearable === false ? isClearable : true} // dont use or(||), or is not valid in this case
          onChange={onChange}
          options={options || []}
          value={value || ""}
          isSearchable={isSearchable || true}
          name={name}
          styles={styles}
          placeholder={placeholder}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
          })}
          onFocus={() => setIsFocusForm(true)}
          onBlur={() => setIsFocusForm(false)}
          menuPosition={menuPosition}
          isOptionDisabled={isOptionDisabled}
          {...props}
        />
        {setClear && (
          <i
            class='fa fa-times-circle select-cross-icon'
            onClick={() => {
              setClear(name, "");
            }}
          ></i>
        )}
      </div>
      <FormikError errors={errors} name={name} touched={touched} />
    </div>
  );
};

export default FormikSelect;

/*
   Usage

   a. formik Select with label ( height 40px)

      <FormikSelect
         name="country"
         options={[
            { value: 1, label: "BD" },
            { value: 2, label: "UK" },
            { value: 3, label: "USA" }
         ]}
         value={values?.country}
         label="Country"
         onChange={(valueOption) => {
            setFieldValue("country", valueOption);
         }}
         placeholder="Country"
         styles={customStyles}
         errors={errors}
         touched={touched}
         isDisabled={false}
      />

   a. formik Select with label ( height 56px)

      <FormikSelect
         name="country"
         options={[
            { value: 1, label: "BD" },
            { value: 2, label: "UK" },
            { value: 3, label: "USA" }
         ]}
         value={values?.country}
         label="Country"
         onChange={(valueOption) => {
            setFieldValue("country", valueOption);
         }}
         placeholder="Country"
         styles={customStylesLarge}
         errors={errors}
         touched={touched}
         isDisabled={false}
      />

*/
