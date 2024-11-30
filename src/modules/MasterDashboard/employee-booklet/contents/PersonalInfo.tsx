import React, { forwardRef } from "react";

const PersonalInfo = forwardRef((props: any, ref: any) => {
  return (
    <div ref={ref} className="interactive">
      PersonalInfo {props?.id}
    </div>
  );
});

export default PersonalInfo;
