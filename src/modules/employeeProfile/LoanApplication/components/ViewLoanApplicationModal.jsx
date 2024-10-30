import React from "react";
import { Avatar } from "@mui/material";
import {
  AccountBalanceWallet,
  AttachFile,
  Attachment,
  Dns,
  Edit,
  InsertComment,
  MarkunreadMailbox,
  Receipt,
  Today,
} from "@mui/icons-material";
import "../application.css";
import { useDispatch } from "react-redux";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { getDownlloadFileView_Action } from "../../../../commonRedux/auth/actions";
import { APIUrl } from "../../../../App";
import DemoImg from "../../../../assets/images/bigDemo.png";

const ViewLoanApplicationModal = ({ setView, singleData, setShow, intProfileImageUrl }) => {
  console.log("intProfileImageUrl", intProfileImageUrl);
  console.log("singleData",singleData)
  const dispatch = useDispatch();
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
                <img
                  src={
                    intProfileImageUrl
                      ? `${APIUrl}/Document/DownloadFile?id=${intProfileImageUrl}`
                      : DemoImg
                  }
                  alt="Profile"
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="ml-3">
                <h6 className="title-item-name">
                  {singleData?.employee?.label} [{singleData?.employee?.code}]
                </h6>
                <p className="subtitle-p">{singleData?.employee?.position}</p>
                <p className="subtitle-p">{singleData?.employee?.department}</p>
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
                  <MarkunreadMailbox sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
                </Avatar>
              </div>
              <div>
                <h6 className="title-item-name">{singleData?.loanType?.label}</h6>
                <p className="subtitle-p">Loan Type</p>
              </div>
            </div>
            <div
              className="d-flex align-items-center py-1"
              style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
            >
              <div style={{ marginRight: "17px" }}>
                <Avatar sx={avatarSx}>
                  <Today sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
                </Avatar>
              </div>
              <div>
                <h6 className="title-item-name">{dateFormatter(singleData?.insertDateTime)}</h6>
                <p className="subtitle-p">Application Date</p>
              </div>
            </div>
            <div
              className="d-flex align-items-center py-1"
              style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
            >
              <div style={{ marginRight: "17px" }}>
                <Avatar sx={avatarSx}>
                  <AccountBalanceWallet sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
                </Avatar>
              </div>
              <div>
                <h6 className="title-item-name">BDT {singleData?.loanAmount}</h6>
                <p className="subtitle-p">Loan Amount</p>
              </div>
            </div>
            <div
              className="d-flex align-items-center py-1"
              style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
            >
              <div style={{ marginRight: "17px" }}>
                <Avatar sx={avatarSx}>
                  <Receipt sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
                </Avatar>
              </div>
              <div>
                <h6 className="title-item-name">BDT {singleData?.amountPerInstallment}</h6>
                <p className="subtitle-p">Installment Amount</p>
              </div>
            </div>
            <div
              className="d-flex align-items-center py-1"
              style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
            >
              <div style={{ marginRight: "17px" }}>
                <Avatar sx={avatarSx}>
                  <Dns sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
                </Avatar>
              </div>
              <div>
                <h6 className="title-item-name">{singleData?.installmentNumber}</h6>
                <p className="subtitle-p">Installment Number</p>
              </div>
            </div>
            <div
              className="d-flex align-items-center py-1"
              style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
            >
              <div style={{ marginRight: "17px" }}>
                <Avatar sx={avatarSx}>
                  <InsertComment sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
                </Avatar>
              </div>
              <div>
                <h6 className="title-item-name" >
                  {singleData?.description}
                </h6>
                <p className="subtitle-p">Purpose</p>
              </div>
            </div>
            <div
              className="d-flex align-items-center py-1"
              style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
            >
              <div style={{ marginRight: "17px" }}>
                <Avatar sx={avatarSx}>
                  <AttachFile sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
                </Avatar>
              </div>
              <div
                className="pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(getDownlloadFileView_Action(singleData?.fileUrl));
                }}
              >
                <h6 className="title-item-name" style={{ color: "#009CDE" }}> {singleData?.fileUrl ? <Attachment /> : ""}</h6>
                <p className="subtitle-p">File</p>
              </div>
            </div>
            <div
              className="d-flex align-items-center py-1"
              style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
            >
              <div style={{ marginRight: "17px" }}>
                <Avatar sx={avatarSx}>
                  <Today sx={{ color: "rgba(0, 0, 0, 0.6)" }} />
                </Avatar>
              </div>
              <div>
                <h6 className="title-item-name">{singleData?.effectiveDate}</h6>
                <p className="subtitle-p">Effective Date</p>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer view-modal-footer">
          <div>
            {
              singleData?.status === "Pending" &&
              <button
                onClick={(e) => {
                  setView(false);
                  setShow(true);
                }}
                className="modal-btn modal-btn-edit"
              >
                <Edit sx={{ marginRight: "13px", fontSize: "16px" }} />
                Edit
              </button>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewLoanApplicationModal;
