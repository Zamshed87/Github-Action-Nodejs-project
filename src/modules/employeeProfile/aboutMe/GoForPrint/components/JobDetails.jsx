import React from "react";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AvatarComponent from "../../../../../common/AvatarComponent";
import { shallowEqual, useSelector } from "react-redux";
import { gray700, gray900 } from "../../../../../utility/customColor";
import { APIUrl } from "../../../../../App";

const JobDetails = ({ empInfo }) => {
  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );
  return (
    <>
      <div className="accordion-item">
        <div className="accordion-heading">
          <div className="d-flex align-items-center">
            <BusinessCenterIcon
              sx={{ mr: "12px", fontSize: "16px", color: gray900 }}
            />
            <h3
              style={{
                color: gray700,
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: "600",
              }}
            >
              Job Details
            </h3>
          </div>
        </div>
        <div className="accordion-body">
          <div className="left">
            <p>
              Designation - <small>{empInfo?.strDesignation}</small>
            </p>
            <p>
              Service Length - <small>{empInfo?.strServiceLength}</small>
            </p>
            <p>
              Department - <small>{empInfo?.strDepartment}</small>
            </p>
          </div>
          <div className="right">
            <div className="right-item">
              <AvatarComponent
                classess="mx-2"
                isImage={true}
                img={`${APIUrl}/Document/DownloadFile?id=${empInfo?.intSupervisorImageUrlId}`}
                alt=""
              />
              <div
                style={{
                  marginLeft: "8px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p>{empInfo?.strSupervisorName}</p>
                <small>
                  {orgId === 10015
                    ? "Reporting Line"
                    : supervisor || "Supervisor"}
                </small>
              </div>
            </div>
            <div className="right-item">
              <AvatarComponent
                classess="mx-2"
                isImage={true}
                img={`${APIUrl}/Document/DownloadFile?id=${empInfo?.intLinemanagerImageUrlId}`}
                alt=""
              />
              <div
                style={{
                  marginLeft: "8px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p>{empInfo?.strLinemanager}</p>
                <small>
                  {orgId === 10015
                    ? "Team Leader"
                    : "Line Manager"}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetails;
