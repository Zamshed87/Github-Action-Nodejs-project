import { EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import React from "react";
import { toast } from "react-toastify";
import Chips from "../../../../common/Chips";
import { gray600 } from "../../../../utility/customColor";

const TableItem = ({
  intWorkplaceId,
  strWorkplace,
  strWorkplaceCode,
  strWorkplaceGroup,
  strBusinessUnit,
  isActive,
  setIsFormModal,
  setEditId,
  index,
  item,
  setIsDetailsModal,
  permission,
}) => {
  return (
    <tr
      className="hasEvent"
      onClick={(e) => {
        e.stopPropagation();
        if (!permission?.isEdit) return toast.warn("You don't have permission");
        setIsDetailsModal(true);
        setEditId(item?.intWorkplaceId);
      }}
      key={index}
    >
      <td>
        <div className="content tableBody-title pl-1">{index + 1}</div>
      </td>
      <td>
        <div className="content tableBody-title">{strWorkplace}</div>
      </td>
      <td>
        <div className="content tableBody-title">{strWorkplaceCode}</div>
      </td>
      <td>
        <div className="content tableBody-title">{strWorkplaceGroup}</div>
      </td>
      <td>
        <div className="content tableBody-title">{strBusinessUnit}</div>
      </td>
      <td>
        <div className="content tableBody-title">
          <Chips
            label={isActive ? "Active" : "Inactive"}
            classess={isActive ? "success" : "danger"}
          />
        </div>
      </td>
      <td className="action-td">
        <Tooltip title="Edit" arrow>
          <button
            className="iconButton content tableBody-title"
            onClick={(e) => {
              if (!permission?.isEdit)
                return toast.warn("You don't have permission");
              e.stopPropagation();
              setEditId(intWorkplaceId);
              setIsFormModal(true);
            }}
          >
            <EditOutlined sx={{ color: gray600 }} />
          </button>
        </Tooltip>
      </td>
    </tr>
  );
};

export default TableItem;
