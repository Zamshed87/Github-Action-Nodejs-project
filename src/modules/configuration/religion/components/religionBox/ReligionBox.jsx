import React from "react";
import Chips from "../../../../../common/Chips";

const ReligionBox = ({ strReligion, intReligionId, isActive, index, setViewModal, setId }) => {
  return (
    <tr
      className="hasEvent"
      onClick={(e) => {
        e.stopPropagation();
        setViewModal(true);
        setId(intReligionId);
      }}
    >
      <td width="30px" >
        <span className="pl-1">
          {index + 1}
        </span>
      </td>
      <td>
        <div className="content tableBody-title">{strReligion}</div>
      </td>
      <td>
        <div className="text-center">
          <Chips
            label={isActive ? "Active" : "Inactive"}
            classess={`${isActive ? "success" : "danger"}`}
          />
        </div>
      </td>
    </tr>
  );
};

export default ReligionBox;
