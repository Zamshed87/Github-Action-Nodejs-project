import React from "react";
import { gray700 } from "../../../utility/customColor";

const LocationDetails = ({ data }) => {
  const { code, locationName, locationLog, noOfAssigned, status } = data;
  return (
    <>
      <hr/>
      <h2>Location Details</h2>
      <div className="mt-1">
        <div className="single-info">
          <p
            className="text-single-info"
            style={{ fontWeight: "500", color: gray700 }}
          >
            <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
              Code -
            </small>
            <span className="ml-2">{code}</span>
          </p>
        </div>
        <div className="single-info">
          <p
            className="text-single-info"
            style={{ fontWeight: "500", color: gray700 }}
          >
            <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
              Location Name -
            </small>
            <span className="ml-2">{locationName}</span>
          </p>
        </div>
        <div className="single-info">
          <p
            className="text-single-info"
            style={{ fontWeight: "500", color: gray700 }}
          >
            <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
              Location Log -
            </small>
            <span className="ml-2">{locationLog}</span>
          </p>
        </div>
        <div className="single-info">
          <p
            className="text-single-info"
            style={{ fontWeight: "500", color: gray700 }}
          >
            <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
              No of Assigned -
            </small>
            <span className="ml-2">{noOfAssigned}</span>
          </p>
        </div>
        <div className="single-info">
          <p
            className="text-single-info"
            style={{ fontWeight: "500", color: gray700 }}
          >
            <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
              Status -
            </small>
            <span className="ml-2">{status}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default LocationDetails;
