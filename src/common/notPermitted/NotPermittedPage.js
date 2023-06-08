import React from "react";
import { gray400, gray600 } from "../../utility/customColor";
import err from "./err.png";

export default function NotPermittedPage() {
  return (
    <>
      <div className="d-flex justify-content-center flex-column align-items-center text-center not_permitted">
        <div className="mb-4 mt-5">
          <img className="img img-fluid" src={err} alt="Not permitted"></img>
        </div>
        <div className="d-flex justify-content-center flex-column align-items-center text-center">
          <h4
            style={{
              fontWeight: "700",
              fontSize: "18px",
              lineHeight: "28px",
              color: gray600,
            }}
          >
            Your are not allowed to access
          </h4>
          <p
            style={{
              fontWeight: "400",
              fontSize: "14px",
              lineHeight: "20px",
              color: gray400,
            }}
          >
            The page your're trying to access has restricted access. Please
            refer <br /> to your system administrator.
          </p>
        </div>
      </div>
    </>
  );
}
