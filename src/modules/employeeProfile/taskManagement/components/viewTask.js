import React from "react";
import BackButton from "../../../../common/BackButton";
import { gray700, gray900 } from "../../../../utility/customColor";
import moment from "moment";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

const ViewTask = ({ propsObj }) => {
  const { singleData, isAccordion, setIsAccordion } = propsObj;

  return (
    <>
      <div className="table-card">
        <div className="table-card-heading" style={{ marginBottom: "12px" }}>
          <div className="d-flex align-items-center">
            <BackButton />
            <h2>{`View Task`}</h2>
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
                        <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                          Task Name -
                        </small>
                        {singleData?.tmsHeader?.taskTitle}
                      </p>
                    </div>
                    <div className="single-info">
                      <p
                        className="text-single-info"
                        style={{ fontWeight: "500", color: gray700 }}
                      >
                        <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                          Task Duration -
                        </small>
                        {moment(singleData?.tmsHeader?.fromdate).format(
                          "DD MMM, YYYY h:mma"
                        )}{" "}
                        To{" "}
                        {moment(singleData?.tmsHeader?.todate).format(
                          "DD MMM, YYYY h:mma"
                        )}
                      </p>
                    </div>
                    <div className="single-info">
                      <p
                        className="text-single-info"
                        style={{ fontWeight: "500", color: gray700 }}
                      >
                        <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                          Task Created At -
                        </small>
                        {moment(singleData?.tmsHeader?.createdAt).format(
                          "DD MMM, YYYY h:mma"
                        )}
                      </p>
                    </div>
                    <div className="single-info">
                      <p
                        className="text-single-info"
                        style={{ fontWeight: "500", color: gray700 }}
                      >
                        <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                          Task Created By -
                        </small>
                        {singleData?.tmsHeader?.createdBy}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {isAccordion && (
                <>
                  <div>
                    <p style={{ marginBottom: "8px", marginTop: "24px" }}>
                      Assigned To -
                    </p>
                    <div className="d-flex">
                      {singleData?.tmsRow?.map((data) => (
                        <p className="mr-2" style={{ fontWeight: 600 }}>
                          {data?.employeeName}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 style={{ marginBottom: "12px", marginTop: "24px" }}>
                      Task Description
                    </h2>
                  </div>
                  <small
                    style={{ fontSize: "12px", lineHeight: "1.5" }}
                    dangerouslySetInnerHTML={{
                      __html: singleData?.tmsHeader?.taskDescription,
                    }}
                  />
                </>
              )}
              <div
                className="see-more-btn-main"
                style={{ marginTop: isAccordion ? "100px" : "70px" }}
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
    </>
  );
};

export default ViewTask;
