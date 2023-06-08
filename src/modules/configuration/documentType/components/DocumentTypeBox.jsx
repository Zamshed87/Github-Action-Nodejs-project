import React from "react";
import { ModeEditOutlineOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import { Tooltip } from "@mui/material";
import Chips from "../../../../common/Chips";

const DocumentTypeBox = ({
  intDocumentTypeId,
  strDocumentType,
  isActive,
  setOpen,
  setId,
  permission,
  setViewModal,
  index
}) => {
  return (
    <tr
      className="hasEvent"
      onClick={(e) => {
        e.stopPropagation();
        if (!permission?.isEdit)
          return toast.warn(
            "You don't have permission"
          );
        setViewModal(true);
        setId(intDocumentTypeId);
      }}
    >
      <td width="30px" >
        <span className="pl-1">
          {index + 1}
        </span>
      </td>
      <td>
        <div className="content tableBody-title">{strDocumentType}</div>
      </td>
      <td>
        <div>
          <Chips
            label={isActive ? "Active" : "Inactive"}
            classess={`${isActive ? "success" : "danger"}`}
          />
        </div>
      </td>
      <td>
        <Tooltip title="Edit" arrow>
          <button
            className="iconButton"
            onClick={(e) => {
              if (!permission?.isEdit) return toast.warn("You don't have permission")
              e.stopPropagation();
              setOpen(true);
              setId(intDocumentTypeId);
            }}
          >
            <ModeEditOutlineOutlined sx={{ fontSize: "20px" }} />
          </button>
        </Tooltip>
      </td>
    </tr>
  );
};

export default DocumentTypeBox;
