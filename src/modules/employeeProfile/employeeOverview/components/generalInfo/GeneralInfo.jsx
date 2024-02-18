import React from "react";
import MaritalStatus from "./maritalInfo";
import BloodGroup from "./bloodInfo";
import "../../employeeOverview.css";
import EmpSignature from "./empSignature";

function GeneralInfo({ index, tabIndex, empId, wgId, buId }) {
  return (
    index === tabIndex && (
      <>
        <div className="common-overview-part">
          <div className="common-overview-content">
            <MaritalStatus empId={empId} wgId={wgId} buId={buId} />
            <BloodGroup empId={empId} wgId={wgId} buId={buId} />
            <EmpSignature empId={empId} wgId={wgId} buId={buId} />
          </div>
        </div>
      </>
    )
  );
}

export default GeneralInfo;
