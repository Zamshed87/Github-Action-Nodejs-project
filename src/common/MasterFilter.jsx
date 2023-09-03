import { Clear, Search, TuneSharp } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import * as React from "react";

export default function MasterFilter({
  isHiddenFilter,
  handleClick,
  value,
  setValue,
  cancelHandler,
  width,
  inputWidth,
  withoutFrontIcon,
  styles,
  placeholder
}) {
  return (
    <div
      style={{
        width: width || "420px",
        borderRadius: "4px",
        marginRight: styles?.marginRight || "10px",
        display: "flex",
        height: "32px",
      }}
      component="form"
      className="search-form-input"
    >
      {!withoutFrontIcon && (
        <IconButton
          type="submit"
          sx={{
            "&.MuiButtonBase-root": {
              padding: "8px !important",
              "&:hover": {
                backgroundColor: "transparent",
              },
              "&:focus": {
                backgroundColor: "transparent",
              },
            },
          }}
          aria-label="search"
          onClick={(e)=> e.preventDefault()}
        >
          <Search sx={{ fontSize: "16px", color: "#323232" }} />
        </IconButton>
      )}
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
          width: inputWidth || 300,
          "&.MuiInputBase-root": {
            fontSize: "14px",
            marginLeft: "0px",
          },
        }}
        placeholder={placeholder ? placeholder : "Search"}
        inputProps={{ "aria-label": "search" }}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            setValue(e.target.value);
          }
        }}
      />
      {(value?.length || 0) > 0 && (
        <span
          style={{ display: "flex", alignItems: "center", marginRight: "5px" }}
          className="pointer"
          onClick={() => cancelHandler()}
        >
          <IconButton>
            <Clear
              sx={{
                "&.MuiSvgIcon-root": {
                  fontSize: "14px",
                },
              }}
            />
          </IconButton>
        </span>
      )}

      {!isHiddenFilter && (
        <IconButton
          sx={{
            "&.MuiButtonBase-root": {
              padding: "8px !important",
              "&:hover": {
                backgroundColor: "transparent",
              },
              "&:focus": {
                backgroundColor: "transparent",
              },
            },
          }}
          aria-label="menu"
          onClick={(e) => {
            handleClick(e);
          }}
        >
          <TuneSharp sx={{ fontSize: "16px", color: "#323232" }} />
        </IconButton>
      )}
    </div>
  );
}
