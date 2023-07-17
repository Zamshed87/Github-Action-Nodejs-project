import React from 'react';
import { LinearProgress } from "@mui/material";

export default function LineProgress(props) {
  return (
    <>
      <LinearProgress
        variant="determinate"
        value={props?.progress}
        sx={{
          "&.MuiLinearProgress-root": {
            backgroundColor: props?.styleObj?.backBackgroundColor,
            width: "100%",
            height: "6px",
            borderRadius: "4px",
            margin: props?.styleObj?.margin || 0,

            "& .MuiLinearProgress-bar": {
              backgroundColor: props?.styleObj?.frontBackgroundColor,
            },
          },
        }}
      />
    </>
  );
}
