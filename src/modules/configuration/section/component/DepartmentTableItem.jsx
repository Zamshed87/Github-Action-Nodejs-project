import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Chips from "../../../../common/Chips";
import { toast } from "react-toastify";
import { Tooltip } from "@mui/material";

const DepartmentTableItem = ({
  strDepartment,
  strDepartmentCode,
  strParentDepName,
  strBusinessUnit,
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
      <td width="30px">
        <span className="content tableBody-title pl-1">{index + 1}</span>
      </td>
      <td>
        <div className="content tableBody-title">{strDepartment} [ {strDepartmentCode} ] </div>
      </td>
      <td>
        <div className="content tableBody-title"> {strParentDepName}</div>
      </td>
      <td>
        <div className="content tableBody-title"> {strBusinessUnit}</div>
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
                setSingleData(item);
              }}
            />
          </button>
        </Tooltip>
      </td>
    </tr>
  );
};

export default DepartmentTableItem;
