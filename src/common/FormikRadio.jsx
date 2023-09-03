import React from "react";
import { FormControlLabel, Radio } from "@mui/material";
import { gray300, gray500, gray900, greenColor } from "../utility/customColor";

function FormikRadio(props) {
   return (
      <>
         <FormControlLabel
            label={props?.label ? props?.label : ""}
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
               <Radio
                  className="form-radio"
                  name={props?.name ? props?.name : ''}
                  value={props?.value ? props?.value : ''}
                  onChange={props?.onChange}
                  sx={{
                     color: `${props?.styleObj?.color || props?.styleobj?.color || gray900}!important`,
                     '&.MuiRadio-root': {
                        padding: props?.styleObj?.padding || props?.styleobj?.padding,
                        '&.Mui-checked': {
                           color: `${props?.styleObj?.checkedColor || props?.styleobj?.checkedColor || greenColor}!important`,
                           '&.Mui-disabled': {
                              color: `${gray300}!important`,
                              opacity: 1,
                           },
                        },
                        '& .MuiSvgIcon-root': {
                           width: props?.styleObj?.iconWidth || props?.styleobj?.iconWidth,
                           height: props?.styleObj?.icoHeight || props?.styleobj?.icoHeight,
                        }
                     }
                  }}
                  disabled={props?.disabled ? props?.disabled : false}
               />
            }
            {...props}
         />
      </>
   );
}

export default FormikRadio;

/*
   <FormikRadio
      name="gender"
      label="Female"
      value={"female"}
      color={greenColor}
      onChange={(e) => {
         setFieldValue("gender", e.target.value);
      }}
      checked={values?.gender === "female"}
      disabled={true}
   />
*/
