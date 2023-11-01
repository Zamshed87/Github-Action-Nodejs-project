import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useState } from "react";
import { APIUrl } from "../../../../App";
import profileImg from "../../../../assets/images/profile.jpg";
import Loading from "../../../../common/loading/Loading";
import { gray700, gray900 } from "../../../../utility/customColor";
import { dateFormatter } from "../../../../utility/dateFormatter";

const ProfileCard = ({ empBasic, loading }) => {
  const [isAccordion, setIsAccordion] = useState(false);

  return (
    <div className="card-about-info-main about-info-card">
      {loading && <Loading />}
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div>
            <div
              style={{
                width: empBasic > 0 ? empBasic && "auto" : "78px",
              }}
              className={
                empBasic > 0
                  ? empBasic && "add-image-about-info-card height-auto"
                  : "add-image-about-info-card"
              }
            >
              <label
                htmlFor="contained-button-file"
                className="label-add-image"
              >
                {empBasic?.strImageURL ? (
                  <img
                    src={`${APIUrl}/Document/DownloadFile?id=${empBasic?.strImageURL}`}
                    alt=""
                    height="78px"
                    width="78px"
                    style={{ height: "inherit" }}
                  />
                ) : (
                  <img
                    src={profileImg}
                    alt="iBOS"
                    height="78px"
                    width="78px"
                    style={{ height: "inherit" }}
                  />
                )}
              </label>
            </div>
          </div>

          <div className="content-about-info-card ml-3">
            <div className="d-flex justify-content-between">
              <h4 className="name-about-info" style={{ marginBottom: "5px" }}>
                {empBasic?.strEmployeeName}
              </h4>
            </div>
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Department -
                </small>{" "}
                {empBasic?.strDepartment || "N/A"}
              </p>
            </div>
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Designation -
                </small>{" "}
                {empBasic?.strDesignation || "N/A"}
              </p>
            </div>
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Employment Type -
                </small>{" "}
                {empBasic?.strEmploymentType || "N/A"}
              </p>
            </div>

            {isAccordion && (
              <>
                {" "}
                <div className="single-info">
                  <p
                    className="text-single-info"
                    style={{ fontWeight: "500", color: gray700 }}
                  >
                    <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                      Date Of Joining -
                    </small>{" "}
                    {dateFormatter(empBasic?.dteJoiningDate) || "N/A"}
                  </p>
                </div>
                <div className="single-info">
                  <p
                    className="text-single-info"
                    style={{ fontWeight: "500", color: gray700 }}
                  >
                    <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                      Work Length -
                    </small>{" "}
                    {empBasic?.strServiceLength || "N/A"}
                  </p>
                </div>
                <div className="single-info">
                  <p
                    className="text-single-info"
                    style={{ fontWeight: "500", color: gray700 }}
                  >
                    <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                      Shift -
                    </small>{" "}
                    {empBasic?.strCalenderName || "N/A"}
                  </p>
                </div>
                <div className="single-info">
                  <p
                    className="text-single-info"
                    style={{ fontWeight: "500", color: gray700 }}
                  >
                    <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                      Supervisor -
                    </small>{" "}
                    {empBasic?.strSupervisorName || "N/A"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div
          className="see-more-btn-main"
          style={{ marginTop: isAccordion ? "130px" : "70px" }}
        >
          <button
            type="button"
            className="btn-see-more"
            onClick={(e) => {
              setIsAccordion(!isAccordion);
              e.stopPropagation();
            }}
          >
            <small className="text-btn-see-more">
              {isAccordion ? "See Less" : "See More"}
            </small>
            {isAccordion ? (
              <ArrowDropUp
                sx={{
                  marginLeft: "10px",
                  fontSize: "20px",
                  color: gray900,
                  position: "relative",
                  top: "0px",
                }}
              />
            ) : (
              <ArrowDropDown
                sx={{
                  marginLeft: "10px",
                  fontSize: "20px",
                  color: gray900,
                  position: "relative",
                  top: "0px",
                }}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
