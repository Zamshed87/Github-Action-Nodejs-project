import React from "react";
import { Avatar } from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import LabelOffIcon from "@mui/icons-material/LabelOff";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DateRangeIcon from '@mui/icons-material/DateRange';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { Edit } from "@mui/icons-material";

const ViewRewardAndPunishmentModal = ({ setViewModal, setShow, handleCloseModal }) => {
  const avatarSx = {
    background: "#F2F2F7",
    "&": {
      height: "30px",
      width: "30px",
    },
    "& .MuiSvgIcon-root": {
      fontSize: "16px",
    },
  };
  return (
    <>
      <div className="view-application-modal">
        <div className="modal-body2">
          <div className="modal-header2">
            <div className="d-flex align-items-center">
              <div>
                <Avatar
                  alt=""
                  src="/static/images/avatar/1.jpg"
                  className="avatar-icon"
                />
              </div>
              <div className="ml-3">
                <h6 className="title-item-name">Md. Kamal Hassan Rifat</h6>
                <p className="subtitle-p">Business Analyst, Full Time</p>
                <p className="subtitle-p">Engineering</p>
              </div>
            </div>
          </div>
          <div className="modal-main-body">
            <div
              className="d-flex align-items-center py-1 "
              style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
            >
              <div style={{ marginRight: "17px" }}>
                <Avatar sx={avatarSx}>
                  <LightbulbIcon sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
                </Avatar>
              </div>
              <div>
                <h6 className="title-item-name">Bad Behaviour</h6>
                <p className="subtitle-p"> Type</p>
              </div>
            </div>
            <div
              className="d-flex align-items-center py-1"
              style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
            >
              <div style={{ marginRight: "17px" }}>
                <Avatar sx={avatarSx}>
                  <LabelOffIcon sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
                </Avatar>
              </div>
              <div>
                <h6 className="title-item-name">Suspended</h6>
                <p className="subtitle-p">Action Taken</p>
              </div>
            </div>
            <div
              className="d-flex align-items-center py-1"
              style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
            >
              <div style={{ marginRight: "17px" }}>
                <Avatar sx={avatarSx}>
                  <AssignmentIcon sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
                </Avatar>
              </div>
              <div>
                <h6 className="title-item-name">
                  In publishing and graphic design, Lorem ipsum is a placeholder
                  text commonly used to demonstrate the visual form of a
                  document or a typeface without relying on meaningful content.
                </h6>
                <p className="subtitle-p">Description</p>
              </div>
            </div>
            <div
              className="d-flex align-items-center py-1"
              style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
            >
              <div style={{ marginRight: "17px" }}>
                <Avatar sx={avatarSx}>
                  <DateRangeIcon sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
                </Avatar>
              </div>
              <div>
                <h6 className="title-item-name">
                  Dec 24, 2021
                </h6>
                <p className="subtitle-p">Effective Date</p>
              </div>
            </div>
            <div
              className="d-flex align-items-center py-1"
              style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
            >
              <div style={{ marginRight: "17px" }}>
                <Avatar sx={avatarSx}>
                  <DateRangeIcon sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
                </Avatar>
              </div>
              <div>
                <h6 className="title-item-name">
                  Feb 14, 2022
                </h6>
                <p className="subtitle-p"> End date</p>
              </div>
            </div>
            <div
              className="d-flex align-items-center py-1"
              style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
            >
              <div style={{ marginRight: "17px" }}>
                <Avatar sx={avatarSx}>
                  <AttachmentIcon sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
                </Avatar>
              </div>
              <div
                className="pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  /* dispatch(getDownlloadFileView_Action(singleData?.fileUrl)); */
                }}
              >
                <h6 className="title-item-name" style={{ color: "#009CDE" }}>
                  File.pdf
                </h6>
                <p className="subtitle-p">Attachment</p>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer view-modal-footer">
          <button
            onClick={(e) => {
              setViewModal(false);
            }}
            className="modal-btn modal-btn-edit"
          >
            <Edit sx={{ marginRight: "13px", fontSize: "16px" }} />
            Edit
          </button>

          <button
            className="modal-btn modal-btn-edit"
            onClick={() => {
               /* setView(false); */
               handleCloseModal();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewRewardAndPunishmentModal;
