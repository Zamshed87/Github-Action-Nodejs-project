import React, { useState, useEffect } from "react";
import {
  ArrowDropDown,
  ArrowDropUp,
  FilePresentOutlined,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BackButton from "../../../../../common/BackButton";
import Chips from "../../../../../common/Chips";
import Loading from "../../../../../common/loading/Loading";
import { gray700, gray900 } from "../../../../../utility/customColor";
import { getSeparationLandingById } from "../../helper";
import { setFirstLevelNameAction } from "../../../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import { getDownlloadFileView_Action } from "../../../../../commonRedux/auth/actions";
import NotPermittedPage from "../../../../../common/notPermitted/NotPermittedPage";

export default function ManagementViewSeparationForm() {
  const params = useParams();
  const dispatch = useDispatch();

  const { orgId, buId, employeeId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 10) {
      permission = item;
    }
  });

  const [loading, setLoading] = useState(false);
  const [isAccordion, setIsAccordion] = useState(false);
  const [singleData, setSingleData] = useState([]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const payload = {
      intSeparationId: +params?.id,
      status: "",
      workplaceGroupId: wgId,
      departmentId: 0,
      designationId: 0,
      supervisorId: 0,
      employeeId: employeeId,
      separationTypeId: 0,
      applicationFromDate: null,
      applicationToDate: null,
      businessUnitId: buId,
      accountId: orgId,
      tableName: "EmployeeSeparationReportBySeparationId",
    };
    getSeparationLandingById(+params?.id, setSingleData, setLoading);
  }, [orgId, buId, employeeId, params?.id, wgId]);

  return (
    <>
      {loading && <Loading />}
      {permission?.isView ? (
        <div className="table-card">
          <div className="table-card-heading" style={{ marginBottom: "12px" }}>
            <div className="d-flex align-items-center">
              <BackButton />
              <h2>{`View Separation`}</h2>
            </div>
          </div>
          <div className="card-style card-about-info-main">
            <div className="row">
              <div className="col-12">
                <div className="mt-2">
                  <div
                    className="d-flex justify-content-between"
                    style={{ marginBottom: "28px" }}
                  >
                    <div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Separation Type -
                          </small>
                          {singleData?.strSeparationTypeName}
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
                            Application Date -
                          </small>
                          {dateFormatter(singleData?.dteCreatedAt)}
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
                          </small>
                          {dateFormatter(singleData?.dteLastWorkingDate)}
                        </p>
                      </div>
                    </div>
                    <div>
                      {singleData?.ApprovalStatus === "Approve" && (
                        <Chips label="Approved" classess="success p-2" />
                      )}
                      {singleData?.ApprovalStatus === "Pending" && (
                        <Chips label="Pending" classess="warning p-2" />
                      )}
                      {singleData?.ApprovalStatus === "Process" && (
                        <Chips label="Process" classess="primary p-2" />
                      )}
                      {singleData?.ApprovalStatus === "Reject" && (
                        <>
                          <Chips label="Rejected" classess="danger p-2 mr-2" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="single-info">
                  {isAccordion ? (
                    <>
                      <small
                        style={{ fontSize: "12px", lineHeight: "1.5" }}
                        dangerouslySetInnerHTML={{
                          __html: singleData?.fullReason,
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <small
                        style={{ fontSize: "12px", lineHeight: "1.5" }}
                        dangerouslySetInnerHTML={{
                          __html: singleData?.halfReason,
                        }}
                      />
                    </>
                  )}
                </div>
                {isAccordion && (
                  <>
                    <div>
                      <h2 style={{ marginBottom: "12px", marginTop: "24px" }}>
                        Attachment
                      </h2>
                      {singleData?.docArr?.length
                        ? singleData?.docArr.map((image, i) => (
                            <p
                              style={{
                                margin: "6px 0 0",
                                fontWeight: "400",
                                fontSize: "12px",
                                lineHeight: "18px",
                                color: "#009cde",
                                cursor: "pointer",
                              }}
                              key={i}
                            >
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(getDownlloadFileView_Action(image));
                                }}
                              >
                                <>
                                  <FilePresentOutlined />{" "}
                                  {`Attachment_${i + 1}`}
                                </>
                              </span>
                            </p>
                          ))
                        : ""}
                    </div>
                  </>
                )}
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
          </div>
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
}
