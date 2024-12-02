import React from "react";
import "./pmsCommonTable.css";

// this table is used in 27 places, before changing this table, please discuss with responsible person
const PmsCommonTable = (props) => {
  return (
    <table className="pmsCommonTable">
      <tr>
        {props?.ths?.map((item) => (
          <th style={item?.style}>{item?.name}</th>
        ))}
      </tr>
      {props.children}
    </table>
  );
};

export default PmsCommonTable;
