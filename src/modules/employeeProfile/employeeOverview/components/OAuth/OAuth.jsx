import React from "react";
// import Emails from "./Gmail/index";
// import WorkEmail from "./WorkEmail/index";
// import Phone from "./Profile";
// import WorkPhone from "./WorkPhone";
// import Address from "./Address";
import "../../employeeOverview.css";
import FaceBook from "./Profile";
import Gmails from "./Gmail/index";

function OAuth({ index, tabIndex, empId }) {
  return (
    index === tabIndex && (
      <>
        <div className="common-overview-part">
          <div className="common-overview-content">
            <Gmails empId={empId} />
            <FaceBook empId={empId} />
          </div>
        </div>
      </>
    )
  );
}

export default OAuth;
