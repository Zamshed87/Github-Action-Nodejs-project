import React from "react";
import Chips from "../../../../common/Chips";
import AttachmentIcon from "@mui/icons-material/Attachment";

const GrievanceTableBodySelf = ({ item, rowData, setRowData, index }) => {
  return (
    <>
      <td className="pl-3 tableBody-title text-center">
        <div>{index + 1}</div>
      </td>
      <td>
        <div className=" justify-content-start tableBody-title">
          {item?.title}
        </div>
      </td>
      <td>
        <div className="tableBody-title" style={{ width: "200px" }}>
          {item?.subject}
        </div>
      </td>
      <td style={{ width: "320px" }}>
        <div className=" justify-content-start tableBody-title">
          {item?.des}
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center justify-content-start tableBody-title">
          <div style={{ color: "#009cde", cursor: "pointer" }}>
            <AttachmentIcon sx={{ fontSize: "20px" }} />
            <span> </span>
            {item?.document}
          </div>
        </div>
      </td>
      <td>
        <div className=" justify-content-start tableBody-title">
          {item?.date}
        </div>
      </td>
      <td>
        <div className=" d-flex align-items-center justify-content-center tableBody-title">
          <div>
            {item?.status === "Pending" && (
              <Chips label="Pending" classess="warning" />
            )}
            {item?.status === "Closed" && (
              <Chips label="Closed" classess="success" />
            )}
            {item?.status === "In Review" && (
              <Chips label="In Review" classess="danger" />
            )}
          </div>
        </div>
      </td>
    </>
  );
};

export default GrievanceTableBodySelf;
