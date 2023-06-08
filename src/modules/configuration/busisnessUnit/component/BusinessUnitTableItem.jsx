import { EditOutlined } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import React from "react";
import { toast } from "react-toastify";
import { APIUrl } from "../../../../App";
import DemoImg from "../../../../assets/images/demo.png";
import Chips from "../../../../common/Chips";
import IConfirmModal from "../../../../common/IConfirmModal";
import { deleteBusinessUnit } from "../helper";

const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
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
const BusinessUnitTableItem = ({ propsObj, index }) => {
  const { item, setOpen, setViewModal, setImageFile, permission, setBusinessUnitId } = propsObj;
  // eslint-disable-next-line no-unused-vars
  const demoPopup = (cb) => {
    let confirmObject = {
      closeOnClickOutside: false,
      message: "Do you want to delete this business unit?",
      yesAlertFunc: () => {
        deleteBusinessUnit(item?.intBusinessUnitId, cb);
      },
      noAlertFunc: () => { },
    };
    IConfirmModal(confirmObject);
  };
  return (
    <tr
      className="hasEvent"
      onClick={(e) => {
        if (!permission?.isEdit) return toast.warn("You don't have permission");
        setViewModal(true);
        setBusinessUnitId(item?.intBusinessUnitId);
      }}
    >
      <td width="30px" > <span className="pl-1">
        {index + 1}
      </span> </td>
      <td>
        <div className="d-flex align-items-center">
          {item?.strLogoUrlId ? (
            <img
              src={`${APIUrl}/Document/DownloadFile?id=${item?.strLogoUrlId}`}
              alt="icon"
              style={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                objectFit: "contain",
              }}
            />
          ) : (
            <img
              src={DemoImg}
              alt="icon"
              style={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                objectFit: "contain",
              }}
            />
          )}
          <span className="tableBody-title ml-2">{item?.strBusinessUnit}</span>
        </div>
      </td>
      <td>
        <LightTooltip title={item?.strAddress} placement="top" arrow>
          <span className="content tableBody-title">{item?.strAddress}</span>
        </LightTooltip>
      </td>
      <td>
        <div className="content tableBody-title">{item?.strWebsiteUrl}</div>
      </td>
      <td>
        <div>
          <Chips label={item?.isActive ? "Active" : "Inactive"} classess={`${item?.isActive ? "success" : "danger"}`} />
        </div>
      </td>
      <td>
        <Tooltip title="Edit" arrow>
          <button
            className="iconButton"
            onClick={(e) => {
              if (!permission?.isEdit) return toast.warn("You don't have permission")
              e.stopPropagation();
              setOpen(true);
              setImageFile(item?.strLogoUrlId);
              setBusinessUnitId(item?.intBusinessUnitId);
            }}
          >
            <EditOutlined sx={{ fontSize: "20px" }} />
          </button>
        </Tooltip>
      </td>
      {/* <td>
        <div className="d-flex align-items-center">
          <button
            type="button"
            className="iconButton mt-0 mt-md-2 mt-lg-0"
            onClick={(e) => {
              e.stopPropagation();
              demoPopup(() => {
                getData();
              });
            }}
          >
            <DeleteOutlined />
          </button>
        </div>
      </td> */}
    </tr>
  );
};

export default BusinessUnitTableItem;
