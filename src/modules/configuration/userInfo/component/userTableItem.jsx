import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import React from "react";
import Chips from "../../../../common/Chips";
import "./businessUnitTableItem.css";
// import { styled } from "@mui/material/styles";
// import { tooltipClasses } from "@mui/material/Tooltip";
// import Tooltip from "@mui/material/Tooltip";
import { Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import AvatarComponent from "../../../../common/AvatarComponent";

// const LightTooltip = styled(({ className, ...props }) => (
//   <Tooltip {...props} classes={{ popper: className }} />
// ))(({ theme }) => ({
//   [`& .${tooltipClasses.tooltip}`]: {
//     backgroundColor: "#009CDE",
//     color: "#fff",
//     boxShadow: theme.shadows[1],
//     fontSize: 11,
//   },
//   [`& .${tooltipClasses.arrow}`]: {
//     color: "#009CDE!important",
//   },
// }));

const UserTableItem = ({
  item,
  setSingelUser,
  strEmploymentType,
  strLoginId,
  EmployeeId,
  strEmployeeName,
  strEmployeeCode,
  strPersonalMobile,
  strCountry,
  userStatus,
  setOpen,
  setId,
  orgId,
  buId,
  setSingleData,
  setLoading,
  setViewModal,
  permission,
  index,
}) => {
  return (
    <tr
      className="hasEvent"
      onClick={(e) => {
        if (!permission?.isEdit) return toast.warn("You don't have permission");
        setSingelUser(item);
        setViewModal(true);
      }}
    >
      <td>
        <div className="content tableBody-title pl-1">{index + 1}</div>
      </td>
      <td>
        <div className="content tableBody-title pl-1">{strEmployeeCode}</div>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <div className="emp-avatar">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={strEmployeeName || ""}
            />
          </div>
          <div className="ml-2">
            <div className="tableBody-title">
              {strEmployeeName}
            </div>
          </div>
        </div>
      </td>
      <td>
        <div className="content tableBody-title">{strEmploymentType}</div>
      </td>
      <td>
        <div className="content tableBody-title">{strLoginId}</div>
      </td>
      <td>
        <div className="content tableBody-title">{strPersonalMobile}</div>
      </td>
      <td>
        <div className="text-center">
          <Chips
            label={userStatus ? "Active" : "Inactive"}
            classess={userStatus ? "success" : "danger"}
          />
        </div>
      </td>
      <td>
        <Tooltip title="Edit" arrow>
          <button className="iconButton">
            <EditOutlinedIcon
              sx={{ color: "#637381", fontSize: "20px" }}
              onClick={(e) => {
                if (!permission?.isEdit)
                  return toast.warn("You don't have permission");
                e.stopPropagation();
                setOpen(true);
                setSingelUser(item);
              }}
            />
          </button>
        </Tooltip>
      </td>
    </tr>
  );
};

export default UserTableItem;
