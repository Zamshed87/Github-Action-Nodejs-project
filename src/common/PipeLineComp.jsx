import React from "react";

const PipeLineComp = (props) => {
  return (
    <div className="pipeline-comp">
      <div className="step">
        <div className="number">{props?.number}</div>
        <div className={`line ${props?.isLastLine && "last-line"}`}></div>
      </div>
      <div className="pipeline-card">{props.children}</div>
    </div>
  );
};

export default PipeLineComp;
