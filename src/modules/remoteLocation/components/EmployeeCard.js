import React from "react";
import { APIUrl } from "../../../App";
import { gray300, gray700 } from "../../../utility/customColor";
import DemoImg from "../../../assets/images/demo.png";

const EmployeeCard = ({ data }) => {
  const {
    photoURL,
    name,
    designation,
    dapartment,
    supervisor,
    lineManager,
    userRole,
    businessUnit,
    workplaceGroup,
    workplace,
  } = data;

  return (
    <>
      <h2 className="my-2" style={{fontSize: "16px", fontWeight: 500}}>Employee Current Information</h2>
      <div
        style={{
          border: `1px solid ${gray300}`,
          borderRadius: "4px",
          width: "70%",
          padding: "12px",
        }}
        className="d-flex mt-2"
      >
        <div className="mr-3">
          <img
            src={
              photoURL
                ? `${APIUrl}/Document/DownloadFile?id=${photoURL}`
                : DemoImg
            }
            alt=""
            width="36px"
            height="36px"
          />
        </div>
        <div>
          <h2>{name}</h2>
          <div className="d-flex mt-1">
            <div className="">
              <div className="single-info">
                <p
                  className="text-single-info"
                  style={{ fontWeight: "500", color: gray700 }}
                >
                  <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    Designation -
                  </small>
                  <span className="ml-2">{designation}</span>
                </p>
              </div>
              <div className="single-info">
                <p
                  className="text-single-info"
                  style={{ fontWeight: "500", color: gray700 }}
                >
                  <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    Department -
                  </small>
                  <span className="ml-2">{dapartment}</span>
                </p>
              </div>
              <div className="single-info">
                <p
                  className="text-single-info"
                  style={{ fontWeight: "500", color: gray700 }}
                >
                  <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    Supervisor -
                  </small>
                  <span className="ml-2">{supervisor}</span>
                </p>
              </div>
              <div className="single-info">
                <p
                  className="text-single-info"
                  style={{ fontWeight: "500", color: gray700 }}
                >
                  <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    Line Manger -
                  </small>
                  <span className="ml-2">{lineManager}</span>
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
                    User Role -
                  </small>
                  <span className="ml-2">{userRole}</span>
                </p>
              </div>
              <div className="single-info">
                <p
                  className="text-single-info"
                  style={{ fontWeight: "500", color: gray700 }}
                >
                  <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    Business Unit -
                  </small>
                  <span className="ml-2">{businessUnit}</span>
                </p>
              </div>
              <div className="single-info">
                <p
                  className="text-single-info"
                  style={{ fontWeight: "500", color: gray700 }}
                >
                  <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    Workplace Group -
                  </small>
                  <span className="ml-2">{workplaceGroup}</span>
                </p>
              </div>
              <div className="single-info">
                <p
                  className="text-single-info"
                  style={{ fontWeight: "500", color: gray700 }}
                >
                  <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    Workplace -
                  </small>
                  <span className="ml-2">{workplace}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeCard;
