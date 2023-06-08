/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import FormikError from "./login/FormikError";
import Select, { components } from "react-select";
import {
  customStyles,
  customStylesLarge,
  smallCustomStyles,
} from "../utility/selectCustomStyle";

const FormikSelectWithIcon = (props) => {
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
    // icon
  } = props;
  const { Option } = components;
  const IconOption = (props) => (
    <Option {...props}>
      <div className="w-100 d-flex align-items-center">
        <div className="p-0 m-0">
          <p className="mr-1 formikSelect-icon">{props.data.icon}</p>
        </div>
        <div className="p-0 m-0">
          <p className="formikSelect-icon-label">{props.data.label}</p>
        </div>
      </div>
    </Option>
  );

  let styles = null;
  if (styleMode === "medium") {
    styles = customStyles;
  } else if (styleMode === "large") {
    styles = customStylesLarge;
  }

  return (
    <div className="form-container">
      <div
        className="formik-select-wrapper"
        ref={target}
        onFocus={() => setIsFocusForm(true)}
        onBlur={() => setIsFocusForm(false)}
      >
        {label && <label> {label} </label>}
        <Select
          isDisabled={isDisabled ? true : false}
          isClearable={true}
          onChange={onChange}
          options={options || []}
          value={value || ""}
          isSearchable={true}
          name={name}
          styles={styles}
          placeholder={placeholder}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
          })}
          onFocus={() => setIsFocusForm(true)}
          onBlur={() => setIsFocusForm(true)}
          menuPosition={menuPosition}
          components={{ Option: IconOption }}
          {...props}
        />
        {setClear && (
          <i
            className="fa fa-times-circle select-cross-icon"
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

export default FormikSelectWithIcon;

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
