import React from "react";
import { APIUrl } from "../../../../../App";
import { gray500 } from "../../../../../utility/customColor";
import demoUserIcon from "../../../../../assets/images/userIcon.svg";
import { shallowEqual, useSelector } from "react-redux";
const EmployeeSelfManagerList = ({
  intLineManagerImageUrlId,
  lineManager,
  intDottedSupervisorImageUrlId,
  dottedSupervisor,
  intSupervisorImageUrlId,
  supervisor,
}) => {
  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  return (
    <div className="employee-self-dashboard-manager-container">
      <div
        style={{
          height: "25%",
          display: "grid",
          placeItems: "center",
        }}
      >
        <h2 className="w-100" style={{ color: gray500, fontSize: "1rem" }}>
          My Manager
        </h2>
      </div>

      <div
        style={{ height: "75%" }}
        className="d-flex flex-column justify-content-between"
      >
        <div className="d-flex">
          <div className="employee-self-dashboard-manager-picture">
            <img
              className="rounded-circle"
              style={{ width: "35px", height: "35px" }}
              src={
                intSupervisorImageUrlId
                  ? `${APIUrl}/Document/DownloadFile?id=${intSupervisorImageUrlId}`
                  : demoUserIcon
              }
              alt=""
            />
          </div>
          <div className="employee-self-dashboard-manager-details">
            <p>{supervisor}</p>
            <p>{orgId === 10015 ? "Reporting Line" : "Supervisor"}</p>
          </div>
        </div>
        <div className="d-flex">
          <div className="employee-self-dashboard-manager-picture">
            <img
              className="rounded-circle"
              style={{ width: "35px", height: "35px" }}
              src={
                intDottedSupervisorImageUrlId
                  ? `${APIUrl}/Document/DownloadFile?id=${intDottedSupervisorImageUrlId}`
                  : demoUserIcon
              }
              alt=""
            />
          </div>
          <div className="employee-self-dashboard-manager-details">
            <p>{dottedSupervisor}</p>
            <p>
              {orgId === 10015 ? "Dotted Reporting Line" : "Dotted Supervisor"}
            </p>
          </div>
        </div>
        <div className="d-flex">
          <div className="employee-self-dashboard-manager-picture">
            <img
              style={{ width: "35px", height: "35px" }}
              className="rounded-circle"
              src={
                intLineManagerImageUrlId
                  ? `${APIUrl}/Document/DownloadFile?id=${intLineManagerImageUrlId}`
                  : demoUserIcon
              }
              alt=""
            />
          </div>
          <div className="employee-self-dashboard-manager-details">
            <p>{lineManager}</p>
            <p> {orgId === 10015 ? "Team Leader" : "Line Manager"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSelfManagerList;
