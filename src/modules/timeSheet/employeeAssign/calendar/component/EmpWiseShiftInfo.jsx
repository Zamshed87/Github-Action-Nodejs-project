import { Clear } from "@mui/icons-material";
import { IconButton, Popover } from "@mui/material";
import moment from "moment";
import React from "react";
import { gray900 } from "utility/customColor";
import Calender from "./Calender";
import NoResult from "common/NoResult";

export const EmpWiseShiftInfo = ({
  id2,
  open2,
  anchorEl2,
  setAnchorEl2,
  setSingleShiftData,
  singleShiftData,
  uniqueShiftColor,
  uniqueShiftBg,
  uniqueShift,
}) => {
  return (
    <Popover
      sx={{
        "& .MuiPaper-root": {
          width: "675px",
          minHeight: "200px",
          borderRadius: "4px",
        },
      }}
      id={id2}
      open={open2}
      anchorEl={anchorEl2}
      onClose={() => {
        setAnchorEl2(null);
      }}
      anchorOrigin={{
        horizontal: "center",
        vertical: "bottom",
      }}
    >
      <div
        className="master-filter-modal-container employeeProfile-src-filter-main"
        style={{ height: "auto" }}
      >
        <div className="master-filter-header employeeProfile-src-filter-header">
          <div></div>
          <IconButton
            onClick={() => {
              setAnchorEl2(null);
              setSingleShiftData([]);
            }}
          >
            <Clear sx={{ fontSize: "18px", color: gray900 }} />
          </IconButton>
        </div>
        <hr />

        {singleShiftData?.length > 0 ? (
          <>
            <h6 className="ml-3 fs-1 text-center">
              {" "}
              {moment().format("MMMM")}-{moment().format("YYYY")}
            </h6>

            <div
              className="body-employeeProfile-master-filter d-flex"
              style={{ height: "380px" }}
            >
              <div className="row ml-3  my-2">
                <Calender
                  monthYear={moment().format("YYYY-MM")}
                  singleShiftData={singleShiftData}
                  uniqueShiftColor={uniqueShiftColor}
                  uniqueShiftBg={uniqueShiftBg}
                />
              </div>
            </div>
          </>
        ) : (
          <NoResult title="No Result Found" para="" />
        )}

        <div className=" mt-2 mb-3 d-flex justify-content-around">
          {uniqueShift.length > 0 &&
            uniqueShift.map((item, index) => (
              <div key={index} className="text-center">
                {/* <p style={getChipStyleShift(item)}>{`${item} Shift `}</p> */}
                <p
                  style={{
                    borderRadius: "99px",
                    fontSize: "14px",
                    padding: "2px 5px",
                    fontWeight: 500,
                    color: `${uniqueShiftColor[item]}`,
                    backgroundColor: `${uniqueShiftBg[item]}`,
                  }}
                >{`${item} Shift `}</p>
              </div>
            ))}
        </div>
      </div>
    </Popover>
  );
};
