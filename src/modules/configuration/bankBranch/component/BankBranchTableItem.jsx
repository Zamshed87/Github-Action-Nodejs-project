import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import Chips from "../../../../common/Chips";

const BankBranchTableItem = ({
  strBankBranchName,
  strBankBranchCode,
  strBankName,
  strBankCode,
  strDistrict,
  strBankBranchAddress,
  strRoutingNo,
  isActive,
  setOpen,
  item,
  permission,
  index,
  setId,
}) => {
  return (
    <tr key={index}>
      <td width="30px">
        <span className="content tableBody-title pl-1">{index + 1}</span>
      </td>
      <td>
        <div className="content tableBody-title">
          {strBankName} {strBankCode ? `[ ${strBankCode} ]` : ""}
        </div>
      </td>
      <td>
        <div className="content tableBody-title">
          {strBankBranchName}{" "}
          {strBankBranchCode ? `[ ${strBankBranchCode} ]` : ""}
        </div>
      </td>
      <td>
        <div className="content tableBody-title">
          {strDistrict ? strDistrict : "-"}
        </div>
      </td>
      <td>
        <div className="content tableBody-title">
          {strBankBranchAddress ? strBankBranchAddress : "-"}
        </div>
      </td>
      <td>
        <div className="content tableBody-title"> {strRoutingNo}</div>
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
                e.stopPropagation();
                if (!permission?.isEdit)
                  return toast.warn("You don't have permission");
                setOpen(true);
                setId(item?.intBankBranchId);
              }}
            />
          </button>
        </Tooltip>
      </td>
    </tr>
  );
};

export default BankBranchTableItem;
