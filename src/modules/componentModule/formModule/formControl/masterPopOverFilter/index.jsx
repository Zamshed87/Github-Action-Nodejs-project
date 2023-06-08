import { Clear } from "@mui/icons-material";
import { Popover } from "@mui/material";
import React from "react";
import MasterFilterTabs from "./masterFilterTabs";

const MasterPopOverFilter = ({ propsObj }) => {
  const { id, open, anchorEl, handleClose } = propsObj;
  return (
    <Popover
      sx={{
        "& .MuiPaper-root": {
          minWidth: "875px",
          height: "500px",
          borderRadius: "4px",
        },
      }}
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <div className="master-filter-modal-container">
        <div className="master-filter-header">
          <h3>Advance Filter</h3>
          <button onClick={(e) => handleClose()} className="btn btn-cross">
            <Clear sx={{ fontSize: "18px" }} />
          </button>
        </div>
        <hr />
        <MasterFilterTabs propsObj={propsObj} />
        <div className="master-filter-bottom">
          <div></div>
          <div className="master-filter-btn-group">
            <button
              type="button"
              className="btn btn-green btn-green-less"
              onClick={(e) => handleClose()}
              style={{
                marginRight: "10px",
              }}
            >
              Cancel
            </button>
            <button type="button" className="btn btn-green" onClick={() => {}}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </Popover>
  );
};

export default MasterPopOverFilter;
