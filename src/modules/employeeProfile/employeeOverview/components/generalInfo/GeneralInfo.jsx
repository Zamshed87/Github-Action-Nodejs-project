import React from "react";
import MaritalStatus from "./maritalInfo";
import BloodGroup from "./bloodInfo";
import "../../employeeOverview.css";
import EmpSignature from "./empSignature";

function GeneralInfo({ index, tabIndex, empId, wgId, buId, getProgress }) {
  return (
    index === tabIndex && (
      <>
        <div className="common-overview-part">
          <div className="common-overview-content">
            <MaritalStatus
              empId={empId}
              wgId={wgId}
              buId={buId}
              getProgress={getProgress}
            />
            <BloodGroup
              empId={empId}
              wgId={wgId}
              buId={buId}
              getProgress={getProgress}
            />
            <EmpSignature
              empId={empId}
              wgId={wgId}
              buId={buId}
              getProgress={getProgress}
            />
          </div>
        </div>
      </>
    )
  );
}

export default GeneralInfo;
