import React from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Chips from "../../../../common/Chips";
import { toast } from "react-toastify";
import { Tooltip } from "@mui/material";
import { getDesignationById } from "../helper";

const DesignationTableItem = ({
  strDesignation,
  isActive,
  setOpen,
  setSingleData,
  item,
  setViewModal,
  permission,
  index,
  setLoading
}) => {
  return (
    <tr
      className="hasEvent"
      onClick={(e) => {
        if (!permission?.isEdit) return toast.warn("You don't have permission");
        setViewModal(true);
        getDesignationById(item?.intDesignationId, setSingleData, setLoading);
      }}
      key={index}
    >
      <td>
        <div className="content tableBody-title pl-1">{index + 1}</div>
      </td>
      <td>
        <div className="content tableBody-title">{strDesignation}</div>
      </td>
      <td>
        <div className="content tableBody-title">
          <Chips
            label={isActive ? "Active" : "Inactive"}
            classess={`${isActive ? "success" : "danger"} p-2`}
          />
        </div>
      </td>
      <td>
        <Tooltip title="Edit" arrow>
          <button className="iconButton content tableBody-title">
            <EditOutlinedIcon
              sx={{ color: "#637381" }}
              onClick={(e) => {
                if (!permission?.isEdit)
                  return toast.warn("You don't have permission");
                e.stopPropagation();
                setOpen(true);
                getDesignationById(item?.intDesignationId, setSingleData, setLoading);
              }}
            />
          </button>
        </Tooltip>
      </td>
    </tr>
  );
};

export default DesignationTableItem;
