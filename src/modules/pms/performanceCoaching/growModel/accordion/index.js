/* eslint-disable no-unused-vars */
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useState } from "react";
import { APIUrl } from "../../../../../App";
import Loading from "../../../../../common/loading/Loading";
import { gray700, gray900 } from "../../../../../utility/customColor";

const Accordion = ({ empBasic }) => {
  const [isAccordion, setIsAccordion] = useState(false);
  const [loading, setLoading] = useState(false);

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
                {empBasic?.empEmployeePhotoIdentity ? (
                  <img
                    src={`${APIUrl}/Document/DownloadFile?id=${empBasic?.empEmployeePhotoIdentity?.intProfilePicFileUrlId}`}
                    alt=""
                    style={{ maxHeight: "78px", minWidth: "78px" }}
                  />
                ) : (
                  <img
                    src="http://localhost:3000/static/media/profile.a29e843a.jpg"
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
                {empBasic?.employeeProfileLandingView?.strEmployeeName}
                <span style={{ fontWeight: "400", color: gray700 }}>
                  [{empBasic?.employeeProfileLandingView?.strCardNumber}]
                </span>{" "}
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
                {empBasic?.employeeProfileLandingView?.strDepartment}
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
                {empBasic?.employeeProfileLandingView?.strDesignation}
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
                {empBasic?.employeeProfileLandingView?.strEmploymentType}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
