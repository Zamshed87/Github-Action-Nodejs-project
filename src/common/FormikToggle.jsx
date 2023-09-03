import React from "react";
import { FormControlLabel, Switch } from "@mui/material";

function FormikToggle(props) {
  return (
    <>
      <FormControlLabel
        label={props?.label ? props?.label : ""}
        control={
          <Switch
            onChange={props?.onChange}
            checked={props?.checked ? props?.checked : false}
            name={props?.name ? props?.name : ""}
            disabled={props?.disabled ? props?.disabled : false}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: props?.color,
                "&.Mui-disabled": {
                  color: props?.color,
                  opacity: 0.38,
                },
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: props?.color,
              },
              "& .MuiSwitch-thumb": {
                color: `${props?.color}!important`,
              },
            }}
          />
        }
        {...props}
      />
    </>
  );
}

export default FormikToggle;

/*
   <FormikToggle
      name="toggleTwo"
      label="Two"
      color={blueColor}
      checked={values?.toggleTwo}
      onChange={(e) => {
         setFieldValue("toggleTwo", e.target.checked);
      }}
      disabled={true}
   />
*/
