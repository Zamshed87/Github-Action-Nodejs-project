import GroupsIcon from "@mui/icons-material/Groups";
import SettingsIcon from "@mui/icons-material/Settings";
import { IconButton } from "@mui/material";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getDownlloadFileView_Action } from "../../commonRedux/auth/actions";
import { setNotificationMarkAsSeenAPI } from "./helper";

const NotiBodyContent = ({
  content = {},
  orgId,
  buId,
  handleClose,
  setLoading,
  data,
  setData,
  employeeId,
}) => {
  const dispatch = useDispatch();
  // const { notifyDetails, module, timeDifference, notificationMaster, isSeen } =
  //   content;

  const {
    strModule,
    strFeature,
    intFeatureTableAutoId,
    isSeenRealTimeNotify,
    timeDifference,
    notification,
  } = content || {};

  return (
    <>
      <div
        className={
          isSeenRealTimeNotify
            ? `notification-popover-body-main-content`
            : `notification-popover-body-main-content unseen`
        }
        style={{
          cursor: "pointer",
          borderBottom: "1px solid #D0D5DD",
          width: "346px",
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!isSeenRealTimeNotify) {
            setNotificationMarkAsSeenAPI({
              notificationId: content?.intId,
              employeeId: employeeId,
              accountId: orgId,
              rowDto: data,
              setter: setData,
            });
          }
          if (strFeature === "leave_application") {
            const win = window.open("/approval/leaveApproval", "_blank");
            win.focus();
          }
          if (strFeature === "movement_application") {
            const win = window.open("/approval/movementApproval", "_blank");
            win.focus();
          }
          if (strFeature === "policy" && intFeatureTableAutoId) {
            // const win = window.open("/administration/policyUpload", "_blank");
            // win.focus();
            const policyFileUrl = async () => {
              try {
                const { data } = await axios.get(
                  `/SaasMasterData/GetUploadedPolicyById?AccountId=${orgId}&BusinessUnitId=${buId}&PolicyId=${intFeatureTableAutoId}`
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
                {strModule === "Employee Management" && (
                  <GroupsIcon></GroupsIcon>
                )}
                {strFeature === "policy" && <SettingsIcon></SettingsIcon>}
              </IconButton>
            </div>
          </div>
          <div>
            {/* <div className="notification-popover-body-main-content-title"> */}

            <div className="notification-body-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="d-flex justify-content-between ">
                    <h6
                      style={{
                        fontWeight: !isSeenRealTimeNotify ? "bold" : "normal",
                      }}
                    >
                      {strModule?.toUpperCase() || ""}
                    </h6>
                    <h6>
                      {timeDifference === "now"
                        ? timeDifference
                        : `${timeDifference}`}
                    </h6>
                  </div>
                  <div>
                    <span>{notification?.strRealTimeNotifyDetails || ""}</span>
                  </div>
                </div>
                {!isSeenRealTimeNotify && (
                  <div>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "#5bcb4f",
                        padding: "5px",
                        marginTop: "5px",
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotiBodyContent;
