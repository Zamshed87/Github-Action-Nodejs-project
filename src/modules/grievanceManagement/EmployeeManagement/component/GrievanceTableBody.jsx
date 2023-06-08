import React from "react";
import Chips from "../../../../common/Chips";
import AttachmentIcon from "@mui/icons-material/Attachment";
import AvatarComponent from "../../../../common/AvatarComponent";

const GrievanceTableBody = ({ item, rowData, setRowData, index }) => {
  return (
    <>
      <td style={{color: "rgba(0, 0, 0, 0.6)"}}>
        <div className="pl-3">{index + 1}</div>
      </td>
      <td>
        <div className="employeeInfo d-flex align-items-center justify-content-start">
          <AvatarComponent letterCount={1} label={item?.title} />
          <div className="ml-3">
            <b style={{ color: "rgba(0, 0, 0, 0.6)" }}>{item?.title}</b>
            <p className="content tableBody-title">{item?.position}</p>
            <p className="content tableBody-title">{item?.section}</p>
          </div>
        </div>
      </td>
      <td style={{ width: "200px" }}>
        <div className="d-flex align-items-center justify-content-start">
          <div className="employeeTitle">
            <p className="employeeName" style={{color: "rgba(0, 0, 0, 0.6)"}}>{item?.subject}</p>
          </div>
        </div>
      </td>
      <td style={{ width: "320px" }}>
        <div className="d-flex align-items-center justify-content-start">
          <div className="employeeTitle">
            <p className="employeeName" style={{ paddingRight: "30px", color: "rgba(0, 0, 0, 0.6)" }}>
              {item?.des}
            </p>
          </div>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center justify-content-start">
          <div style={{ color: "#009cde", cursor: "pointer" }}>
            <AttachmentIcon sx={{ fontSize: "20px" }} />
            <span> </span>
            {item?.document}
          </div>
        </div>
      </td>
      <td>
        <div className="d-flex mr-4 justify-content-end">
          <div className="employeeTitle " >
            <p className="employeeName" style={{color: "rgba(0, 0, 0, 0.6)"}}>{item?.date}</p>
          </div>
        </div>
      </td>
      <td>
        <div className=" d-flex align-items-center justify-content-start">
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

export default GrievanceTableBody;
