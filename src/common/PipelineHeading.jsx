import React from "react";

const PipelineHeading = ({ title, text, stageText, icon }) => {
  return (
    <div className="d-flex justify-content-between pipeline-heading">
      <div className="d-flex align-items-center">
        <div className="icon">{icon()}</div>
        <div>
          <h4>{title}</h4>
          <p>{text}</p>
        </div>
      </div>
      {stageText && <div className="stage">{stageText}</div>}
    </div>
  );
};

export default PipelineHeading;
