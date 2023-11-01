import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useHistory } from "react-router";
import { IconButton } from "@mui/material";
import { gray700, gray900 } from "../utility/customColor";

const BackButton = ({ title }) => {
  const history = useHistory();
  return (
    <div className="d-flex align-items-center justify-content-center back-button">
      <IconButton onClick={() => history.goBack()}>
        <ArrowBackIcon
          sx={{
            fontSize: "16px",
            color: gray900
          }}
        />
      </IconButton>
      <h3
        style={{
          color: gray700,
          display: "inline-block",
          fontSize: "13px",
          fontWeight: "700",
        }}
        className="ml-2"
      >
        {title}
      </h3>
    </div>
  );
};

export default BackButton;
