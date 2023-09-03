import React from "react";

import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";
import { flat } from './../utility/inputFlat';

const styles = makeStyles({
  root: {
    "& .MuiFilledInput-root": {
      background: "transparent"
    },
    "& label.MuiInputLabel-root": {
      paddingLeft: "45px",
      top: "4px",
      "&.MuiInputLabel-shrink": {
        paddingLeft: "0px",
        top: "1px",
      },
      "&.Mui-focused": {
        top: "-6px",
        "&.css-1kty9di-MuiFormLabel-root-MuiInputLabel-root": {
          transform: "translate(14px, 0px) scale(0.75)!important",
        }
      },
    },

    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: "#000",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#1084F1",
      },
      "& .MuiOutlinedInput-input": {
        padding: "0px",
        height: "64px",
        display: 'flex',
        alignItems: "center",
        paddingLeft: "60px",
        "&::focus": {
          background: "transparent!important",
        },

      },
      "& .PrivateNotchedOutline-legendLabelled-4": {
        height: "0",
      }

    },
    "& .css-186xcr5": {

    }
  },
});

const AuthInput = ({
  placeholder,
  value,
  name,
  type,
  disabled,
  label,
  multiline,
  // rowsMax,
  rows,
  autoComplete,
  errors,
  touched,
  onChange,
  onBlur,
  errorsKey,
  className,
  min,
  max,
}) => {
  const flattenError = flat(errors);
  const flattenTouched = flat(touched);
  const classes = styles();

  return (
    <>
      <TextField
        fullWidth
        variant="outlined"
        margin="normal"
        label={label}
        value={value}
        name={name}
        multiline={multiline}
        rows={rows}
        // rowsMax={rowsMax}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        autoComplete={autoComplete}
        onChange={onChange}
        error={
          flattenTouched[name] && flattenError[name]
            ? flattenError[name]
            : false
        }
        helperText={
          flattenTouched[name] && flattenError[name] ? flattenError[name] : ""
        }
        onBlur={onBlur}
        className={classes.root}
        min={min}
        max={max}
        InputLabelProps={{
          style: {
            // textOverflow: 'ellipsis',
            // whiteSpace: 'nowrap',
            // overflow: 'hidden',
            // color: '#A69FA1',
          }
        }}
      />
    </>
  );
};

export default AuthInput;
