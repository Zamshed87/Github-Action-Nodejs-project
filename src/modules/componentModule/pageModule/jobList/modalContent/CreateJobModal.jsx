import React, { useState } from "react";
import IStepper from "../../../../../common/IStepper";
import PrimaryButton from "../../../../../common/PrimaryButton";
import StepFour from "./StepFour";
import StepOne from "./StepOne";
import StepThree from "./StepThree";
import StepTwo from "./StepTwo";

export default function CreateJobModal({
  setShowModal,
  values,
  setFieldValue,
  errors,
  touched,
}) {
  const [currentStep, setCurrentStep] = useState(0);

  const [data, setData] = useState([
    {
      className: "active",
      label: "Basic Information",
    },
    {
      className: "",
      label: "Job Summary",
    },
    {
      className: "",
      label: "Job Application Form",
    },
    {
      className: "",
      label: "Interview Pipeline",
    },
  ]);

  const stepComp = () => {
    if (currentStep === 0) {
      return (
        <StepOne
          values={values}
          errors={errors}
          touched={touched}
          setFieldValue={setFieldValue}
        />
      );
    } else if (currentStep === 1) {
      return <StepTwo />;
    } else if (currentStep === 2) {
      return <StepThree />;
    } else if (currentStep === 3) {
      return <StepFour />;
    }
  };

  const stepChanger = (status) => {
    let newData = [...data];

    if (status === "Next") {
      if (currentStep === 3) return "";

      newData[currentStep].className = "completed";
      newData[currentStep + 1].className = "active";
      setData(newData);
      setCurrentStep(currentStep + 1);
    } else {
      if (currentStep === 0) return "";
      if (currentStep > 1) {
        newData[currentStep - 2].className = "completed";
      }
      newData[currentStep - 1].className = "active";
      newData[currentStep].className = "";
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="create-modal-body-wrapper">
      <div className="create-modal-body-head">
        <IStepper data={data} />
      </div>
      <div className="create-modal-inner-body">
        <div className="create-modal-inner-body-content">{stepComp()}</div>
      </div>
      <div className="create-modal-body-footer">
        <div>
          <PrimaryButton
            type="button"
            className="btn btn-default btn-gray flex-center"
            label="Cancel"
            onClick={() => {
              setShowModal(false);
            }}
          />
        </div>
        <div className="flex-center">
          <PrimaryButton
            type="button"
            className="btn btn-default btn-gray flex-center"
            label="prev"
            onClick={() => {
              stepChanger("Prev");
            }}
          />
          <PrimaryButton
            type="button"
            className="btn btn-default flex-center"
            label="next"
            onClick={() => {
              stepChanger("Next");
            }}
          />
        </div>
      </div>
    </div>
  );
}
