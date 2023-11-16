import React from "react";
import "./style.scss";
type PCardType = { className: string; children: React.ReactNode };
export const PCard: React.FC<PCardType> = ({ className, children }) => {
  return (
    <div className={`PeopleDeskCardWrapper ${className ? className : ""}`}>
      <>{children}</>
    </div>
  );
};
export { PCardHeader } from "./CardHeader/PCardHeader";
export { PCardBody } from "./CardBody/PCardBody";
