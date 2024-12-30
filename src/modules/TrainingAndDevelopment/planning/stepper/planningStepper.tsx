import { Steps } from "antd";
import React from "react";
import "./style.css";

const PlanningStepper = ({ planStep, onChangeStepper }: any) => {
  return (
    <div className="custom-stepper" id="planning-stepper">
      <Steps
        current={planStep === "STEP_ONE" ? 0 : planStep === "STEP_TWO" ? 1 : 2}
        onChange={onChangeStepper}
        items={[
          {
            title: "Training Basic Info.",
          },
          {
            title: "Training Cost/Trainer/Participant",
          },
          {
            title: "Training Scheduling Info.",
          },
        ]}
      />
    </div>
  );
};

export default PlanningStepper;
