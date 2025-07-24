import React from "react";
import Nationality from "./nationality";
import Nid from "./nid";
import "./identification.css";
import Passport from "./passport";
import CardNo from "./cardNo";
import BirthCertificate from "./birthCertificate";
import DrivingLicense from "./drivingLicense";
import TinNo from "./tinNo";
function Identification({ index, tabIndex, empId, wgId, buId, getProgress }) {
  return (
    index === tabIndex && (
      <>
        <div className="common-overview-part">
          <div className="common-overview-content">
            <Nid
              empId={empId}
              wgId={wgId}
              buId={buId}
              getProgress={getProgress}
            />
            <BirthCertificate
              empId={empId}
              wgId={wgId}
              buId={buId}
              getProgress={getProgress}
            />
            <Nationality
              empId={empId}
              wgId={wgId}
              buId={buId}
              getProgress={getProgress}
            />
            <Passport
              empId={empId}
              wgId={wgId}
              buId={buId}
              getProgress={getProgress}
            />
            <DrivingLicense
              empId={empId}
              wgId={wgId}
              buId={buId}
              getProgress={getProgress}
            />
            <TinNo
              empId={empId}
              wgId={wgId}
              buId={buId}
              getProgress={getProgress}
            />
            <CardNo
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

export default Identification;
