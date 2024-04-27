import { Cancel, CheckCircle } from "@mui/icons-material";
import MuiIcon from "./MuiIcon";
import { failColor, successColor } from "utility/customColor";

/* eslint-disable @typescript-eslint/no-empty-function */
const ApproveRejectComp = ({ props = {} }) => {
  const { className, onApprove = () => {}, onReject = () => {} } = props || {};
  return (
    <div className={className ? className : "ml-3"}>
      <div
        style={{
          width: "180px",
        }}
        className="custom-approve-reject-flex-btn"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div onClick={onApprove} className="d-flex justify-content-start align-items-center approval-btn-container-approve">
            <MuiIcon
              icon={
                <CheckCircle
                className="icon-approve"
                  sx={{
                    color: successColor,
                    width: "20px !important",
                    height: "33px !important",
                    fontSize: "20px !important",
                  }}
                />
              }
            />
            <button type="button" className="btn-approve">
              <span>Approve</span>
            </button>
          </div>
          <div onClick={onReject} className="d-flex justify-content-start align-items-center approval-btn-container-reject">
            <MuiIcon
              icon={
                <Cancel
                className="icon-reject"
                  sx={{
                    color: failColor,
                    width: "20px !important",
                    height: "33px !important",
                    fontSize: "20px !important",
                  }}
                />
              }
            />
            <button type="button" className="btn-reject">
              <span>Reject</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveRejectComp;
