import React from "react";
import FormikError from "./login/FormikError";
import TextField from "@mui/material/TextField";

const FormikDatePicker = ({ value, onChange, label, name, isSmall, min, max, errors, touched, type }) => {
  const inputStyle = {
    border: "1px solid rgba(0, 0, 0, 0.2)",
    borderRadius: "4px",
    width: "100%",
    zIndex: "0",
    // input field style overide
    "& .MuiFilledInput-root": {
      backgroundColor: "#fff",
      border: "1px solid transparent ",
      height: `${isSmall ? "30px" : ""}`,
    },
    "& .MuiFilledInput-root:hover": {
      backgroundColor: "#fff",
    },
    "& .MuiFilledInput-root.Mui-focused": {
      backgroundColor: "#fff",
      boxShadow: "0px 0px 0px 3.2px rgba(74, 200, 240, 0.25)",
      border: "1px solid #4ac8f0 ",
    },
    "& .MuiFilledInput-root input": {
      color: !value && "transparent",
      padding: "16px",
      // paddingLeft: "10px",
      fontSize: "12px",
      // lineHeight: "24px",
    },
    ".MuiFilledInput-root:hover:not(.Mui-disabled):before": {
      borderBottom: "none",
    },
    ".MuiFilledInput-root.Mui-focused:after": {
      transform: "scaleX(0)",
    },
    "& div.Mui-focused input": {
      color: "rgba(0, 0, 0, 0.87)",
    },
    // label style overide
    "& .MuiInputLabel-root": {
      top: value && "-4px",
      left: "6px",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#4ac8f0",
      top: "-4px",
    },
    "& .MuiFilledInput-root::before": {
      border: "none",
    },
  };
  return (
    <div className="form-container">
      <TextField
        sx={inputStyle}
        id="filled-basic"
        type={type || "date"}
        label={value && !isSmall ? label : label}
        value={value}
        onChange={onChange}
        placeholder=""
        name={name}
        variant="filled"
        min={min}
        max ={max}
      />
      <FormikError errors={errors} touched={touched} name={name} />
    </div>
  );
};

export default FormikDatePicker;
