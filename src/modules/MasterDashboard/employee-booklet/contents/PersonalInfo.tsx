import { Col, Divider, Row } from "antd";
import { APIUrl } from "App";
import moment from "moment";
import React, { forwardRef } from "react";

const PersonalInfo = forwardRef((props: any, ref: any) => {
  const singleData = props?.singleData;
  const passportNo = props?.passportNo;
  const nidNo = props?.nidNo;
  const empSignatureId = props?.empSignatureId;
  const birthId = props?.birthId;
  const presentAddress = props?.presentAddress;
  const permanentAddress = props?.permanentAddress;

  return (
    <div ref={ref} style={{ fontSize: "12px" }}>
      <Row>
        <Col md={8}>
          <div className="mt-2">
            Employment Type :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {singleData?.strEmploymentType || "N/A"}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="mt-2">
            HR Position :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {singleData?.strHrpostionName || "N/A"}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="mt-2">
            Supervisor :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {singleData?.strSupervisorName || "N/A"}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="mt-2">
            Dotted Supervisor :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {singleData?.strDottedSupervisorName || "N/A"}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="mt-2">
            Line Manager :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {singleData?.strLinemanager || "N/A"}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="mt-2">
            Card No :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {singleData?.strCardNumber || "N/A"}
            </div>
          </div>
        </Col>
      </Row>
      <Divider style={{ margin: "8px 0", backgroundColor: "lightgray" }} />
      <Row>
        <Col md={8}>
          <div>
            Religion :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {singleData?.strReligion || "N/A"}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div>
            Gender :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {singleData?.strGender || "N/A"}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div>
            Date of Birth :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {moment(singleData?.dteDateOfBirth).format("DD MMM, YYYY") ||
                "N/A"}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="mt-2">
            Blood Group :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {singleData?.strBloodGroup || "N/A"}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="mt-2">
            Office Email :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {singleData?.strOfficeMail || "N/A"}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="mt-2">
            Office Contact No :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {singleData?.strOfficeMobile || "N/A"}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="mt-2">
            NID No. :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {nidNo || "N/A"}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="mt-2">
            TIN :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {singleData?.tinNo || "N/A"}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="mt-2">
            Employee Signature :{" "}
            <div className="employeeInfo d-flex align-items-center  ml-lg-0 ml-md-4">
              {empSignatureId ? (
                <div
                  style={{
                    width: "100px",
                    objectFit: "cover",
                  }}
                >
                  <img
                    src={`${APIUrl}/Document/DownloadFile?id=${empSignatureId}`}
                    alt="Profile"
                    width="60px"
                    height="40px"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : (
                <>N/A</>
              )}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="mt-2">
            Marital Status :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {singleData?.strMaritalStatus || "N/A"}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="mt-2">
            Personal Email :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {singleData?.strPersonalMail || "N/A"}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="mt-2">
            Personal Contact No. :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {singleData?.strPersonalMobile || "N/A"}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="mt-2">
            Passport No :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {passportNo || "N/A"}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="mt-2">
            Driving License No. :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {singleData?.drivingLicenseNo || "N/A"}
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="mt-2">
            Birth Certificate :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {birthId || "N/A"}
            </div>
          </div>
        </Col>
      </Row>
      <Divider style={{ margin: "8px 0", backgroundColor: "lightgray" }} />
      <Row>
        <Col md={12}>
          <div>
            Present Address :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {presentAddress || "N/A"}
            </div>
          </div>
        </Col>
        <Col md={12}>
          <div>
            Permanent Address :{" "}
            <div style={{ fontWeight: "500", fontSize: "14px" }}>
              {permanentAddress || "N/A"}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
});

export default PersonalInfo;
