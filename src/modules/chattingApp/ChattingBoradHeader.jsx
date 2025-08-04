import * as React from "react";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import profileImg from "../../assets/images/profile_avatar.png";

import { APIUrl } from "../../App";

const ChattingBoradHeader = ({ selectedUserForChat }) => {
  return (
    <Card style={{ borderRadius: 0 }}>
      <div className="container">
        <div className="d-flex">
          <div className="p-1">
            <Avatar
              alt="na"
              src={
                selectedUserForChat?.imgId > 0
                  ? `${APIUrl}/Document/DownloadFile?id=${selectedUserForChat?.imgId}`
                  : profileImg
              }
            />
          </div>
          <div className="p-1">
            <p>
              {selectedUserForChat?.name} <br></br>{" "}
              {selectedUserForChat != null ? "" : null}
            </p>
            {/* <p
              style={{ color: greenColor, fontWeight: "600", marginTop: "2px" }}
            >
              typing...
            </p> */}
          </div>
          <div className="ml-auto p-1">
            {/* <IconButton
              aria-label="cross"
              size="small"
              style={{ marginTop: "5px" }}
            >
              <SearchIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              aria-label="cross"
              size="small"
              style={{ marginTop: "5px" }}
            >
              <CallIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              aria-label="cross"
              size="small"
              style={{ marginTop: "5px" }}
            >
              <MoreVertIcon fontSize="inherit" />
            </IconButton> */}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChattingBoradHeader;
