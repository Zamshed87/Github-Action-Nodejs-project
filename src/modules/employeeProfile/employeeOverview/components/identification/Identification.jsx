import React from "react";
import Nationality from "./nationality";
import Nid from "./nid";
import "./identification.css";
import Passport from "./passport";
import CardNo from "./cardNo";
import BirthCertificate from "./birthCertificate";
import DrivingLicense from "./drivingLicense";
import TinNo from "./tinNo";
function Identification({ index, tabIndex, empId, wgId, buId }) {
  return (
    index === tabIndex && (
      <>
        <div className="common-overview-part">
          <div className="common-overview-content">
            <Nid empId={empId} wgId={wgId} buId={buId} />
            <BirthCertificate empId={empId} wgId={wgId} buId={buId} />
            <Nationality empId={empId} wgId={wgId} buId={buId} />
            <Passport empId={empId} wgId={wgId} buId={buId} />
            <DrivingLicense empId={empId} wgId={wgId} buId={buId} />
            <TinNo empId={empId} wgId={wgId} buId={buId} />
            <CardNo empId={empId} wgId={wgId} buId={buId} />
          </div>
        </div>
      </>
    )
  );
}

export default Identification;
