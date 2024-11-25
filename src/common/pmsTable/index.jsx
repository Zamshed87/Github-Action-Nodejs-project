import React from "react";
import "./styles.css";

// please dont change anything in this file as it is a common component and used in multiple places
const PmsCentralTable = (props) => {
  return (
    <table className="pmsCentralTableClass">
      <tr>
        {props?.header?.map((item) => (
          <th style={item?.style}>{item?.name}</th>
        ))}
      </tr>
      {props.children}
    </table>
  );
};

export default PmsCentralTable;
