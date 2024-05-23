import GroupsIcon from "@mui/icons-material/Groups";
import SettingsIcon from "@mui/icons-material/Settings";
import { IconButton } from "@mui/material";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getDownlloadFileView_Action } from "../../commonRedux/auth/actions";

const NotiBodyContent = ({ content, orgId, buId, handleClose, setLoading }) => {
  const dispatch = useDispatch();
  const { notifyDetails, module, timeDifference, notificationMaster, isSeen } =
    content;

  return (
    <>
      <div
        className={
          isSeen
            ? `notification-popover-body-main-content`
            : `notification-popover-body-main-content unseen`
        }
        style={{
          cursor: "pointer",
          borderBottom: "1px solid #D0D5DD",
          width: "346px",
        }}
        onClick={(e) => {
          if (notificationMaster?.strFeature === "leave_application") {
            const win = window.open("/approval/leaveApproval", "_blank");
            win.focus();
          }
          if (notificationMaster?.strFeature === "movement_application") {
            const win = window.open("/approval/movementApproval", "_blank");
            win.focus();
          }
          if (notificationMaster?.strFeature === "policy") {
            // const win = window.open("/administration/policyUpload", "_blank");
            // win.focus();
            const policyFileUrl = async () => {
              try {
                let { data } = await axios.get(
                  `/SaasMasterData/GetUploadedPolicyById?AccountId=${orgId}&BusinessUnitId=${buId}&PolicyId=${notificationMaster?.intFeatureTableAutoId}`
                );
                if (data?.intPolicyFileUrlId) {
                  const callback = () => {
                    handleClose();
                  };
                  dispatch(
                    getDownlloadFileView_Action(
                      data?.intPolicyFileUrlId,
                      false,
                      callback,
                      setLoading
                    )
                  );
                }
              } catch (error) {
                toast.error("Something went wrong!");
              }
            };
            policyFileUrl();
          }
        }}
      >
        <div className="d-flex">
          <div>
            <div className="notification-popover-body-main-content-avatar">
              <IconButton
                className="circle-button-icon"
                style={{ height: "40px", width: "40px" }}
              >
                {notificationMaster?.strModule === "Employee Management" && (
                  <GroupsIcon></GroupsIcon>
                )}
                {notificationMaster?.strFeature === "policy" && (
                  <SettingsIcon></SettingsIcon>
                )}
              </IconButton>
            </div>
          </div>
          <div>
            {/* <div className="notification-popover-body-main-content-title"> */}

            <div className="notification-body-header">
              <div className="d-flex justify-content-between ">
                <h6>{module?.toUpperCase() || ""}</h6>
                <h6>
                  {timeDifference === "now"
                    ? timeDifference
                    : `${timeDifference}`}
                </h6>
              </div>
              <div>
                <span>{notifyDetails || ""}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotiBodyContent;
