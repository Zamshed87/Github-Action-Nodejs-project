import React from "react";

const IStepper = ({ data }) => {
  return (
    <div className="stepper bg-white p-4">
      {data?.map((item, index) => (
        <div className={`stepper-section ${item?.className}`} key={index}>
          <div className="line"></div>
          <div className="info">
            <div className="icon"></div>
            <div className="text">{item?.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IStepper;
