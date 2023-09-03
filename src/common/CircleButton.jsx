import React from 'react';
import { IconButton } from '@mui/material';

export default function CircleButton({ icon, title, subTitle }) {
  return (
    <>
      <div className="circle-button">
        <IconButton className="circle-button-icon">
          {icon}
        </IconButton>
        <div className="circle-button-txt">
          <h2>{title || "-"}</h2>
          <p>{subTitle}</p>
        </div>
      </div>
    </>
  );
}
