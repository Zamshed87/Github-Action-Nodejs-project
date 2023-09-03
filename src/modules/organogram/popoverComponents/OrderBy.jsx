import { Clear } from "@mui/icons-material";
import React from "react";
import DragAndDropModule from "../components/Dnd";

const OrderBy = ({ setAnchorEl, setAnchorElForAction, childList, getData }) => {
  return (
    <div className="organugram_form_main">
      <div className="organugram_form_header pt-2">
        <h3>Order By</h3>
        <button
          onClick={() => {
            setAnchorElForAction(null);
            setAnchorEl(null);
          }}
          className="btn btn-cross"
        >
          <Clear sx={{ fontSize: "18px" }} />
        </button>
      </div>
      <hr className="m-0" />
      <div className="my-3 d-flex justify-content-center">
        <DragAndDropModule
          setAnchorElForAction={setAnchorElForAction}
          setAnchorEl={setAnchorEl}
          getData={getData}
          childList={childList}
        />
      </div>
    </div>
  );
};

export default OrderBy;
