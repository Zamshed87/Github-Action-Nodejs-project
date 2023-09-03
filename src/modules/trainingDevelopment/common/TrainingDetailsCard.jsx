import React from "react";
import { gray700 } from "../../../utility/customColor";
import {
  dateFormatter,
  monthYearFormatter,
} from "../../../utility/dateFormatter";

const TrainingDetailsCard = ({ data }) => {
  const {
    trainingName,
    resourcePerson,
    requestedBy,
    batchSize,
    batchNo,
    fromDate,
    toDate,
    duration,
    venue,
    remark,
  } = data;
  return (
    <>
      <div className="card-style p-4 d-flex">
        <div className="">
          <div className="single-info">
            <p
              className="text-single-info"
              style={{ fontWeight: "500", color: gray700 }}
            >
              <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                Training Name -
              </small>
              <span className="ml-2">{trainingName}</span>
            </p>
          </div>
          <div className="single-info">
            <p
              className="text-single-info"
              style={{ fontWeight: "500", color: gray700 }}
            >
              <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                Resource Person -
              </small>
              <span className="ml-2">{resourcePerson}</span>
            </p>
          </div>
          <div className="single-info">
            <p
              className="text-single-info"
              style={{ fontWeight: "500", color: gray700 }}
            >
              <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                Requested By -
              </small>
              <span className="ml-2">{requestedBy}</span>
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
              <span className="ml-2">{batchSize}</span>
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
              <span className="ml-2">#{batchNo}</span>
            </p>
          </div>
        </div>
        <div className="" style={{ marginLeft: "50px" }}>
          <div className="single-info">
            <p
              className="text-single-info"
              style={{ fontWeight: "500", color: gray700 }}
            >
              <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                Month-Year -
              </small>
              <span className="ml-2">{monthYearFormatter(fromDate)}</span>
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
                {dateFormatter(fromDate)} - {dateFormatter(toDate)}
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
              <span className="ml-2">{duration} Hours</span>
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
              <span className="ml-2">{venue}</span>
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
              <span className="ml-2">{remark || "N/A"}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainingDetailsCard;
