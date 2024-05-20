import React from "react";
import "../style.scss";
type PCardBodyType = {
  children?: React.ReactNode;
  className?: string;
  styles?: any;
};
export const PCardBody: React.FC<PCardBodyType> = ({
  children,
  className,
  styles,
}) => {
  return (
    <>
      <div
        style={styles}
        className={`peopleDeskCardBody ${className ? className : ""}`}
      >
        {children}
      </div>
    </>
  );
};
