import React from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Chips from "../../../../common/Chips";
import { styled } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";
import Tooltip from "@mui/material/Tooltip";
import "./businessUnitTableItem.css";
import { toast } from "react-toastify";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#009CDE",
    color: "#fff",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#009CDE!important",
  },
}));

const BusinessUnitTableItem = ({
  SBUId,
  LogoURL,
  SBUName,
  BusinessUnitName,
  SBUAddress,
  Status,
  setOpen,
  setId,
  orgId,
  buId,
  setSingleData,
  setLoading,
  key,
  item,
  setViewModal,
  permission
}) => {
  return (
    <tr className="hasEvent"
      onClick={(e) => {
        if(!permission?.isEdit) return toast.warn("You don't have permission")
        setViewModal(true);
        setSingleData(item);
      }}
      key={key}
    >
      <td>
        {SBUName}
      </td>
      <td>
        {BusinessUnitName}
      </td>
      <td>
        <LightTooltip title={SBUAddress} placement="top" arrow>
          <span className="content tableBody-title">{SBUAddress?.slice(0, 31)}..</span>
        </LightTooltip>
      </td>
      <td>
        <div className="text-center">
          <Chips
            label={Status ? "Active" : "Inactive"}
            classess={`${Status ? "success" : "danger"}`}
          />
        </div>
      </td>
      <td>
        <button className="iconButton">
          <EditOutlinedIcon
            sx={{ color: "#637381", fontSize: "20px" }}
            onClick={(e) => {
              if(!permission?.isEdit) return toast.warn("You don't have permission")
              e.stopPropagation();
              setOpen(true);
              setSingleData(item);
            }}
          />
        </button>
      </td>
    </tr>
  );
};

export default BusinessUnitTableItem;
