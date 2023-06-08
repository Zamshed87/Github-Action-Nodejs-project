import { APIUrl } from "../../../../App";
import Loading from "../../../../common/loading/Loading";
import { gray700 } from "../../../../utility/customColor";
import profileImg from "../../../../assets/images/profile.jpg";

const Accordion = ({ empBasic, loading, userRole }) => {

  let ddlToStringUserRole = userRole.map(itm => itm?.label);

  return (
    <div className="card-about-info-main about-info-card">
      {loading && <Loading />}
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex" style={{ maxWidth: "464px" }}>
          <div>
            <div
              style={{
                width: empBasic > 0 ? empBasic && "auto" : "36px",
              }}
              className={
                empBasic > 0
                  ? empBasic && "add-image-about-info-card height-auto"
                  : "add-image-about-info-card"
              }
            >
              <label
                htmlFor="contained-button-file"
                className="label-add-image sm-size"
              >
                {empBasic?.empEmployeePhotoIdentity ? (
                  <img
                    src={`${APIUrl}/Document/DownloadFile?id=${empBasic?.empEmployeePhotoIdentity?.intProfilePicFileUrlId}`}
                    alt=""
                    style={{ maxHeight: "36px", minWidth: "36px" }}
                  />
                ) : (
                  <img
                    src={profileImg}
                    alt="iBOS"
                    height="36px"
                    width="36px"
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
            <div className="employee-info-div" style={{ width: "550px" }}>
              <div>
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
                      Supervisor -
                    </small>{" "}
                    {empBasic?.employeeProfileLandingView?.strSupervisorName}
                  </p>
                </div>
                <div className="single-info">
                  <p
                    className="text-single-info"
                    style={{ fontWeight: "500", color: gray700 }}
                  >
                    <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                      Line Manger -
                    </small>{" "}
                    {empBasic?.employeeProfileLandingView?.strLinemanager}
                  </p>
                </div>
              </div>
              <div>
                <div className="single-info">
                  <p
                    className="text-single-info"
                    style={{ fontWeight: "500", color: gray700 }}
                  >
                    <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                      User Role -
                    </small>{" "}
                    {ddlToStringUserRole.join(",") || "N/A"}
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
                    {empBasic?.employeeProfileLandingView?.strBusinessUnitName}
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
                    {empBasic?.employeeProfileLandingView?.strWorkplaceGroupName}
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
                    {empBasic?.employeeProfileLandingView?.strWorkplaceName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
