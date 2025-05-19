import { VisibilityOutlined } from "@mui/icons-material";
import { Tooltip } from "antd";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import React from "react";
import { useDispatch } from "react-redux";

const AttachmentShow = ({ intAttachmentId, label }) => {
  const dispatch = useDispatch();
  return (
    intAttachmentId && (
      <div style={{ marginLeft: "50px", display: "flex" }}>
        <p>{label}</p>

        <Tooltip title="Attachment View">
          {/* <button type="button" className="iconButton"> */}
          <VisibilityOutlined
            style={{
              cursor: "pointer",
              marginLeft: "10px",
              marginBottom: "6px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(getDownlloadFileView_Action(intAttachmentId));
            }}
          />
          {/* </button> */}
        </Tooltip>
      </div>
    )
  );
};

export default AttachmentShow;
