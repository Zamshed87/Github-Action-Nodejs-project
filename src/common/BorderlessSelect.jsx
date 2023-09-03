/* eslint-disable no-unused-vars */
import { Close } from "@mui/icons-material";
import React, { useState, useRef } from "react";
import Select from "react-select";
import FormikError from "../common/login/FormikError";
import { customStyles, customStylesLarge } from "../utility/selectCustomStyle";

const BorderlessSelect = (props) => {
  const target = useRef(null);
  const [isFocusForm, setIsFocusForm] = useState(false);
  const { name, options, value, label, placeholder, errors, touched, onChange, setClear, styleMode, isDisabled, menuPosition } = props;

  // styleMode = "small" || "medium" || "large"

  let styles = null;
  if (styleMode === "medium") {
    styles = customStyles;
  } else if (styleMode === "large") {
    styles = customStylesLarge;
  }

  return (
    <div className="form-container">
      <div className="formik-select-wrapper" ref={target} onFocus={() => setIsFocusForm(true)} onBlur={() => setIsFocusForm(false)}>
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
          onBlur={() => setIsFocusForm(false)}
          menuPosition={menuPosition}
          {...props}
        />
        {setClear && (
          <span
            className="select-cross-icon"
            onClick={() => {
              setClear(name, "");
            }}
          >
            {value && <Close />}
          </span>
        )}
      </div>
      <FormikError errors={errors} name={name} touched={touched} />
    </div>
  );
};

export default BorderlessSelect;
