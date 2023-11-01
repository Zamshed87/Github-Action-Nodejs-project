import { ModeEditOutlineOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import React from "react";
import { toast } from "react-toastify";
import Chips from "../../../../common/Chips";

const ExpenseTypeBox = ({
  intExpenseTypeId,
  strExpenseType,
  isActive,
  setOpen,
  setId,
  permission,
  index,
  setViewModal,
}) => {
  return (
    <tr
      className="hasEvent"
      onClick={(e) => {
        e.stopPropagation();
        if (!permission?.isEdit) return toast.warn("You don't have permission");
        setViewModal(true);
        setId(intExpenseTypeId);
      }}
    >
      <td width="30px">
        <span className="pl-1">{index + 1}</span>
      </td>
      <td>
        <div className="content tableBody-title">{strExpenseType}</div>
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
              setId(intExpenseTypeId);
            }}
          >
            <ModeEditOutlineOutlined sx={{ fontSize: "20px" }} />
          </button>
        </Tooltip>
      </td>
    </tr>
  );
};

export default ExpenseTypeBox;
