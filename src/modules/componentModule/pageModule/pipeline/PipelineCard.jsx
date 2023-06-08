import React from "react";
import PipeLineComp from "../../../../common/PipeLineComp";

const data = [{}, {}];

const PipelineCard = () => {
  return (
    <div>
      {data?.map((item, index) => (
        <PipeLineComp key={index} number={index + 1} isLastLine={data?.length - 1 === index}>
          Card Text
        </PipeLineComp>
      ))}
    </div>
  );
};

export default PipelineCard;
