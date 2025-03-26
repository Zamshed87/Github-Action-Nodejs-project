import { Popover } from "@mui/material";
import React from "react";
import PopoverCalender from "../../monthlyOffdayAssign/components/PopoverCalender";
import profileImg from "../../../../../assets/images/profile.jpg";

export const EmpOffDayCalendarView = ({
  id,
  open,
  anchorEl,
  setAnchorEl,
  selectedSingleEmployee,
  calendarData,
  setCalendarData,
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
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={() => {
        setAnchorEl(null);
      }}
      anchorOrigin={{
        // vertical: "bottom",
        horizontal: "middle",
      }}
    >
      <PopoverCalender
        propsObj={{
          selectedSingleEmployee,
          profileImg,
          calendarData,
          setCalendarData,
        }}
      />
    </Popover>
  );
};
