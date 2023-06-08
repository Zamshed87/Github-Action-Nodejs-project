/* eslint-disable no-unused-vars */
import { Popover } from "@mui/material";

const PopoverCom = ({ propsObj, children }) => {
  const { customStyleObj, id, open, anchorEl, setAnchorEl } = propsObj;
  return (
    <Popover
      sx={{
        "& .MuiPaper-root": {
          width: "542px",
          // minHeight: "250px",
          height: "250px",
          borderRadius: "4px",
          overflow: "auto",
        },
      }}
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      {children}
    </Popover>
  );
};

export default PopoverCom;
