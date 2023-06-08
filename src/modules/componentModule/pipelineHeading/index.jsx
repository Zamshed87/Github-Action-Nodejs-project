import React from "react";
import PipelineHeading from "../../../common/PipelineHeading";
import SettingsInputAntennaIcon from "@mui/icons-material/SettingsInputAntenna";
import AssignmentIcon from '@mui/icons-material/Assignment';


const Heading = () => {

  return (
    <div>
      <PipelineHeading
        title="CV Sortlist & Hire"
        text="Select the required actions for cv sortlist and Select offer letter
            templet the candidate you want to hire."
        icon={() => <SettingsInputAntennaIcon />}
      />
      <PipelineHeading
        title="Assessment"
        text="Select the required actions for evaluating candidates. Set schedule, location, and examiner."
        stageText="Stage 1"
        icon={() => <AssignmentIcon />}
      />
      <PipelineHeading
        title="Viva"
        text="Select the required actions for evaluating candidates."
        stageText="Stage 2"
        icon={() => <AssignmentIcon />}
      />
    </div>
  );
};

export default Heading;
