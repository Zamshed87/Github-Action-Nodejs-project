/* eslint-disable no-unused-vars */
import profileImg from "../../../../../assets/images/profile.jpg";
import { APIUrl } from "App";
import { gray700 } from "utility/customColor";

const EmployeeDetails = ({ empBasic }) => {
  return (
    <div className="p-2">
      <h3 className="pb-2">Employee Details</h3>
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
                {empBasic?.profilePicFileUrlId ? (
                  <img
                    src={`${APIUrl}/Document/DownloadFile?id=${empBasic?.profilePicFileUrlId}`}
                    alt=""
                    style={{ maxHeight: "78px", minWidth: "78px" }}
                  />
                ) : (
                  <img
                    src={profileImg}
                    alt="Peopledesk"
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
                {empBasic?.name}
                <span style={{ fontWeight: "400", color: gray700 }}>
                  [{empBasic?.code}]
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
                {empBasic?.department}
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
                {empBasic?.designation}
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
                {empBasic?.employmentType}
              </p>
            </div>
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Business Unit -
                </small>{" "}
                {empBasic?.businessUnit}
              </p>
            </div>
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Workplace Group -
                </small>{" "}
                {empBasic?.workplaceGroup}
              </p>
            </div>
            <div className="single-info">
              <p
                className="text-single-info"
                style={{ fontWeight: "500", color: gray700 }}
              >
                <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                  Workplace -
                </small>{" "}
                {empBasic?.workplace}
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
                {empBasic?.supervisor}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
};

export default EmployeeDetails;
