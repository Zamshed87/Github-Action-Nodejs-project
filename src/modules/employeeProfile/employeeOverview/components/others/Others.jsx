import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import Biography from "./biography";
import Hobbies from "./hobbies";
import SocialMedia from "./socialMedia";
import VehicleInfo from "./vehicleInfo";

import "./others.css";
import Remarks from "./Remarks";
import SalaryType from "./salaryType";

function Others({ index, tabIndex, empId, buId, wgId }) {
  const { isOfficeAdmin, isSuperuser } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  return (
    index === tabIndex && (
      <>
        <div className="common-overview-part">
          <div className="common-overview-content">
            <Biography empId={empId} wgId={wgId} buId={buId} />
            <SocialMedia empId={empId} wgId={wgId} buId={buId} />
            <Hobbies empId={empId} wgId={wgId} buId={buId} />
            <VehicleInfo empId={empId} wgId={wgId} buId={buId} />
            {(isOfficeAdmin || isSuperuser) && (
              <Remarks empId={empId} wgId={wgId} buId={buId} />
            )}
            <SalaryType empId={empId} wgId={wgId} buId={buId} />
          </div>
        </div>
      </>
    )
  );
}

export default Others;
