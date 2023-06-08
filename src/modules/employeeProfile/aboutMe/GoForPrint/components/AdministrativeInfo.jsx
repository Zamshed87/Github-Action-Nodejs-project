import React from "react";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import { gray700, gray900 } from "../../../../../utility/customColor";

const AdministrativeInfo = ({ empInfo }) => {
  return (
    <>
      <div className="accordion-item ">
        <div className="accordion-heading">
          <div className="d-flex align-items-center">
            <MarkunreadMailboxIcon sx={{ mr: "12px", fontSize: "16px", color: gray900 }} />
            <h3 style={{
              color: gray700,
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: "600",
            }}>
              Administrative Info
            </h3>
          </div>
        </div>
        <div className="accordion-body">
          <div className="left">
            <p>

              Business Unit - <small>{empInfo?.strBusinessUnitName || "N/A"}</small>
            </p>
            <p>
              Workplace Group - <small>{empInfo?.strWorkplaceGroupName || "N/A"}</small>
            </p>
            <p>
              Workplace - <small>{empInfo?.strWorkplaceName || "N/A"}</small>
            </p>
            <p>
              Payroll Group - <small>{empInfo?.PayrollGroup || "N/A"}</small>
            </p>
            <p>
              Payscale Grade - <small>{empInfo?.PayscaleGradeName || "N/A"}</small>
            </p>
            <p>
              Calendar Type - <small>{empInfo?.strCalenderType || "N/A"}</small>
            </p>
            <p>
              Calendar Name - <small>{empInfo?.strCalenderName || "N/A"}</small>
            </p>
            <p>
              Joining Date - <small>{dateFormatter(empInfo?.dteJoiningDate) || "N/A"}</small>
            </p>
            <p>
              Employment Type - <small>{empInfo?.strEmploymentType || "N/A"}</small>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdministrativeInfo;
