import React from "react";
import WorkExperience from "./WorkExperience";
import "./styles.css";
const Experience = ({ tabIndex, index, empId, buId, wgId, getProgress }) => {
  return (
    index === tabIndex && (
      <div className="common-overview-part">
        <div className="common-overview-content">
          <WorkExperience
            empId={empId}
            wgId={wgId}
            buId={buId}
            getProgress={getProgress}
          />
        </div>
      </div>
    )
  );
};

export default Experience;
