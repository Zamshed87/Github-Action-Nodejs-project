import React, { useState, useEffect } from "react";
import {
  ArrowDropDown,
  ArrowDropUp,
  FilePresentOutlined,
} from "@mui/icons-material";
import { useHistory, useParams } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BackButton from "../../../../../common/BackButton";
import Chips from "../../../../../common/Chips";
import Loading from "../../../../../common/loading/Loading";
import {
  gray700,
  gray900,
  greenColor,
} from "../../../../../utility/customColor";
import {
  getRoleAssigneToUser,
  getSeparationLandingById,
  releasedEmployeeSeparation,
} from "../../helper";
import { setFirstLevelNameAction } from "../../../../../commonRedux/reduxForLocalStorage/actions";
import { dateFormatter } from "../../../../../utility/dateFormatter";
import { getDownlloadFileView_Action } from "../../../../../commonRedux/auth/actions";
import NotPermittedPage from "../../../../../common/notPermitted/NotPermittedPage";
import { useFormik } from "formik";
import { getEmployeeProfileViewData } from "./../../helper";
import Accordion from "./../accordion";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import { toast } from "react-toastify";

const initData = {
  isReleased: false,
};

export default function ManagementReleaseSeparationForm() {
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

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
  const [empBasic, setEmpBasic] = useState([]);
  const [userRole, setUserRole] = useState([]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getSeparationLandingById(+params?.id, setSingleData, setLoading);
  }, [orgId, buId, employeeId, params?.id, wgId]);

  useEffect(() => {
    if (singleData?.intEmployeeId) {
      getEmployeeProfileViewData(
        singleData?.intEmployeeId,
        setEmpBasic,
        setLoading,
        buId,
        wgId
      );
      getRoleAssigneToUser(buId, wgId, singleData?.intEmployeeId, setUserRole);
    }
  }, [singleData, buId, wgId]);

  const saveHandler = (values, cb) => {
    if (values?.isReleased !== true) {
      return toast.warning("Please select isRelease checkbox!!!");
    }
    const payload = {
      intSeparationId: singleData?.separationId,
      isReleased: values?.isReleased,
      intAccountId: orgId,
      intCreatedBy: employeeId,
    };
    const callBack = () => {
      cb();
      getSeparationLandingById(+params?.id, setSingleData, setLoading);
      history.goBack();
    };
    releasedEmployeeSeparation(payload, setLoading, callBack);
  };

  const { setFieldValue, values, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      saveHandler(values, () => {
        if (params?.id) {
        } else {
          resetForm(initData);
        }
      });
    },
  });

  return (
    <>
      {loading && <Loading />}
      {permission?.isCreate ? (
        <form onSubmit={handleSubmit}>
          <div className="table-card">
            <div
              className="table-card-heading"
              style={{ marginBottom: "12px" }}
            >
              <div className="d-flex align-items-center">
                <BackButton />
                <h2>{`Employee Release`}</h2>
              </div>
              <ul className="d-flex flex-wrap">
                <li>
                  <button type="submit" className="btn btn-default flex-center">
                    Release
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-style card-about-info-main">
              <div className="row">
                <div className="col-12">
                  <div className="mt-2">
                    <Accordion
                      empBasic={empBasic}
                      loading={loading}
                      userRole={userRole}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="card-about-info-main about-info-card">
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
                              {dateFormatter(singleData?.dteSeparationDate)}
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
                          {singleData?.approvalStatus === "Approved" && (
                            <Chips label="Approved" classess="success p-2" />
                          )}
                          {singleData?.approvalStatus === "Pending" && (
                            <Chips label="Pending" classess="warning p-2" />
                          )}
                          {singleData?.approvalStatus === "Process" && (
                            <Chips label="Process" classess="primary p-2" />
                          )}
                          {singleData?.approvalStatus === "Reject" && (
                            <>
                              <Chips
                                label="Rejected"
                                classess="danger p-2 mr-2"
                              />
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
                          <h2
                            style={{ marginBottom: "12px", marginTop: "24px" }}
                          >
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
                                      dispatch(
                                        getDownlloadFileView_Action(image)
                                      );
                                    }}
                                  >
                                    <>
                                      <FilePresentOutlined />{" "}
                                      {`Attachment_${i + 1}`}
                                    </>
                                  </span>
                                </p>
                              ))
                            : "N/A"}
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
                <div className="col-12">
                  <div className="mt-2">
                    <div className="card-about-info-main about-info-card">
                      <div className="d-flex align-items-center small-checkbox">
                        <FormikCheckBox
                          styleObj={{
                            color: gray900,
                            checkedColor: greenColor,
                          }}
                          label="isReleased ?"
                          checked={values?.isReleased}
                          onChange={(e) => {
                            setFieldValue("isReleased", e.target.checked);
                          }}
                          labelFontSize="12px"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
}
