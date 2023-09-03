import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import React from "react";
import { toast } from "react-toastify";
import Chips from "../../../../../common/Chips";
import "./tableItem.css";

const TableItem = ({
  statusType,
  setIsFormModal,
  setEditId,
  index,
  item,
  setViewModal,
  setIsDetailsModal,
  permission
}) => {
  const { strName, strDisplayName, isActive } = item;
  return (
    <tr className="hasEvent"
      onClick={() => {
        if (!permission?.isEdit) return toast.warn("You don't have permission")
        setIsDetailsModal(true);
        setEditId(item?.intPositionId);
      }}
      key={index}
    >
      <td className="tableBody-title text-center">{index + 1}</td>
      <td className="tableBody-title">{strName}</td>
      <td className="tableBody-title">{strDisplayName}</td>
      <td>
        <div className="text-center">
          <Chips
            label={isActive ? "Active" : "Inactive"}
            classess={`${isActive ? "success" : "danger"} p-2`}
          />
        </div>
      </td>
      <td>
        <button
          title="Edit"
          className="iconButton"
          onClick={(e) => {
            if (!permission?.isEdit) return toast.warn("You don't have permission")
            e.stopPropagation();
            setEditId(item?.intId);
            setIsFormModal(true);
          }}
        >
          <EditOutlinedIcon sx={{ color: "#637381" }} />
        </button>
      </td>
    </tr>
  );
};

export default TableItem;
