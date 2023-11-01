import { ModeEditOutlineOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import React from "react";
import { toast } from "react-toastify";
import Chips from "../../../../../common/Chips";
const LeaveTypeTable = ({
  intLeaveTypeId,
  strLeaveType,
  strLeaveTypeCode,
  isActive,
  setOpen,
  setId,
  permission,
  index,
}) => {
  return (
    <tr
      className="hasEvent"
    >
      <td width="30px">
        <span className="pl-1">{index + 1}</span>
      </td>
      <td>
        <div className="content tableBody-title">{strLeaveType}</div>
      </td>
      <td>
        <div className="content tableBody-title">{strLeaveTypeCode}</div>
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
              if (!permission?.isEdit)
                return toast.warn("You don't have permission");
              e.stopPropagation();
              setOpen(true);
              setId(intLeaveTypeId);
            }}
          >
            <ModeEditOutlineOutlined sx={{ fontSize: "20px" }} />
          </button>
        </Tooltip>
      </td>
    </tr>
  );
};

export default LeaveTypeTable;
