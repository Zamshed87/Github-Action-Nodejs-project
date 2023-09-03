import React from "react";
import { Link } from "react-router-dom";
import noApplication from "../assets/images/noApplication.png";
import { gray500 } from "../utility/customColor";

export default function NoResultTwo({ title, to }) {
  return (
    <>
      <div className="no-result">
        <div className="no-result-img mb-4 mt-5">
          <img className="img-fluid" src={noApplication} alt="People Desk" />
        </div>
        <div className="no-result-txt no-appy-result-txt">
          <h2
            style={{
              fontWeight: "400",
              fontSize: "12px",
              lineHeight: "18px",
              color: gray500,
              font: "Inter",
            }}
          >
            {title ? title : "No data"}
            {to && (
              <Link to={to}> Apply </Link>
            )}
          </h2>
        </div>
      </div>
    </>
  );
}
