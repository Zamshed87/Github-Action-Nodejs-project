import React from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import PipelineHeading from "../../../../../common/PipelineHeading";
import SettingsInputAntennaIcon from "@mui/icons-material/SettingsInputAntenna";

const StepFour = () => {
  const interviewPipelineWrapperStyle = {};
  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
  };

  const titleStyle = {
    color: "rgba(0, 0, 0, 0.6)",
    padding: "42px 25px 69px 25px",
  };

  const buttonSectionStyle = {
    textAlign: "right",
    padding: "31px 52px 64px 31px",
  };

  const buttonStyle = {
    color: "#000000B2",
  };

  const cardStyle = {
    width: "958px",
    height: "363px",
    background: "#FFFFFF",
    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: "4px",
  };

  const bodyStyle = {};
  return (
    <div style={interviewPipelineWrapperStyle}>
      <div style={headerStyle}>
        <div>
          <h3 style={titleStyle}>Interview Pipeline</h3>
        </div>
        <div style={buttonSectionStyle}>
          <button>
            <span style={buttonStyle}>
              <RemoveRedEyeIcon />
            </span>
            <span>VIEW</span>
          </button>
        </div>
      </div>
      <div style={bodyStyle}>
        <div style={cardStyle}>
          <div>
          <PipelineHeading
        title="CV Sortlist & Hire"
        text="Select the required actions for cv sortlist and Select offer letter
            templet the candidate you want to hire."
        icon={() => <SettingsInputAntennaIcon />}
      />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepFour;
