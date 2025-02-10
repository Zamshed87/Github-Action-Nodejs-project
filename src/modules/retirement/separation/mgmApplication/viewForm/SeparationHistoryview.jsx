import { APIUrl } from "App";
import moment from "moment";
import { useEffect, useState } from "react";
import { gray700 } from "utility/customColor";
import profileImg from "../../../../../assets/images/profile.jpg";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "common/loading/Loading";
import Chips from "common/Chips";
import { PButton } from "Components";

function SeparationHistoryview({ id, type, empId, singleSeparationData }) {
  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [, getApprovalListData, loading] = useAxiosGet();
  const [empBasic, setEmpBasic] = useState({});

  useEffect(() => {
    if (id) {
      getApprovalListData(
        `/SaasMasterData/GetEmpSeparationViewById?AccountId=${orgId}&Id=${id}`,
        (res) => {
          setEmpBasic(res);
        }
      );
    }
  }, [id]);
  console.log(singleSeparationData);
  return (
    <>
      {loading && <Loading />}
      {empBasic && (
        <div>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "12.5px",
              color: gray700,
              marginBottom: "10px",
            }}
          >
            Employee Details
          </div>
          <div className="card-about-info-main about-info-card">
            <div className="d-flex justify-content-between">
              <div className="d-flex justify-content-between">
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
                      {empBasic?.imageId ? (
                        <img
                          src={`${APIUrl}/Document/DownloadFile?id=${empBasic?.imageId}`}
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
                    <h4
                      className="name-about-info"
                      style={{ marginBottom: "5px" }}
                    >
                      {empBasic?.strEmployeeName}
                      <span style={{ fontWeight: "400", color: gray700 }}>
                        [{empBasic?.strEmployeeCode}]
                      </span>{" "}
                    </h4>
                  </div>
                  <div className="employee-info-div" style={{ width: "500px" }}>
                    <div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Employee Id -
                          </small>{" "}
                          {empBasic?.strEmployeeCode}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Designation -
                          </small>{" "}
                          {empBasic?.strEmployeeDesignation}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Department -
                          </small>{" "}
                          {empBasic?.strEmployeeDepartment}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Joining Date -
                          </small>{" "}
                          {empBasic?.dteJoiningDate
                            ? moment(empBasic?.dteJoiningDate).format(
                                "YYYY-MM-DD"
                              )
                            : "N/A"}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Length of Service -
                          </small>{" "}
                          {empBasic?.lengthofService}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Last Working Date -
                          </small>{" "}
                          {empBasic?.lastWorkingDate || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Mobile (Official) -
                          </small>{" "}
                          {empBasic?.mobileNumber || "N/A"}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Business Unit -
                          </small>{" "}
                          {empBasic?.strEmployeeBusinessUnit}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Workplace Group -
                          </small>{" "}
                          {empBasic?.strEmployeeWorkplaceGroupName}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Workplace -
                          </small>{" "}
                          {empBasic?.strEmployeeWorkplaceName}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Date of Application -
                          </small>{" "}
                          {empBasic?.dateofResign || "N/A"}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Notice Period -
                          </small>{" "}
                          {empBasic?.noticePeriod || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ minWidth: "340px" }}>
                <br />
                <div className="d-flex justify-content-between">
                  <div>
                    <span style={{ fontSize: "13.5px" }}>Status:</span>&nbsp;
                    {
                      <>
                        {singleSeparationData?.approvalStatus === "Approve" && (
                          <Chips label="Approved" classess="success p-2" />
                        )}
                        {singleSeparationData?.approvalStatus === "Pending" && (
                          <Chips label="Pending" classess="warning p-2" />
                        )}
                        {singleSeparationData?.approvalStatus === "Process" && (
                          <Chips label="Process" classess="primary p-2" />
                        )}
                        {singleSeparationData?.approvalStatus === "Reject" && (
                          <Chips label="Rejected" classess="danger p-2 mr-2" />
                        )}
                        {singleSeparationData?.approvalStatus ===
                          "Released" && (
                          <Chips label="Released" classess="indigo p-2 mr-2" />
                        )}
                      </>
                    }
                  </div>
                  <div>
                    <PButton
                      type="primary"
                      content={
                        <div style={{ fontSize: "10px" }}>
                          Charge Handed Over
                        </div>
                      }
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-end mt-2">
                  <div>
                    <PButton
                      type="primary"
                      content={
                        <div style={{ fontSize: "10px" }}>Exit Interview</div>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SeparationHistoryview;
