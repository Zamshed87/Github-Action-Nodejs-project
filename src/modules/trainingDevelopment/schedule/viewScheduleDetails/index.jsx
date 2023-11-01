import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import BackButton from "../../../../common/BackButton";
import IConfirmModal from "../../../../common/IConfirmModal";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { gray700 } from "../../../../utility/customColor";
import {
  dayMonthYearFormatter,
  getMonthwithYear,
} from "../../../../utility/dateFormatter";
import { deleteSchedule, getSingleSchedule } from "../createSchedule/helper";

const ViewTrainingScheduleDetails = () => {
  const params = useParams();
  const history = useHistory();

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [singleData, setSingleData] = useState({});
  const [loading, setLoading] = useState(false);
  let permission = null;
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30352) {
      permission = item;
    }
  });

  useEffect(() => {
    getSingleSchedule(setSingleData, setLoading, orgId, buId, params?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const demoPopup = () => {
    let confirmObject = {
      closeOnClickOutside: false,
      message: ` Do you want to Delete ? `,
      yesAlertFunc: () => {
        const cb = () => {
          history.push(`/trainingAndDevelopment/training/schedule`);
        };
        deleteSchedule(params?.id, setLoading, cb);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      {loading && <Loading />}
      {permission?.isView ? (
        <div className="table-card">
          <div className="table-card-heading mb-2">
            <div className="d-flex align-items-center">
              <BackButton />
              <h2>Schedule Details</h2>
            </div>
            {singleData?.strStatus !== "Approved" && (
              <ul className="d-flex flex-wrap">
                <li>
                  <button
                    type="button"
                    className="btn btn-default flex-center mr-2"
                    onClick={demoPopup}
                  >
                    Delete
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      history.push(
                        `/trainingAndDevelopment/training/schedule/edit/${params?.id}`
                      );
                    }}
                    type="button"
                    className="btn btn-default flex-center"
                  >
                    Edit
                  </button>
                </li>
              </ul>
            )}
          </div>

          <div className="table-card-body">
            <div className="card-style p-4">
              <p
                className=""
                style={{
                  fontWeight: "600",
                  color: gray700,
                  fontSize: "16px",
                  paddingBottom: "10px",
                }}
              >
                {singleData?.strTrainingName}
              </p>
              <div className="single-info">
                <p
                  className="text-single-info"
                  style={{ fontWeight: "500", color: gray700 }}
                >
                  <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    Resource Person -
                  </small>
                  <span className="ml-2">
                    {singleData?.strResourcePersonName}
                  </span>
                </p>
              </div>
              <div className="single-info">
                <p
                  className="text-single-info"
                  style={{ fontWeight: "500", color: gray700 }}
                >
                  <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    Batch Size -
                  </small>
                  <span className="ml-2">{singleData?.intBatchSize}</span>
                </p>
              </div>
              <div className="single-info">
                <p
                  className="text-single-info"
                  style={{ fontWeight: "500", color: gray700 }}
                >
                  <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    Batch No -
                  </small>
                  <span className="ml-2">
                    {singleData?.strBatchNo || "N/A"}
                  </span>
                </p>
              </div>
              <div className="single-info">
                <p
                  className="text-single-info"
                  style={{ fontWeight: "500", color: gray700 }}
                >
                  <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    Month-Year -
                  </small>
                  <span className="ml-2">
                    {singleData?.dteFromDate &&
                      getMonthwithYear(singleData?.dteFromDate)}
                  </span>
                </p>
              </div>
              <div className="single-info">
                <p
                  className="text-single-info"
                  style={{ fontWeight: "500", color: gray700 }}
                >
                  <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    Date -
                  </small>
                  <span className="ml-2">
                    {singleData?.dteFromDate &&
                      dayMonthYearFormatter(singleData?.dteFromDate)}{" "}
                    -{" "}
                    {singleData?.dteToDate &&
                      dayMonthYearFormatter(singleData?.dteToDate)}
                  </span>
                </p>
              </div>
              <div className="single-info">
                <p
                  className="text-single-info"
                  style={{ fontWeight: "500", color: gray700 }}
                >
                  <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    Duration -
                  </small>
                  <span className="ml-2">
                    {singleData?.numTotalDuration} Hours
                  </span>
                </p>
              </div>
              <div className="single-info">
                <p
                  className="text-single-info"
                  style={{ fontWeight: "500", color: gray700 }}
                >
                  <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    Venue -
                  </small>
                  <span className="ml-2">{singleData?.strVenue}</span>
                </p>
              </div>
              <div className="single-info">
                <p
                  className="text-single-info"
                  style={{ fontWeight: "500", color: gray700 }}
                >
                  <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    Remarks -
                  </small>
                  <span className="ml-2">
                    {singleData?.strRemarks || "N/A"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
};

export default ViewTrainingScheduleDetails;
