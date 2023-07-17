import React from "react";
import noResult from "../assets/images/noResult.png";
import { gray400, gray600 } from "../utility/customColor";

export default function NoResult({ title, para }) {
  return (
    <>
      <div className="no-result">
        <div className="no-result-img mb-4 mt-5">
          <img className="img-fluid" src={noResult} alt="People Desk" />
        </div>
        <div className="no-result-txt">
          <h2
            style={{
              fontWeight: "700",
              fontSize: "18px",
              lineHeight: "28px",
              color: gray600,
              font: "Inter",
            }}
          >
            {title ? title : "No data"}
          </h2>
          <p
            style={{
              fontWeight: "400",
              fontSize: "14px",
              lineHeight: "20px",
              color: gray400,
              font: "Inter",
            }}
          >
            {para ? para : "No data has been entered yet"}
          </p>
        </div>
      </div>
    </>
  );
}
