import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { APIUrl } from "../../App";

export default function DashboardHead() {
  const { intLogoUrlId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { firstLevelName } = useSelector(
    (state) => state?.localStorage,
    shallowEqual
  );

  const history = useHistory();

  const goHome = () => {
    history.push("/");
  };

  return (
    <div className="dashboard-head">
      <div className="container-fluid">
        <div className="d-flex">
          <div>
            <div
              style={{ zIndex: "999", marginTop: "10px" }}
              onClick={() => goHome()}
              className="company-logo pointer"
            >
              {intLogoUrlId ? (
                <img
                  src={`${APIUrl}/Document/DownloadFile?id=${intLogoUrlId}`}
                  alt="logo"
                />
              ) : (
                ""
              )}
            </div>
          </div>
          <div style={{ marginLeft: "210px" }}>
            <div>
              <h2>{firstLevelName}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
