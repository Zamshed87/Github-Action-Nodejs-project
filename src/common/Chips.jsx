import ClearIcon from "@mui/icons-material/Clear";
import { IconButton } from "@mui/material";
import React from "react";

export default function Chips(props) {
  return (
    <>
      <div
        className={`chips ${props?.classess ? props?.classess : ""}`}
        onClick={props?.onClick}
        {...props}
      >
        {props.label}{" "}
        {props?.isDeleteClick && (
          <IconButton onClick={props?.isDeleteClick} sx={{ padding: "0px", margin:"0px" }}> 
            <ClearIcon sx={{ fontSize: "12px" }} />
          </IconButton>
        )}
      </div>
    </>
  );
}

/*
   Usage
   <Chips label="Busy" status={false} classes="mx-2" />
*/
