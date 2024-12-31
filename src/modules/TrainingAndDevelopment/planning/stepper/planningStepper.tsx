import { Steps } from "antd";
import React from "react";
import "./style.css";
import {
  FieldTimeOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";

const PlanningStepper = ({ planStep, onChangeStepper }: any) => {
  return (
    <div className="custom-stepper" id="planning-stepper">
      <Steps
        current={planStep === "STEP_ONE" ? 0 : planStep === "STEP_TWO" ? 1 : 2}
        // onChange={onChangeStepper}
        items={[
          {
            title: "Training Basic Info.",
            icon: planStep !== "STEP_ONE" && <UserOutlined />,
          },
          {
            title: "Training Cost/Trainer/Participant",
            icon: planStep !== "STEP_TWO" && <SolutionOutlined />,
          },
          {
            title: "Training Scheduling Info.",
            icon: planStep !== "STEP_THREE" && <FieldTimeOutlined />,
          },
        ]}
      />
    </div>
  );
};

export default PlanningStepper;
