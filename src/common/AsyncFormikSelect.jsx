/* eslint-disable no-unused-vars */
import { useState } from "react";
import { components } from "react-select";
import AsyncSelect from "react-select/async";
import { customAutoStyles, customStyles, customStylesLarge } from "../utility/selectCustomStyle";

const AsyncFormikSelect = ({
  selectedValue,
  loadOptions,
  handleChange,
  isDisabled,
  setClear,
  name,
  placeholder,
  isSearchIcon,
  paddingRight,
  errors,
  touched,
  isMulti,
  styleMode,
  onChange
}) => {
  const [inputValue, setValue] = useState("");
  // const [selectedValue, setSelectedValue] = useState(null);

  // handle input change event
  const handleInputChange = (value) => {
    setValue(value);
  };

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <i style={{ fontSize: "14px" }} className="fa fa-search"></i>
      </components.DropdownIndicator>
    );
  };

  let styles = null;
  if (styleMode === "medium") {
    styles = customStyles;
  } else if (styleMode === "large") {
    styles = customStylesLarge;
  }

  return (
    <div className="form-container">
      <div className="formik-select-wrapper">
        {isMulti ? (
          <AsyncSelect
            isMulti
            cacheOptions
            defaultOptions
            name={name}
            value={selectedValue}
            loadOptions={loadOptions}
            onChange={onChange}
            styles={customAutoStyles}
            menuPosition="fixed"
            placeholder={placeholder ? placeholder : "Search (min 3 letter) "}
            isClearable={false}
          />
        ) : (
          <AsyncSelect
            menuPosition="fixed"
            isDisabled={isDisabled}
            isClearable={true}
            defaultOptions
            value={selectedValue}
            getOptionLabel={(e) => e?.label}
            getOptionValue={(e) => e?.value}
            components={isSearchIcon && { DropdownIndicator }}
            loadOptions={(inputValue) => loadOptions(inputValue)}
            onInputChange={handleInputChange}
            onChange={(valueOption) => handleChange(valueOption)}
            styles={styles || customStyles}
            placeholder={placeholder ? placeholder : "Search (min 3 letter) "}
          />
        )}

        {setClear && (
          <i
            className="fa fa-times-circle async-select-cross-icon"
            onClick={() => {
              setClear(name, "");
            }}
          ></i>
        )}
      </div>
    </div>
  );
};

export default AsyncFormikSelect;

/*
   Usage

   a. async Formik Select with label

      <AsyncFormikSelect
                                selectedValue={values?.userName}
                                isSearchIcon={true}
                                handleChange={(valueOption) => {
                                  setFieldValue("userName", valueOption);
                                }}
                                loadOptions={loadUserList}
                              />

*/
