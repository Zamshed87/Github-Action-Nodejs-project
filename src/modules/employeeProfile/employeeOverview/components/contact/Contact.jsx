import React from "react";
import Emails from "./Email/index";
import WorkEmail from "./WorkEmail/index";
import Phone from "./Phone";
import WorkPhone from "./WorkPhone";
import Address from "./Address";
import "../../employeeOverview.css";

function Contact({ index, tabIndex, empId, wgId, buId, getProgress }) {
  return (
    index === tabIndex && (
      <>
        <div className="common-overview-part">
          <div className="common-overview-content">
            <Emails
              empId={empId}
              wgId={wgId}
              buId={buId}
              getProgress={getProgress}
            />
            <WorkEmail
              empId={empId}
              wgId={wgId}
              buId={buId}
              getProgress={getProgress}
            />
            <Phone
              empId={empId}
              wgId={wgId}
              buId={buId}
              getProgress={getProgress}
            />
            <WorkPhone
              empId={empId}
              wgId={wgId}
              buId={buId}
              getProgress={getProgress}
            />
            <Address
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

export default Contact;
