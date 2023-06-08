import React, { useState } from "react";
import IStepper from "../../../../common/IStepper.jsx";

const CustomizedSteppers = () => {
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
      return <h3 className="mt-5">Step {1}</h3>;
    } else if (currentStep === 1) {
      return <h3 className="mt-5">Step {2}</h3>;
    } else if (currentStep === 2) {
      return <h3 className="mt-5">Step {3}</h3>;
    } else if (currentStep === 3) {
      return <h3 className="mt-5">Step {4}</h3>;
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
    <div>
      <IStepper data={data} />
      {stepComp()}
      <div className="mt-5">
        <button
          onClick={() => stepChanger("Prev")}
          className="mr-2 btn btn-primary"
        >
          Prev
        </button>
        <button onClick={() => stepChanger("Next")} className="btn btn-primary">
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomizedSteppers;
