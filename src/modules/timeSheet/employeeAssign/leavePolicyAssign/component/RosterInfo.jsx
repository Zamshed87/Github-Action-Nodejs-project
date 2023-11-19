import { InfoOutlined } from "@mui/icons-material";
import React, { useState } from "react";
import RoasterInfoPopover from "./RoasterInfoPopover";

export default function RoasterInfo({ item }) {
  // master filter
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const [singleData, setSingleData] = useState("");
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="d-flex justify-content-between">
      <InfoOutlined
        onClick={(e) => {
          setSingleData(item);
          handleClick(e);
        }}
      />

      {/* filer form */}
      <RoasterInfoPopover
        propsObj={{
          id,
          open,
          anchorEl,
          setAnchorEl,
          handleClose,
          item: singleData,
        }}
      />
    </div>
  );
}
