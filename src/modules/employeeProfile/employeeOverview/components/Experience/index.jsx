import React from "react";
import TrainingDevelopment from "./TrainingDevelopment";
import WorkExperience from "./WorkExperience";
import "./styles.css";
const Experience = ({ tabIndex, index, empId, buId, wgId }) => {
  return (
    index === tabIndex && (
      <div className="common-overview-part">
        <div className="common-overview-content">
          <WorkExperience empId={empId} wgId={wgId} buId={buId} />
          <TrainingDevelopment empId={empId} wgId={wgId} buId={buId} />
        </div>
      </div>
    )
  );
};

export default Experience;
