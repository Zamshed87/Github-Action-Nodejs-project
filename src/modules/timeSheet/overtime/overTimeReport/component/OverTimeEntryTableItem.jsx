import React from "react";
import AvatarComponent from "../../../../../common/AvatarComponent";


const OverTimeReportTableItem = ({ item }) => {
  return (
    <>
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
            <div className="">
              {item?.employee}
            </div>
          </div>
        </div>
      </td>
      <td>{item?.designation}</td>
      <td>{item?.department}</td>
      <td>{item?.employementType}</td>
      <td className="text-center">{item?.salary} </td>
      <td className="text-center">{item?.basicSalary} </td>
      <td className="text-center">{item?.hours} </td>
      <td className="text-center">{item?.perHourRate} </td>
      {/* <td>
        <Tooltip title="Print" arrow>
          <button
            className="edit-button"
            style={{
              border: "1px solid rgba(166, 159, 161, 0.5)",
              width: "25px",
              height: "25px",
              background: "#fff",
              borderRadius: "100px",
              marginRight: "20px",
            }}
          >
            <LocalPrintshopOutlinedIcon
              sx={{ color: "#637381" }}
              onClick={(e) => {
                setSingleData(item);
                setCreateModal(true);
              }}
            />
          </button>
        </Tooltip>
      </td> */}
    </>
  );
};

export default OverTimeReportTableItem;
