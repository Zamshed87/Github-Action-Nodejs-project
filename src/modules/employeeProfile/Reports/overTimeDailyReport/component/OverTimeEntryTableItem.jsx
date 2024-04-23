import React from "react";
import AvatarComponent from "../../../../../common/AvatarComponent";
import { numberWithCommas } from "../../../../../utility/numberWithCommas";

const OverTimeReportTableItem = ({ item, index }) => {
  return (
    <>
      <td style={{ width: "30px" }}>{index + 1}</td>
      <td>
        <div className="tableBody-title">{item?.employeeCode}</div>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <div className="emp-avatar">
            <AvatarComponent
              classess=""
              letterCount={1}
              label={item?.employee}
            />
          </div>
          <div className="ml-2">
            <div className="tableBody-title">{item?.employee}</div>
          </div>
        </div>
      </td>
      <td>
        <div className="tableBody-title">{item?.designation}</div>
      </td>
      <td>
        <div className="tableBody-title">{item?.department}</div>
      </td>
      <td>
        <div className="tableBody-title">{item?.employementType}</div>
      </td>
      <td className="text-center">
        <div className="tableBody-title">{item?.salary}</div>
      </td>
      <td className="text-center">
        <div className="tableBody-title">{item?.basicSalary}</div>
      </td>
      <td className="text-center">
        <div className="tableBody-title">{item?.hours}</div>
      </td>
      <td className="text-right">
        <div className="tableBody-title">{item?.perHourRate}</div>
      </td>
      <td className="text-right">
        <div className="tableBody-title">
          {numberWithCommas(item?.payAmount)}
        </div>
      </td>
    </>
  );
};

export default OverTimeReportTableItem;
