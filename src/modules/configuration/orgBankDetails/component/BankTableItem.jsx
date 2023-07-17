import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Tooltip } from "@mui/material";
import React from "react";
import { toast } from "react-toastify";
import Chips from "../../../../common/Chips";
import "./bankTableItem.css";

const BankTableItem = ({
  strAccountName,
  strAccountNo,
  strBankWalletName,
  strBranchName,
  strDistrict,
  strRoutingNo,
  isActive,
  setOpen,
  setSingleData,
  item,
  setViewModal,
  permission,
  index,
}) => {
  return (
    <tr
      className="hasEvent"
      onClick={(e) => {
        if (!permission?.isEdit) return toast.warn("You don't have permission");
        setViewModal(true);
        setSingleData(item);
      }}
      key={index}
    >
      <td>
        <div className="content tableBody-title pl-1">{index + 1}</div>
      </td>

      <td>
        <div className="content tableBody-title">{strAccountName}</div>
      </td>
      <td>
        <div className="content tableBody-title">{strBankWalletName}</div>
      </td>
      <td>
        <div className="content tableBody-title">{strBranchName}</div>
      </td>
      <td>
        <div className="content tableBody-title">{strAccountNo}</div>
      </td>
      <td>
        <div className="content tableBody-title">{strRoutingNo}</div>
      </td>
      <td>
        <div className="content tableBody-title">{strDistrict}</div>
      </td>
      <td>
        <div className="text-center content tableBody-title">
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
                setSingleData(item);
              }}
            />
          </button>
        </Tooltip>
      </td>
    </tr>
  );
};

export default BankTableItem;
