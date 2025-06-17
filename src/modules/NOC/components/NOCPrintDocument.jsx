import React from "react";
import { format } from "date-fns";

class NOCPrintDocument extends React.Component {
  formatDate(dateString) {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "dd MMMM, yyyy");
    } catch (error) {
      return dateString;
    }
  }

  render() {
    const { nocData, signatureInfo } = this.props;
    console.log("Rendering NOCPrintDocument with data:", nocData);

    // If no data, return an empty div with no text
    if (!nocData || Object.keys(nocData).length === 0) {
      return <div></div>;
    }

    // Define font sizes directly as pixel values
    const baseFontSize = "20px";
    const headingFontSize = "32px";
    const lineHeight = "1.8"; // Added improved line height

    return (
      <div
        className="noc-print-container"
        style={{
          padding: "40px",
          fontFamily: "Arial, sans-serif",
          width: "800px",
          backgroundColor: "white",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "20px", marginTop: "100px" }}>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: baseFontSize, lineHeight: lineHeight }}>
              Date: {format(new Date(), "dd MMMM, yyyy")}
            </p>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "120px",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              fontWeight: "bold",
              fontSize: headingFontSize,
              lineHeight: lineHeight,
            }}
          >
            To Whom It May Concern
          </h2>
        </div>

        <div style={{ textAlign: "left" }}>
          <p style={{ fontSize: baseFontSize, lineHeight: lineHeight }}>
            This is with reference to the request of{" "}
            <strong style={{ fontSize: baseFontSize }}>
              {nocData?.employeeName || "[Employee Name]"}
            </strong>
            {nocData?.passportNumber && (
              <span style={{ fontSize: baseFontSize }}>
                , (bearing passport number{" "}
                <strong style={{ fontSize: baseFontSize }}>
                  {nocData.passportNumber}
                </strong>
                ),
              </span>
            )}{" "}
            working as{" "}
            <strong style={{ fontSize: baseFontSize }}>
              {nocData?.designation || "Executive"}
            </strong>{" "}
            in the department of{" "}
            <strong style={{ fontSize: baseFontSize }}>
              {nocData?.department || "People & Culture"}
            </strong>{" "}
            at{" "}
            <strong style={{ fontSize: baseFontSize }}>
              {nocData?.accountName || "iFarmer Limited"}
            </strong>
            , will be travelling to{" "}
            <strong style={{ fontSize: baseFontSize }}>
              {nocData?.countryName}
            </strong>{" "}
            for the period from{" "}
            <strong style={{ fontSize: baseFontSize }}>
              {this.formatDate(nocData?.fromDate)}
            </strong>{" "}
            to{" "}
            <strong style={{ fontSize: baseFontSize }}>
              {this.formatDate(nocData?.toDate)}
            </strong>{" "}
            for{" "}
            <strong style={{ fontSize: baseFontSize }}>
              {nocData?.nocType}
            </strong>{" "}
            purpose.
          </p>

          <p
            style={{
              marginTop: "20px",
              fontSize: baseFontSize,
              lineHeight: lineHeight,
            }}
          >
            The company has sanctioned{" "}
            <span style={{ fontSize: baseFontSize }}>
              {nocData?.employeeName ? "his/her" : "her"}
            </span>{" "}
            travel request which can be availed at{" "}
            <span style={{ fontSize: baseFontSize }}>
              {nocData?.employeeName ? "his/her" : "her"}
            </span>{" "}
            discretion. This NOC also validates the fact that,{" "}
            <strong style={{ fontSize: baseFontSize }}>
              {nocData?.employeeName || "[Employee Name]"}
            </strong>{" "}
            is able to handle{" "}
            <span style={{ fontSize: baseFontSize }}>
              {nocData?.employeeName ? "his/her" : "her"}
            </span>{" "}
            expenses on{" "}
            <span style={{ fontSize: baseFontSize }}>
              {nocData?.employeeName ? "his/her" : "her"}
            </span>{" "}
            own.
          </p>

          <p
            style={{
              marginTop: "20px",
              fontSize: baseFontSize,
              lineHeight: lineHeight,
            }}
          >
            Please feel free to contact at the below mentioned contact details
            for any further assistance.
          </p>
        </div>

        <div
          style={{
            marginTop: "60px",
            textAlign: "left",
          }}
        >
          <p style={{ fontSize: baseFontSize, lineHeight: lineHeight }}>
            Sincerely,
          </p>
          <div style={{ marginTop: "50px" }}>
            <p
              style={{
                marginBottom: "0px",
                fontSize: baseFontSize,
                lineHeight: lineHeight,
              }}
            >
              <strong style={{ fontSize: baseFontSize }}>
                {signatureInfo?.name || nocData?.hrManagerName || ""}
              </strong>
            </p>
            <p
              style={{
                marginTop: "0px",
                fontSize: baseFontSize,
                lineHeight: lineHeight,
              }}
            >
              {signatureInfo?.designation || ""}
            </p>
            <p style={{ fontSize: baseFontSize, lineHeight: lineHeight }}>
              {signatureInfo?.department || ""}
            </p>
            <p style={{ fontSize: baseFontSize, lineHeight: lineHeight }}>
              <span style={{ fontSize: baseFontSize }}>
                {signatureInfo?.email || nocData?.hrManagerEmail || ""}
              </span>
            </p>
            <p style={{ fontSize: baseFontSize, lineHeight: lineHeight }}>
              <span style={{ fontSize: baseFontSize }}>
                {signatureInfo?.phone || nocData?.hrManagerPhone || ""}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default NOCPrintDocument;
