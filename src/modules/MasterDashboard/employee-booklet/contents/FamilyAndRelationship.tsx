import { Col, Divider, Row } from "antd";
import NoResult from "common/NoResult";
import { forwardRef } from "react";

const FamilyAndRelationship = forwardRef((props: any, ref: any) => {
  const familyHistory = props?.familyHistory;

  return (
    <div ref={ref} style={{ fontSize: "12px" }}>
      <center>
        <h1 style={{ fontSize: "16px", marginBottom: "10px" }}>
          {props?.historyType} Information
        </h1>
      </center>
      {familyHistory?.length > 0 ? (
        familyHistory?.map((dto: any, index: number) => (
          <div key={index}>
            <Divider />
            <Row>
              <Col md={8}>
                <div className="mt-2">
                  Name :{" "}
                  <div style={{ fontWeight: "500", fontSize: "14px" }}>
                    {dto?.strRelativesName || "N/A"}
                  </div>
                </div>
              </Col>
              <Col md={8}>
                <div className="mt-2">
                  Relation :{" "}
                  <div style={{ fontWeight: "500", fontSize: "14px" }}>
                    {dto?.strRelationship || "N/A"}
                  </div>
                </div>
              </Col>
              <Col md={8}>
                <div className="mt-2">
                  Contact No :{" "}
                  <div style={{ fontWeight: "500", fontSize: "14px" }}>
                    {dto?.strPhone || "N/A"}
                  </div>
                </div>
              </Col>
              <Col md={8}>
                <div className="mt-2">
                  NID :{" "}
                  <div style={{ fontWeight: "500", fontSize: "14px" }}>
                    {dto?.strNid || "N/A"}
                  </div>
                </div>
              </Col>
              <Col md={8}>
                <div className="mt-2">
                  Address :{" "}
                  <div style={{ fontWeight: "500", fontSize: "14px" }}>
                    {dto?.strAddress || "N/A"}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        ))
      ) : (
        <NoResult />
      )}
    </div>
  );
});

export default FamilyAndRelationship;
