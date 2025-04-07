import { Popover } from "@mui/material";
import React from "react";
import PopoverHistory from "../../monthlyOffdayAssign/components/PopoverHistory";
import profileImg from "../../../../../assets/images/profile.jpg";

export const EmpOffDayDetails = ({
  idHistory,
  openHistory,
  anchorElHistory,
  setAnchorElHistory,
  selectedSingleEmployee,
  setOffDayHistory,
  offDayHistory,
}) => {
  return (
    <Popover
      sx={{
        "& .MuiPaper-root": {
          width: "600px",
          minHeight: "200px",
          borderRadius: "4px",
        },
      }}
      id={idHistory}
      open={openHistory}
      anchorEl={anchorElHistory}
      onClose={() => {
        setAnchorElHistory(null);
      }}
      anchorOrigin={{
        // vertical: "bottom",
        horizontal: "middle",
      }}
    >
      <PopoverHistory
        propsObj={{
          selectedSingleEmployee,
          profileImg,
          offDayHistory,
          setOffDayHistory,
        }}
      />
    </Popover>
  );
};
