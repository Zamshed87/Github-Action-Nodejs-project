import React from "react";
import "../style.scss";
type PCardBodyType = {
  children?: React.ReactNode;
  className?: string;
};
export const PCardBody: React.FC<PCardBodyType> = ({ children, className }) => {
  return (
    <>
      <div className={`peopleDeskCardBody ${className ? className : ""}`}>
        {children}
      </div>
    </>
  );
};
