import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { gray300, gray500, gray900, greenColor } from "../utility/customColor";

function FormikCheckBox(props) {
  return (
    <>
      <FormGroup
        sx={{
          display: 'inline-block',
        }}
      >
        <FormControlLabel
          sx={{
            "&.MuiFormControlLabel-root .MuiTypography-root": {
              fontSize: props.labelFontSize || "12px",
              color: props.labelColor || gray500,
              "&.Mui-disabled": {
                color: `${gray300}!important`,
                opacity: 1,
              },
            }
          }}
          control={
            <Checkbox
              name={props?.name}
              onChange={props?.onChange}
              checked={props?.checked ? props?.checked : false}
              disabled={props?.disabled ? props?.disabled : false}
              onClick={(e) => e.stopPropagation()}
              sx={{
                color: `${props?.styleObj?.color || props?.styleobj?.color || gray900}!important`,
                margin: props?.styleObj?.margin || props?.styleobj?.margin,
                width: props?.styleObj?.width || props?.styleobj?.width,
                height: props?.styleObj?.height || props?.styleobj?.height,
                padding: props?.styleObj?.padding || props?.styleobj?.padding,
                "&.Mui-checked": {
                  color: `${props?.styleObj?.checkedColor || props?.styleobj?.checkedColor || greenColor}!important`,
                },
                "&.MuiCheckbox-root": {
                  "&.Mui-disabled": {
                    color: `${gray300}!important`,
                    opacity: 1,
                  },
                  "&:hover": {
                    backgroundColor: "transparent",
                  }
                },
                "&.MuiCheckbox-root .MuiSvgIcon-root": {
                  height: props.height || "1em"
                }
              }}
            />
          }
          label={props?.label ? props?.label : ""}
        />
      </FormGroup>
    </>
  );
}

export default FormikCheckBox;

/*
   <FormikCheckBox
      styleObj={{
         margin: '0 auto!important',
         color: greenColor
      }}
      name="checkboxTwo"
      label="One"
      checked={values?.checkboxTwo}
      onChange={(e) => {
         setFieldValue("checkboxTwo", e.target.checked);
      }}
      disabled={true}
   />
*/
