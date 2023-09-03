import React from "react";
// import FormikError from "./login/FormikError";
import TextField from "@mui/material/TextField";

const DatePickerBorderLess = ({ value, onChange, label, name, type, isCustomStyle, customStyle, minDate, isDisabled }) => {
  const inputStyle = {
    borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
    borderRadius: "0px",
    width: "100%",
    "& .css-cio0x1-MuiInputBase-root-MuiFilledInput-root": {
      // backgroundColor: "#fff",
    },
    "& .css-cio0x1-MuiInputBase-root-MuiFilledInput-root:hover": {
      // backgroundColor: "#fff",
    },

    "& div input": {
      color: !value && "transparent",
      padding: "10px 10px",
    },
    ".css-cio0x1-MuiInputBase-root-MuiFilledInput-root:hover:not(.Mui-disabled):before": {
      borderBottom: "none",
    },

    ".css-cio0x1-MuiInputBase-root-MuiFilledInput-root.Mui-disabled:before": {
      borderBottomStyle: "none",
    },
    ".css-cio0x1-MuiInputBase-root-MuiFilledInput-root.Mui-focused:after": {
      transform: "scaleX(0)",
    },
    "& div::before": {
      border: "none",
    },
    "& div.Mui-focused input": {
      // color: "rgba(0, 0, 0, 0.87)",
    },
    "& label": {
      top: "2px",
    },
    "& .MuiInputLabel-shrink": {
      top: "-8px",
    },
    "& .MuiInputLabel-root": {
      fontSize: "12px",
    },
    "& .MuiFilledInput-input": {
      fontSize: "12px",
    },
  };
  return (
    <div className="form-container">
      <TextField
        sx={isCustomStyle ? { ...inputStyle, customStyle } : inputStyle}
        id="filled-basic"
        type={type || "date"}
        label={value ? "" : label}
        value={value}
        onChange={onChange}
        placeholder=""
        name={name}
        variant="filled"
        InputProps={{ inputProps: minDate && { min: minDate } }}
        disabled={isDisabled ? true : false}
      />
      {/* <FormikError errors={errors} touched={touched} name={name} /> */}
    </div>
  );
};

export default DatePickerBorderLess;
