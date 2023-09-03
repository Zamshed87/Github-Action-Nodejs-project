import React from "react";
import { Clear, Search } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";

export default function FilterSearch({
   placeholder,
   value,
   setValue,
   cancelHandler,
   width,
   crossClassName
}) {
   return (
      <div
         style={{
            border: "1px solid #c4c4c4",
            width: width || "420px",
            borderRadius: "4px",
            marginRight: "10px",
            display: "flex",
            alignItems: "center",
            height: "56px"
         }}
         component='form'
      >
         <IconButton type='button'
            sx={{
               p: "8px",
               "&.MuiButtonBase-root": {
                  "&:hover": {
                     backgroundColor: 'transparent'
                  }
               },
               "&.MuiTouchRipple-root": {
                  "&:focuss": {
                     backgroundColor: 'transparent'
                  }
               }
            }}
            aria-label={placeholder ? placeholder : 'search'}
         >
            <Search />
         </IconButton>
         <InputBase
            sx={{ ml: 1, flex: 1, width: 300 }}
            placeholder={placeholder ? placeholder : 'Search'}
            inputProps={{ "aria-label": placeholder ? placeholder : "search" }}
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
         {(value.length || 0) > 0 && (
            <span
               className={crossClassName ? `pointer ${crossClassName}` : 'pointer'}
               onClick={() => cancelHandler()}
            >
               <Clear sx={{ fontSize: '18px' }} />
            </span>
         )}
      </div>
   );
}
