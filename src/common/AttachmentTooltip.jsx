import React from "react";
import { Tooltip } from "antd";
import { Attachment } from "@mui/icons-material";

/**
 * Props:
 * - strDocumentList: string, comma-separated attachment IDs, e.g. "1452,2587"
 * - onClickAttachment: function(id:number), called when user clicks on an attachment item
 */
const AttachmentTooltip = ({ strDocumentList, onClickAttachment }) => {
  // Return null if strDocumentList is falsy or onClickAttachment is not provided
  if (!strDocumentList || typeof onClickAttachment !== 'function') return null;

  const ids = strDocumentList
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id !== "0" && id !== "");

  if (ids.length === 0) return null;

  const tooltipContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {ids.map((id) => (
        <span
          key={id}
          style={{
            color: "green",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
          onClick={(e) => {
            e.stopPropagation();
            // Safe call to onClickAttachment
            if (typeof onClickAttachment === 'function') {
              onClickAttachment(Number(id));
            }
          }}
        >
          <Attachment />
          <span style={{ marginLeft: 6 }}>Attachment {id}</span>
        </span>
      ))}
    </div>
  );

  return (
    <Tooltip title={tooltipContent} placement="bottom" color="#fff" overlayStyle={{ maxWidth: 200 }}>
      <span style={{ color: "green", cursor: "pointer", userSelect: "none" }}>
        Attachment
      </span>
    </Tooltip>
  );
};

export default AttachmentTooltip;
