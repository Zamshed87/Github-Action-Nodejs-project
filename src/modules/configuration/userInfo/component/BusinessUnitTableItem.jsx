import React from "react";
import "./businessUnitTableItem.css";
import { Add } from "@mui/icons-material";
import FavButton from "../../../../common/FavButton";
import { gray900 } from "../../../../utility/customColor";

const BusinessUnitTableItem = ({
  item,
  setIsCreate,
  setSingelUser,
  EmployeeId,
  strEmployeeName,
  strDesignation,
  strDepartment,
  strEmployeeCode,
  strEmploymentType,
  setOpen,
  setId,
  orgId,
  buId,
  setSingleData,
  setLoading,
  setViewModal,
  index
}) => {
  return (
    <tr
      onClick={(e) => {
        setViewModal(true);
      }}
    >
      {/* <td></td> */}
      <td >
        <div className="content tableBody-title pl-1">{index + 1}</div>
      </td>
      <td className="">
        <span className="tableBody-title">{`${strEmployeeName}`}</span>
      </td>
      <td className="">
        <span className="tableBody-title">{`${strDesignation}`}</span>
      </td>
      <td className="">
        <span className="tableBody-title">{`${strDepartment}`}</span>
      </td>
      <td className="">
        <span className="tableBody-title">{`${strEmployeeCode}`}</span>
      </td>
      <td>
        <span className="tableBody-title">{strEmploymentType}</span>
      </td>
      <td>
        <FavButton
          icon={<Add sx={{ color: gray900, fontSize: "16px" }} />}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
            setSingelUser(item);
            setIsCreate(true);
          }}
        />
      </td>
    </tr>
  );
};

export default BusinessUnitTableItem;
